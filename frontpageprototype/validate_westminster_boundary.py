#!/usr/bin/env python3
"""
Compare our Westminster boundary with the official OpenStreetMap boundary
and create visual comparison maps
"""

import json
import requests
import folium
from shapely.geometry import Polygon
import geojson

def fetch_official_westminster_boundary():
    """Fetch the official Westminster boundary from Overpass API"""
    query = """
    [out:json][timeout:60];
    relation(51781);
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
        if element['type'] == 'relation' and element['id'] == 51781:
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

def load_our_westminster_boundary():
    """Load our Westminster boundary from the public folder"""
    try:
        with open('public/westminster-boundary.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print("Warning: Westminster boundary file not found")
        return None

def create_comparison_map(our_geojson, official_coords):
    """Create a folium map comparing both boundaries"""
    # Create map centered on Westminster (near Westminster Abbey)
    center_lat = 51.5074
    center_lon = -0.1278
    m = folium.Map(location=[center_lat, center_lon], zoom_start=12)
    
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
            tooltip='Our Westminster Boundary'
        ).add_to(m)
    
    # Add official boundary in blue
    if official_coords:
        official_geojson = {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [official_coords]
            },
            "properties": {"name": "Official OSM Westminster Boundary"}
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
            tooltip='Official OSM Westminster Boundary'
        ).add_to(m)
    
    # Add legend
    legend_html = '''
    <div style="position: fixed; 
                bottom: 50px; left: 50px; width: 180px; height: 100px; 
                background-color: white; border:2px solid grey; z-index:9999; 
                font-size:14px; padding: 10px">
    <p><b>Westminster Boundary Comparison</b></p>
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
Westminster Boundary Analysis:
- Our boundary points: {len(our_coords)}
- Official boundary points: {len(official_coords)}
- Area difference: {abs(our_area - official_area):.8f} degrees²
- Boundary overlap: {overlap_percentage:.2f}%
- Our area: {our_area:.8f} degrees²  
- Official area: {official_area:.8f} degrees²

Borough Information:
- Name: City of Westminster
- Council: Westminster City Council
- Designation: Inner London Borough
- OpenStreetMap Relation ID: 51781
"""
    
    except Exception as e:
        return f"Analysis error: {str(e)}"

def main():
    print("🏛️  Comparing Westminster boundaries...")
    
    # Load our boundary
    print("📍 Loading our Westminster boundary...")
    our_boundary = load_our_westminster_boundary()
    
    # Fetch official boundary
    print("🌍 Fetching official OSM Westminster boundary...")
    try:
        official_osm = fetch_official_westminster_boundary()
        official_coords = extract_coordinates_from_osm(official_osm)
        print(f"✅ Retrieved official boundary with {len(official_coords)} points")
    except Exception as e:
        print(f"❌ Error fetching official boundary: {e}")
        official_coords = []
    
    # Create comparison map
    print("🗺️  Creating comparison map...")
    comparison_map = create_comparison_map(our_boundary, official_coords)
    comparison_map.save('westminster_boundary_comparison.html')
    print("💾 Saved comparison map to westminster_boundary_comparison.html")
    
    # Analyze differences
    print("📊 Analyzing differences...")
    analysis = analyze_differences(our_boundary, official_coords)
    print(analysis)
    
    # Save analysis to file
    with open('westminster_boundary_analysis.txt', 'w') as f:
        f.write(analysis)
    
    print("✅ Westminster comparison complete!")
    print("📁 Files created:")
    print("  - westminster_boundary_comparison.html (interactive map)")
    print("  - westminster_boundary_analysis.txt (analysis report)")
    print("  - public/westminster-boundary.json (boundary coordinates)")

if __name__ == "__main__":
    main()