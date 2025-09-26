import { useState, useEffect } from "react";
import { Droplets, Thermometer, FlaskConical, AlertTriangle, Activity, Users, Bell, RefreshCw, UserCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-health.jpg";
import { healthAPI, SensorData } from "@/services/api";

interface WaterQualityStatus {
  parameter: string;
  value: string;
  status: "safe" | "warning" | "danger";
  icon: React.ElementType;
}

// Mock sensor data for demonstration
const mockSensorData: SensorData = {
  pH: 7.2,
  turbidity: 1.5,
  TDS: 850,
  temperature: 24,
  DO: 6.8,
  ORP: 300,
  coliform: 1,
  rainfall: 120,
  water_level: 1.2,
  ambient_temp: 27,
  humidity: 85,
  pressure: 1005,
  lat: 26.18,
  lon: 91.75
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "safe":
      return "bg-green-50 text-green-700 border-green-200";
    case "warning":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "danger":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export function HomeScreen() {
  const [waterQualityData, setWaterQualityData] = useState<WaterQualityStatus[]>([]);
  const [overallStatus, setOverallStatus] = useState<"safe" | "warning" | "danger">("safe");
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const navigate = useNavigate();

  const updateWaterQualityData = async () => {
    setIsLoading(true);
    try {
      // Try to get real-time data from API, fallback to mock
      try {
        const prediction = await healthAPI.predictDisease(mockSensorData);
        setOverallStatus(prediction.overall_status);
        
        // Update water quality data based on prediction
        const newData: WaterQualityStatus[] = [
          { 
            parameter: "pH Level", 
            value: `${mockSensorData.pH}`, 
            status: mockSensorData.pH < 6.5 || mockSensorData.pH > 8.5 ? "danger" : "safe", 
            icon: FlaskConical 
          },
          { 
            parameter: "Turbidity", 
            value: `${mockSensorData.turbidity} NTU`, 
            status: mockSensorData.turbidity > 4 ? "danger" : mockSensorData.turbidity > 2 ? "warning" : "safe", 
            icon: Droplets 
          },
          { 
            parameter: "Temperature", 
            value: `${mockSensorData.temperature}°C`, 
            status: mockSensorData.temperature > 30 ? "warning" : "safe", 
            icon: Thermometer 
          },
          { 
            parameter: "TDS", 
            value: `${mockSensorData.TDS} ppm`, 
            status: mockSensorData.TDS > 1000 ? "warning" : "safe", 
            icon: AlertTriangle 
          },
        ];
        setWaterQualityData(newData);
      } catch (error) {
        // Fallback to mock data
        const mockData: WaterQualityStatus[] = [
          { parameter: "pH Level", value: "7.2", status: "safe", icon: FlaskConical },
          { parameter: "Turbidity", value: "1.5 NTU", status: "safe", icon: Droplets },
          { parameter: "Temperature", value: "24°C", status: "safe", icon: Thermometer },
          { parameter: "TDS", value: "850 ppm", status: "warning", icon: AlertTriangle },
        ];
        setWaterQualityData(mockData);
        setOverallStatus("safe");
      }
      
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error updating water quality data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    updateWaterQualityData();
    // Auto-refresh every 5 minutes
    const interval = setInterval(updateWaterQualityData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getOverallStatusColor = (status: string) => {
    switch (status) {
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

  const getOverallStatusText = (status: string) => {
    switch (status) {
      case "danger":
        return "High Risk";
      case "warning":
        return "Caution";
      case "safe":
        return "Generally Safe";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="p-4 pb-24 space-y-6 animate-fade-in">
      {/* Hero Section */}
      <div className="bg-gradient-hero rounded-2xl p-6 text-center">
        <img 
          src={heroImage} 
          alt="Health Surveillance" 
          className="w-full h-32 object-cover rounded-xl mb-4"
        />
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Smart Health Surveillance
        </h1>
        <p className="text-muted-foreground text-sm mb-4">
          Real-time water quality monitoring and disease prediction
        </p>
        <Button 
          onClick={() => navigate('/role-selection')}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <UserCheck className="h-4 w-4 mr-2" />
          Choose Your Role
        </Button>
      </div>

      {/* Overall Status */}
      <Card className="p-6 bg-gradient-card hover-lift">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Water Quality Status</h2>
          <div className="flex items-center gap-2">
            <Badge className={getOverallStatusColor(overallStatus)}>
              {getOverallStatusText(overallStatus)}
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={updateWaterQualityData}
              disabled={isLoading}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        
        {lastUpdated && (
          <p className="text-xs text-muted-foreground mb-4">
            Last updated: {lastUpdated}
          </p>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          {waterQualityData.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.parameter}
                className="bg-background rounded-xl p-4 border border-border hover-glow animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${getStatusColor(item.status)}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">{item.parameter}</p>
                    <p className="font-semibold text-sm">{item.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 hover-lift bg-gradient-card">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-3">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-sm mb-1">Disease Prediction</h3>
            <p className="text-xs text-muted-foreground">AI-powered health insights</p>
          </div>
        </Card>
        
        <Card className="p-4 hover-lift bg-gradient-card">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-sm mb-1">Report Issue</h3>
            <p className="text-xs text-muted-foreground">Community reporting</p>
          </div>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card className="p-4 bg-gradient-card">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Recent Alerts
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-soft"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">Water quality improved in Zone A</p>
              <p className="text-xs text-muted-foreground">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse-soft"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">TDS levels slightly elevated</p>
              <p className="text-xs text-muted-foreground">6 hours ago</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}