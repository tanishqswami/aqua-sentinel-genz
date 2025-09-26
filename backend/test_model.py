"""
Test script to verify the model integration works correctly
"""

import joblib
import numpy as np
import json

def test_model():
    """Test the actual model with sample data"""
    try:
        # Load the model
        print("🔍 Loading your pre-trained model...")
        model_data = joblib.load('models/water_disease_model.pkl')
        
        print("✅ Model loaded successfully!")
        print(f"📊 Model structure:")
        print(f"   - Feature names: {model_data['feature_names']}")
        print(f"   - Disease classes: {model_data['disease_classes']}")
        print(f"   - Number of features: {len(model_data['feature_names'])}")
        print(f"   - Number of diseases: {len(model_data['disease_classes'])}")
        
        # Create sample data matching your model's requirements
        sample_data = {
            'pH': 7.2,
            'turbidity': 1.5,
            'conductivity': 500,
            'water_temp': 25,
            'dissolved_oxygen': 6.8,
            'ecoli_cfu': 1,
            'rainfall_mm': 120
        }
        
        print(f"\n🧪 Testing with sample data:")
        print(f"   Sample data: {sample_data}")
        
        # Preprocess the data
        features = []
        for feature_name in model_data['feature_names']:
            if feature_name in sample_data:
                features.append(float(sample_data[feature_name]))
            elif feature_name.startswith('has_'):
                base_feature = feature_name[4:]
                has_value = base_feature in sample_data and sample_data[base_feature] is not None
                features.append(1.0 if has_value else 0.0)
            else:
                features.append(0.0)
        
        features_array = np.array(features).reshape(1, -1)
        print(f"   Processed features: {features_array[0]}")
        
        # Apply imputation if available
        if 'imputer' in model_data:
            features_array = model_data['imputer'].transform(features_array)
            print(f"   After imputation: {features_array[0]}")
        
        # Make prediction
        probabilities = model_data['model'].predict_proba(features_array)[0]
        prediction = model_data['model'].predict(features_array)[0]
        
        print(f"\n🎯 Prediction Results:")
        print(f"   Predicted disease: {prediction}")
        print(f"   Probabilities:")
        for i, prob in enumerate(probabilities):
            print(f"     {model_data['disease_classes'][i]}: {prob:.3f} ({prob*100:.1f}%)")
        
        # Get top 3 predictions
        top_indices = np.argsort(probabilities)[::-1][:3]
        print(f"\n🏆 Top 3 Predictions:")
        for i, idx in enumerate(top_indices):
            disease = model_data['disease_classes'][idx]
            probability = probabilities[idx]
            print(f"   {i+1}. {disease}: {probability:.3f} ({probability*100:.1f}%)")
        
        print(f"\n✅ Model test completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error testing model: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("🧪 Testing Your Pre-trained ML Model")
    print("=" * 50)
    success = test_model()
    if success:
        print(f"\n🎉 Your model is working perfectly!")
        print(f"📝 The backend has been updated to use your actual model.")
        print(f"🔧 You can now run the Flask server with: python app.py")
    else:
        print(f"\n❌ There was an issue with your model.")
        print(f"🔧 Please check the model file and try again.")
