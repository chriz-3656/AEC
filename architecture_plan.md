# 🏗️ Architecture Migration Plan

This document outlines the transition of the "AEC Memories" platform from a local-only prototype (`localStorage`) to a scalable, modern JAMstack architecture.

## 1. Frontend & Hosting
*   **Tech Stack**: HTML5, CSS3, Vanilla JavaScript, Three.js (for 3D Cover Flow / Flipbook).
*   **Hosting**: **GitHub Pages** (or Cloudflare Pages).
    *   *Why?* It's completely free, highly reliable, and serves static files globally via CDN. It perfectly fits our static frontend approach.

## 2. Authentication & Database (Backend-as-a-Service)
*   **Provider**: **Firebase** (Firestore & Auth) or **Supabase**.
*   **Authentication**: Users must sign in (Google OAuth or Email/Password) to upload content, preventing spam and tracking who uploaded what.
*   **Database Structure**: A NoSQL document collection (e.g., `memories` and `social_cards`) storing lightweight JSON metadata:
    *   `uploader_name` / `user_id`
    *   `caption` / `bio`
    *   `event_category` (e.g., Academic, Hangout)
    *   `upload_timestamp`
    *   `media_url` (The permanent public URL)
    *   `media_type` (image/video)

## 3. Media Storage (Offloading)
To keep the database lightweight and within free-tier limits, we will not store heavy media files in Firebase/Supabase.
*   **Images**: Uploaded directly from the browser to **ImgBB** via their public API. ImgBB returns a permanent direct image URL.
*   **Videos**: Uploaded directly to a free video host API (like **Upload Hostify** or Cloudinary free tier).
*   *Workflow*:
    1. User selects a photo.
    2. Frontend sends the photo to ImgBB API.
    3. ImgBB returns `https://i.ibb.co/xyz/photo.jpg`.
    4. Frontend saves this URL + caption to Firestore.

## 4. Rendering
When a visitor opens the website:
1. The frontend queries Firestore for the latest memories.
2. Firestore returns the JSON list of URLs and captions.
3. The browser fetches and renders the images/videos directly from ImgBB and the video host.
4. **Result**: Our GitHub Pages site remains lightning-fast and our database uses barely any bandwidth.

---

### Next Steps to Implement:
To start coding this, we will need to set up the following accounts:
1. **Database**: Create a free project on Firebase (or Supabase) and get the `config` object (API keys).
2. **ImgBB**: Create a free ImgBB account and generate an API key.
3. **Video Host**: Decide on the video host (e.g., Cloudinary is highly recommended for developers) and get the upload preset.
