/**
 * DOM manipulation utilities
 */

/**
 * Show error message in the Windows status bar
 * @param {string} message - Error message to display
 */
export function showStatusError(message) {
  const statusText = document.querySelector('.window-status-bar span');
  if (statusText) {
    statusText.textContent = message;
    statusText.style.color = '#ff6b35'; // Orange error color
  }
}

/**
 * Update the Windows-style progress bar
 * @param {number} percentage - Progress percentage (0-100)
 */
export function updateProgressBar(percentage) {
  const progressBlocks = document.querySelectorAll('.progress-block');
  const progressText = document.getElementById('progress-text');
  
  if (progressBlocks.length > 0 && progressText) {
    // Round to nearest 5% increment
    const blockPercentage = Math.floor(percentage / 5) * 5;
    const blocksToFill = blockPercentage / 5;
    
    // Update blocks
    progressBlocks.forEach((block, index) => {
      if (index < blocksToFill) {
        block.classList.add('filled');
      } else {
        block.classList.remove('filled');
      }
    });
    
    progressText.textContent = `${blockPercentage}%`;
  }
}

/**
 * Disable/enable page scrolling (for dialogs)
 * @param {boolean} disabled - Whether scrolling should be disabled
 */
export function setScrollingDisabled(disabled) {
  if (disabled) {
    document.body.classList.add('scroll-disabled');
  } else {
    document.body.classList.remove('scroll-disabled');
  }
}

/**
 * Request fullscreen mode with browser compatibility
 */
export function requestFullscreen() {
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
}