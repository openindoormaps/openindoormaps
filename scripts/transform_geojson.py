import json

def transform_geojson(input_file, output_file):
    # Read input file
    with open(input_file, 'r') as f:
        data = json.load(f)
    
    # Create new features list
    new_features = []
    
    # Transform each feature
    for feature in data['features']:
        # Skip features with level_id 0 or 2
        level = feature['properties'].get('level')
        if level in ['0', '2']:
            continue
            
        # Set level 1 to null
        level = None
            
        # Restructure geometry to ensure correct order
        new_geometry = {
            "coordinates": feature['geometry']['coordinates'],
            "type": feature['geometry']['type']
        }
        
        new_feature = {
            "type": "Feature",
            "properties": {
                "name": None,
                "alt_name": None,
                "category": None,
                "restriction": None,
                "accessibility": None,
                "display_point": None,
                "feature_type": "unit",
                "level_id": level,
                "show": True,
                "area": 0
            },
            "geometry": new_geometry
        }
        new_features.append(new_feature)
    
    # Create output structure
    output_data = {
        "type": "FeatureCollection",
        "features": new_features
    }
    
    # Write output file
    with open(output_file, 'w') as f:
        json.dump(output_data, f, indent=2)

if __name__ == "__main__":
    transform_geojson('input.geojson', 'output.geojson')