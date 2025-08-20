document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('#content-area section');
    const menuButton = document.getElementById('menu-button');
    const sidebar = document.getElementById('sidebar');
    const logoutButton = document.getElementById('logout-button');

    // Check for token on page load
    if (!localStorage.getItem('token')) {
        window.location.href = '/login.html';
        return; // Stop executing script if not logged in
    }

    // Sidebar navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');

            contentSections.forEach(section => {
                if (section.id === `${sectionId}-section`) {
                    section.classList.remove('hidden');
                } else {
                    section.classList.add('hidden');
                }
            });

            // Hide sidebar on mobile after click
            if (window.innerWidth < 768) {
                sidebar.classList.add('-translate-x-full');
            }
        });
    });

    // Mobile menu toggle
    menuButton.addEventListener('click', () => {
        sidebar.classList.toggle('-translate-x-full');
    });

    // Logout functionality
    logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        alert('You have been logged out.');
        window.location.href = '/login.html';
    });
});
