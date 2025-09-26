import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Users, Heart, Shield, ArrowRight } from "lucide-react";

interface Role {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  buttonText: string;
  buttonVariant: "default" | "outline";
  borderColor: string;
  buttonColor: string;
}

const roles: Role[] = [
  {
    id: "volunteer",
    title: "Community Volunteer / ASHA Worker",
    description: "Report health data, conduct surveys, and upload water test results from the field.",
    icon: Users,
    buttonText: "Login as Volunteer",
    buttonVariant: "default",
    borderColor: "border-green-200",
    buttonColor: "bg-green-600 hover:bg-green-700"
  },
  {
    id: "official",
    title: "Health Official",
    description: "Monitor disease patterns, analyze data, and manage public health responses.",
    icon: Heart,
    buttonText: "Login as Official",
    buttonVariant: "default",
    borderColor: "border-orange-200",
    buttonColor: "bg-orange-600 hover:bg-orange-700"
  },
  {
    id: "admin",
    title: "System Administrator",
    description: "Manage users, review submissions, and oversee system operations.",
    icon: Shield,
    buttonText: "Admin Login",
    buttonVariant: "outline",
    borderColor: "border-green-200",
    buttonColor: "border-green-600 text-green-600 hover:bg-green-50"
  }
];

export function RoleSelectionScreen() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    
    // Navigate to the appropriate dashboard
    switch (roleId) {
      case "volunteer":
        navigate("/volunteer");
        break;
      case "official":
        navigate("/official");
        break;
      case "admin":
        navigate("/admin");
        break;
      default:
        console.log(`Selected role: ${roleId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Smart Health Surveillance</h1>
                <p className="text-sm text-gray-600">AI-Powered Water Quality Monitoring</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full">
          {/* Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Role to Continue
            </h2>
            <p className="text-lg text-gray-600">
              Select your role to access the appropriate features and dashboard
            </p>
          </div>

          {/* Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <Card 
                  key={role.id}
                  className={`p-6 text-center hover:shadow-lg transition-all duration-200 cursor-pointer ${role.borderColor} ${
                    selectedRole === role.id ? 'ring-2 ring-green-500' : ''
                  }`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      role.id === 'volunteer' ? 'bg-green-100' : 
                      role.id === 'official' ? 'bg-orange-100' : 'bg-green-100'
                    }`}>
                      <Icon className={`h-8 w-8 ${
                        role.id === 'volunteer' ? 'text-green-600' : 
                        role.id === 'official' ? 'text-orange-600' : 'text-green-600'
                      }`} />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {role.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {role.description}
                  </p>

                  {/* Button */}
                  <Button
                    className={`w-full ${role.buttonColor} transition-all duration-200`}
                    variant={role.buttonVariant}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRoleSelect(role.id);
                    }}
                  >
                    {role.buttonText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Card>
              );
            })}
          </div>

          {/* Footer Info */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-2 text-gray-500">
              <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
                <Heart className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm">Smart Health Surveillance Platform</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
              <Heart className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm">Smart Health Surveillance Platform</span>
          </div>
        </div>
      </div>
    </div>
  );
}
