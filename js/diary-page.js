document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor
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

    const bookEl = document.getElementById('book');
    const STORAGE_KEY = 'aec_diaries_v3';
    
    let currentSheet = 0;
    let totalSheets = 0;

    const defaultEntries = [
        { name: "Rahul", content: "Man, I'll never forget the nights before exams. So much coffee! [!]", date: "May 15, 2026", photo: "" },
        { name: "Sneha", content: "Tech fest was absolute chaos but the best time of my life! *", date: "May 14, 2026", photo: "" },
        { name: "Arjun", content: "Canteen samosas...", date: "May 12, 2026", photo: "" }
    ];

    function loadEntries() {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : defaultEntries;
    }

    function saveEntries(entries) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }

    function renderEntry(entry) {
        let photoHtml = entry.photo ? `<img src="${entry.photo}" class="entry-photo">` : '';
        const tapeRot = (Math.random() - 0.5) * 20;
        return `
            <div class="doodle-tape" style="transform: translateX(-50%) rotate(${tapeRot}deg)"></div>
            ${photoHtml}
            <div class="entry-content">"${entry.content}"</div>
            <div class="entry-meta">- ${entry.name} <br> ${entry.date}</div>
        `;
    }

    function renderForm() {
        return `
            <form id="new-page-form" class="book-form">
                <h2 class="page-title">New Page</h2>
                <input type="text" id="entry-name" placeholder="Your Name" required>
                <textarea id="entry-content" placeholder="Write your memories..." required></textarea>
                <div class="upload-area">
                    <label for="entry-photo" class="page-btn" style="position:relative; bottom:0; left:0; font-size: 1rem;">+ ADD PHOTO</label>
                    <input type="file" id="entry-photo" accept="image/*" style="display:none;">
                    <img id="entry-photo-preview" src="">
                </div>
                <button type="submit" class="page-btn" style="position:relative; bottom:0; right:0; width:100%; margin-top:auto; background:var(--accent-green); color:var(--graphite);">+ SAVE PAGE</button>
            </form>
        `;
    }

    function buildBook() {
        const entries = loadEntries();
        bookEl.innerHTML = '';
        
        const sheetsData = [];
        
        // Sheet 0: Cover
        sheetsData.push({
            frontClass: 'cover-front',
            front: `<h1>Class Diary</h1>`,
            backClass: 'cover-back',
            back: `<h2 style="color:var(--graphite); font-family:var(--font-poster); font-size:3rem; text-shadow:4px 4px 0 white; transform:rotate(-15deg);">Memories<br>Inside...</h2>`
        });

        // Entry Sheets
        for(let i=0; i<entries.length; i+=2) {
            sheetsData.push({
                frontClass: '',
                front: renderEntry(entries[i]),
                backClass: '',
                back: entries[i+1] ? renderEntry(entries[i+1]) : `<div class="entry-content" style="text-align:center; opacity:0.5; font-size:3rem; margin-top:50%;">(Blank Page)</div>`
            });
        }

        // Form Sheet
        sheetsData.push({
            frontClass: '',
            front: renderForm(),
            backClass: 'cover-back',
            back: `<h1 style="color:var(--graphite); font-size:4rem; font-family:var(--font-poster); text-shadow:4px 4px 0 white; transform:rotate(10deg);">The End</h1>`
        });

        totalSheets = sheetsData.length;

        sheetsData.forEach((data, i) => {
            const sheet = document.createElement('div');
            sheet.className = 'sheet';
            sheet.dataset.index = i;
            sheet.style.zIndex = totalSheets - i;
            
            // Generate Buttons
            let frontBtns = '';
            let backBtns = '';
            
            if (i === 0) {
                frontBtns = `<button class="page-btn btn-next">OPEN -></button>`;
                backBtns = `<button class="page-btn btn-prev"><- CLOSE</button>`;
            } else if (i === totalSheets - 1) {
                // Last sheet
                frontBtns = `<button class="page-btn btn-prev"><- PREV</button>
                             <button class="page-btn btn-close">CLOSE X</button>`;
                backBtns = `<button class="page-btn btn-prev"><- BACK</button>`;
            } else {
                frontBtns = `<button class="page-btn btn-next">NEXT -></button>`;
                backBtns = `<button class="page-btn btn-prev"><- PREV</button>
                            <button class="page-btn btn-close">CLOSE X</button>`;
            }

            sheet.innerHTML = `
                <div class="face front ${data.frontClass}">
                    ${data.front}
                    ${frontBtns}
                </div>
                <div class="face back ${data.backClass}">
                    ${data.back}
                    ${backBtns}
                </div>
            `;
            
            // Allow clicking sheet itself to flip, but prevent if clicking buttons or form elements
            sheet.addEventListener('click', (e) => {
                if(e.target.closest('form') || e.target.closest('.page-btn')) return;
                
                if (i === currentSheet) {
                    flipNext();
                } else if (i === currentSheet - 1) {
                    flipPrev();
                }
            });
            
            bookEl.appendChild(sheet);
        });
        
        bindFormEvents();
        updateFlipState();
    }

    // Delegate button clicks for dynamically injected buttons
    bookEl.addEventListener('click', (e) => {
        if(e.target.classList.contains('btn-next')) {
            flipNext();
        } else if(e.target.classList.contains('btn-prev')) {
            flipPrev();
        } else if(e.target.classList.contains('btn-close')) {
            closeBook();
        }
    });

    function updateFlipState() {
        const sheets = document.querySelectorAll('.sheet');
        sheets.forEach((sheet, i) => {
            if(i < currentSheet) {
                sheet.classList.add('flipped');
                sheet.style.zIndex = i + 1; // Left side stacking (bottom to top)
            } else {
                sheet.classList.remove('flipped');
                sheet.style.zIndex = totalSheets - i; // Right side stacking (top to bottom)
            }
        });
    }

    function flipNext() {
        if(currentSheet < totalSheets) {
            currentSheet++;
            updateFlipState();
        }
    }

    function flipPrev() {
        if(currentSheet > 0) {
            currentSheet--;
            updateFlipState();
        }
    }

    function closeBook() {
        currentSheet = 0;
        updateFlipState();
    }

    function bindFormEvents() {
        const form = document.getElementById('new-page-form');
        const fileInput = document.getElementById('entry-photo');
        const preview = document.getElementById('entry-photo-preview');
        
        let photoBase64 = "";

        if(fileInput && preview) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if(file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        photoBase64 = e.target.result;
                        preview.src = photoBase64;
                        preview.style.display = 'block';
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        if(form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('entry-name').value;
                const content = document.getElementById('entry-content').value;
                const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                
                const entries = loadEntries();
                entries.push({ name, content, date, photo: photoBase64 });
                saveEntries(entries);
                
                buildBook();
                
                // Flip to the page we just created
                currentSheet = totalSheets - 1;
                updateFlipState();
            });
        }
    }

    buildBook();
});
