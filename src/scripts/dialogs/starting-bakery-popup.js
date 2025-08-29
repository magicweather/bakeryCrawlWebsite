/**
 * Starting bakery popup dialog functionality
 */

import { showDialog, hideDialog } from './dialog-manager.js';
import { setScrollingDisabled } from '../utils/dom-helpers.js';

/**
 * Show starting bakery information popup
 */
export function showStartingBakeryPopup() {
  showDialog('starting-bakery-popup');
}

/**
 * Hide starting bakery information popup
 */
export function hideStartingBakeryPopup() {
  hideDialog('starting-bakery-popup');
  setScrollingDisabled(false); // Re-enable scrolling when popup is closed
}

/**
 * Initialize starting bakery popup functionality
 */
export function initializeStartingBakeryPopup() {
  // Add event listener for close button using data attribute
  const closeBtn = document.querySelector('[data-close-starting-bakery]');
  if (closeBtn) {
    closeBtn.addEventListener('click', hideStartingBakeryPopup);
  }
}