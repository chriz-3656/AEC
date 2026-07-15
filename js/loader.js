export function initLoader() {
    const loader = document.getElementById('loader');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 90) progress = 90; // Hold at 90% until finished
        updateProgress(progress);
    }, 150);

    function updateProgress(val) {
        const p = Math.min(100, Math.floor(val));
        if(progressBar) progressBar.style.width = p + '%';
        if(progressText) progressText.innerText = p + '%';
    }

    function finishLoader() {
        clearInterval(interval);
        updateProgress(100);
        setTimeout(() => {
            if(loader) {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                    // Trigger intro animations
                    gsap.from('#cover-flow-container', { opacity: 0, scale: 0.9, duration: 1.5, ease: "power3.out" });
                    gsap.from('.active-card-info > *', { y: 20, opacity: 0, duration: 1, stagger: 0.1, delay: 0.5 });
                }, 1000);
            }
        }, 300);
    }

    return { finishLoader };
}
