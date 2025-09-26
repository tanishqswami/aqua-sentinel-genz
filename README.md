# 🏥 Smart Health Surveillance AI App

A comprehensive health surveillance system that uses AI to predict waterborne diseases based on sensor data. Built with Flask backend and React frontend, featuring real-time monitoring, disease prediction, and multilingual health education.

## 🌟 Features

### 🔬 AI-Powered Disease Prediction
- **Real-time Analysis**: Process sensor data to predict disease risk
- **Multiple Diseases**: Cholera, Typhoid, Hepatitis A, Diarrhea, Gastroenteritis
- **Risk Assessment**: Safe/Warning/Danger indicators with confidence scores
- **Preventive Tips**: Disease-specific hygiene recommendations

### 📊 Water Quality Monitoring
- **14 Sensor Parameters**: pH, turbidity, TDS, temperature, DO, ORP, coliform count, rainfall, water level, ambient conditions, GPS
- **Real-time Status**: Live updates with auto-refresh
- **Visual Indicators**: Color-coded status for quick assessment

### 📱 Mobile-First Design
- **GenZ UI**: Modern black & white minimalist design
- **Responsive**: Works on all device sizes
- **Offline Support**: Downloadable health resources
- **Multilingual**: English, Hindi, and local dialects

### 🚨 Smart Alerts
- **Priority System**: Critical, High, Medium, Low severity levels
- **Location-Based**: GPS-tagged alerts for specific areas
- **Real-time Updates**: Instant notifications for health workers

### 📚 Health Education
- **Multilingual Content**: English, Hindi, and local dialects
- **Multiple Formats**: Videos, audio, articles, infographics
- **Disease-Specific**: Targeted prevention tips for each disease
- **Offline Access**: Downloadable resources for remote areas

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │   Flask API     │    │   ML Model      │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (AI Engine)   │
│                 │    │                 │    │                 │
│ • Home Screen   │    │ • /predict      │    │ • Disease       │
│ • Predictions  │    │ • /health       │    │   Prediction    │
│ • Alerts       │    │ • /hygiene-tips │    │ • Risk          │
│ • Education    │    │ • /diseases     │    │   Assessment    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Automated Setup
```bash
# Run the setup script
python setup.py

# Start backend (Terminal 1)
./start_backend.sh    # Linux/Mac
# or
start_backend.bat     # Windows

# Start frontend (Terminal 2)
./start_frontend.sh   # Linux/Mac
# or
start_frontend.bat    # Windows
```

### Manual Setup

#### Backend Setup
```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
venv\\Scripts\\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create mock model
python create_mock_model.py

# Start server
python app.py
```

#### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## 📡 API Endpoints

### POST /predict
Main prediction endpoint for disease risk assessment.

**Request:**
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
      "hygiene_tips": [
        "Drink plenty of clean water",
        "Use oral rehydration solutions"
      ]
    }
  ],
  "timestamp": "2024-01-15T10:30:00"
}
```

### Other Endpoints
- `GET /health` - Health check
- `GET /hygiene-tips` - All hygiene recommendations
- `GET /diseases` - Supported diseases list

## 🤖 Machine Learning Model

### Model Integration
The system supports multiple ML model formats:

1. **Scikit-learn models** (`.pkl` files)
2. **Keras/TensorFlow models** (`.h5` files)
3. **Mock model** (for development/testing)

### Converting to TensorFlow Lite
For mobile deployment, convert your Keras model to TensorFlow Lite:

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

### Model Training
To train your own model:

1. Collect sensor data with disease labels
2. Preprocess the data (normalization, feature engineering)
3. Train using scikit-learn, TensorFlow, or PyTorch
4. Save the model in the `backend/models/` directory
5. Update the `load_model()` function in `app.py`

## 📱 Mobile App Features

### Home Screen
- Real-time water quality status
- Overall risk assessment
- Quick access to predictions
- Auto-refresh every 5 minutes

### Prediction Screen
- 14 sensor input fields
- Real-time AI prediction
- Risk level indicators
- Disease-specific prevention tips

### Alerts Screen
- Priority-based alert system
- Location-tagged notifications
- Filter by severity/status
- Mark as read functionality

### Education Screen
- Multilingual health content
- Multiple content formats
- Offline download capability
- Category-based filtering

## 🌍 Multilingual Support

The app supports multiple languages for health education:

- **English**: Primary language for technical content
- **Hindi**: Regional language support
- **Local Dialects**: Community-specific content

### Adding New Languages
1. Update the language options in `LearnScreen.tsx`
2. Add translated content to the learning materials
3. Update the API to support new language codes

## 🔧 Development

### Project Structure
```
aqua-sentinel-genz/
├── backend/                 # Flask API
│   ├── app.py              # Main API server
│   ├── create_mock_model.py # Mock ML model
│   ├── requirements.txt    # Python dependencies
│   └── models/             # ML model files
├── src/                    # React frontend
│   ├── components/        # UI components
│   ├── services/          # API services
│   └── screens/           # App screens
├── setup.py               # Setup script
└── README.md              # This file
```

### Environment Variables
Create a `.env` file in the backend directory:

```env
FLASK_ENV=development
MODEL_PATH=models/disease_model.pkl
API_HOST=0.0.0.0
API_PORT=5000
```

### Testing
```bash
# Backend tests
cd backend
python -m pytest tests/

# Frontend tests
npm test
```

## 🚀 Deployment

### Production Backend
```bash
# Install production dependencies
pip install gunicorn

# Run with Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Production Frontend
```bash
# Build for production
npm run build

# Serve with a web server
npm run preview
```

### Docker Deployment
```dockerfile
# Dockerfile for backend
FROM python:3.9-slim
WORKDIR /app
COPY backend/ .
RUN pip install -r requirements.txt
EXPOSE 5000
CMD ["python", "app.py"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the API endpoints

## 🔮 Future Enhancements

- [ ] Real-time IoT sensor integration
- [ ] Advanced ML models (Deep Learning)
- [ ] Mobile app (React Native/Flutter)
- [ ] Database integration for historical data
- [ ] Push notifications
- [ ] Offline mode for mobile
- [ ] Multi-language API responses
- [ ] Advanced analytics dashboard
- [ ] Integration with health databases
- [ ] Automated report generation

---

**Built with ❤️ for public health surveillance**