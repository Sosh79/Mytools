// Function to navigate between pages from within the interface
function navigateToPage(pageName) {
    if (window.electronAPI && window.electronAPI.navigateToPage) {
        window.electronAPI.navigateToPage(pageName);
    } else {
        console.error('Electron API is not available');
    }
}

function togglePreview() {
    const container = document.querySelector('.split-pane-container');
    if (container) {
        container.classList.toggle('preview-hidden');
    }
}

// Export function for use in pages
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { navigateToPage };
}
