export function initTheme() {
    const toggle = document.getElementById('theme-toggle');
    if(!toggle) return;
    
    // Apply saved theme immediately
    const savedTheme = localStorage.getItem('aec_theme');
    if(savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        toggle.textContent = 'LGT';
    }
    
    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if(document.body.classList.contains('dark-mode')) {
            localStorage.setItem('aec_theme', 'dark');
            toggle.textContent = 'LGT';
        } else {
            localStorage.setItem('aec_theme', 'light');
            toggle.textContent = 'DRK';
        }
    });
}
