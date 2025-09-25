import { useState } from "react";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { PredictScreen } from "@/components/screens/PredictScreen";
import { CommunityScreen } from "@/components/screens/CommunityScreen";
import { AlertsScreen } from "@/components/screens/AlertsScreen";
import { LearnScreen } from "@/components/screens/LearnScreen";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");

  const renderScreen = () => {
    switch (activeTab) {
      case "home":
        return <HomeScreen />;
      case "predict":
        return <PredictScreen />;
      case "community":
        return <CommunityScreen />;
      case "alerts":
        return <AlertsScreen />;
      case "learn":
        return <LearnScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="min-h-screen">
        {renderScreen()}
      </main>
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
