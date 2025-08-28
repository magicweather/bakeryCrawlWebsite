/**
 * Device detection utilities for mobile-first design
 */

/**
 * Check if current device is mobile based on screen width
 * @returns {boolean} True if device is mobile (width <= 768px)
 */
export function isMobile() {
  return window.innerWidth <= 768;
}

/**
 * Initialize app based on device type
 * Shows mobile content or desktop message accordingly
 */
export function initializeDeviceSpecificUI() {
  if (isMobile()) {
    document.body.className = 'mobile';
    document.getElementById('mobile-content').style.display = 'block';
    return true; // Mobile device
  } else {
    document.body.className = 'desktop';
    document.getElementById('desktop-message').style.display = 'block';
    return false; // Desktop device
  }
}