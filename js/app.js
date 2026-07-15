import { initLoader } from './loader.js';
import { initEffects } from './effects.js';
import { initCarousel } from './carousel.js';
import { initGallery } from './gallery.js';
import { initTimeline } from './timeline.js';

let memoriesData = [];

document.addEventListener('DOMContentLoaded', async () => {
    // Start loader
    const { finishLoader } = initLoader();
    
    try {
        // Fetch data
        const response = await fetch('data/memories.json');
        memoriesData = await response.json();
        
        // Initialize modules
        initEffects(memoriesData);
        initGallery(memoriesData);
        initTimeline(memoriesData);
        initCarousel(memoriesData);
        
        // Finish loading after brief delay to show Apple-quality loader
        setTimeout(() => {
            finishLoader();
        }, 1500);
    } catch (error) {
        console.error("Failed to load memories data:", error);
        finishLoader(); // still clear loader
    }
});

export const getMemories = () => memoriesData;
