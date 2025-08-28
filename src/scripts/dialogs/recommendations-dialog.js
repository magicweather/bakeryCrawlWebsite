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
  const floatingBtn = document.querySelector('[data-show-recommendations]');

  // X button in title bar using data attribute
  if (closeXBtn) {
    closeXBtn.addEventListener('click', () => {
      hideDialog('recommendations-popup');
      setScrollingDisabled(false);
      showRecommendationsButton(); // Show floating button when popup closes
    });
  }

  // Floating recommendations button
  if (floatingBtn) {
    floatingBtn.addEventListener('click', () => {
      showRecommendationsPopup();
      hideRecommendationsButton(); // Hide floating button when popup opens
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

/**
 * Show the floating recommendations button
 */
export function showRecommendationsButton() {
  const floatingBtn = document.getElementById('recommendations-button');
  if (floatingBtn) {
    floatingBtn.style.display = 'block';
  }
}

/**
 * Hide the floating recommendations button
 */
export function hideRecommendationsButton() {
  const floatingBtn = document.getElementById('recommendations-button');
  if (floatingBtn) {
    floatingBtn.style.display = 'none';
  }
}