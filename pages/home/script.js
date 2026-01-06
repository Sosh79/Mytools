// Home page logic

function goToCategory(categoryName) {
    navigateToPage(categoryName);
}

// Welcome message when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Home page loaded successfully');

    // Dynamic Username
    if (window.electronAPI && window.electronAPI.getUsername) {
        window.electronAPI.getUsername().then(username => {
            const title = document.getElementById('welcome-title');
            if (title && username) {
                title.innerText = `Welcome Back, ${username}`;
            }
        });
    }

    // You can add more functions here
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
});
