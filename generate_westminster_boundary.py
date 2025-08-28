#!/usr/bin/env python3
import json
import requests

def fetch_westminster_relation():
    """Fetch the complete Westminster relation with geometry"""
    query = """
    [out:json][timeout:60];
    relation(51781);
    out geom;
    """
    
    response = requests.post('https://overpass-api.de/api/interpreter', data={'data': query})
    return response.json()

def connect_boundary_ways(relation_data):
    """Connect boundary ways in proper sequence to form continuous outline"""
    
    # Extract outer boundary ways
    relation = relation_data['elements'][0]  # The Westminster relation
    outer_ways = []
    
    for member in relation['members']:
        if member['role'] == 'outer' and 'geometry' in member:
            way_coords = [[p['lon'], p['lat']] for p in member['geometry']]
            outer_ways.append({
                'id': member['ref'],
                'coords': way_coords
            })
    
    print(f"Found {len(outer_ways)} outer boundary ways")
    
    if not outer_ways:
        return []
    
    # Start with first way
    connected_coords = outer_ways[0]['coords'][:]
    remaining_ways = outer_ways[1:]
    used_ways = [outer_ways[0]['id']]
    
    # Connect remaining ways by finding connections
    while remaining_ways:
        last_point = connected_coords[-1]
        best_match = None
        best_distance = float('inf')
        reverse_needed = False
        
        # Find the closest way to connect
        for i, way in enumerate(remaining_ways):
            # Check start point distance
            start_dist = abs(way['coords'][0][0] - last_point[0]) + abs(way['coords'][0][1] - last_point[1])
            # Check end point distance  
            end_dist = abs(way['coords'][-1][0] - last_point[0]) + abs(way['coords'][-1][1] - last_point[1])
            
            if start_dist < best_distance:
                best_match = i
                best_distance = start_dist
                reverse_needed = False
            
            if end_dist < best_distance:
                best_match = i
                best_distance = end_dist
                reverse_needed = True
        
        if best_match is not None and best_distance < 0.01:  # Reasonable connection threshold
            way = remaining_ways.pop(best_match)
            way_coords = way['coords']
            
            if reverse_needed:
                way_coords = way_coords[::-1]  # Reverse the way
            
            # Add coordinates (skip first point to avoid duplication)
            connected_coords.extend(way_coords[1:])
            used_ways.append(way['id'])
            print(f"Connected way {way['id']} ({'reversed' if reverse_needed else 'normal'})")
        else:
            # Force connect the next way if no close match
            if remaining_ways:
                way = remaining_ways.pop(0)
                connected_coords.extend(way['coords'])
                used_ways.append(way['id'])
                print(f"Force connected way {way['id']} (distance: {best_distance:.6f})")
    
    # Close the polygon
    if connected_coords[0] != connected_coords[-1]:
        connected_coords.append(connected_coords[0])
    
    print(f"Connected {len(used_ways)} ways with {len(connected_coords)} total points")
    return connected_coords

def create_proper_geojson(coordinates):
    """Create properly formatted GeoJSON"""
    return {
        "type": "Feature",
        "properties": {
            "name": "City of Westminster",
            "admin_level": "8",
            "source": "OpenStreetMap - Properly Connected Ways",
            "council_name": "Westminster City Council",
            "designation": "inner_london_borough"
        },
        "geometry": {
            "type": "Polygon", 
            "coordinates": [coordinates]
        }
    }

def main():
    print("🏛️  Generating Westminster boundary...")
    
    # Fetch data
    print("📡 Fetching relation data...")
    relation_data = fetch_westminster_relation()
    
    # Connect ways properly
    print("🔗 Connecting boundary ways...")
    connected_coords = connect_boundary_ways(relation_data)
    
    # Create GeoJSON
    print("📄 Creating GeoJSON...")
    geojson = create_proper_geojson(connected_coords)
    
    # Save Westminster boundary
    with open('public/westminster-boundary.json', 'w') as f:
        json.dump(geojson, f, indent=2)
    
    print(f"✅ Westminster boundary saved with {len(connected_coords)} properly connected points!")
    print("🗺️ File saved as: public/westminster-boundary.json")
    print("🏛️ The boundary covers the City of Westminster including Westminster, Marylebone, Mayfair, and Paddington.")

if __name__ == "__main__":
    main()