/**
 * Recommendations dialog functionality
 */

import { showDialog, hideDialog } from './dialog-manager.js';
import { setScrollingDisabled } from '../utils/dom-helpers.js';
import { BAKERIES } from '../map/bakery-markers.js';

/**
 * Initialize recommendations dialog functionality
 */
export function initializeRecommendationsDialog() {
  // Populate recommendations list dynamically
  populateRecommendationsList();
  
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
 * Populate the recommendations list dynamically from bakery data
 */
function populateRecommendationsList() {
  const recommendationsList = document.querySelector('.recommendations-list');
  if (!recommendationsList) return;
  
  // Clear existing content
  recommendationsList.innerHTML = '';
  
  // Generate recommendation items from bakery data
  BAKERIES.forEach(bakery => {
    const recommendationItem = document.createElement('div');
    recommendationItem.className = 'recommendation-item';
    
    recommendationItem.innerHTML = `
      <div class="bakery-number">${bakery.number}</div>
      <div class="bakery-details">
        <h4>${bakery.name}</h4>
        <p>${bakery.recommendation}</p>
      </div>
    `;
    
    recommendationsList.appendChild(recommendationItem);
  });
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