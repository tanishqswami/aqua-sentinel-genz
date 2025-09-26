import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Users, 
  Settings, 
  FileText, 
  BarChart3,
  UserCheck,
  UserX,
  Activity,
  Database,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface User {
  id: string;
  name: string;
  role: "volunteer" | "official" | "admin";
  status: "active" | "inactive" | "pending";
  lastActive: string;
  submissions: number;
}

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  pendingApprovals: number;
  totalSubmissions: number;
  systemHealth: "good" | "warning" | "critical";
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Priya Sharma",
    role: "volunteer",
    status: "active",
    lastActive: "2024-01-15 10:30",
    submissions: 15
  },
  {
    id: "2",
    name: "Dr. Rajesh Kumar",
    role: "official",
    status: "active",
    lastActive: "2024-01-15 09:15",
    submissions: 8
  },
  {
    id: "3",
    name: "Anita Singh",
    role: "volunteer",
    status: "pending",
    lastActive: "2024-01-14 16:45",
    submissions: 3
  },
  {
    id: "4",
    name: "Dr. Meera Patel",
    role: "official",
    status: "inactive",
    lastActive: "2024-01-10 14:20",
    submissions: 12
  }
];

const mockStats: SystemStats = {
  totalUsers: 156,
  activeUsers: 142,
  pendingApprovals: 8,
  totalSubmissions: 1247,
  systemHealth: "good"
};

export function AdminDashboard() {
  const [users, setUsers] = useState(mockUsers);
  const [stats] = useState(mockStats);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "volunteer":
        return "bg-green-100 text-green-800";
      case "official":
        return "bg-orange-100 text-orange-800";
      case "admin":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case "good":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleUserAction = (userId: string, action: "approve" | "reject" | "activate" | "deactivate") => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        switch (action) {
          case "approve":
            return { ...user, status: "active" };
          case "reject":
            return { ...user, status: "inactive" };
          case "activate":
            return { ...user, status: "active" };
          case "deactivate":
            return { ...user, status: "inactive" };
          default:
            return user;
        }
      }
      return user;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">System Administrator</h1>
                <p className="text-sm text-gray-600">Platform Management & Oversight</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button className="bg-green-600 hover:bg-green-700">
                <Settings className="h-4 w-4 mr-2" />
                System Settings
              </Button>
              <Button variant="outline">
                <Database className="h-4 w-4 mr-2" />
                Database
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Activity className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingApprovals}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSubmissions}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* System Health */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
                <p className="text-sm text-gray-600">All systems operational</p>
              </div>
            </div>
            <Badge className={getHealthColor(stats.systemHealth)}>
              {stats.systemHealth}
            </Badge>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Management */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              User Management
            </h3>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">Last active: {user.lastActive}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getRoleColor(user.role)}>
                      {user.role}
                    </Badge>
                    <Badge className={getStatusColor(user.status)}>
                      {user.status}
                    </Badge>
                    <div className="flex space-x-1">
                      {user.status === "pending" && (
                        <>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleUserAction(user.id, "approve")}>
                            <UserCheck className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50" onClick={() => handleUserAction(user.id, "reject")}>
                            <UserX className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                      {user.status === "active" && (
                        <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50" onClick={() => handleUserAction(user.id, "deactivate")}>
                          <UserX className="h-3 w-3" />
                        </Button>
                      )}
                      {user.status === "inactive" && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleUserAction(user.id, "activate")}>
                          <UserCheck className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* System Analytics */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              System Analytics
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Data Quality</p>
                    <p className="text-sm text-gray-600">98.5% accuracy rate</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Excellent</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Activity className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">API Performance</p>
                    <p className="text-sm text-gray-600">Average response: 120ms</p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">Good</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-gray-900">Storage Usage</p>
                    <p className="text-sm text-gray-600">75% of capacity used</p>
                  </div>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">Monitor</Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">User Management</h3>
              <p className="text-gray-600 text-sm mb-4">Manage user accounts and permissions</p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Manage Users
              </Button>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">System Reports</h3>
              <p className="text-gray-600 text-sm mb-4">Generate comprehensive system analytics</p>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Generate Reports
              </Button>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Settings className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">System Settings</h3>
              <p className="text-gray-600 text-sm mb-4">Configure platform settings and preferences</p>
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                Configure Settings
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
