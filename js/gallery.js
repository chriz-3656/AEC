export function initGallery(data) {
    const grid = document.getElementById('masonry-grid');
    if(!grid) return;
    
    // Duplicate data slightly to show off Masonry grid
    const galleryData = [...data, ...data, ...data, ...data]; 

    galleryData.forEach((item, i) => {
        const div = document.createElement('div');
        div.className = 'gallery-item fade-in';
        div.innerHTML = `
            <img src="${item.image}" alt="${item.title}" loading="lazy">
        `;
        grid.appendChild(div);
        
        // Let user click to preview in fullscreen if desired
        div.addEventListener('click', () => {
            const overlay = document.getElementById('memory-overlay');
            if(overlay) {
                document.getElementById('memory-hero-img').src = item.image;
                document.getElementById('memory-title-full').innerText = item.title;
                document.getElementById('memory-date-full').innerText = item.date;
                document.getElementById('memory-sem-full').innerText = item.semester;
                document.getElementById('memory-loc-full').innerText = item.location;
                document.getElementById('memory-desc-full').innerText = item.description;
                overlay.classList.remove('hidden');
                
                if(window.gsap) {
                    gsap.fromTo('.memory-content > *', 
                        { y: 50, opacity: 0 }, 
                        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, delay: 0.2, ease: "power3.out" }
                    );
                }
            }
        });
    });

    if(window.gsap && window.ScrollTrigger) {
        gsap.utils.toArray('.gallery-item').forEach(element => {
            gsap.to(element, {
                scrollTrigger: {
                    trigger: element,
                    start: "top 90%",
                    toggleClass: "visible",
                    once: true
                }
            });
        });
    }
}
