"""
Train the Water Disease Prediction Model with Your Actual Data
Based on your training pipeline but adapted for your CSV file
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import pickle
import joblib
import json
from typing import Dict, Optional
import warnings
warnings.filterwarnings('ignore')

class WaterDiseasePredictor:
    """
    ML Pipeline for water-borne disease prediction
    Trains on your actual dataset
    """
    
    def __init__(self):
        self.model = None
        self.imputer = None
        self.feature_names = None
        self.disease_classes = ['Cholera', 'Typhoid', 'Diarrhea', 'HepatitisA', 'Safe']
        
        # Core sensor features as per your training code
        self.sensor_features = [
            'pH', 'turbidity', 'conductivity', 'water_temp', 'dissolved_oxygen',
            'orp', 'ecoli_cfu', 'rainfall_mm', 'water_level', 'ambient_temp', 
            'ambient_humidity', 'gps_lat', 'gps_lon'
        ]
        
    def prepare_dataframe(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Standardize column names and disease labels for your dataset
        """
        print(f"📊 Processing your dataset: {df.shape}")
        print(f"📋 Original columns: {list(df.columns)}")
        
        # Column name mapping (handles different naming conventions)
        column_mapping = {
            # pH variations
            'ph': 'pH', 'PH': 'pH', 'Ph': 'pH',
            
            # Turbidity variations  
            'Turbidity': 'turbidity', 'TURBIDITY': 'turbidity', 'NTU': 'turbidity',
            
            # Conductivity variations
            'TDS': 'conductivity', 'tds': 'conductivity', 'EC': 'conductivity', 
            'electrical_conductivity': 'conductivity', 'conductance': 'conductivity',
            
            # Temperature variations
            'temp': 'water_temp', 'temperature': 'water_temp', 'water_temperature': 'water_temp',
            'ambient_temperature': 'ambient_temp', 'air_temp': 'ambient_temp',
            
            # Dissolved Oxygen variations
            'DO': 'dissolved_oxygen', 'do': 'dissolved_oxygen', 'oxygen': 'dissolved_oxygen',
            
            # E.coli variations
            'ecoli': 'ecoli_cfu', 'e_coli': 'ecoli_cfu', 'coliform': 'ecoli_cfu',
            'bacteria': 'ecoli_cfu', 'bacterial_count': 'ecoli_cfu',
            
            # GPS variations
            'latitude': 'gps_lat', 'lat': 'gps_lat', 'Latitude': 'gps_lat',
            'longitude': 'gps_lon', 'lon': 'gps_lon', 'lng': 'gps_lon', 'Longitude': 'gps_lon',
            
            # Rainfall variations
            'rain': 'rainfall_mm', 'precipitation': 'rainfall_mm', 'rainfall': 'rainfall_mm',
            
            # Target column variations
            'Disease': 'disease', 'target': 'disease', 'label': 'disease', 
            'class': 'disease', 'outcome': 'disease', 'result': 'disease'
        }
        
        # Apply column mapping
        df = df.rename(columns=column_mapping)
        
        # Standardize disease names
        if 'disease' in df.columns:
            disease_mapping = {
                'cholera': 'Cholera', 'CHOLERA': 'Cholera',
                'typhoid': 'Typhoid', 'TYPHOID': 'Typhoid',
                'diarrhea': 'Diarrhea', 'DIARRHEA': 'Diarrhea', 'diarrhoea': 'Diarrhea',
                'hepatitis': 'HepatitisA', 'hepatitis_a': 'HepatitisA', 'hepatitisa': 'HepatitisA',
                'safe': 'Safe', 'SAFE': 'Safe', 'normal': 'Safe', 'clean': 'Safe', 'good': 'Safe'
            }
            
            df['disease'] = df['disease'].astype(str).str.lower().map(
                lambda x: disease_mapping.get(x, x.title())
            )
        
        print(f"✅ Processed dataset: {df.shape}")
        if 'disease' in df.columns:
            print(f"🎯 Disease distribution:\n{df['disease'].value_counts()}")
        
        missing_info = df.isnull().sum()
        if missing_info.sum() > 0:
            print(f"📊 Missing values:\n{missing_info[missing_info > 0]}")
        
        return df
    
    def create_missing_indicators(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Create binary indicator columns for missing sensor data
        """
        df_processed = df.copy()
        
        for feature in self.sensor_features:
            if feature in df_processed.columns:
                # Create missing indicator (1 if data available, 0 if missing)
                df_processed[f'has_{feature}'] = (~df_processed[feature].isna()).astype(int)
        
        return df_processed
    
    def preprocess_data(self, df: pd.DataFrame, fit_imputer: bool = False) -> pd.DataFrame:
        """
        Handle missing values with median imputation + indicator features
        """
        # Create missing indicators first
        df_processed = self.create_missing_indicators(df)
        
        # Separate features from target
        feature_cols = [col for col in df_processed.columns if col != 'disease']
        X = df_processed[feature_cols]
        
        if fit_imputer:
            # Fit imputer during training
            self.imputer = SimpleImputer(strategy='median')
            X_imputed = self.imputer.fit_transform(X)
            self.feature_names = feature_cols
        else:
            # Transform during prediction
            if self.imputer is None:
                raise ValueError("Model not trained yet. Call train_model() first.")
            
            # Ensure all expected features are present
            for feature in self.feature_names:
                if feature not in X.columns:
                    X[feature] = np.nan
            
            X = X[self.feature_names]
            X_imputed = self.imputer.transform(X)
        
        # Convert back to DataFrame
        df_processed = pd.DataFrame(X_imputed, columns=self.feature_names, index=df_processed.index)
        
        return df_processed
    
    def train_model(self, df: pd.DataFrame) -> Dict:
        """
        Train RandomForest model on your dataset
        """
        print("🔬 Training model on your dataset...")
        
        # Check if target column exists
        if 'disease' not in df.columns:
            raise ValueError("Dataset must have a 'disease' column with disease labels")
        
        # Preprocess data
        X_processed = self.preprocess_data(df, fit_imputer=True)
        y = df['disease']
        
        # Train-test split (without stratification due to imbalanced classes)
        X_train, X_test, y_train, y_test = train_test_split(
            X_processed, y, test_size=0.2, random_state=42
        )
        
        # Train RandomForest as per specifications
        self.model = RandomForestClassifier(
            n_estimators=300,
            class_weight='balanced',
            random_state=42,
            max_depth=15,
            min_samples_split=5,
            min_samples_leaf=2
        )
        
        self.model.fit(X_train, y_train)
        
        # Calculate metrics
        train_accuracy = self.model.score(X_train, y_train)
        test_accuracy = self.model.score(X_test, y_test)
        y_pred = self.model.predict(X_test)
        
        print(f"✅ Model trained successfully!")
        print(f"📊 Training accuracy: {train_accuracy:.3f}")
        print(f"📊 Test accuracy: {test_accuracy:.3f}")
        
        # Feature importance
        feature_importance = pd.DataFrame({
            'feature': self.feature_names,
            'importance': self.model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        print(f"🔍 Top 5 important features:")
        for i, (_, row) in enumerate(feature_importance.head().iterrows()):
            print(f"   {i+1}. {row['feature']}: {row['importance']:.3f}")
        
        return {
            'train_accuracy': train_accuracy,
            'test_accuracy': test_accuracy,
            'classification_report': classification_report(y_test, y_pred),
            'feature_importance': feature_importance.to_dict('records')
        }
    
    def save_model(self, filepath: str):
        """Save trained model with both pickle and joblib"""
        model_data = {
            'model': self.model,
            'imputer': self.imputer,
            'feature_names': self.feature_names,
            'disease_classes': self.disease_classes,
            'sensor_features': self.sensor_features
        }
        # Save with pickle
        with open(filepath.replace('.joblib', '.pkl'), 'wb') as f:
            pickle.dump(model_data, f)
        # Save with joblib
        joblib.dump(model_data, filepath.replace('.pkl', '.joblib'))
        print(f"💾 Model saved as {filepath.replace('.joblib','')}.pkl and .joblib")

def train_with_your_dataset():
    """
    Train the model with YOUR dataset
    """
    print("🌊 Smart Health Surveillance - Training Mode")
    print("=" * 50)
    
    # Initialize predictor
    predictor = WaterDiseasePredictor()
    
    # Load your dataset
    print("📁 Loading your dataset...")
    df = pd.read_csv('WATER_dATA.csv')
    
    # Prepare and train
    prepared_df = predictor.prepare_dataframe(df)
    metrics = predictor.train_model(prepared_df)
    
    # Save the trained model
    predictor.save_model('models/water_disease_model.pkl')
    
    print("\n" + "=" * 50)
    print("✅ Training Complete!")
    print("🎯 Model ready for deployment")
    
    return predictor, metrics

if __name__ == "__main__":
    # Train model with your dataset
    predictor, metrics = train_with_your_dataset()
