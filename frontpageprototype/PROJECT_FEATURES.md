# Bakery Crawl - Hackney Edition - Feature Documentation

## Project Overview
A mobile-only Astro website for a Bakery Crawl event in Hackney, London, featuring an interactive map with Windows NT 4.0 styling and smooth scroll-based transitions.

## Core Features Implemented

### 1. Mobile-Only Design
- **Desktop Detection**: Automatically detects screen width (≤768px) for mobile devices
- **Desktop Message**: Shows "Please open the website on your mobile phone" on desktop
- **Mobile-First Approach**: All functionality optimized for mobile experience
- **Fixed Viewport**: Prevents mobile browser address bar from hiding during scroll

### 2. Windows NT 4.0 Window Frame
- **Authentic Styling**: Classic gray window frame with proper 3D borders
- **Title Bar**: Dark gray (#848484) with "Bakery Crawl - Internet Explorer" title
- **Window Controls**: Minimize (_), Maximize (□), and Close (×) buttons
- **Status Bar**: Bottom bar with "Ready" text and progress indicator
- **3D Border Effects**: Proper highlight (#ffffff) and shadow (#a0a0a0) borders
- **Fixed Positioning**: Stays in place during scrolling and zooming

### 3. Interactive Map System
- **Base Map**: OpenStreetMap tiles using Leaflet.js
- **Non-Interactive**: Map cannot be dragged, zoomed, or manipulated by user
- **Smooth Transitions**: Scroll-based movement from Central London to Hackney
- **Coordinate Path**: 
  - Start: Central London [51.5074, -0.1278] at zoom 12
  - End: Perfect Hackney view [51.5420, -0.0650] at zoom 12.8
- **Preloading System**: Background tile preloading for smooth scrolling experience

### 4. Hackney Borough Boundary
- **Accurate Data**: 2,382 coordinate points from OpenStreetMap relation 51806
- **Proper Connection**: Boundary ways connected in correct sequence
- **Visual Styling**: Pastel green (#98D8C8) outline and fill
- **Dynamic Opacity**: High opacity (0.9/0.6) initially, reduces to (0.6/0.4) on scroll
- **High Z-Index**: Positioned above map (z-index 1001) for visibility

### 5. Scroll-Based Interactions
- **Map Transition**: Smooth movement from London overview to Hackney detail
- **Boundary Opacity**: Gradual fade from prominent to subtle
- **Progress Bar**: Windows 95-style green progress indicator
- **Overlay Transitions**: Map overlay fades out during scroll
- **Performance Optimized**: Fast transitions (0.05s duration, 0.9 easing)

### 6. Typography & Fonts
- **Sacramento Font**: Google Fonts cursive typeface for titles
- **MS Sans Serif**: System font for authentic Windows NT elements
- **Responsive Sizing**: Font sizes optimized for mobile viewing

### 7. Background & Color Scheme
- **Mobile Background**: Light gray (#e0e0e0) matching window frame
- **Desktop Background**: Black with white text
- **Window Colors**: Authentic Windows NT color palette
- **Progress Bar**: Faded green gradient (#90c695 to #6b9c6f)

### 8. Performance Optimizations
- **Tile Preloading**: Background preloading of map tiles for entire scroll path
- **Invisible Preloading**: Uses temporary hidden map to avoid visual disruption
- **Buffer Management**: Large tile buffer (keepBuffer: 20) for smooth experience
- **Fast Updates**: Optimized tile update intervals (100ms)
- **Throttled Transitions**: Prevents overlapping map animations

### 9. Mobile Browser Compatibility
- **Natural Scrolling**: Standard browser scrolling behavior for maximum compatibility
- **Touch Optimization**: Native mobile touch scrolling support
- **Responsive Design**: Mobile-first approach with desktop detection

### 10. Technical Architecture
- **Framework**: Astro static site generator
- **Map Library**: Leaflet.js v1.9.4
- **Data Format**: GeoJSON for boundary coordinates
- **Styling**: Vanilla CSS with Windows NT theming
- **JavaScript**: ES6+ with modern browser APIs

## File Structure
```
frontpageprototype/
├── src/pages/index.astro          # Main website file
├── public/hackney-boundary.json   # Boundary coordinate data
├── fix_boundary.py                # Boundary processing script
├── compare_boundaries.py          # Boundary validation script
├── requirements.txt               # Python dependencies
└── PROJECT_FEATURES.md           # This documentation
```

## Key Technical Specifications

### Map Configuration
- **Tile Provider**: OpenStreetMap
- **Initial View**: London [51.5074, -0.1278] zoom 12
- **Final View**: Hackney [51.5420, -0.0650] zoom 12.8
- **Scroll Distance**: 200vh (667px scrollable area)
- **Boundary Points**: 2,382 coordinates in proper sequence

### Window Frame Dimensions
- **Title Bar**: 30px height with 26px content area
- **Status Bar**: 30px height with 22px content area
- **Side Borders**: 4px width each
- **Z-Index Layers**: Frame (2000), Status bar (2002), Boundary (1001)

### Performance Metrics
- **Preload Points**: 5 strategic locations along scroll path
- **Transition Speed**: 0.05s duration for responsiveness
- **Update Frequency**: 50ms timeout between transitions
- **Tile Buffer**: 20 tiles kept in memory

## Browser Support
- **Primary**: Mobile Safari (iOS)
- **Secondary**: Chrome Mobile (Android)
- **Desktop**: Chrome, Firefox, Safari (shows desktop message)

## Event System
- **Scroll Detection**: Container-based scroll events
- **Progress Tracking**: Real-time scroll position calculation
- **Map Updates**: Coordinate interpolation based on scroll progress
- **Boundary Animation**: Opacity transitions synchronized with scroll

## Future Considerations
- Bakery location markers could be added to the map
- Route planning functionality for the crawl
- Social sharing integration
- Performance monitoring and analytics

---
*Last updated: $(date)*
*Total development features: 10 major systems, 50+ individual components*