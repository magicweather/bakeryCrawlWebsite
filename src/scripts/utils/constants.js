// Map coordinates and zoom levels
export const MAP_CONFIG = {
  // Start: Central London coordinates
  START_LAT: 51.5074,
  START_LNG: -0.1278,
  START_ZOOM: 12,
  
  // End: Perfect Hackney view coordinates
  END_LAT: 51.5420,
  END_LNG: -0.0650,
  END_ZOOM: 12.8,
  
  // Tile configuration
  TILE_URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  KEEP_BUFFER: 20,
  UPDATE_INTERVAL: 100
};

// Animation and timing constants
export const ANIMATION_CONFIG = {
  TRANSITION_DURATION: 0.05, // seconds
  TRANSITION_EASING: 0.9,
  PRELOAD_DELAY: 500, // ms
  RESET_TIMEOUT: 1000, // ms
  DIALOG_DELAY: 300, // ms
  FULLSCREEN_DIALOG_DELAY: 500 // ms
};

// Scroll configuration
export const SCROLL_CONFIG = {
  SNAP_THRESHOLD_START: 0.10, // 10% threshold for snapping to 0%
  SNAP_THRESHOLD_END: 0.90,   // 90% threshold for snapping to 100%
  PROGRESS_BLOCK_INCREMENT: 5  // 5% per progress block
};

// Styling constants
export const STYLES = {
  HACKNEY_BOUNDARY: {
    color: '#98D8C8',
    fillColor: '#98D8C8',
    weight: 2,
    opacity: 0.9,
    fillOpacity: 0.6
  },
  WESTMINSTER_BOUNDARY: {
    color: '#DC2626',
    fillColor: '#DC2626',
    weight: 2,
    opacity: 0.9,
    fillOpacity: 0.3
  },
  ERROR_COLOR: '#ff6b35'
};

// Z-index layers
export const Z_INDEX = {
  HACKNEY_BOUNDARY: 1001,
  WESTMINSTER_BOUNDARY: 1002,
  BAKERY_MARKERS: 2000
};