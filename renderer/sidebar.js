// Sidebar injection and logic
function injectSidebar() {
    const sidebarHTML = `
        <div class="sidebar glass">
            <div class="sidebar-header">
                <div class="logo">
                    <span class="logo-icon">⚡</span>
                    <span class="logo-text">MyTools</span>
                </div>
            </div>
            <nav class="sidebar-nav">
                <a href="#" class="nav-item active" onclick="navigateToPage('home')">
                    <span class="nav-icon">🏠</span>
                    <span class="nav-label">Dashboard</span>
                </a>
                <div class="nav-section-label">TOOLS</div>
                <a href="#" class="nav-item" onclick="navigateToPage('category1')">
                    <span class="nav-icon">🚀</span>
                    <span class="nav-label">Teleport</span>
                </a>
                <a href="#" class="nav-item" onclick="navigateToPage('category2')">
                    <span class="nav-icon">📍</span>
                    <span class="nav-label">Zones</span>
                </a>
                <a href="#" class="nav-item" onclick="navigateToPage('category3')">
                    <span class="nav-icon">📜</span>
                    <span class="nav-label">Logs</span>
                </a>
                <a href="#" class="nav-item" onclick="navigateToPage('category4')">
                    <span class="nav-icon">🛠️</span>
                    <span class="nav-label">XML Generator</span>
                </a>
            </nav>
            <div class="sidebar-footer">
                <div class="user-profile">
                    <div class="avatar">S</div>
                    <div class="user-info">
                        <span class="user-name">Saad</span>
                        <span class="user-role">Game Modder</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
        sidebarContainer.innerHTML = sidebarHTML;

        // Mark active item based on current page
        const currentPage = window.location.pathname.split('/').slice(-2, -1)[0] || 'home';
        const navItems = sidebarContainer.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('onclick').includes(currentPage)) {
                item.classList.add('active');
            }
        });
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', injectSidebar);
