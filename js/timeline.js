export function initTimeline(data) {
    const track = document.getElementById('timeline-track');
    const filters = document.getElementById('timeline-filters');
    if(!track || !filters) return;

    function renderTimeline(filterData) {
        track.innerHTML = '';
        if(filterData.length === 0) {
            track.innerHTML = '<p class="subtext">No memories found for this filter.</p>';
            return;
        }
        
        filterData.forEach((item, i) => {
            const div = document.createElement('div');
            div.className = 'timeline-item fade-in';
            div.innerHTML = `
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <div class="overlay"></div>
                <div>
                    <span class="timeline-meta">${item.date} • ${item.semester}</span>
                    <h3 class="timeline-title">${item.title}</h3>
                </div>
            `;
            track.appendChild(div);
            
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
                }
            });
        });

        // Trigger animations
        setTimeout(() => {
            if(window.gsap && window.ScrollTrigger) {
                ScrollTrigger.refresh();
                gsap.utils.toArray('#timeline-track .timeline-item').forEach(element => {
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
        }, 100);
    }

    renderTimeline(data);

    // Filters
    const btns = filters.querySelectorAll('.filter-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            if(filter === 'all') {
                renderTimeline(data);
            } else {
                const filtered = data.filter(d => d.semester === filter);
                renderTimeline(filtered);
            }
        });
    });
}
