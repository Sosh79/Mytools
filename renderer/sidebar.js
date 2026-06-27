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
                <a href="#" class="nav-item" onclick="navigateToPage('category5')">
                    <span class="nav-icon">⚙️</span>
                    <span class="nav-label">Server Info</span>
                </a>
            </nav>
            <div class="sidebar-footer">
                <div class="user-profile" onclick="navigateToPage('profile')" style="cursor: pointer; flex-grow: 1;">
                    <div class="avatar">U</div>
                    <div class="user-info">
                        <span class="user-name">User</span>
                    </div>
                </div>
                <div class="logout-btn" onclick="logoutUser()" title="Logout" style="cursor: pointer; padding: 10px; margin-top: 15px; color: #ef4444; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 8px; font-weight: 600; font-size: 14px; width: 100%;" onmouseover="this.style.background='rgba(239, 68, 68, 0.2)'" onmouseout="this.style.background='rgba(239, 68, 68, 0.1)'">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Logout
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

        // Dynamic Username from localStorage
        const storedUsername = localStorage.getItem('username');
        const nameEl = sidebarContainer.querySelector('.user-name');
        const avatarEl = sidebarContainer.querySelector('.avatar');
        if (storedUsername) {
            if (nameEl) nameEl.textContent = storedUsername;
            if (avatarEl) avatarEl.textContent = storedUsername.charAt(0).toUpperCase();
        }
    }
}

function logoutUser() {
    localStorage.removeItem('username');
    localStorage.removeItem('remember_expiry');
    if (window.electronAPI && window.electronAPI.navigateToPage) {
        window.electronAPI.navigateToPage('login');
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', injectSidebar);
