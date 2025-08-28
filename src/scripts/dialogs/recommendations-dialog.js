/**
 * Recommendations dialog functionality
 */

import { showDialog, hideDialog } from './dialog-manager.js';
import { setScrollingDisabled } from '../utils/dom-helpers.js';

/**
 * Initialize recommendations dialog functionality
 */
export function initializeRecommendationsDialog() {
  const closeXBtn = document.querySelector('[data-close-recommendations]');

  // X button in title bar using data attribute
  if (closeXBtn) {
    closeXBtn.addEventListener('click', () => {
      hideDialog('recommendations-popup');
      setScrollingDisabled(false);
    });
  }
}

/**
 * Show the recommendations dialog
 */
export function showRecommendationsPopup() {
  setScrollingDisabled(true);
  showDialog('recommendations-popup');
}

/**
 * Hide the recommendations dialog
 */
export function hideRecommendationsPopup() {
  hideDialog('recommendations-popup');
  setScrollingDisabled(false);
}