export function initEffects(data) {
    // Lenis Smooth Scroll Setup
    if(typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // Custom Cursor
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    
    if (cursor && follower) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        const loop = () => {
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            follower.style.left = followerX + 'px';
            follower.style.top = followerY + 'px';
            requestAnimationFrame(loop);
        };
        loop();
    }

    // Background Canvas Effect
    initBackgroundCanvas();

    // Audio
    const muteBtn = document.getElementById('mute-btn');
    if(muteBtn) {
        const equalizer = muteBtn.querySelector('.equalizer');
        let isPlaying = true;
        
        muteBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;
            if(isPlaying) {
                equalizer.classList.add('playing');
                // Could play HTML5 audio element here
            } else {
                equalizer.classList.remove('playing');
                // Pause HTML5 audio element here
            }
        });
    }

    // Search Overlay
    const searchBtn = document.getElementById('search-btn');
    const closeSearch = document.getElementById('close-search');
    const searchOverlay = document.getElementById('search-overlay');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    if(searchBtn && closeSearch && searchOverlay && searchInput) {
        searchBtn.addEventListener('click', () => {
            searchOverlay.classList.remove('hidden');
            setTimeout(() => searchInput.focus(), 100);
        });

        closeSearch.addEventListener('click', () => {
            searchOverlay.classList.add('hidden');
        });

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            if(!query) {
                searchResults.innerHTML = '';
                return;
            }
            const results = (data || []).filter(item => 
                item.title.toLowerCase().includes(query) || 
                item.description.toLowerCase().includes(query) ||
                item.date.toLowerCase().includes(query) ||
                item.semester.toLowerCase().includes(query)
            );
            
            searchResults.innerHTML = results.map(item => `
                <div class="search-result-item" style="display:flex; gap:15px; margin-bottom:15px; cursor:pointer; align-items:center; background:var(--glass); padding:10px; border-radius:15px; border:1px solid var(--border); transition:transform 0.3s ease;">
                    <img src="${item.image}" style="width:60px; height:60px; object-fit:cover; border-radius:10px;">
                    <div>
                        <h4 style="margin:0; font-size:1.1rem;">${item.title}</h4>
                        <span style="font-size:0.8rem; color:var(--accent);">${item.date} • ${item.semester}</span>
                    </div>
                </div>
            `).join('');
            
            searchResults.querySelectorAll('.search-result-item').forEach((el, index) => {
                el.addEventListener('mouseenter', () => el.style.transform = 'translateY(-2px)');
                el.addEventListener('mouseleave', () => el.style.transform = 'translateY(0)');
                el.addEventListener('click', () => {
                    searchOverlay.classList.add('hidden');
                    const item = results[index];
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
        });
    }

    // Draggable Stickers
    const stickers = document.querySelectorAll('.sticker');
    stickers.forEach(sticker => {
        let isDown = false, startX, startY, startLeft, startTop;
        
        const down = (e) => {
            isDown = true;
            const clientX = e.clientX || e.touches?.[0].clientX;
            const clientY = e.clientY || e.touches?.[0].clientY;
            startX = clientX;
            startY = clientY;
            
            // Get current style position
            const rect = sticker.getBoundingClientRect();
            // Need to handle absolute positioning relative to document
            startLeft = rect.left + window.scrollX;
            startTop = rect.top + window.scrollY;
            
            // Convert from right/bottom to absolute left/top if needed
            sticker.style.right = 'auto';
            sticker.style.bottom = 'auto';
            sticker.style.left = startLeft + 'px';
            sticker.style.top = startTop + 'px';
            
            sticker.style.zIndex = 1000;
        };

        const move = (e) => {
            if(!isDown) return;
            e.preventDefault();
            const clientX = e.clientX || e.touches?.[0].clientX;
            const clientY = e.clientY || e.touches?.[0].clientY;
            
            const dx = clientX - startX;
            const dy = clientY - startY;
            sticker.style.left = (startLeft + dx) + 'px';
            sticker.style.top = (startTop + dy) + 'px';
        };

        const up = () => {
            if(isDown) {
                isDown = false;
                sticker.style.zIndex = 150;
            }
        };

        sticker.addEventListener('mousedown', down);
        window.addEventListener('mousemove', move, {passive: false});
        window.addEventListener('mouseup', up);
        
        sticker.addEventListener('touchstart', down, {passive: true});
        window.addEventListener('touchmove', move, {passive: false});
        window.addEventListener('touchend', up);
    });
}

function initBackgroundCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let w, h;
    const resize = () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const shapes = [];
    const colors = ['#1C1C1C', '#FF3366', '#3A86FF', '#FFBE0B', '#06D6A0'];
    const types = ['rect', 'circle', 'triangle', 'plus'];
    
    for(let i=0; i<30; i++) {
        shapes.push({
            x: Math.random() * w,
            y: Math.random() * h,
            size: Math.random() * 40 + 20,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            rot: Math.random() * Math.PI,
            vRot: (Math.random() - 0.5) * 0.1,
            color: colors[Math.floor(Math.random() * colors.length)],
            type: types[Math.floor(Math.random() * types.length)]
        });
    }

    function render() {
        ctx.clearRect(0, 0, w, h);
        
        shapes.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.rot += p.vRot;
            
            if(p.x < -100) p.x = w + 100;
            if(p.x > w + 100) p.x = -100;
            if(p.y < -100) p.y = h + 100;
            if(p.y > h + 100) p.y = -100;
            
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            
            ctx.lineWidth = 4;
            ctx.strokeStyle = '#1C1C1C';
            ctx.fillStyle = p.color;
            
            ctx.beginPath();
            if(p.type === 'rect') {
                ctx.rect(-p.size/2, -p.size/2, p.size, p.size);
            } else if(p.type === 'circle') {
                ctx.arc(0, 0, p.size/2, 0, Math.PI * 2);
            } else if(p.type === 'triangle') {
                ctx.moveTo(0, -p.size/2);
                ctx.lineTo(p.size/2, p.size/2);
                ctx.lineTo(-p.size/2, p.size/2);
                ctx.closePath();
            } else if(p.type === 'plus') {
                const s = p.size/3;
                ctx.rect(-s/2, -p.size/2, s, p.size);
                ctx.rect(-p.size/2, -s/2, p.size, s);
            }
            
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        });
        requestAnimationFrame(render);
    }
    render();
}
