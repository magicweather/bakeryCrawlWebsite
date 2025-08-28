/**
 * Bakery marker management functionality
 */

import { showBakeryPopup } from '../dialogs/bakery-popup.js';
import { ANIMATION_CONFIG, Z_INDEX } from '../utils/constants.js';

// Bakery Crawl locations - easily reorderable list
export const BAKERIES = [
  { 
    name: "FORNO", 
    lat: 51.5346029, 
    lng: -0.0577733, 
    number: 1,
    googleMapsLink: "https://www.google.com/maps/place/FORNO/@51.5346062,-0.0603482,17z/data=!3m1!4b1!4m6!3m5!1s0x48761dbe754b5b21:0x3afd19dd9582124b!8m2!3d51.5346029!4d-0.0577733!16s%2Fg%2F11sckjr3n7",
    recommendation: "Try their signature maritozzo and the indulgent milk chocolate & sea salt praline bun"
  },
  { 
    name: "Ozone Coffee - London Fields", 
    lat: 51.532553, 
    lng: -0.0611383, 
    number: 2,
    googleMapsLink: "https://www.google.com/maps/place/Ozone+Coffee+-+London+Fields/@51.5348725,-0.0610221,16.5z/data=!4m14!1m7!3m6!1s0x48761dbe754b5b21:0x3afd19dd9582124b!2sFORNO!8m2!3d51.5346029!4d-0.0577733!16s%2Fg%2F11sckjr3n7!3m5!1s0x48761da6733e80f1:0xa75bf5b2e11bac71!8m2!3d51.532553!4d-0.0611383!16s%2Fg%2F11h5nd0rrb",
    recommendation: "Specialty coffee and our first coffee break of the day"
  },
  { 
    name: "Specialty Cafetiere", 
    lat: 51.5317801, 
    lng: -0.0629956, 
    number: 3,
    googleMapsLink: "https://maps.app.goo.gl/manVHquGMKK9Crii6",
    recommendation: "Another specialty coffee spot with some burrata-mortadella-pistachio croissants"
  },
  { 
    name: "Pophams London Fields", 
    lat: 51.5436252, 
    lng: -0.0575894, 
    number: 4,
    googleMapsLink: "https://maps.app.goo.gl/443HKgpEFfqRKNeE6",
    recommendation: "They do weekly special bakes - worth asking for what's new this week! They're working with Smokestack UK to bring some savoury BBQ pastries and toasties"
  },
  { 
    name: "Violet Cakes", 
    lat: 51.5454834, 
    lng: -0.0640996, 
    number: 5,
    googleMapsLink: "https://www.google.com/maps/place/Violet+Cakes/@51.5454867,-0.0666745,17z/data=!3m1!4b1!4m6!3m5!1s0x48761cede637de39:0xa132cd648e549b7d!8m2!3d51.5454834!4d-0.0640996!16s%2Fg%2F1tfg2kyg?entry=ttu&g_ep=EgoyMDI1MDgyNS4wIKXMDSoASAFQAw%3D%3D",
    recommendation: "Famous for their banana bread, kimchi and blue cheese toastie, and chocolate cupcakes"
  },
  { 
    name: "The Dusty Knuckle Bakery", 
    lat: 51.5470859, 
    lng: -0.074094, 
    number: 6,
    googleMapsLink: "https://maps.app.goo.gl/N3VvRxKkjc4N2Jp5A",
    recommendation: "Everything! We will be hoping to try their sandwiches this weekend"
  },
  { 
    name: "Toconoco", 
    lat: 51.5383498, 
    lng: -0.0783027, 
    number: 7,
    googleMapsLink: "https://maps.app.goo.gl/Bh9pppQov4vLCf9h6",
    recommendation: "Final spot of the day, known for their matcha lattes, bento boxes and cakes"
  }
];

/**
 * Create SVG marker for bakery
 * @param {number} number - Bakery number to display
 * @returns {string} SVG markup for marker
 */
function createSVGMarker(number) {
  return `
    <svg width="40" height="50" viewBox="0 0 40 50" style="filter: drop-shadow(0 3px 6px rgba(0,0,0,0.4));">
      <path d="M20 0C9 0 0 9 0 20c0 15 20 30 20 30s20-15 20-30C40 9 31 0 20 0z" 
            fill="#0ea5e9"/>
      <text x="20" y="28" text-anchor="middle" fill="white" 
            font-family="Arial, sans-serif" font-size="16" font-weight="bold">${number}</text>
    </svg>
  `;
}

/**
 * Create interactive bakery marker
 * @param {L.Map} map - Leaflet map instance
 * @param {Object} bakery - Bakery data object
 * @returns {L.Marker} Leaflet marker instance
 */
function createBakeryMarker(map, bakery) {
  // Track scale and reset timer for this marker
  let currentScale = 1.0;
  let resetTimer = null;
  
  const icon = L.divIcon({
    html: createSVGMarker(bakery.number),
    className: 'svg-marker-icon',
    iconSize: [40, 50], // SVG dimensions
    iconAnchor: [20, 50], // Center horizontally, anchor at bottom point
    popupAnchor: [0, -50]
  });

  const marker = L.marker([bakery.lat, bakery.lng], { 
    icon: icon,
    pane: 'bakeryPane', // Use custom high z-index pane
    zIndexOffset: 1000 // Additional offset within the pane
  }).addTo(map);
  
  function scaleMarker(scale) {
    const markerElement = marker.getElement();
    const svgElement = markerElement?.querySelector('svg');
    if (svgElement) {
      // Scale the SVG
      svgElement.style.transform = `scale(${scale})`;
      svgElement.style.transformOrigin = 'center bottom';
      
      // Scale the parent container to prevent clipping
      markerElement.style.width = `${40 * scale}px`;
      markerElement.style.height = `${50 * scale}px`;
      
      // Adjust margins to keep centered
      markerElement.style.marginLeft = `${-20 * scale}px`;
      markerElement.style.marginTop = `${-50 * scale}px`;
    }
  }
  
  function resetMarkerSize() {
    currentScale = 1.0;
    scaleMarker(1.0);
    console.log(`${bakery.name} size reset to normal`);
  }
  
  // Handle click/tap events
  marker.on('click', function(e) {
    console.log(`Clicked on ${bakery.name} (#${bakery.number})`);
    
    // Clear any existing reset timer
    if (resetTimer) {
      clearTimeout(resetTimer);
      resetTimer = null;
    }
    
    // Increase scale by 10%
    currentScale += 0.1;
    scaleMarker(currentScale);
    
    console.log(`${bakery.name} scaled to ${(currentScale * 100).toFixed(0)}%`);
    
    // Show bakery popup
    showBakeryPopup(bakery);
    
    // Set timer to reset size after 1 second of no interaction
    resetTimer = setTimeout(resetMarkerSize, ANIMATION_CONFIG.RESET_TIMEOUT);
    
    e.originalEvent.stopPropagation(); // Prevent map click
  });

  return marker;
}

/**
 * Initialize bakery marker pane
 * @param {L.Map} map - Leaflet map instance
 */
export function initializeBakeryPane(map) {
  // Create an even higher z-index pane for bakery markers
  map.createPane('bakeryPane');
  map.getPane('bakeryPane').style.zIndex = Z_INDEX.BAKERY_MARKERS;
}

/**
 * Add all bakery markers to the map
 * @param {L.Map} map - Leaflet map instance
 * @returns {L.Marker[]} Array of created markers
 */
export function addBakeryMarkers(map) {
  return BAKERIES.map(bakery => createBakeryMarker(map, bakery));
}