/**
 * Main map management and initialization
 */

import { MAP_CONFIG, ANIMATION_CONFIG } from '../utils/constants.js';
import { initializeBoundaryPanes, loadHackneyBoundary, loadWestminsterBoundary } from './boundary-loader.js';
import { initializeBakeryPane, addBakeryMarkers } from './bakery-markers.js';
import { initializeScrollController } from './scroll-controller.js';

/**
 * Initialize the Leaflet map with all functionality
 * @returns {Promise<L.Map>} Promise that resolves to the initialized map
 */
export async function initializeMap() {
  // Initialize Leaflet map (non-interactive)
  const map = L.map('map', {
    dragging: false,
    touchZoom: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
    zoomControl: false,
    attributionControl: false  // Disable built-in attribution completely
  }).setView([MAP_CONFIG.START_LAT, MAP_CONFIG.START_LNG], MAP_CONFIG.START_ZOOM);
  
  // Add tile layer
  L.tileLayer(MAP_CONFIG.TILE_URL, {
    attribution: '',  // Remove attribution since we have custom one
    keepBuffer: MAP_CONFIG.KEEP_BUFFER,
    maxNativeZoom: 18,
    maxZoom: 18,
    updateWhenIdle: false, // Update tiles during animation
    updateWhenZooming: true, // Keep updating while zooming
    updateInterval: MAP_CONFIG.UPDATE_INTERVAL,
    bounds: [[51.40, -0.25], [51.65, 0.05]], // Preload entire area from south London to north Hackney
    minZoom: 11,
    zIndex: 1
  }).addTo(map);
  
  // Initialize all map panes
  initializeBoundaryPanes(map);
  initializeBakeryPane(map);
  
  // Start preloading tiles in background
  setTimeout(() => preloadScrollPath(map), ANIMATION_CONFIG.PRELOAD_DELAY);

  // Load boundary data
  const hackneyLayer = await loadHackneyBoundary(map);
  const westminsterLayer = await loadWestminsterBoundary(map);
  
  // Add bakery markers
  addBakeryMarkers(map);
  
  // Initialize scroll-based interactions
  initializeScrollController(map, hackneyLayer, westminsterLayer);
  
  return map;
}

/**
 * Preload map tiles along the scroll path for smooth performance
 * @param {L.Map} map - Main map instance
 */
function preloadScrollPath(map) {
  console.log('Preloading map tiles for scroll path...');
  
  // Create invisible temporary map for preloading
  const tempMapDiv = document.createElement('div');
  tempMapDiv.style.width = '1px';
  tempMapDiv.style.height = '1px';
  tempMapDiv.style.position = 'absolute';
  tempMapDiv.style.left = '-9999px';
  tempMapDiv.style.opacity = '0';
  document.body.appendChild(tempMapDiv);
  
  const tempMap = L.map(tempMapDiv, {
    zoomControl: false,
    attributionControl: false
  });
  
  const tempTileLayer = L.tileLayer(MAP_CONFIG.TILE_URL, {
    keepBuffer: MAP_CONFIG.KEEP_BUFFER,
    updateWhenIdle: false,
    updateWhenZooming: true,
    updateInterval: MAP_CONFIG.UPDATE_INTERVAL
  }).addTo(tempMap);
  
  // Define key points along the scroll path
  const pathPoints = [
    { lat: MAP_CONFIG.START_LAT, lng: MAP_CONFIG.START_LNG, zoom: MAP_CONFIG.START_ZOOM },
    { lat: 51.5200, lng: -0.1000, zoom: 12.3 }, // 25% progress
    { lat: 51.5300, lng: -0.0800, zoom: 12.6 }, // 50% progress
    { lat: 51.5375, lng: -0.0650, zoom: 12.8 }, // 75% progress
    { lat: MAP_CONFIG.END_LAT, lng: MAP_CONFIG.END_LNG, zoom: MAP_CONFIG.END_ZOOM }
  ];
  
  // Preload tiles for each point using temp map
  pathPoints.forEach((point, index) => {
    setTimeout(() => {
      tempMap.setView([point.lat, point.lng], point.zoom);
      console.log(`Preloaded tiles for point ${index + 1}/5`);
    }, index * 300);
  });
  
  // Clean up temp map after preloading
  setTimeout(() => {
    tempMap.remove();
    document.body.removeChild(tempMapDiv);
    console.log('Preloading complete, temp map cleaned up');
  }, pathPoints.length * 300 + 1000);
}