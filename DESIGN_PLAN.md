# Bakery Crawl Website - Design & Development Plan

## Project Overview
**Event**: Bakery Crawl in Hackney, London  
**Date**: August 30, 2025 (Saturday)  
**Participants**: 20-30 people  
**Website Purpose**: Mobile-only informational site for event attendees  

## Technical Stack
- **Framework**: Astro (static site generation)
- **Hosting**: Netlify or Vercel (free hosting)
- **Target**: Mobile browsers only
- **Desktop Behavior**: Show message "Please open on your phone"
- **Content**: Placeholder/fake data initially, real content added later

## Design Concept

### Landing Section (Hero)
- **Background**: Map of London with landmarks popping up
- **Center Text**: "Bakery Crawl" (prominent display)
- **UI Element**: Small scroll down indicator (bottom right)
- **Interaction**: Static view of London map

### Scroll Transition (Section 2)
- **Background**: Map smoothly transitions from London view → Hackney view
- **Text Transition**: 
  - "Bakery Crawl" transforms to "Bakery Crawl: Hackney Edition"
  - Can be displayed on two lines
  - "Hackney Edition" appears on scroll trigger
- **Animation**: Smooth zoom/pan animation tied to scroll position

### Technical Implementation Plan
- **Map Solution**: Mapbox (preferred) or Leaflet (fallback)
  - Custom styling for aesthetic appeal
  - Landmark markers for London view
  - Smooth zoom transitions
- **Scroll Animations**: Intersection Observer API + CSS transforms
- **Mobile Optimization**: Touch-friendly, performance-focused

## Content Structure (To Be Developed)
- Event details (time, meeting point)
- 4-5 bakery information sections
- Route/map integration
- Contact information

## Map Integration Requirements
- London overview with landmarks
- Hackney detail view
- Bakery route visualization
- Mobile-optimized interaction

## Development Status
- [x] Initial concept discussion
- [x] Technical stack decision (Astro)
- [ ] Complete design specification
- [ ] Map integration choice finalization
- [ ] Development setup
- [ ] Implementation phases

## Next Steps
1. Continue design discussion (remaining sections)
2. Finalize map integration approach
3. Set up Astro project
4. Begin development implementation

---
*Last updated: August 25, 2025*