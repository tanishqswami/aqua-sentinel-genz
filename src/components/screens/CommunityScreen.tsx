import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Upload, MapPin, Calendar, Users, MessageSquare, Camera, FileText } from "lucide-react";

interface CommunityReport {
  id: string;
  user: string;
  location: string;
  timestamp: string;
  type: "symptom" | "water_test" | "general";
  content: string;
  status: "pending" | "verified" | "resolved";
}

const mockReports: CommunityReport[] = [
  {
    id: "1",
    user: "Health Volunteer A",
    location: "Zone B, Sector 3",
    timestamp: "2 hours ago",
    type: "symptom",
    content: "Reports of stomach issues in 3 households. Possible water contamination.",
    status: "pending"
  },
  {
    id: "2",
    user: "Community Member",
    location: "Zone A, Sector 1",
    timestamp: "5 hours ago",
    type: "water_test",
    content: "Water appears cloudy with unusual odor near the main well.",
    status: "verified"
  },
  {
    id: "3",
    user: "Health Worker",
    location: "Zone C, Sector 2",
    timestamp: "1 day ago",
    type: "general",
    content: "Completed water quality testing. Results show safe levels.",
    status: "resolved"
  },
];

export function CommunityScreen() {
  const [reportText, setReportText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReport = () => {
    if (!reportText.trim()) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setReportText("");
      setIsSubmitting(false);
      // Show success toast
    }, 1500);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "symptom":
        return "bg-red-50 text-red-700 border-red-200";
      case "water_test":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "general":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "verified":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "resolved":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-4 pb-24 space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">Community Reports</h1>
        <p className="text-muted-foreground text-sm">
          Share symptoms, water test results, and health observations
        </p>
      </div>

      {/* Submit Report Card */}
      <Card className="p-6 bg-gradient-card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Submit New Report
        </h2>
        
        <div className="space-y-4">
          <Textarea
            placeholder="Describe symptoms, water quality observations, or test results..."
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            className="min-h-[100px] bg-background border-border"
          />
          
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Add Photo
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Attach File
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </Button>
          </div>
          
          <Button 
            onClick={handleSubmitReport}
            disabled={isSubmitting || !reportText.trim()}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </div>
      </Card>

      {/* Community Statistics */}
      <Card className="p-6 bg-gradient-card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users className="h-5 w-5" />
          Community Statistics
        </h2>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">24</div>
            <div className="text-xs text-muted-foreground">Active Reports</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">18</div>
            <div className="text-xs text-muted-foreground">Resolved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">6</div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </div>
        </div>
      </Card>

      {/* Recent Reports */}
      <Card className="p-6 bg-gradient-card">
        <h2 className="text-lg font-semibold mb-4">Recent Reports</h2>
        
        <div className="space-y-4">
          {mockReports.map((report, index) => (
            <div 
              key={report.id}
              className="bg-background rounded-xl p-4 border border-border hover-glow animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge className={getTypeColor(report.type)}>
                    {report.type.replace("_", " ")}
                  </Badge>
                  <Badge className={getStatusColor(report.status)}>
                    {report.status}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">{report.timestamp}</span>
              </div>
              
              <p className="text-sm mb-3">{report.content}</p>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {report.user}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {report.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}