import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, Thermometer, Droplets, Zap, CloudRain, Wind, TrendingUp } from "lucide-react";

interface SensorData {
  ph: string;
  turbidity: string;
  tds: string;
  dissolvedOxygen: string;
  orp: string;
  temperature: string;
  coliformCount: string;
  rainfall: string;
  humidity: string;
}

interface DiseasePrediction {
  disease: string;
  probability: number;
  severity: "low" | "medium" | "high";
  description: string;
}

const sensorInputs = [
  { key: "ph", label: "pH Level", icon: FlaskConical, unit: "" },
  { key: "turbidity", label: "Turbidity", icon: Droplets, unit: "NTU" },
  { key: "tds", label: "TDS", icon: Zap, unit: "ppm" },
  { key: "dissolvedOxygen", label: "Dissolved Oxygen", icon: Wind, unit: "mg/L" },
  { key: "orp", label: "ORP", icon: TrendingUp, unit: "mV" },
  { key: "temperature", label: "Temperature", icon: Thermometer, unit: "°C" },
  { key: "coliformCount", label: "Coliform Count", icon: FlaskConical, unit: "CFU/100ml" },
  { key: "rainfall", label: "Rainfall", icon: CloudRain, unit: "mm" },
  { key: "humidity", label: "Humidity", icon: Wind, unit: "%" },
];

export function PredictScreen() {
  const [sensorData, setSensorData] = useState<SensorData>({
    ph: "",
    turbidity: "",
    tds: "",
    dissolvedOxygen: "",
    orp: "",
    temperature: "",
    coliformCount: "",
    rainfall: "",
    humidity: "",
  });

  const [predictions, setPredictions] = useState<DiseasePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (key: keyof SensorData, value: string) => {
    setSensorData(prev => ({ ...prev, [key]: value }));
  };

  const generatePredictions = () => {
    setIsLoading(true);
    
    // Simulate AI prediction logic
    setTimeout(() => {
      const mockPredictions: DiseasePrediction[] = [
        { 
          disease: "Cholera", 
          probability: 15, 
          severity: "medium",
          description: "Risk factors: High coliform count and elevated turbidity"
        },
        { 
          disease: "Typhoid", 
          probability: 8, 
          severity: "low",
          description: "Risk factors: Moderate temperature and TDS levels"
        },
        { 
          disease: "Hepatitis A", 
          probability: 12, 
          severity: "medium",
          description: "Risk factors: Water quality parameters suggest contamination"
        },
        { 
          disease: "Diarrhea", 
          probability: 25, 
          severity: "high",
          description: "Risk factors: Multiple water quality indicators elevated"
        },
        { 
          disease: "Gastroenteritis", 
          probability: 18, 
          severity: "medium",
          description: "Risk factors: Bacterial contamination likely"
        },
      ];
      setPredictions(mockPredictions);
      setIsLoading(false);
    }, 2000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "low":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-muted text-muted-foreground";
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

      {predictions.length > 0 && (
        <Card className="p-6 bg-gradient-card animate-fade-in">
          <h2 className="text-lg font-semibold mb-4">Prediction Results</h2>
          <div className="space-y-4">
            {predictions.map((prediction, index) => (
              <div 
                key={prediction.disease}
                className="bg-background rounded-xl p-4 border border-border hover-glow animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{prediction.disease}</h3>
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor(prediction.severity)}>
                      {prediction.severity}
                    </Badge>
                    <span className="text-lg font-bold">{prediction.probability}%</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{prediction.description}</p>
                <div className="mt-3">
                  <div className="bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary rounded-full h-2 transition-all duration-500"
                      style={{ width: `${prediction.probability}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}