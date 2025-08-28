/**
 * Base dialog management functionality
 */

/**
 * Show a dialog by ID
 * @param {string} dialogId - The ID of the dialog element
 */
export function showDialog(dialogId) {
  const dialog = document.getElementById(dialogId);
  if (dialog) {
    dialog.style.display = 'flex';
  }
}

/**
 * Hide a dialog by ID
 * @param {string} dialogId - The ID of the dialog element
 */
export function hideDialog(dialogId) {
  const dialog = document.getElementById(dialogId);
  if (dialog) {
    dialog.style.display = 'none';
  }
}

/**
 * Add click event listeners to dialog elements
 * @param {string} selector - CSS selector for elements
 * @param {Function} callback - Click handler function
 */
export function addDialogEventListeners(selector, callback) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(element => {
    element.addEventListener('click', callback);
  });
}