export function initDiary() {
    const form = document.getElementById('diary-form');
    const entriesGrid = document.getElementById('diary-entries');
    
    if(!form || !entriesGrid) return;
    
    const STORAGE_KEY = 'aec_diaries';
    
    // Default dummy entries
    const defaultEntries = [
        {
            name: "Rahul",
            content: "Man, I'll never forget the nights before exams. So much coffee! ☕",
            date: "May 15, 2026",
            rotation: -2,
            color: "white"
        },
        {
            name: "Sneha",
            content: "Tech fest was absolute chaos but the best time of my life! ✨",
            date: "May 14, 2026",
            rotation: 3,
            color: "var(--accent-yellow)"
        },
        {
            name: "Arjun",
            content: "Miss the canteen samosas already... 😭",
            date: "May 12, 2026",
            rotation: -4,
            color: "var(--accent-green)"
        }
    ];

    function loadEntries() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if(stored) {
            return JSON.parse(stored);
        }
        return defaultEntries;
    }

    function saveEntries(entries) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }

    function renderEntries() {
        const entries = loadEntries();
        entriesGrid.innerHTML = '';
        
        entries.forEach((entry, i) => {
            const rot = entry.rotation || (Math.random() * 6 - 3);
            const bg = entry.color || 'white';
            
            const div = document.createElement('div');
            div.className = 'diary-note fade-in';
            div.style.transform = `rotate(${rot}deg)`;
            div.style.background = bg;
            
            // Tape doodle
            const tape = `<div style="position:absolute; top:-15px; left:50%; transform:translateX(-50%) rotate(${-rot * 2}deg); width:60px; height:25px; background:rgba(255,255,255,0.9); border:3px solid var(--graphite); z-index:5;"></div>`;
            
            div.innerHTML = `
                ${tape}
                <div class="diary-note-content">"${entry.content}"</div>
                <div class="diary-note-author">- ${entry.name}</div>
                <div class="diary-note-date">${entry.date}</div>
            `;
            
            entriesGrid.appendChild(div);
        });

        // Trigger GSAP fade in
        if(window.gsap && window.ScrollTrigger) {
            ScrollTrigger.refresh();
            gsap.utils.toArray('.diary-note').forEach(element => {
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

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('diary-name').value;
        const content = document.getElementById('diary-content').value;
        const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        
        const colors = ['white', 'var(--accent-yellow)', 'white', 'var(--accent-green)', 'white'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        const newEntry = {
            name,
            content,
            date,
            rotation: (Math.random() * 8 - 4),
            color: randomColor
        };
        
        const entries = loadEntries();
        entries.unshift(newEntry); // Add to top
        saveEntries(entries);
        
        renderEntries();
        
        form.reset();
        
        // Scroll to newly added entry
        setTimeout(() => {
            if(window.gsap && window.ScrollTrigger) ScrollTrigger.refresh();
        }, 100);
    });

    renderEntries();
}
