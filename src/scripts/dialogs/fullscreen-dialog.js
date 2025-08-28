/**
 * Fullscreen dialog functionality
 */

import { showDialog, hideDialog, addDialogEventListeners } from './dialog-manager.js';
import { setScrollingDisabled, requestFullscreen } from '../utils/dom-helpers.js';
import { showWelcomeDialog } from './welcome-dialog.js';
import { ANIMATION_CONFIG } from '../utils/constants.js';

/**
 * Initialize fullscreen dialog functionality
 */
export function initializeFullscreenDialog() {
  const enterBtn = document.getElementById('enter-fullscreen-btn');
  const skipBtn = document.getElementById('skip-fullscreen-btn');
  const closeBtn = document.querySelector('.close-btn');

  // Enter fullscreen button
  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      requestFullscreen();
      hideDialog('fullscreen-dialog');
      setTimeout(showWelcomeDialog, ANIMATION_CONFIG.DIALOG_DELAY);
    });
  }

  // Skip fullscreen button
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      hideDialog('fullscreen-dialog');
      setTimeout(showWelcomeDialog, ANIMATION_CONFIG.DIALOG_DELAY);
    });
  }

  // Close button
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      hideDialog('fullscreen-dialog');
      setTimeout(showWelcomeDialog, ANIMATION_CONFIG.DIALOG_DELAY);
    });
  }

  // Show fullscreen dialog on page load
  setTimeout(() => {
    setScrollingDisabled(true);
    showDialog('fullscreen-dialog');
  }, ANIMATION_CONFIG.FULLSCREEN_DIALOG_DELAY);
}

/**
 * Show the fullscreen dialog
 */
export function showFullscreenDialog() {
  showDialog('fullscreen-dialog');
}

/**
 * Hide the fullscreen dialog
 */
export function hideFullscreenDialog() {
  hideDialog('fullscreen-dialog');
}