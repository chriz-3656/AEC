export function initCarousel(data) {
    if(!data || data.length === 0) return;
    
    const container = document.getElementById('cover-flow-container');
    if(!container || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    const isMobile = window.innerWidth < 768;
    camera.position.z = isMobile ? 12 : 7;
    camera.position.y = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);
    


    // Cards
    const cards = [];
    const cardWidth = 4;
    const cardHeight = 6;
    const gap = 2.5;
    
    const textureLoader = new THREE.TextureLoader();
    const group = new THREE.Group();
    scene.add(group);

    data.forEach((item, index) => {
        // Group for card + border
        const cardGroup = new THREE.Group();
        
        // Card Image
        const geometry = new THREE.PlaneGeometry(cardWidth, cardHeight);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
        });
        
        // Brutalist Thick Border/Shadow backing
        const borderGeo = new THREE.PlaneGeometry(cardWidth + 0.3, cardHeight + 0.3);
        const borderMat = new THREE.MeshBasicMaterial({ color: 0x1c1c1c });
        const borderMesh = new THREE.Mesh(borderGeo, borderMat);
        borderMesh.position.z = -0.1;
        borderMesh.position.x = 0.2; // offset shadow
        borderMesh.position.y = -0.2;
        cardGroup.add(borderMesh);
        
        textureLoader.load(item.image, (tex) => {
            tex.minFilter = THREE.LinearFilter;
            tex.generateMipmaps = false;
            // Crop texture to fit card proportion if needed
            material.map = tex;
            material.needsUpdate = true;
        });

        const mesh = new THREE.Mesh(geometry, material);
        cardGroup.add(mesh);
        
        cardGroup.userData = { index, item };
        group.add(cardGroup);
        cards.push(cardGroup);
    });

    let currentIndex = 0;
    let targetIndex = 0;
    let dragStartX = 0;
    let isDragging = false;

    function updateCards() {
        cards.forEach((card, i) => {
            const offset = i - targetIndex;
            const sign = Math.sign(offset);
            const absOffset = Math.abs(offset);
            
            // Apple Cover Flow style math
            let targetX = offset * gap;
            let targetZ = -absOffset * 2.5;
            let targetRotY = -sign * Math.min(absOffset * 0.6, 0.9);
            
            if (absOffset > 0) {
                targetX += sign * 1.5; // pull side cards out slightly
            }

            // Interpolate
            card.position.x += (targetX - card.position.x) * 0.08;
            card.position.z += (targetZ - card.position.z) * 0.08;
            card.rotation.y += (targetRotY - card.rotation.y) * 0.08;
        });
        
        if(Math.abs(currentIndex - targetIndex) < 0.1) {
            updateActiveInfo(Math.round(targetIndex));
        }
        currentIndex += (targetIndex - currentIndex) * 0.08;
    }

    let activeDataIndex = -1;
    function updateActiveInfo(idx) {
        if(idx === activeDataIndex || idx < 0 || idx >= data.length) return;
        activeDataIndex = idx;
        const item = data[idx];
        
        const title = document.getElementById('active-title');
        const desc = document.getElementById('active-desc');
        const date = document.getElementById('active-date');
        const sem = document.getElementById('active-sem');
        const loc = document.getElementById('active-location');
        
        if(window.gsap) {
            gsap.to([title, desc, date, sem, loc], {
                y: 10, opacity: 0, duration: 0.2, onComplete: () => {
                    if(title) title.innerText = item.title;
                    if(desc) desc.innerText = item.description;
                    if(date) date.innerText = item.date;
                    if(sem) sem.innerText = item.semester;
                    if(loc) loc.innerText = item.location;
                    
                    gsap.to([title, desc, date, sem, loc], {
                        y: 0, opacity: 1, duration: 0.4, stagger: 0.05
                    });
                }
            });
        }
    }

    // Mouse Wheel
    window.addEventListener('wheel', (e) => {
        if(window.scrollY > window.innerHeight * 0.5) return; // Only if home section is visible
        if (e.deltaY > 0) targetIndex = Math.min(targetIndex + 1, cards.length - 1);
        else targetIndex = Math.max(targetIndex - 1, 0);
    });

    // Keyboard
    window.addEventListener('keydown', (e) => {
        if(window.scrollY > window.innerHeight * 0.5) return;
        if(e.key === 'ArrowRight') targetIndex = Math.min(targetIndex + 1, cards.length - 1);
        if(e.key === 'ArrowLeft') targetIndex = Math.max(targetIndex - 1, 0);
    });
    
    // Drag
    renderer.domElement.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragStartX = e.clientX;
    });
    renderer.domElement.addEventListener('mousemove', (e) => {
        if(!isDragging) return;
        const deltaX = e.clientX - dragStartX;
        if(Math.abs(deltaX) > 60) {
            if(deltaX > 0) targetIndex = Math.max(targetIndex - 1, 0);
            else targetIndex = Math.min(targetIndex + 1, cards.length - 1);
            dragStartX = e.clientX;
            isDragging = false;
        }
    });
    renderer.domElement.addEventListener('mouseup', () => isDragging = false);
    renderer.domElement.addEventListener('mouseleave', () => isDragging = false);
    
    // Touch
    renderer.domElement.addEventListener('touchstart', (e) => {
        isDragging = true;
        dragStartX = e.touches[0].clientX;
    });
    renderer.domElement.addEventListener('touchmove', (e) => {
        if(!isDragging) return;
        const deltaX = e.touches[0].clientX - dragStartX;
        if(Math.abs(deltaX) > 50) {
            if(deltaX > 0) targetIndex = Math.max(targetIndex - 1, 0);
            else targetIndex = Math.min(targetIndex + 1, cards.length - 1);
            dragStartX = e.touches[0].clientX;
            isDragging = false;
        }
    });
    renderer.domElement.addEventListener('touchend', () => isDragging = false);

    // Click raycast
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    renderer.domElement.addEventListener('click', (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(cards, true);
        
        if(intersects.length > 0) {
            // Because we used recursive=true, intersects[0].object is the Mesh, 
            // but we need the userData from the parent Group which we stored it on.
            const clickedCard = intersects[0].object.parent;
            const idx = clickedCard.userData.index;
            if(Math.round(targetIndex) === idx) {
                openMemory(clickedCard.userData.item);
            } else {
                targetIndex = idx;
            }
        }
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        const isMobile = window.innerWidth < 768;
        camera.position.z = isMobile ? 12 : 7;
    });

    const parallaxMouse = new THREE.Vector2();
    window.addEventListener('mousemove', (e) => {
        parallaxMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        parallaxMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    function animate() {
        requestAnimationFrame(animate);
        updateCards();
        
        if(!isDragging) {
            camera.position.x += ( (parallaxMouse.x * 1) - camera.position.x ) * 0.05;
            camera.position.y += ( (parallaxMouse.y * 1) - camera.position.y ) * 0.05;
            camera.lookAt(scene.position);
        }
        
        renderer.render(scene, camera);
    }
    
    updateActiveInfo(0);
    animate();
}

function openMemory(item) {
    const overlay = document.getElementById('memory-overlay');
    document.getElementById('memory-hero-img').src = item.image;
    document.getElementById('memory-title-full').innerText = item.title;
    document.getElementById('memory-date-full').innerText = item.date;
    document.getElementById('memory-sem-full').innerText = item.semester;
    document.getElementById('memory-loc-full').innerText = item.location;
    document.getElementById('memory-desc-full').innerText = item.description;
    
    const subGallery = document.getElementById('memory-sub-gallery');
    subGallery.innerHTML = `
        <img src="${item.image}" alt="photo">
        <img src="${item.image}" alt="photo">
        <img src="${item.image}" alt="photo">
    `;

    overlay.classList.remove('hidden');
    
    if(window.gsap) {
        gsap.fromTo('.memory-content > *', 
            { y: 50, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, delay: 0.2, ease: "power3.out" }
        );
    }
    
    document.getElementById('close-memory').onclick = () => {
        overlay.classList.add('hidden');
    };
}
