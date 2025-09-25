import { Droplets, Thermometer, FlaskConical, AlertTriangle, Activity, Users, Bell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/hero-health.jpg";

interface WaterQualityStatus {
  parameter: string;
  value: string;
  status: "safe" | "warning" | "danger";
  icon: React.ElementType;
}

const waterQualityData: WaterQualityStatus[] = [
  { parameter: "pH Level", value: "7.2", status: "safe", icon: FlaskConical },
  { parameter: "Turbidity", value: "1.5 NTU", status: "safe", icon: Droplets },
  { parameter: "Temperature", value: "24°C", status: "safe", icon: Thermometer },
  { parameter: "TDS", value: "850 ppm", status: "warning", icon: AlertTriangle },
];

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
        <p className="text-muted-foreground text-sm">
          Real-time water quality monitoring and disease prediction
        </p>
      </div>

      {/* Overall Status */}
      <Card className="p-6 bg-gradient-card hover-lift">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Water Quality Status</h2>
          <Badge className="bg-green-50 text-green-700 border-green-200">
            Generally Safe
          </Badge>
        </div>
        
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