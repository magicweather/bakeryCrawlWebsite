#!/usr/bin/env python3
"""
Compare our Hackney boundary with the official OpenStreetMap boundary
and create visual comparison maps
"""

import json
import requests
import folium
from shapely.geometry import Polygon
import geojson

def fetch_official_osm_boundary():
    """Fetch the official Hackney boundary from Overpass API"""
    query = """
    [out:json][timeout:60];
    relation(51806);
    out geom;
    """
    
    url = "https://overpass-api.de/api/interpreter"
    response = requests.post(url, data={"data": query})
    return response.json()

def extract_coordinates_from_osm(osm_data):
    """Extract coordinates from OSM relation data"""
    coordinates = []
    
    # Find the relation with boundary data
    for element in osm_data['elements']:
        if element['type'] == 'relation' and element['id'] == 51806:
            for member in element['members']:
                if member['role'] == 'outer' and 'geometry' in member:
                    way_coords = []
                    for point in member['geometry']:
                        way_coords.append([point['lon'], point['lat']])
                    coordinates.extend(way_coords)
    
    # Close the polygon if not closed
    if coordinates and coordinates[0] != coordinates[-1]:
        coordinates.append(coordinates[0])
    
    return coordinates

def load_our_boundary():
    """Load our current boundary from the public folder"""
    try:
        with open('public/hackney-boundary.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print("Warning: Our boundary file not found")
        return None

def create_comparison_map(our_geojson, official_coords):
    """Create a folium map comparing both boundaries"""
    # Create map centered on Hackney
    center_lat = 51.5450
    center_lon = -0.0550
    m = folium.Map(location=[center_lat, center_lon], zoom_start=13)
    
    # Add our boundary in red
    if our_geojson:
        folium.GeoJson(
            our_geojson,
            style_function=lambda x: {
                'fillColor': 'red',
                'color': 'red',
                'weight': 3,
                'fillOpacity': 0.1,
                'opacity': 0.8
            },
            tooltip='Our Boundary'
        ).add_to(m)
    
    # Add official boundary in blue
    if official_coords:
        official_geojson = {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [official_coords]
            },
            "properties": {"name": "Official OSM Boundary"}
        }
        
        folium.GeoJson(
            official_geojson,
            style_function=lambda x: {
                'fillColor': 'blue',
                'color': 'blue',
                'weight': 3,
                'fillOpacity': 0.1,
                'opacity': 0.8
            },
            tooltip='Official OSM Boundary'
        ).add_to(m)
    
    # Add legend
    legend_html = '''
    <div style="position: fixed; 
                bottom: 50px; left: 50px; width: 150px; height: 80px; 
                background-color: white; border:2px solid grey; z-index:9999; 
                font-size:14px; padding: 10px">
    <p><b>Boundary Comparison</b></p>
    <p><span style="color:red;">■</span> Our Boundary</p>
    <p><span style="color:blue;">■</span> Official OSM</p>
    </div>
    '''
    m.get_root().html.add_child(folium.Element(legend_html))
    
    return m

def analyze_differences(our_geojson, official_coords):
    """Analyze the differences between boundaries"""
    if not our_geojson or not official_coords:
        return "Cannot analyze: missing boundary data"
    
    try:
        # Create Shapely polygons
        our_coords = our_geojson['geometry']['coordinates'][0]
        our_polygon = Polygon(our_coords)
        official_polygon = Polygon(official_coords)
        
        # Calculate metrics
        our_area = our_polygon.area
        official_area = official_polygon.area
        
        # Calculate intersection
        intersection = our_polygon.intersection(official_polygon)
        union = our_polygon.union(official_polygon)
        
        overlap_percentage = (intersection.area / union.area) * 100
        
        return f"""
Boundary Analysis:
- Our boundary points: {len(our_coords)}
- Official boundary points: {len(official_coords)}
- Area difference: {abs(our_area - official_area):.8f} degrees²
- Boundary overlap: {overlap_percentage:.2f}%
- Our area: {our_area:.8f} degrees²  
- Official area: {official_area:.8f} degrees²
"""
    
    except Exception as e:
        return f"Analysis error: {str(e)}"

def main():
    print("🗺️  Comparing Hackney boundaries...")
    
    # Load our boundary
    print("📍 Loading our boundary...")
    our_boundary = load_our_boundary()
    
    # Fetch official boundary
    print("🌍 Fetching official OSM boundary...")
    try:
        official_osm = fetch_official_osm_boundary()
        official_coords = extract_coordinates_from_osm(official_osm)
        print(f"✅ Retrieved official boundary with {len(official_coords)} points")
    except Exception as e:
        print(f"❌ Error fetching official boundary: {e}")
        official_coords = []
    
    # Create comparison map
    print("🗺️  Creating comparison map...")
    comparison_map = create_comparison_map(our_boundary, official_coords)
    comparison_map.save('boundary_comparison.html')
    print("💾 Saved comparison map to boundary_comparison.html")
    
    # Analyze differences
    print("📊 Analyzing differences...")
    analysis = analyze_differences(our_boundary, official_coords)
    print(analysis)
    
    # Save analysis to file
    with open('boundary_analysis.txt', 'w') as f:
        f.write(analysis)
    
    print("✅ Comparison complete!")
    print("📁 Files created:")
    print("  - boundary_comparison.html (interactive map)")
    print("  - boundary_analysis.txt (analysis report)")

if __name__ == "__main__":
    main()