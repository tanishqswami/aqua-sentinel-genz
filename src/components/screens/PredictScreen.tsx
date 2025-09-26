import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FlaskConical, Thermometer, Droplets, Zap, CloudRain, Wind, TrendingUp, MapPin, Gauge } from "lucide-react";
import { healthAPI, SensorData, PredictionResponse } from "@/services/api";

interface LocalSensorData {
  pH: string;
  turbidity: string;
  conductivity: string;
  water_temp: string;
  dissolved_oxygen: string;
  orp: string;
  ecoli_cfu: string;
  rainfall_mm: string;
  water_level: string;
  ambient_temp: string;
  ambient_humidity: string;
  gps_lat: string;
  gps_lon: string;
}

const sensorInputs = [
  { key: "pH", label: "pH Level", icon: FlaskConical, unit: "" },
  { key: "turbidity", label: "Turbidity", icon: Droplets, unit: "NTU" },
  { key: "conductivity", label: "Conductivity", icon: Zap, unit: "μS/cm" },
  { key: "water_temp", label: "Water Temperature", icon: Thermometer, unit: "°C" },
  { key: "dissolved_oxygen", label: "Dissolved Oxygen", icon: Wind, unit: "mg/L" },
  { key: "orp", label: "ORP", icon: TrendingUp, unit: "mV" },
  { key: "ecoli_cfu", label: "E.coli Count", icon: FlaskConical, unit: "CFU/100ml" },
  { key: "rainfall_mm", label: "Rainfall", icon: CloudRain, unit: "mm" },
  { key: "water_level", label: "Water Level", icon: Gauge, unit: "m" },
  { key: "ambient_temp", label: "Ambient Temperature", icon: Thermometer, unit: "°C" },
  { key: "ambient_humidity", label: "Ambient Humidity", icon: Wind, unit: "%" },
  { key: "gps_lat", label: "GPS Latitude", icon: MapPin, unit: "" },
  { key: "gps_lon", label: "GPS Longitude", icon: MapPin, unit: "" },
];

export function PredictScreen() {
  const [sensorData, setSensorData] = useState<LocalSensorData>({
    pH: "",
    turbidity: "",
    conductivity: "",
    water_temp: "",
    dissolved_oxygen: "",
    orp: "",
    ecoli_cfu: "",
    rainfall_mm: "",
    water_level: "",
    ambient_temp: "",
    ambient_humidity: "",
    gps_lat: "",
    gps_lon: "",
  });

  const [predictionResponse, setPredictionResponse] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (key: keyof LocalSensorData, value: string) => {
    setSensorData(prev => ({ ...prev, [key]: value }));
  };

  const generatePredictions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Prepare data for API call - matching your model's 13 sensor requirements
      const apiData = {
        pH: parseFloat(sensorData.pH) || 0,
        turbidity: parseFloat(sensorData.turbidity) || 0,
        conductivity: parseFloat(sensorData.conductivity) || 0,
        water_temp: parseFloat(sensorData.water_temp) || 0,
        dissolved_oxygen: parseFloat(sensorData.dissolved_oxygen) || 0,
        orp: parseFloat(sensorData.orp) || 0,
        ecoli_cfu: parseFloat(sensorData.ecoli_cfu) || 0,
        rainfall_mm: parseFloat(sensorData.rainfall_mm) || 0,
        water_level: parseFloat(sensorData.water_level) || 0,
        ambient_temp: parseFloat(sensorData.ambient_temp) || 0,
        ambient_humidity: parseFloat(sensorData.ambient_humidity) || 0,
        gps_lat: parseFloat(sensorData.gps_lat) || 0,
        gps_lon: parseFloat(sensorData.gps_lon) || 0,
      };

      // Try real API first, fallback to mock if it fails
      try {
        const result = await healthAPI.predictDisease(apiData);
        setPredictionResponse(result);
      } catch (apiError) {
        console.warn('API not available, using mock data:', apiError);
        const mockResult = await healthAPI.getMockPrediction(apiData);
        setPredictionResponse(mockResult);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get predictions');
      console.error('Prediction error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "danger":
        return "bg-red-50 text-red-700 border-red-200";
      case "warning":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "safe":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getOverallStatusColor = (status: string) => {
    switch (status) {
      case "danger":
        return "bg-red-500";
      case "warning":
        return "bg-amber-500";
      case "safe":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="p-4 pb-24 space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">Disease Prediction</h1>
        <p className="text-muted-foreground text-sm">
          Enter sensor values for AI-powered health risk assessment
        </p>
      </div>

      <Card className="p-6 bg-gradient-card">
        <h2 className="text-lg font-semibold mb-4">Sensor Data Input</h2>
        <div className="grid grid-cols-1 gap-4">
          {sensorInputs.map((input, index) => {
            const Icon = input.icon;
            return (
              <div 
                key={input.key}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Label htmlFor={input.key} className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Icon size={16} className="text-muted-foreground" />
                  {input.label}
                  {input.unit && <span className="text-muted-foreground">({input.unit})</span>}
                </Label>
                <Input
                  id={input.key}
                  type="number"
                  placeholder={`Enter ${input.label.toLowerCase()}`}
                  value={sensorData[input.key as keyof SensorData]}
                  onChange={(e) => handleInputChange(input.key as keyof SensorData, e.target.value)}
                  className="bg-background border-border"
                />
              </div>
            );
          })}
        </div>

        <Button 
          onClick={generatePredictions}
          disabled={isLoading}
          className="w-full mt-6 bg-primary hover:bg-primary/90"
        >
          {isLoading ? "Analyzing..." : "Predict Disease Risk"}
        </Button>
      </Card>

      {error && (
        <Alert className="bg-red-50 border-red-200">
          <AlertDescription className="text-red-700">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {predictionResponse && (
        <Card className="p-6 bg-gradient-card animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Prediction Results</h2>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getOverallStatusColor(predictionResponse.overall_status)}`}></div>
              <Badge className={getRiskLevelColor(predictionResponse.overall_status)}>
                {predictionResponse.overall_status.toUpperCase()}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-4">
            {predictionResponse.predictions.map((prediction, index) => (
              <div 
                key={prediction.disease}
                className="bg-background rounded-xl p-4 border border-border hover-glow animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{prediction.disease}</h3>
                  <div className="flex items-center gap-2">
                    <Badge className={getRiskLevelColor(prediction.risk_level)}>
                      {prediction.risk_level}
                    </Badge>
                    <span className="text-lg font-bold">{prediction.probability}%</span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary rounded-full h-2 transition-all duration-500"
                      style={{ width: `${prediction.probability}%` }}
                    />
                  </div>
                </div>

                {prediction.hygiene_tips.length > 0 && (
                  <div className="mt-3">
                    <h4 className="text-sm font-medium mb-2">Prevention Tips:</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {prediction.hygiene_tips.slice(0, 3).map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}