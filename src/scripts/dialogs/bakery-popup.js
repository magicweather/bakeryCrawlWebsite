/**
 * Bakery popup dialog functionality
 */

import { showDialog, hideDialog } from './dialog-manager.js';

/**
 * Show bakery information popup
 * @param {Object} bakery - Bakery data object
 * @param {string} bakery.name - Bakery name
 * @param {string} bakery.recommendation - Recommendation text
 * @param {string} bakery.googleMapsLink - Google Maps URL
 */
export function showBakeryPopup(bakery) {
  const dialog = document.getElementById('bakery-popup');
  const nameDisplay = document.getElementById('bakery-name-display');
  const recommendationDisplay = document.getElementById('bakery-recommendation');
  const mapsLink = document.getElementById('bakery-maps-link');
  
  if (nameDisplay && recommendationDisplay && mapsLink) {
    nameDisplay.textContent = bakery.name;
    recommendationDisplay.textContent = bakery.recommendation;
    mapsLink.href = bakery.googleMapsLink;
    
    showDialog('bakery-popup');
  }
}

/**
 * Hide bakery information popup
 */
export function hideBakeryPopup() {
  hideDialog('bakery-popup');
}

/**
 * Initialize bakery popup functionality
 */
export function initializeBakeryPopup() {
  // Make hideBakeryPopup available globally for onclick handler
  window.hideBakeryPopup = hideBakeryPopup;
  window.showBakeryPopup = showBakeryPopup;
  
  // Add event listener for close button
  const closeBtn = document.querySelector('#bakery-popup .dialog-button');
  if (closeBtn) {
    closeBtn.addEventListener('click', hideBakeryPopup);
  }
}