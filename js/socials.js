document.addEventListener('DOMContentLoaded', () => {
    // Custom cursor setup
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    if (cursor && follower) {
        let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX; mouseY = e.clientY;
            cursor.style.left = mouseX + 'px'; cursor.style.top = mouseY + 'px';
        });
        const loop = () => {
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            follower.style.left = followerX + 'px'; follower.style.top = followerY + 'px';
            requestAnimationFrame(loop);
        };
        loop();
    }

    const STORAGE_KEY = 'aec_socials';
    const form = document.getElementById('social-form');
    const grid = document.getElementById('socials-grid');
    
    const colors = ['var(--accent-yellow)', 'var(--accent-pink)', 'var(--accent-green)', 'var(--accent-blue)', '#fff'];

    const defaultCards = [
        { name: "Zuck", ig: "zuck", bio: "Building the future.", color: "var(--accent-blue)", photo: "" },
        { name: "NatGeo", ig: "natgeo", bio: "Exploring the world one photo at a time.", color: "var(--accent-yellow)", photo: "" }
    ];

    function loadCards() {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : defaultCards;
    }

    function saveCards(cards) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    }

    function renderCards(animate = false) {
        if(!grid) return;
        const cards = loadCards();
        grid.innerHTML = '';
        
        cards.forEach((card, index) => {
            let cleanIg = card.ig.replace('@', '').trim();
            // Since browsers block Instagram scraping via OpaqueResponseBlocking (ORB),
            // we use the uploaded photo, or automatically generate a unique, beautiful avatar based on their IG handle!
            let avatarUrl = card.photo ? card.photo : `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${cleanIg}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffdfbf,ffd5dc`;
            
            const div = document.createElement('div');
            div.className = 'social-card';
            div.style.background = card.color;
            const initRot = (Math.random() * 6 - 3);
            div.style.transform = `rotate(${initRot}deg)`;
            
            div.innerHTML = `
                <div class="card-tape" style="transform: translateX(-50%) rotate(${(Math.random() * 10 - 5)}deg)"></div>
                <div class="card-avatar-wrapper">
                    <img src="${avatarUrl}" class="card-avatar" alt="${card.name}">
                </div>
                <div class="card-name">${card.name}</div>
                ${card.studentId ? `<div class="card-id">ID: ${card.studentId}</div>` : ''}
                <div class="card-bio">"${card.bio}"</div>
                
                <div class="card-links">
                    <a href="https://instagram.com/${cleanIg}" target="_blank" class="card-link ig">@${cleanIg}</a>
                    ${card.linkedin ? `<a href="${card.linkedin}" target="_blank" class="card-link linkedin">IN</a>` : ''}
                    ${card.xLink ? `<a href="${card.xLink}" target="_blank" class="card-link x">X</a>` : ''}
                    ${card.website ? `<a href="${card.website}" target="_blank" class="card-link web">WEB</a>` : ''}
                    ${card.email ? `<a href="mailto:${card.email}" class="card-link mail">MAIL</a>` : ''}
                </div>
            `;
            
            grid.appendChild(div);
        });

        if(animate && window.gsap) {
            gsap.fromTo('.social-card', 
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)" }
            );
        }
    }

    let uploadedPhoto = "";
    const photoInput = document.getElementById('social-photo');
    const photoPreview = document.getElementById('social-photo-preview');

    if(photoInput && photoPreview) {
        photoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if(file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    uploadedPhoto = ev.target.result;
                    photoPreview.src = uploadedPhoto;
                    photoPreview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('social-name').value;
            const ig = document.getElementById('social-ig').value;
            const bio = document.getElementById('social-bio').value;
            
            const studentId = document.getElementById('social-id').value;
            const email = document.getElementById('social-email').value;
            const linkedin = document.getElementById('social-linkedin').value;
            const xLink = document.getElementById('social-x').value;
            const website = document.getElementById('social-website').value;
            
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            const cards = loadCards();
            cards.unshift({ 
                name, ig, bio, color, photo: uploadedPhoto,
                studentId, email, linkedin, xLink, website
            }); // add to start
            saveCards(cards);
            
            renderCards(true);
            form.reset();
            uploadedPhoto = "";
            if(photoPreview) photoPreview.style.display = 'none';
        });
    }

    renderCards(true);
});
