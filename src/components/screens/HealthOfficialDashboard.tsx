import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  TrendingUp, 
  AlertTriangle, 
  MapPin, 
  Users, 
  Activity,
  BarChart3,
  FileText,
  Bell,
  CheckCircle
} from "lucide-react";

interface HealthAlert {
  id: string;
  location: string;
  severity: "low" | "medium" | "high" | "critical";
  disease: string;
  cases: number;
  timestamp: string;
  status: "active" | "investigating" | "resolved";
}

interface DiseasePattern {
  disease: string;
  cases: number;
  trend: "up" | "down" | "stable";
  riskLevel: "low" | "medium" | "high";
}

const mockAlerts: HealthAlert[] = [
  {
    id: "1",
    location: "Village A, Sector 2",
    severity: "high",
    disease: "Cholera",
    cases: 12,
    timestamp: "2024-01-15 10:30",
    status: "active"
  },
  {
    id: "2",
    location: "Village B, Sector 4", 
    severity: "medium",
    disease: "Diarrhea",
    cases: 8,
    timestamp: "2024-01-15 14:20",
    status: "investigating"
  },
  {
    id: "3",
    location: "Village C, Sector 1",
    severity: "low",
    disease: "Hepatitis A",
    cases: 3,
    timestamp: "2024-01-14 16:45",
    status: "resolved"
  }
];

const mockPatterns: DiseasePattern[] = [
  { disease: "Cholera", cases: 25, trend: "up", riskLevel: "high" },
  { disease: "Diarrhea", cases: 45, trend: "stable", riskLevel: "medium" },
  { disease: "Hepatitis A", cases: 12, trend: "down", riskLevel: "low" },
  { disease: "Typhoid", cases: 8, trend: "up", riskLevel: "medium" }
];

export function HealthOfficialDashboard() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [patterns] = useState(mockPatterns);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-50 text-red-700 border-red-200";
      case "high":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "medium":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-red-100 text-red-800";
      case "investigating":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case "down":
        return <TrendingUp className="h-4 w-4 text-green-500 rotate-180" />;
      case "stable":
        return <Activity className="h-4 w-4 text-blue-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Health Official Dashboard</h1>
                <p className="text-sm text-gray-600">Public Health Monitoring & Response</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Bell className="h-4 w-4 mr-2" />
                Alerts
              </Button>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {alerts.filter(a => a.status === "active").length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Activity className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Under Investigation</p>
                <p className="text-2xl font-bold text-gray-900">
                  {alerts.filter(a => a.status === "investigating").length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {alerts.filter(a => a.status === "resolved").length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Cases</p>
                <p className="text-2xl font-bold text-gray-900">
                  {alerts.reduce((sum, alert) => sum + alert.cases, 0)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Disease Patterns */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Disease Patterns
            </h3>
            <div className="space-y-4">
              {patterns.map((pattern, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(pattern.trend)}
                      <span className="font-medium text-gray-900">{pattern.disease}</span>
                    </div>
                    <Badge className={
                      pattern.riskLevel === "high" ? "bg-red-100 text-red-800" :
                      pattern.riskLevel === "medium" ? "bg-yellow-100 text-yellow-800" :
                      "bg-green-100 text-green-800"
                    }>
                      {pattern.riskLevel}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{pattern.cases}</p>
                    <p className="text-sm text-gray-600">cases</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Active Alerts */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Active Health Alerts
            </h3>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-gray-900">{alert.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                      <Badge className={getStatusColor(alert.status)}>
                        {alert.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{alert.disease}</p>
                      <p className="text-xs text-gray-500">{alert.timestamp}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{alert.cases}</p>
                      <p className="text-sm text-gray-600">cases</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Emergency Response</h3>
              <p className="text-gray-600 text-sm mb-4">Activate emergency protocols for critical alerts</p>
              <Button className="w-full bg-red-600 hover:bg-red-700">
                Activate Response
              </Button>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Report</h3>
              <p className="text-gray-600 text-sm mb-4">Generate comprehensive health analytics</p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Generate Report
              </Button>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Team Coordination</h3>
              <p className="text-gray-600 text-sm mb-4">Coordinate with field teams and volunteers</p>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Coordinate Teams
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
