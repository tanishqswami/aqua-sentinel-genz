// API service for health surveillance backend

const API_BASE_URL = 'http://localhost:5000';

export interface SensorData {
  pH: number;
  turbidity: number;
  conductivity: number;
  water_temp: number;
  dissolved_oxygen: number;
  orp: number;
  ecoli_cfu: number;
  rainfall_mm: number;
  water_level: number;
  ambient_temp: number;
  ambient_humidity: number;
  gps_lat: number;
  gps_lon: number;
}

export interface DiseasePrediction {
  disease: string;
  probability: number;
  risk_level: "safe" | "warning" | "danger";
  hygiene_tips: string[];
}

export interface PredictionResponse {
  overall_status: "safe" | "warning" | "danger";
  predictions: DiseasePrediction[];
  timestamp: string;
  sensor_data: SensorData;
}

export interface HygieneTips {
  [disease: string]: string[];
}

export interface HygieneResponse {
  hygiene_tips: HygieneTips;
  general_tips: string[];
}

export interface DiseasesResponse {
  diseases: string[];
  count: number;
}

class HealthSurveillanceAPI {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async predictDisease(sensorData: SensorData): Promise<PredictionResponse> {
    return this.request<PredictionResponse>('/predict', {
      method: 'POST',
      body: JSON.stringify(sensorData),
    });
  }

  async getHygieneTips(): Promise<HygieneResponse> {
    return this.request<HygieneResponse>('/hygiene-tips');
  }

  async getDiseases(): Promise<DiseasesResponse> {
    return this.request<DiseasesResponse>('/diseases');
  }

  async healthCheck(): Promise<{ status: string; message: string }> {
    return this.request<{ status: string; message: string }>('/health');
  }

  // Mock data for development when backend is not available
  async getMockPrediction(sensorData: SensorData): Promise<PredictionResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate mock predictions based on sensor data using your model's 13 parameters
    const predictions: DiseasePrediction[] = [
      {
        disease: "Cholera",
        probability: Math.min(95, Math.max(5, (sensorData.ecoli_cfu * 2 + sensorData.turbidity * 3))),
        risk_level: sensorData.ecoli_cfu > 5 ? "danger" : sensorData.ecoli_cfu > 2 ? "warning" : "safe",
        hygiene_tips: [
          "Boil water before drinking",
          "Wash hands frequently with soap",
          "Avoid raw or undercooked food",
          "Use chlorine tablets for water purification"
        ]
      },
      {
        disease: "Typhoid",
        probability: Math.min(90, Math.max(3, (sensorData.water_temp - 20) * 2 + sensorData.conductivity / 10)),
        risk_level: sensorData.water_temp > 30 ? "warning" : "safe",
        hygiene_tips: [
          "Ensure proper food hygiene",
          "Avoid street food during outbreaks",
          "Get vaccinated if available",
          "Wash fruits and vegetables thoroughly"
        ]
      },
      {
        disease: "HepatitisA",
        probability: Math.min(85, Math.max(2, sensorData.turbidity * 4 + sensorData.ecoli_cfu)),
        risk_level: sensorData.turbidity > 4 ? "warning" : "safe",
        hygiene_tips: [
          "Practice good personal hygiene",
          "Avoid sharing personal items",
          "Get hepatitis A vaccination",
          "Wash hands before eating"
        ]
      },
      {
        disease: "Diarrhea",
        probability: Math.min(95, Math.max(5, (sensorData.ecoli_cfu * 3 + sensorData.turbidity * 2 + (sensorData.pH < 6.5 || sensorData.pH > 8.5 ? 20 : 0)))),
        risk_level: sensorData.ecoli_cfu > 3 ? "danger" : sensorData.ecoli_cfu > 1 ? "warning" : "safe",
        hygiene_tips: [
          "Drink plenty of clean water",
          "Use oral rehydration solutions",
          "Avoid dairy products if lactose intolerant",
          "Practice proper hand hygiene"
        ]
      },
      {
        disease: "Safe",
        probability: Math.min(90, Math.max(3, 100 - (sensorData.ecoli_cfu * 10 + sensorData.turbidity * 5))),
        risk_level: sensorData.ecoli_cfu < 1 && sensorData.turbidity < 2 ? "safe" : "warning",
        hygiene_tips: [
          "Continue current hygiene practices",
          "Maintain clean water sources",
          "Regular health monitoring",
          "Stay informed about water quality"
        ]
      }
    ];

    // Sort by probability and take top 3
    const topPredictions = predictions
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 3);

    // Determine overall status
    const maxProbability = Math.max(...topPredictions.map(p => p.probability));
    let overallStatus: "safe" | "warning" | "danger" = "safe";
    
    if (maxProbability >= 70) {
      overallStatus = "danger";
    } else if (maxProbability >= 40) {
      overallStatus = "warning";
    }

    return {
      overall_status: overallStatus,
      predictions: topPredictions,
      timestamp: new Date().toISOString(),
      sensor_data: sensorData
    };
  }
}

export const healthAPI = new HealthSurveillanceAPI();
