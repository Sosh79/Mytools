document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const usernameInput = document.getElementById('username').value.trim();
    const passwordInput = document.getElementById('password').value;
    const confirmPasswordInput = document.getElementById('confirm-password').value;
    const errorDiv = document.getElementById('error-message');
    const successDiv = document.getElementById('success-message');
    const registerBtn = document.getElementById('register-btn');
    
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';

    if (!usernameInput || !passwordInput || !confirmPasswordInput) return;

    if (passwordInput !== confirmPasswordInput) {
        errorDiv.textContent = 'Passwords do not match.';
        errorDiv.style.display = 'block';
        return;
    }

    if (passwordInput.length < 6) {
        errorDiv.textContent = 'Password must be at least 6 characters.';
        errorDiv.style.display = 'block';
        return;
    }

    registerBtn.textContent = 'Registering...';
    registerBtn.disabled = true;

    try {
        const response = await window.electronAPI.registerAttempt(usernameInput, passwordInput);
        
        if (response.success) {
            successDiv.textContent = 'Registration successful! Redirecting to login...';
            successDiv.style.display = 'block';
            setTimeout(() => {
                window.electronAPI.navigateToPage('login');
            }, 1500);
        } else {
            errorDiv.textContent = response.message;
            errorDiv.style.display = 'block';
            registerBtn.textContent = 'Register';
            registerBtn.disabled = false;
        }
    } catch (err) {
        errorDiv.textContent = 'An error occurred during registration.';
        errorDiv.style.display = 'block';
        registerBtn.textContent = 'Register';
        registerBtn.disabled = false;
    }
});

function goToLogin() {
    window.electronAPI.navigateToPage('login');
}
