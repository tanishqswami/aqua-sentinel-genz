"""
Script to examine the pre-trained ML model and understand its structure
"""

import joblib
import numpy as np
import os
from pathlib import Path

def examine_model(model_path):
    """Examine the structure of the pre-trained model"""
    try:
        # Load the model
        model = joblib.load(model_path)
        print(f"✓ Model loaded successfully from: {model_path}")
        
        # Get model information
        print(f"\n📊 Model Information:")
        print(f"Model type: {type(model)}")
        
        # Check if it's a scikit-learn model
        if hasattr(model, 'feature_importances_'):
            print(f"Number of features: {len(model.feature_importances_)}")
            print(f"Feature importances: {model.feature_importances_}")
        
        if hasattr(model, 'n_features_in_'):
            print(f"Number of input features: {model.n_features_in_}")
        
        if hasattr(model, 'classes_'):
            print(f"Classes (diseases): {model.classes_}")
        
        # Try to get feature names if available
        if hasattr(model, 'feature_names_in_'):
            print(f"Feature names: {model.feature_names_in_}")
        
        # Test prediction with sample data
        print(f"\n🧪 Testing model with sample data:")
        
        # Create sample input with different numbers of features to test
        for n_features in [5, 10, 14, 20]:
            try:
                sample_data = np.random.rand(1, n_features)
                prediction = model.predict(sample_data)
                probabilities = model.predict_proba(sample_data)
                
                print(f"✓ Model works with {n_features} features")
                print(f"  Prediction: {prediction[0]}")
                print(f"  Probabilities: {probabilities[0]}")
                print(f"  Probability shape: {probabilities.shape}")
                break
            except Exception as e:
                print(f"✗ Model doesn't work with {n_features} features: {e}")
                continue
        
        return model
        
    except Exception as e:
        print(f"✗ Error loading model: {e}")
        return None

def find_model_file():
    """Find the actual model file"""
    possible_paths = [
        "c:/Users/ridha/Documents/Water-Borne Diseases/water_disease_model.pkl",
        "water_disease_model.pkl",
        "models/water_disease_model.pkl",
        "../water_disease_model.pkl"
    ]
    
    for path in possible_paths:
        if os.path.exists(path):
            print(f"✓ Found model at: {path}")
            return path
    
    print("✗ Model file not found in expected locations:")
    for path in possible_paths:
        print(f"  - {path}")
    
    return None

def main():
    print("🔍 Examining Pre-trained ML Model")
    print("=" * 50)
    
    # Find the model file
    model_path = find_model_file()
    if not model_path:
        print("\n❌ Model file not found. Please ensure the model is in one of the expected locations.")
        return
    
    # Examine the model
    model = examine_model(model_path)
    if model:
        print(f"\n✅ Model examination complete!")
        print(f"\n📝 Next steps:")
        print(f"1. Copy the model to: backend/models/water_disease_model.pkl")
        print(f"2. Update the backend to use the correct number of features")
        print(f"3. Test the integration")
    else:
        print(f"\n❌ Failed to examine model")

if __name__ == "__main__":
    main()

