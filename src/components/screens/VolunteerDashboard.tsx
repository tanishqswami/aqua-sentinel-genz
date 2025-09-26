import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  Upload, 
  MapPin, 
  Camera, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Thermometer,
  Droplets,
  FlaskConical
} from "lucide-react";

interface SurveyData {
  id: string;
  location: string;
  timestamp: string;
  status: "pending" | "completed" | "approved";
  waterQuality: "good" | "fair" | "poor";
}

const mockSurveys: SurveyData[] = [
  {
    id: "1",
    location: "Village A, Sector 2",
    timestamp: "2024-01-15 10:30",
    status: "completed",
    waterQuality: "good"
  },
  {
    id: "2", 
    location: "Village B, Sector 4",
    timestamp: "2024-01-15 14:20",
    status: "pending",
    waterQuality: "fair"
  },
  {
    id: "3",
    location: "Village C, Sector 1", 
    timestamp: "2024-01-14 16:45",
    status: "approved",
    waterQuality: "poor"
  }
];

export function VolunteerDashboard() {
  const [surveys, setSurveys] = useState(mockSurveys);
  const [isUploading, setIsUploading] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "approved":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "good":
        return "bg-green-100 text-green-800";
      case "fair":
        return "bg-yellow-100 text-yellow-800";
      case "poor":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleUpload = () => {
    setIsUploading(true);
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      // Add new survey
      const newSurvey: SurveyData = {
        id: (surveys.length + 1).toString(),
        location: "New Location",
        timestamp: new Date().toLocaleString(),
        status: "pending",
        waterQuality: "fair"
      };
      setSurveys([...surveys, newSurvey]);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ASHA Worker Dashboard</h1>
                <p className="text-sm text-gray-600">Community Health Volunteer</p>
              </div>
            </div>
            <Button onClick={handleUpload} disabled={isUploading} className="bg-green-600 hover:bg-green-700">
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? "Uploading..." : "Upload Data"}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Surveys</p>
                <p className="text-2xl font-bold text-gray-900">
                  {surveys.filter(s => s.status === "completed").length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {surveys.filter(s => s.status === "pending").length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Poor Quality</p>
                <p className="text-2xl font-bold text-gray-900">
                  {surveys.filter(s => s.waterQuality === "poor").length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Locations</p>
                <p className="text-2xl font-bold text-gray-900">{surveys.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Camera className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Water Quality Test</h3>
              <p className="text-gray-600 text-sm mb-4">Upload water sample photos and test results</p>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Start Test
              </Button>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Health Survey</h3>
              <p className="text-gray-600 text-sm mb-4">Conduct community health assessment</p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Start Survey
              </Button>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Location Report</h3>
              <p className="text-gray-600 text-sm mb-4">Report new water sources and locations</p>
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                Add Location
              </Button>
            </div>
          </Card>
        </div>

        {/* Recent Surveys */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Surveys</h3>
          <div className="space-y-4">
            {surveys.map((survey) => (
              <div key={survey.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-gray-900">{survey.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{survey.timestamp}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getQualityColor(survey.waterQuality)}>
                    {survey.waterQuality}
                  </Badge>
                  <Badge className={getStatusColor(survey.status)}>
                    {survey.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
