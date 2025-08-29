/**
 * Main application initialization and orchestration
 */

import { initializeDeviceSpecificUI } from './utils/device-detection.js';
import { initializeFullscreenDialog } from './dialogs/fullscreen-dialog.js';
import { initializeWelcomeDialog } from './dialogs/welcome-dialog.js';
import { initializeBakeryPopup } from './dialogs/bakery-popup.js';
import { initializeRecommendationsDialog } from './dialogs/recommendations-dialog.js';
import { initializeStartingBakeryPopup } from './dialogs/starting-bakery-popup.js';
import { initializeMap } from './map/map-manager.js';

/**
 * Initialize the entire Bakery Crawl application
 */
async function initializeApp() {
  // Check device type and show appropriate UI
  const isMobileDevice = initializeDeviceSpecificUI();
  
  if (isMobileDevice) {
    // Mobile-specific initialization
    try {
      // Initialize all dialog systems
      initializeFullscreenDialog();
      initializeWelcomeDialog();
      initializeBakeryPopup();
      initializeRecommendationsDialog();
      initializeStartingBakeryPopup();
      
      // Initialize the map and all its functionality
      await initializeMap();
      
      console.log('Bakery Crawl app initialized successfully');
      
    } catch (error) {
      console.error('Failed to initialize app:', error);
      
      // Show error to user
      const statusText = document.querySelector('.window-status-bar span');
      if (statusText) {
        statusText.textContent = 'Error: App failed to load';
        statusText.style.color = '#ff6b35';
      }
    }
  } else {
    // Desktop device - show desktop message only
    console.log('Desktop detected - showing desktop message');
  }
}

// Load Leaflet script dynamically, then initialize app
const script = document.createElement('script');
script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
script.crossOrigin = '';
script.onload = initializeApp;
script.onerror = () => {
  console.error('Failed to load Leaflet library');
  const statusText = document.querySelector('.window-status-bar span');
  if (statusText) {
    statusText.textContent = 'Error: Map library failed to load';
    statusText.style.color = '#ff6b35';
  }
};
document.head.appendChild(script);