import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Bell, MapPin, Clock, Users, CheckCircle } from "lucide-react";

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  location: string;
  timestamp: string;
  type: "outbreak" | "water_quality" | "prevention" | "resolved";
  affectedPopulation: number;
  isRead: boolean;
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    title: "Cholera Outbreak Risk",
    description: "Elevated risk of cholera transmission detected in Zone B due to contaminated water sources.",
    severity: "critical",
    location: "Zone B, Sectors 2-4",
    timestamp: "30 minutes ago",
    type: "outbreak",
    affectedPopulation: 1250,
    isRead: false
  },
  {
    id: "2",
    title: "Water Quality Alert",
    description: "High coliform count detected in main water supply. Immediate testing recommended.",
    severity: "high",
    location: "Zone A, Central District",
    timestamp: "2 hours ago",
    type: "water_quality",
    affectedPopulation: 800,
    isRead: false
  },
  {
    id: "3",
    title: "Prevention Campaign",
    description: "Health workers needed for water sanitation awareness drive in rural areas.",
    severity: "medium",
    location: "Zone C, Rural Areas",
    timestamp: "5 hours ago",
    type: "prevention",
    affectedPopulation: 500,
    isRead: true
  },
  {
    id: "4",
    title: "Issue Resolved",
    description: "Water treatment completed. Quality restored to safe levels in affected areas.",
    severity: "low",
    location: "Zone A, Sector 1",
    timestamp: "1 day ago",
    type: "resolved",
    affectedPopulation: 350,
    isRead: true
  }
];

export function AlertsScreen() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [filter, setFilter] = useState<"all" | "unread" | "critical">("all");

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-50 text-red-700 border-red-200";
      case "high":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "low":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "outbreak":
        return AlertTriangle;
      case "water_quality":
        return Bell;
      case "prevention":
        return Users;
      case "resolved":
        return CheckCircle;
      default:
        return Bell;
    }
  };

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const filteredAlerts = alerts.filter(alert => {
    switch (filter) {
      case "unread":
        return !alert.isRead;
      case "critical":
        return alert.severity === "critical" || alert.severity === "high";
      default:
        return true;
    }
  });

  const unreadCount = alerts.filter(alert => !alert.isRead).length;

  return (
    <div className="p-4 pb-24 space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <Bell className="h-6 w-6" />
          Alerts & Notifications
        </h1>
        <p className="text-muted-foreground text-sm">
          Critical health alerts for local health workers
        </p>
      </div>

      {/* Alert Summary */}
      <Card className="p-6 bg-gradient-card">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
            <div className="text-xs text-muted-foreground">Unread</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {alerts.filter(a => a.severity === "critical" || a.severity === "high").length}
            </div>
            <div className="text-xs text-muted-foreground">Priority</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {alerts.filter(a => a.type === "resolved").length}
            </div>
            <div className="text-xs text-muted-foreground">Resolved</div>
          </div>
        </div>
      </Card>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
          className="flex-1"
        >
          All Alerts
        </Button>
        <Button
          variant={filter === "unread" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("unread")}
          className="flex-1"
        >
          Unread ({unreadCount})
        </Button>
        <Button
          variant={filter === "critical" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("critical")}
          className="flex-1"
        >
          Critical
        </Button>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert, index) => {
          const TypeIcon = getTypeIcon(alert.type);
          return (
            <Card 
              key={alert.id}
              className={`p-4 hover-glow animate-slide-up ${!alert.isRead ? 'ring-2 ring-primary/20' : ''}`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => markAsRead(alert.id)}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                  <TypeIcon size={16} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm">{alert.title}</h3>
                    <div className="flex items-center gap-2">
                      {!alert.isRead && (
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse-soft" />
                      )}
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {alert.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {alert.timestamp}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {alert.affectedPopulation.toLocaleString()} affected
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredAlerts.length === 0 && (
        <Card className="p-8 text-center bg-gradient-card">
          <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">No alerts found</h3>
          <p className="text-sm text-muted-foreground">
            {filter === "unread" ? "All alerts have been read" : "No alerts match your filter"}
          </p>
        </Card>
      )}
    </div>
  );
}