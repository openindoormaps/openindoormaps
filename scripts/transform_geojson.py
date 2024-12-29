import json

def transform_geojson(input_file, output_file):
    # Read input file
    with open(input_file, 'r') as f:
        data = json.load(f)
    
    # Create new features list
    new_features = []
    
    # Transform each feature
    for feature in data['features']:
        new_feature = {
            "type": "Feature",
            "properties": {
                "name": "null",
                "alt_name": "null",
                "category": "null",
                "restriction": "null",
                "accessibility": "null",
                "display_point": "null",
                "feature_type": "corridor",
                "level_id": feature['properties'].get('level', 'null'),
                "show": "true",
                "area": 0
            },
            "geometry": feature['geometry']
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