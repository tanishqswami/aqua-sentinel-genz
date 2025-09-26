from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import joblib
import os
import json
from functools import wraps
from typing import Dict, List, Tuple
import logging
from database import db

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Disease mapping - will be loaded from the actual model
DISEASES = {}

# Authentication decorator
def require_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'No token provided'}), 401
        
        if token.startswith('Bearer '):
            token = token[7:]
        
        user_data = db.verify_token(token)
        if not user_data:
            return jsonify({'error': 'Invalid token'}), 401
        
        request.user = user_data
        return f(*args, **kwargs)
    return decorated_function

# Load the ML model
def load_model():
    """Load the pre-trained ML model"""
    try:
        # Try to load the actual model file
        model_path = "models/water_disease_model.pkl"
        if os.path.exists(model_path):
            model_data = joblib.load(model_path)
            logger.info("Loaded pre-trained model from file")
            
            # Update global disease mapping
            global DISEASES
            DISEASES = {i: disease for i, disease in enumerate(model_data['disease_classes'])}
            
            return model_data
        else:
            # Return a mock model for development
            logger.warning("Model file not found, using mock model")
            return MockModel()
    except Exception as e:
        logger.error(f"Error loading model: {e}")
        return MockModel()

class MockModel:
    """Mock model for development/testing purposes"""
    
    def predict_proba(self, X):
        """Mock prediction probabilities"""
        # Generate realistic-looking probabilities based on input features
        n_samples = X.shape[0]
        n_classes = len(DISEASES)
        
        # Create probabilities that sum to 1
        probs = np.random.dirichlet(np.ones(n_classes), n_samples)
        
        # Adjust probabilities based on input features for more realistic results
        for i in range(n_samples):
            sample = X[i]
            
            # Higher coliform count increases disease risk
            if sample[6] > 5:  # coliform count
                probs[i][0] *= 1.5  # Cholera
                probs[i][3] *= 1.3  # Diarrhea
                probs[i][4] *= 1.2  # Gastroenteritis
            
            # Higher turbidity increases risk
            if sample[1] > 4:  # turbidity
                probs[i][0] *= 1.2  # Cholera
                probs[i][2] *= 1.3  # Hepatitis A
            
            # Extreme pH levels increase risk
            if sample[0] < 6.5 or sample[0] > 8.5:  # pH
                probs[i][1] *= 1.4  # Typhoid
                probs[i][3] *= 1.2  # Diarrhea
            
            # High temperature increases bacterial growth
            if sample[5] > 30:  # temperature
                probs[i][0] *= 1.3  # Cholera
                probs[i][4] *= 1.4  # Gastroenteritis
            
            # Normalize probabilities
            probs[i] = probs[i] / np.sum(probs[i])
        
        return probs

# Load model on startup
model = load_model()

def validate_sensor_data(data: Dict) -> Tuple[bool, str]:
    """Validate sensor data input based on the actual model requirements"""
    # Based on your training code, we need these 13 core sensor features
    required_fields = [
        'pH', 'turbidity', 'conductivity', 'water_temp', 'dissolved_oxygen', 
        'orp', 'ecoli_cfu', 'rainfall_mm', 'water_level', 'ambient_temp', 
        'ambient_humidity', 'gps_lat', 'gps_lon'
    ]
    
    for field in required_fields:
        if field not in data:
            return False, f"Missing required field: {field}"
        
        try:
            float(data[field])
        except (ValueError, TypeError):
            return False, f"Invalid value for {field}: must be a number"
    
    return True, ""

def preprocess_data(data: Dict, model_data) -> np.ndarray:
    """Preprocess sensor data for model prediction using the actual model structure"""
    # Get the feature names from the model
    feature_names = model_data['feature_names']
    
    # Create feature vector in the exact order expected by the model
    features = []
    for feature_name in feature_names:
        if feature_name in data:
            # Direct sensor value
            features.append(float(data[feature_name]))
        elif feature_name.startswith('has_'):
            # Boolean feature indicating if sensor value exists
            base_feature = feature_name[4:]  # Remove 'has_' prefix
            has_value = base_feature in data and data[base_feature] is not None
            features.append(1.0 if has_value else 0.0)
        else:
            # Default value for missing features
            features.append(0.0)
    
    return np.array(features).reshape(1, -1)

def get_risk_level(probability: float) -> str:
    """Determine risk level based on probability"""
    if probability >= 0.7:
        return "danger"
    elif probability >= 0.4:
        return "warning"
    else:
        return "safe"

def get_hygiene_tips(disease: str) -> List[str]:
    """Get hygiene tips for specific disease"""
    tips = {
        "Cholera": [
            "Boil water before drinking",
            "Wash hands frequently with soap",
            "Avoid raw or undercooked food",
            "Use chlorine tablets for water purification"
        ],
        "Typhoid": [
            "Ensure proper food hygiene",
            "Avoid street food during outbreaks",
            "Get vaccinated if available",
            "Wash fruits and vegetables thoroughly"
        ],
        "HepatitisA": [
            "Practice good personal hygiene",
            "Avoid sharing personal items",
            "Get hepatitis A vaccination",
            "Wash hands before eating"
        ],
        "Diarrhea": [
            "Drink plenty of clean water",
            "Use oral rehydration solutions",
            "Avoid dairy products if lactose intolerant",
            "Practice proper hand hygiene"
        ],
        "Safe": [
            "Continue current hygiene practices",
            "Maintain clean water sources",
            "Regular health monitoring",
            "Stay informed about water quality"
        ]
    }
    return tips.get(disease, ["Practice good hygiene", "Drink clean water", "Wash hands frequently"])

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "message": "Smart Health Surveillance API is running"
    })

@app.route('/predict', methods=['POST'])
def predict_disease():
    """Main prediction endpoint"""
    try:
        # Get JSON data from request
        data = request.get_json()
        
        if not data:
            return jsonify({
                "error": "No JSON data provided"
            }), 400
        
        # Validate input data
        is_valid, error_msg = validate_sensor_data(data)
        if not is_valid:
            return jsonify({
                "error": error_msg
            }), 400
        
        # Preprocess data using the actual model structure
        features = preprocess_data(data, model)
        
        # Apply imputation if available
        if 'imputer' in model:
            features = model['imputer'].transform(features)
        
        # Make prediction using the actual model
        probabilities = model['model'].predict_proba(features)[0]
        predicted_disease = model['model'].predict(features)[0]
        
        # Get top 3 predictions
        top_indices = np.argsort(probabilities)[::-1][:3]
        
        predictions = []
        for idx in top_indices:
            disease = model['disease_classes'][idx]
            probability = float(probabilities[idx])
            
            predictions.append({
                "disease": disease,
                "probability": round(probability * 100, 2),
                "risk_level": get_risk_level(probability),
                "hygiene_tips": get_hygiene_tips(disease)
            })
        
        # Determine overall status
        max_prob = max(probabilities)
        overall_status = get_risk_level(max_prob)
        
        response = {
            "overall_status": overall_status,
            "predictions": predictions,
            "timestamp": str(np.datetime64('now')),
            "sensor_data": data
        }
        
        logger.info(f"Prediction completed for status: {overall_status}")
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Error in prediction: {str(e)}")
        return jsonify({
            "error": f"Internal server error: {str(e)}"
        }), 500

@app.route('/hygiene-tips', methods=['GET'])
def get_all_hygiene_tips():
    """Get hygiene tips for all diseases"""
    tips = {}
    for disease in DISEASES.values():
        tips[disease] = get_hygiene_tips(disease)
    
    return jsonify({
        "hygiene_tips": tips,
        "general_tips": [
            "Always wash hands with soap and water",
            "Drink only clean, treated water",
            "Cook food thoroughly",
            "Avoid raw or undercooked food",
            "Keep living areas clean and sanitized"
        ]
    })

@app.route('/diseases', methods=['GET'])
def get_diseases():
    """Get list of supported diseases"""
    return jsonify({
        "diseases": list(DISEASES.values()),
        "count": len(DISEASES)
    })

# Authentication endpoints
@app.route('/auth/login', methods=['POST'])
def login():
    """User login endpoint"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Username and password required'}), 400
        
        user = db.authenticate_user(username, password)
        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        token = db.generate_token(user['id'], user['username'], user['role'])
        
        return jsonify({
            'token': token,
            'user': {
                'id': user['id'],
                'username': user['username'],
                'email': user['email'],
                'role': user['role'],
                'full_name': user['full_name']
            }
        })
    except Exception as e:
        logger.error(f"Login error: {e}")
        return jsonify({'error': 'Login failed'}), 500

@app.route('/auth/register', methods=['POST'])
def register():
    """User registration endpoint"""
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role', 'volunteer')
        full_name = data.get('full_name')
        phone = data.get('phone')
        location = data.get('location')
        
        if not all([username, email, password, full_name]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        user_id = db.create_user(username, email, password, role, full_name, phone, location)
        if not user_id:
            return jsonify({'error': 'Username or email already exists'}), 400
        
        return jsonify({'message': 'User created successfully', 'user_id': user_id})
    except Exception as e:
        logger.error(f"Registration error: {e}")
        return jsonify({'error': 'Registration failed'}), 500

# Survey endpoints
@app.route('/surveys', methods=['POST'])
@require_auth
def create_survey():
    """Create a new survey"""
    try:
        data = request.get_json()
        user_id = request.user['user_id']
        
        survey_id = db.create_survey(
            user_id=user_id,
            location=data.get('location'),
            latitude=data.get('latitude'),
            longitude=data.get('longitude'),
            water_quality=data.get('water_quality'),
            notes=data.get('notes')
        )
        
        return jsonify({'message': 'Survey created successfully', 'survey_id': survey_id})
    except Exception as e:
        logger.error(f"Survey creation error: {e}")
        return jsonify({'error': 'Failed to create survey'}), 500

@app.route('/surveys', methods=['GET'])
@require_auth
def get_surveys():
    """Get user's surveys"""
    try:
        user_id = request.user['user_id']
        surveys = db.get_user_surveys(user_id)
        return jsonify({'surveys': surveys})
    except Exception as e:
        logger.error(f"Get surveys error: {e}")
        return jsonify({'error': 'Failed to get surveys'}), 500

# Alert endpoints
@app.route('/alerts', methods=['GET'])
def get_alerts():
    """Get all health alerts"""
    try:
        alerts = db.get_all_alerts()
        return jsonify({'alerts': alerts})
    except Exception as e:
        logger.error(f"Get alerts error: {e}")
        return jsonify({'error': 'Failed to get alerts'}), 500

@app.route('/alerts', methods=['POST'])
@require_auth
def create_alert():
    """Create a new health alert"""
    try:
        data = request.get_json()
        user_id = request.user['user_id']
        
        alert_id = db.create_alert(
            title=data.get('title'),
            description=data.get('description'),
            severity=data.get('severity'),
            location=data.get('location'),
            disease_type=data.get('disease_type'),
            cases_count=data.get('cases_count', 0),
            created_by=user_id
        )
        
        return jsonify({'message': 'Alert created successfully', 'alert_id': alert_id})
    except Exception as e:
        logger.error(f"Alert creation error: {e}")
        return jsonify({'error': 'Failed to create alert'}), 500

# System stats endpoint
@app.route('/stats', methods=['GET'])
@require_auth
def get_stats():
    """Get system statistics"""
    try:
        stats = db.get_system_stats()
        return jsonify(stats)
    except Exception as e:
        logger.error(f"Get stats error: {e}")
        return jsonify({'error': 'Failed to get statistics'}), 500

if __name__ == '__main__':
    # Create models directory if it doesn't exist
    os.makedirs('models', exist_ok=True)
    
    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)
