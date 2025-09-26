"""
Script to load and examine the pre-trained ML model
This script will help us understand the model structure and required parameters
"""

import joblib
import numpy as np
import os
import sys
from pathlib import Path

def examine_model_structure(model_path):
    """Examine the structure of the pre-trained model"""
    try:
        print(f"🔍 Loading model from: {model_path}")
        model = joblib.load(model_path)
        print(f"✅ Model loaded successfully!")
        
        print(f"\n📊 Model Information:")
        print(f"Model type: {type(model).__name__}")
        print(f"Model module: {type(model).__module__}")
        
        # Get basic model attributes
        attributes = ['n_features_in_', 'classes_', 'feature_importances_', 'feature_names_in_']
        for attr in attributes:
            if hasattr(model, attr):
                value = getattr(model, attr)
                print(f"{attr}: {value}")
        
        # Test with different feature counts
        print(f"\n🧪 Testing model with different feature counts:")
        
        # Common feature counts for water quality models
        test_features = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        
        for n_features in test_features:
            try:
                # Create random sample data
                sample_data = np.random.rand(1, n_features)
                
                # Try prediction
                prediction = model.predict(sample_data)
                probabilities = model.predict_proba(sample_data)
                
                print(f"✅ Works with {n_features} features")
                print(f"   Prediction: {prediction[0]}")
                print(f"   Probabilities: {probabilities[0]}")
                print(f"   Number of classes: {len(probabilities[0])}")
                
                # This is likely the correct number of features
                return n_features, model, probabilities[0]
                
            except Exception as e:
                print(f"❌ Failed with {n_features} features: {str(e)[:100]}...")
                continue
        
        return None, model, None
        
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return None, None, None

def create_updated_backend(n_features, model_classes):
    """Create an updated backend configuration based on the model"""
    
    print(f"\n🔧 Creating updated backend configuration...")
    
    # Common water quality parameters
    all_parameters = [
        'pH', 'turbidity', 'TDS', 'temperature', 'DO', 'ORP', 
        'coliform', 'rainfall', 'water_level', 'ambient_temp', 
        'humidity', 'pressure', 'lat', 'lon'
    ]
    
    # Select the first n_features parameters
    selected_parameters = all_parameters[:n_features]
    
    print(f"📝 Selected {n_features} parameters: {selected_parameters}")
    print(f"🏥 Model classes (diseases): {model_classes}")
    
    return selected_parameters, model_classes

def main():
    print("🔍 Examining Your Pre-trained ML Model")
    print("=" * 50)
    
    # Try to find the model file
    possible_paths = [
        "water_disease_model.pkl",
        "models/water_disease_model.pkl",
        "../water_disease_model.pkl",
        "c:/Users/ridha/Documents/Water-Borne Diseases/water_disease_model.pkl"
    ]
    
    model_path = None
    for path in possible_paths:
        if os.path.exists(path):
            model_path = path
            break
    
    if not model_path:
        print("❌ Model file not found. Please ensure the model is accessible.")
        print("Expected locations:")
        for path in possible_paths:
            print(f"  - {path}")
        return
    
    # Examine the model
    n_features, model, sample_probs = examine_model_structure(model_path)
    
    if model is None:
        print("❌ Failed to load model")
        return
    
    if n_features is None:
        print("❌ Could not determine the correct number of features")
        return
    
    # Get model classes
    if hasattr(model, 'classes_'):
        model_classes = list(model.classes_)
    else:
        model_classes = [f"Class_{i}" for i in range(len(sample_probs))]
    
    # Create updated configuration
    selected_params, diseases = create_updated_backend(n_features, model_classes)
    
    print(f"\n✅ Model Analysis Complete!")
    print(f"📊 Key Findings:")
    print(f"   - Required features: {n_features}")
    print(f"   - Parameters: {selected_params}")
    print(f"   - Diseases: {diseases}")
    
    print(f"\n📝 Next Steps:")
    print(f"1. Copy your model to: backend/models/water_disease_model.pkl")
    print(f"2. Update the backend to use {n_features} features")
    print(f"3. Update the frontend to match the required parameters")

if __name__ == "__main__":
    main()

