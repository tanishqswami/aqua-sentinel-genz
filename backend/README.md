# Smart Health Surveillance Backend

A Flask-based API for water quality monitoring and disease prediction using machine learning.

## Features

- **Disease Prediction**: AI-powered prediction of waterborne diseases (Cholera, Typhoid, Hepatitis A, Diarrhea, Gastroenteritis)
- **Risk Assessment**: Categorizes risk levels as Safe, Warning, or Danger
- **Hygiene Tips**: Provides preventive measures for each disease
- **Sensor Data Processing**: Handles multiple water quality parameters

## API Endpoints

### POST /predict
Main prediction endpoint that accepts sensor data and returns disease predictions.

**Request Body:**
```json
{
  "pH": 7.2,
  "turbidity": 4.5,
  "TDS": 230,
  "temperature": 25,
  "DO": 6.8,
  "ORP": 300,
  "coliform": 1,
  "rainfall": 120,
  "water_level": 1.2,
  "ambient_temp": 27,
  "humidity": 85,
  "pressure": 1005,
  "lat": 26.18,
  "lon": 91.75
}
```

**Response:**
```json
{
  "overall_status": "warning",
  "predictions": [
    {
      "disease": "Diarrhea",
      "probability": 25.5,
      "risk_level": "warning",
      "hygiene_tips": ["Drink plenty of clean water", "Use oral rehydration solutions", ...]
    }
  ],
  "timestamp": "2024-01-15T10:30:00",
  "sensor_data": {...}
}
```

### GET /health
Health check endpoint.

### GET /hygiene-tips
Returns hygiene tips for all supported diseases.

### GET /diseases
Returns list of supported diseases.

## Installation

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the application:
```bash
python app.py
```

The API will be available at `http://localhost:5000`

## Model Integration

To use a real ML model:

1. Place your trained model file (`disease_model.pkl` or `disease_model.h5`) in the `models/` directory
2. Update the `load_model()` function in `app.py` to load your specific model format
3. Ensure the model expects the same input features as defined in `preprocess_data()`

## Converting to TensorFlow Lite

To convert a Keras model (.h5) to TensorFlow Lite for mobile deployment:

```python
import tensorflow as tf

# Load the Keras model
model = tf.keras.models.load_model('disease_model.h5')

# Convert to TensorFlow Lite
converter = tf.lite.TFLiteConverter.from_keras_model(model)
tflite_model = converter.convert()

# Save the TensorFlow Lite model
with open('disease_model.tflite', 'wb') as f:
    f.write(tflite_model)
```

## Environment Variables

Create a `.env` file for configuration:

```
FLASK_ENV=development
MODEL_PATH=models/disease_model.pkl
API_HOST=0.0.0.0
API_PORT=5000
```

## Deployment

For production deployment, use Gunicorn:

```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

