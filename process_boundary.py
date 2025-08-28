#!/usr/bin/env python3
import json
import requests

# Get detailed boundary data from Overpass API
def fetch_hackney_boundary():
    query = """
    [out:json][timeout:60];
    (
        way(633247236);way(611906691);way(633232010);way(783546988);way(783546989);
        way(273386917);way(202719859);way(203273057);way(203273055);way(1218234435);
        way(198061028);way(892814736);way(892814730);way(892814739);way(892814734);
        way(892814731);way(1057986088);way(892814733);way(1304856735);
    );
    out geom;
    """
    
    url = "https://overpass-api.de/api/interpreter"
    response = requests.post(url, data={"data": query})
    return response.json()

# Process the ways into a single polygon
def create_geojson(data):
    coordinates = []
    
    # Extract coordinates from all ways
    for element in data['elements']:
        if element['type'] == 'way' and 'geometry' in element:
            way_coords = []
            for point in element['geometry']:
                # GeoJSON format is [longitude, latitude]
                way_coords.append([point['lon'], point['lat']])
            coordinates.extend(way_coords)
    
    # Remove duplicates while preserving order
    seen = set()
    unique_coords = []
    for coord in coordinates:
        coord_tuple = tuple(coord)
        if coord_tuple not in seen:
            seen.add(coord_tuple)
            unique_coords.append(coord)
    
    # Close the polygon if not already closed
    if unique_coords[0] != unique_coords[-1]:
        unique_coords.append(unique_coords[0])
    
    geojson = {
        "type": "Feature",
        "properties": {
            "name": "London Borough of Hackney",
            "admin_level": "8"
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": [unique_coords]
        }
    }
    
    return geojson

# Main execution
if __name__ == "__main__":
    print("Fetching Hackney boundary data...")
    data = fetch_hackney_boundary()
    
    print(f"Processing {len(data['elements'])} boundary ways...")
    geojson = create_geojson(data)
    
    print(f"Created polygon with {len(geojson['geometry']['coordinates'][0])} points")
    
    # Save to file
    with open('hackney-boundary-detailed.json', 'w') as f:
        json.dump(geojson, f, indent=2)
    
    print("Saved detailed boundary to hackney-boundary-detailed.json")