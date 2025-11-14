// Home page logic

function goToCategory(categoryName) {
    navigateToPage(categoryName);
}

// Welcome message when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Home page loaded successfully');

    // You can add more functions here
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
});
