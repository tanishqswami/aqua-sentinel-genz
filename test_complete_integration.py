"""
Complete Integration Test for Smart Health Surveillance AI App
Tests the full pipeline with your actual model
"""

import requests
import json
import time

def test_complete_integration():
    """Test the complete system integration"""
    print("🧪 Complete Integration Test")
    print("=" * 50)
    
    # Wait for server to start
    print("⏳ Waiting for server to start...")
    time.sleep(3)
    
    # Test data matching your model's 13 parameters
    test_data = {
        "pH": 6.1,
        "turbidity": 18.5,
        "conductivity": 850,
        "water_temp": 27.2,
        "dissolved_oxygen": 4.2,
        "orp": 150,
        "ecoli_cfu": 520,
        "rainfall_mm": 45,
        "water_level": 2.1,
        "ambient_temp": 29.5,
        "ambient_humidity": 78,
        "gps_lat": 26.15,
        "gps_lon": 92.87
    }
    
    print(f"📊 Test Data:")
    for key, value in test_data.items():
        print(f"   {key}: {value}")
    
    try:
        # Test health endpoint
        print(f"\n🔍 Testing health endpoint...")
        health_response = requests.get('http://localhost:5000/health')
        print(f"   Status: {health_response.status_code}")
        print(f"   Response: {health_response.json()}")
        
        # Test prediction endpoint
        print(f"\n🔍 Testing prediction endpoint...")
        prediction_response = requests.post(
            'http://localhost:5000/predict',
            json=test_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"   Status: {prediction_response.status_code}")
        
        if prediction_response.status_code == 200:
            result = prediction_response.json()
            print(f"   ✅ Prediction successful!")
            print(f"   📊 Overall Status: {result['overall_status']}")
            print(f"   🎯 Predictions:")
            
            for i, prediction in enumerate(result['predictions']):
                print(f"      {i+1}. {prediction['disease']}: {prediction['probability']}% ({prediction['risk_level']})")
                print(f"         Tips: {', '.join(prediction['hygiene_tips'][:2])}...")
            
            print(f"\n🎉 Complete integration test PASSED!")
            return True
        else:
            print(f"   ❌ Prediction failed: {prediction_response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print(f"   ❌ Server not running. Please start the backend first.")
        return False
    except Exception as e:
        print(f"   ❌ Test failed: {e}")
        return False

def test_different_scenarios():
    """Test different water quality scenarios"""
    print(f"\n🧪 Testing Different Scenarios")
    print("=" * 30)
    
    scenarios = [
        {
            "name": "Clean Water",
            "data": {
                "pH": 7.0, "turbidity": 0.5, "conductivity": 200, "water_temp": 20,
                "dissolved_oxygen": 8.5, "orp": 400, "ecoli_cfu": 0, "rainfall_mm": 10,
                "water_level": 1.5, "ambient_temp": 25, "ambient_humidity": 60,
                "gps_lat": 26.15, "gps_lon": 92.87
            }
        },
        {
            "name": "Contaminated Water",
            "data": {
                "pH": 5.8, "turbidity": 15.2, "conductivity": 1200, "water_temp": 28,
                "dissolved_oxygen": 3.1, "orp": 100, "ecoli_cfu": 800, "rainfall_mm": 80,
                "water_level": 3.2, "ambient_temp": 32, "ambient_humidity": 85,
                "gps_lat": 26.15, "gps_lon": 92.87
            }
        }
    ]
    
    for scenario in scenarios:
        print(f"\n📊 Testing: {scenario['name']}")
        try:
            response = requests.post(
                'http://localhost:5000/predict',
                json=scenario['data'],
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                result = response.json()
                top_prediction = result['predictions'][0]
                print(f"   🎯 Top Prediction: {top_prediction['disease']} ({top_prediction['probability']}%)")
                print(f"   📊 Risk Level: {result['overall_status']}")
            else:
                print(f"   ❌ Failed: {response.status_code}")
                
        except Exception as e:
            print(f"   ❌ Error: {e}")

if __name__ == "__main__":
    print("🚀 Smart Health Surveillance AI App - Integration Test")
    print("=" * 60)
    
    # Test basic integration
    success = test_complete_integration()
    
    if success:
        # Test different scenarios
        test_different_scenarios()
        
        print(f"\n✅ All tests completed!")
        print(f"🎯 Your Smart Health Surveillance AI App is ready!")
        print(f"📱 Frontend: http://localhost:5173")
        print(f"🔧 Backend: http://localhost:5000")
    else:
        print(f"\n❌ Integration test failed.")
        print(f"🔧 Please check the backend server and try again.")

