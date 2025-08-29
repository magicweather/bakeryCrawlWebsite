/**
 * Welcome dialog functionality
 */

import { showDialog, hideDialog } from './dialog-manager.js';
import { setScrollingDisabled } from '../utils/dom-helpers.js';
import { showRecommendationsPopup, showRecommendationsButton } from './recommendations-dialog.js';
import { showStartingBakeryPopup } from './starting-bakery-popup.js';

/**
 * Initialize welcome dialog functionality
 */
export function initializeWelcomeDialog() {
  const startBtn = document.getElementById('start-journey-btn');
  const recommendationsBtn = document.getElementById('move-recommendations-btn');
  const startingBakeryBtn = document.getElementById('starting-bakery-btn');
  const closeBtn = document.querySelector('.welcome-close-btn');

  // Start journey button
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      hideDialog('welcome-dialog');
      setScrollingDisabled(false);
      showRecommendationsButton(); // Show floating button when starting journey
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

  // Starting bakery deets button
  if (startingBakeryBtn) {
    startingBakeryBtn.addEventListener('click', () => {
      hideDialog('welcome-dialog');
      // Show the special starting bakery popup
      showStartingBakeryPopup();
    });
  }

  // Close button
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      hideDialog('welcome-dialog');
      setScrollingDisabled(false);
      showRecommendationsButton(); // Show floating button when closing welcome dialog
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