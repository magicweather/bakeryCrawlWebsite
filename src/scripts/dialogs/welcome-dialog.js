/**
 * Welcome dialog functionality
 */

import { showDialog, hideDialog } from './dialog-manager.js';
import { setScrollingDisabled } from '../utils/dom-helpers.js';
import { showRecommendationsPopup } from './recommendations-dialog.js';

/**
 * Initialize welcome dialog functionality
 */
export function initializeWelcomeDialog() {
  const startBtn = document.getElementById('start-journey-btn');
  const recommendationsBtn = document.getElementById('move-recommendations-btn');
  const closeBtn = document.querySelector('.welcome-close-btn');

  // Start journey button
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      hideDialog('welcome-dialog');
      setScrollingDisabled(false);
    });
  }

  // Move to recommendations button
  if (recommendationsBtn) {
    recommendationsBtn.addEventListener('click', () => {
      hideDialog('welcome-dialog');
      // Show recommendations popup instead of external redirect
      showRecommendationsPopup();
    });
  }

  // Close button
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      hideDialog('welcome-dialog');
      setScrollingDisabled(false);
    });
  }
}

/**
 * Show the welcome dialog
 */
export function showWelcomeDialog() {
  showDialog('welcome-dialog');
}

/**
 * Hide the welcome dialog
 */
export function hideWelcomeDialog() {
  hideDialog('welcome-dialog');
}