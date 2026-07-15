# 📓 AEC Memories (Class of 2026)

A highly interactive, brutalist, and doodle-styled memory-sharing platform built for the AEC Class of 2026 (Cyber Forensic and Information Security Department). This platform allows classmates to document memories via a 3D interactive flipbook, browse a timeline of events, and exchange social contact cards.

**Crafted by:** [chriz__3656](https://instagram.com/chriz__3656)  
**Website:** [chriz-3656.github.io](https://chriz-3656.github.io)

---

## ✨ Features

- **🎨 Playful Brutalist Design**: A fully custom UI featuring hard-edged shadows, hand-drawn "doodle" borders, bold typography, and a dynamic Dark/Light mode toggle.
- **📖 3D Diary Flipbook**: A custom-built 3D CSS flipbook where classmates can write diary entries, upload photos, and physically "turn" the pages.
- **📸 3D Cover Flow Timeline**: An interactive, responsive timeline built with Three.js to browse memories by category (Academic, Events, Hangouts).
- **📇 Social Trading Cards**: A dynamic masonry grid of social profiles. Users can generate their own stylized "social card" containing their photo, bio, Instagram, and LinkedIn links.

---

## 🏗️ Architecture & Infrastructure Plan

To ensure the platform remains scalable, incredibly fast, and completely free to operate, it is transitioning from a local storage prototype to a full **JAMstack (JavaScript, APIs, and Markup)** architecture.

### 1. Frontend & Hosting
*   **Tech Stack**: HTML5, Vanilla CSS3, Vanilla JavaScript, Three.js (3D rendering), GSAP (animations).
*   **Hosting**: **GitHub Pages** (or Cloudflare Pages).
    *   *Why?* It is completely free, highly reliable, and serves static files globally via CDN. It perfectly fits our static frontend approach.

### 2. Authentication & Database (Backend-as-a-Service)
*   **Provider**: **Firebase** (Firestore & Auth).
*   **Authentication**: Users must sign in (Google OAuth or Email/Password) to upload content, ensuring security and attribution.
*   **Database Structure**: A NoSQL document collection (e.g., `memories` and `social_cards`) storing lightweight JSON metadata:
    *   `uploader_name` / `user_id`
    *   `caption` / `bio`
    *   `event_category`
    *   `upload_timestamp`
    *   `media_url` (The permanent public URL)

### 3. Media Storage (Offloading)
To keep the database lightweight and within free-tier limits, we bypass traditional database storage for heavy files.
*   **Images**: Uploaded directly from the browser to **ImgBB** via their public API. ImgBB returns a permanent direct image URL.
*   **Videos**: Uploaded directly to a free video host API (e.g., Cloudinary or Upload Hostify).
*   **Workflow**:
    1. User selects a photo.
    2. Frontend securely sends the photo to the ImgBB API.
    3. ImgBB processes the image and returns a public URL (`https://i.ibb.co/xyz/photo.jpg`).
    4. Frontend saves this lightweight URL string + caption to Firebase Firestore.

### 4. Rendering
When a visitor opens the website:
1. The frontend queries Firestore for the latest memories.
2. Firestore returns the JSON list of URLs and captions.
3. The browser fetches and renders the images/videos directly from ImgBB and the video host.
4. **Result**: Our GitHub Pages site remains lightning-fast and our database uses barely any bandwidth.

---

## 🚀 Setup & Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/chriz-3656/aec-memories.git
   ```
2. Navigate to the project directory:
   ```bash
   cd aec-memories
   ```
3. Open `index.html` in your browser or serve it using a local server (like the VS Code Live Server extension).
4. *(Future Step)* Add your Firebase configuration keys to the JavaScript files to enable cloud database syncing.

---
*Built with 💖 for the AEC CFIS Class of 2026.*
