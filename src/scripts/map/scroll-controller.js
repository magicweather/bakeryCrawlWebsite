/**
 * Scroll-based map animation controller
 */

import { MAP_CONFIG, ANIMATION_CONFIG, SCROLL_CONFIG, STYLES } from '../utils/constants.js';
import { updateProgressBar } from '../utils/dom-helpers.js';

/**
 * Initialize scroll-based map transitions
 * @param {L.Map} map - Leaflet map instance
 * @param {L.GeoJSON|null} hackneyLayer - Hackney boundary layer
 * @param {L.GeoJSON|null} westminsterLayer - Westminster boundary layer
 */
export function initializeScrollController(map, hackneyLayer, westminsterLayer) {
  let isTransitioning = false;
  
  window.addEventListener('scroll', function() {
    if (isTransitioning) return; // Prevent overlapping transitions
    
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    let scrollProgress = Math.min(scrollY / maxScroll, 1);
    
    // Smooth snap to 0% and 100% with wider zones
    if (scrollProgress < SCROLL_CONFIG.SNAP_THRESHOLD_START) {
      scrollProgress = 0;
    } else if (scrollProgress > SCROLL_CONFIG.SNAP_THRESHOLD_END) {
      scrollProgress = 1;
    }
    
    // Debug logging for scroll values
    console.log('Scroll Debug:', {
      scrollY: scrollY.toFixed(0),
      maxScroll: maxScroll.toFixed(0),
      rawProgress: ((scrollY / maxScroll) * 100).toFixed(1) + '%',
      adjustedProgress: (scrollProgress * 100).toFixed(1) + '%',
      blockPercent: Math.floor((scrollProgress * 100) / SCROLL_CONFIG.PROGRESS_BLOCK_INCREMENT) * SCROLL_CONFIG.PROGRESS_BLOCK_INCREMENT + '%'
    });
    
    // Interpolate coordinates and zoom
    const currentLat = MAP_CONFIG.START_LAT + (MAP_CONFIG.END_LAT - MAP_CONFIG.START_LAT) * scrollProgress;
    const currentLng = MAP_CONFIG.START_LNG + (MAP_CONFIG.END_LNG - MAP_CONFIG.START_LNG) * scrollProgress;
    const currentZoom = MAP_CONFIG.START_ZOOM + (MAP_CONFIG.END_ZOOM - MAP_CONFIG.START_ZOOM) * scrollProgress;
    
    // Use flyTo for smoother transitions
    isTransitioning = true;
    map.flyTo([currentLat, currentLng], currentZoom, {
      duration: ANIMATION_CONFIG.TRANSITION_DURATION,
      easeLinearity: ANIMATION_CONFIG.TRANSITION_EASING
    });
    
    // Update boundary opacities
    updateBoundaryOpacity(hackneyLayer, scrollProgress, STYLES.HACKNEY_BOUNDARY);
    updateBoundaryOpacity(westminsterLayer, scrollProgress, STYLES.WESTMINSTER_BOUNDARY);
    
    // Update progress bar
    updateProgressBar(scrollProgress * 100);
    
    // Fade out original overlay
    updateMapOverlay(scrollProgress);
    
    // Reset transition flag
    setTimeout(() => {
      isTransitioning = false;
    }, 50);
  });
}

/**
 * Update boundary layer opacity based on scroll progress
 * @param {L.GeoJSON|null} boundaryLayer - Boundary layer to update
 * @param {number} scrollProgress - Scroll progress (0-1)
 * @param {Object} baseStyle - Base style configuration
 */
function updateBoundaryOpacity(boundaryLayer, scrollProgress, baseStyle) {
  if (!boundaryLayer) return;
  
  // Reduce opacity as we scroll down
  const boundaryOpacity = Math.max(0.6, baseStyle.opacity - (scrollProgress * 0.3));
  const boundaryFillOpacity = Math.max(0.1, baseStyle.fillOpacity - (scrollProgress * 0.2));
  
  boundaryLayer.setStyle({
    color: baseStyle.color,
    fillColor: baseStyle.fillColor,
    weight: baseStyle.weight,
    opacity: boundaryOpacity,
    fillOpacity: boundaryFillOpacity
  });
}

/**
 * Update map overlay opacity
 * @param {number} scrollProgress - Scroll progress (0-1)
 */
function updateMapOverlay(scrollProgress) {
  const originalOverlay = document.querySelector('.map-overlay');
  if (originalOverlay) {
    // Fade out original overlay as we scroll (disappears by 50% scroll)
    originalOverlay.style.opacity = Math.max(0, 1 - (scrollProgress * 2));
  }
}