/**
 * Boundary data loading functionality
 */

import { STYLES, Z_INDEX } from '../utils/constants.js';
import { showStatusError } from '../utils/dom-helpers.js';

/**
 * Load and add boundary data to the map
 * @param {L.Map} map - Leaflet map instance
 * @param {string} url - URL to boundary JSON file
 * @param {string} paneName - Map pane name
 * @param {Object} style - Boundary styling options
 * @param {string} boundaryName - Human-readable boundary name for errors
 * @returns {Promise<L.GeoJSON|null>} Promise that resolves to boundary layer or null
 */
async function loadBoundary(map, url, paneName, style, boundaryName) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data || !data.geometry || !data.geometry.coordinates) {
      throw new Error('Invalid boundary data format');
    }
    
    console.log(`Loading ${boundaryName} boundary with`, data.geometry.coordinates[0].length, 'points');
    
    const boundaryLayer = L.geoJSON(data, {
      pane: paneName,
      style: style
    }).addTo(map);
    
    console.log(`${boundaryName} boundary layer created`);
    return boundaryLayer;
    
  } catch (error) {
    console.error(`Could not load ${boundaryName} boundary:`, error);
    
    // Show user-friendly error in status bar
    const statusText = document.querySelector('.window-status-bar span');
    if (statusText) {
      const currentText = statusText.textContent;
      let errorMessage;
      
      if (currentText.includes('boundary failed')) {
        errorMessage = 'Warning: Both boundaries failed to load';
      } else {
        errorMessage = `Warning: ${boundaryName} boundary failed to load`;
      }
      
      showStatusError(errorMessage);
    }
    
    return null;
  }
}

/**
 * Load Hackney boundary
 * @param {L.Map} map - Leaflet map instance
 * @returns {Promise<L.GeoJSON|null>} Promise that resolves to Hackney boundary layer
 */
export async function loadHackneyBoundary(map) {
  return loadBoundary(
    map,
    '/hackney-boundary.json',
    'hackneyPane',
    STYLES.HACKNEY_BOUNDARY,
    'Hackney'
  );
}

/**
 * Load Westminster boundary
 * @param {L.Map} map - Leaflet map instance
 * @returns {Promise<L.GeoJSON|null>} Promise that resolves to Westminster boundary layer
 */
export async function loadWestminsterBoundary(map) {
  return loadBoundary(
    map,
    '/westminster-boundary.json',
    'westminsterPane',
    STYLES.WESTMINSTER_BOUNDARY,
    'Westminster'
  );
}

/**
 * Initialize map panes for boundaries
 * @param {L.Map} map - Leaflet map instance
 */
export function initializeBoundaryPanes(map) {
  // Create a high z-index pane for Hackney boundary
  map.createPane('hackneyPane');
  map.getPane('hackneyPane').style.zIndex = Z_INDEX.HACKNEY_BOUNDARY;
  
  // Create a pane for Westminster boundary  
  map.createPane('westminsterPane');
  map.getPane('westminsterPane').style.zIndex = Z_INDEX.WESTMINSTER_BOUNDARY;
}