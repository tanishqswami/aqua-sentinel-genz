"""
Script to create a mock ML model for development and testing purposes.
This simulates a trained model that would normally be created from historical data.
"""

import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import os

def create_mock_model():
    """Create a mock trained model for disease prediction"""
    
    # Create synthetic training data
    np.random.seed(42)  # For reproducibility
    
    n_samples = 1000
    
    # Generate synthetic sensor data
    # Features: pH, turbidity, TDS, temperature, DO, ORP, coliform, rainfall, 
    # water_level, ambient_temp, humidity, pressure, lat, lon
    X = np.random.rand(n_samples, 14)
    
    # Scale features to realistic ranges
    X[:, 0] = X[:, 0] * 4 + 6  # pH: 6-10
    X[:, 1] = X[:, 1] * 10     # turbidity: 0-10 NTU
    X[:, 2] = X[:, 2] * 1000   # TDS: 0-1000 ppm
    X[:, 3] = X[:, 3] * 20 + 15  # temperature: 15-35°C
    X[:, 4] = X[:, 4] * 10 + 2   # DO: 2-12 mg/L
    X[:, 5] = X[:, 5] * 500 + 100  # ORP: 100-600 mV
    X[:, 6] = X[:, 6] * 20        # coliform: 0-20 CFU/100ml
    X[:, 7] = X[:, 7] * 200       # rainfall: 0-200 mm
    X[:, 8] = X[:, 8] * 5         # water_level: 0-5 m
    X[:, 9] = X[:, 9] * 15 + 20   # ambient_temp: 20-35°C
    X[:, 10] = X[:, 10] * 50 + 30  # humidity: 30-80%
    X[:, 11] = X[:, 11] * 100 + 950  # pressure: 950-1050 hPa
    X[:, 12] = X[:, 12] * 10 + 20    # lat: 20-30
    X[:, 13] = X[:, 13] * 10 + 80    # lon: 80-90
    
    # Create synthetic disease labels based on realistic patterns
    y = np.zeros(n_samples, dtype=int)
    
    for i in range(n_samples):
        sample = X[i]
        
        # Cholera risk factors: high coliform, high turbidity, extreme pH
        cholera_score = 0
        if sample[6] > 10:  # high coliform
            cholera_score += 2
        if sample[1] > 5:   # high turbidity
            cholera_score += 1
        if sample[0] < 6.5 or sample[0] > 8.5:  # extreme pH
            cholera_score += 1
        
        # Typhoid risk factors: moderate temperature, high TDS
        typhoid_score = 0
        if 25 < sample[3] < 35:  # moderate temperature
            typhoid_score += 1
        if sample[2] > 500:      # high TDS
            typhoid_score += 1
        
        # Hepatitis A risk factors: high turbidity, poor water quality
        hepatitis_score = 0
        if sample[1] > 4:         # high turbidity
            hepatitis_score += 1
        if sample[6] > 5:         # some coliform
            hepatitis_score += 1
        
        # Diarrhea risk factors: multiple indicators
        diarrhea_score = 0
        if sample[6] > 3:         # any coliform
            diarrhea_score += 1
        if sample[1] > 3:         # moderate turbidity
            diarrhea_score += 1
        if sample[0] < 7 or sample[0] > 8:  # pH not optimal
            diarrhea_score += 1
        
        # Gastroenteritis risk factors: high temperature, bacterial contamination
        gastro_score = 0
        if sample[3] > 30:        # high temperature
            gastro_score += 1
        if sample[6] > 8:         # high coliform
            gastro_score += 1
        if sample[9] > 30:        # high ambient temp
            gastro_score += 1
        
        # Assign disease based on highest score
        scores = [cholera_score, typhoid_score, hepatitis_score, diarrhea_score, gastro_score]
        y[i] = np.argmax(scores)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train a Random Forest model
    model = RandomForestClassifier(
        n_estimators=100,
        random_state=42,
        max_depth=10,
        min_samples_split=5
    )
    
    model.fit(X_train, y_train)
    
    # Print model performance
    train_score = model.score(X_train, y_train)
    test_score = model.score(X_test, y_test)
    
    print(f"Model training completed!")
    print(f"Training accuracy: {train_score:.3f}")
    print(f"Test accuracy: {test_score:.3f}")
    
    # Create models directory
    os.makedirs('models', exist_ok=True)
    
    # Save the model
    model_path = 'models/disease_model.pkl'
    joblib.dump(model, model_path)
    
    print(f"Model saved to: {model_path}")
    
    return model

if __name__ == "__main__":
    create_mock_model()

