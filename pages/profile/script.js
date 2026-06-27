document.addEventListener('DOMContentLoaded', () => {
    const currentUsername = localStorage.getItem('username');
    if (currentUsername) {
        document.getElementById('new-username').value = currentUsername;
    }
});

document.getElementById('profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const currentUsername = localStorage.getItem('username');
    const newUsernameInput = document.getElementById('new-username').value.trim();
    const oldPasswordInput = document.getElementById('old-password').value;
    const newPasswordInput = document.getElementById('new-password').value;
    const confirmPasswordInput = document.getElementById('confirm-password').value;
    const msgDiv = document.getElementById('message-container');
    const saveBtn = document.getElementById('save-btn');
    
    msgDiv.style.display = 'none';
    msgDiv.className = 'message-container';

    if (!oldPasswordInput) return;

    if (newPasswordInput && newPasswordInput !== confirmPasswordInput) {
        showMessage('New passwords do not match.', false);
        return;
    }

    if (newPasswordInput && newPasswordInput.length < 6) {
        showMessage('New password must be at least 6 characters.', false);
        return;
    }

    saveBtn.textContent = 'Saving...';
    saveBtn.disabled = true;

    try {
        const response = await window.electronAPI.updateProfile(
            currentUsername, 
            newUsernameInput || currentUsername, 
            oldPasswordInput, 
            newPasswordInput
        );
        
        if (response.success) {
            showMessage(response.message, true);
            if (newUsernameInput && newUsernameInput !== currentUsername) {
                localStorage.setItem('username', newUsernameInput);
                // Update sidebar dynamically if possible, or it will update on reload
                const nameEls = document.querySelectorAll('.user-name');
                const avatarEls = document.querySelectorAll('.avatar');
                nameEls.forEach(el => el.textContent = newUsernameInput);
                avatarEls.forEach(el => el.textContent = newUsernameInput.charAt(0).toUpperCase());
            }
            document.getElementById('old-password').value = '';
            document.getElementById('new-password').value = '';
            document.getElementById('confirm-password').value = '';
        } else {
            showMessage(response.message, false);
        }
    } catch (err) {
        showMessage('An error occurred during update.', false);
    } finally {
        saveBtn.textContent = 'Save Changes';
        saveBtn.disabled = false;
    }
});

function showMessage(text, isSuccess) {
    const msgDiv = document.getElementById('message-container');
    msgDiv.textContent = text;
    msgDiv.className = 'message-container ' + (isSuccess ? 'message-success' : 'message-error');
    msgDiv.style.display = 'block';
}
