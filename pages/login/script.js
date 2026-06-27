document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    const expiry = localStorage.getItem('remember_expiry');
    
    if (username) {
        if (expiry && Date.now() < parseInt(expiry, 10)) {
            // Valid remembered session
            window.electronAPI.navigateToPage('home');
        } else {
            // Expired or not remembered (from a previous app run)
            localStorage.removeItem('username');
            localStorage.removeItem('remember_expiry');
        }
    }
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const usernameInput = document.getElementById('username').value.trim();
    const passwordInput = document.getElementById('password').value;
    const errorDiv = document.getElementById('error-message');
    const loginBtn = document.getElementById('login-btn');
    
    if (!usernameInput || !passwordInput) return;

    loginBtn.textContent = 'Logging in...';
    loginBtn.disabled = true;
    errorDiv.style.display = 'none';

    try {
        const response = await window.electronAPI.loginAttempt(usernameInput, passwordInput);
        
        if (response.success) {
            localStorage.setItem('username', usernameInput);
            
            const rememberMe = document.getElementById('remember-me').checked;
            if (rememberMe) {
                const oneWeek = 7 * 24 * 60 * 60 * 1000;
                localStorage.setItem('remember_expiry', Date.now() + oneWeek);
            } else {
                localStorage.removeItem('remember_expiry');
            }
            
            window.electronAPI.navigateToPage('home');
        } else {
            errorDiv.textContent = response.message;
            errorDiv.style.display = 'block';
            loginBtn.textContent = 'Login';
            loginBtn.disabled = false;
        }
    } catch (err) {
        errorDiv.textContent = 'An error occurred during login.';
        errorDiv.style.display = 'block';
        loginBtn.textContent = 'Login';
        loginBtn.disabled = false;
    }
});

function goToRegister() {
    window.electronAPI.navigateToPage('register');
}
