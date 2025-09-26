import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Globe, Play, Download, Heart, Droplets, Shield } from "lucide-react";

interface LearningContent {
  id: string;
  title: string;
  description: string;
  category: "hygiene" | "prevention" | "treatment" | "awareness";
  language: string;
  type: "article" | "video" | "audio" | "infographic";
  duration?: string;
  downloadable: boolean;
}

const learningContent: LearningContent[] = [
  {
    id: "1",
    title: "Clean Water Practices",
    description: "Essential water purification methods and safe storage techniques for communities.",
    category: "hygiene",
    language: "English / Hindi",
    type: "video",
    duration: "5 min",
    downloadable: true
  },
  {
    id: "2",
    title: "Recognizing Waterborne Diseases",
    description: "Early symptoms and warning signs of cholera, typhoid, and other water-related illnesses.",
    category: "awareness",
    language: "Local Dialect",
    type: "audio",
    duration: "8 min",
    downloadable: true
  },
  {
    id: "3",
    title: "Hand Hygiene Guide",
    description: "Step-by-step handwashing techniques to prevent disease transmission.",
    category: "prevention",
    language: "English / Hindi",
    type: "infographic",
    downloadable: true
  },
  {
    id: "4",
    title: "Emergency Water Treatment",
    description: "Quick methods to purify water during emergencies or when clean sources aren't available.",
    category: "treatment",
    language: "English",
    type: "article",
    duration: "3 min read",
    downloadable: false
  },
  {
    id: "5",
    title: "Community Health Monitoring",
    description: "How volunteers can effectively track and report health issues in their communities.",
    category: "awareness",
    language: "Hindi / Local",
    type: "video",
    duration: "12 min",
    downloadable: true
  },
  {
    id: "6",
    title: "Cholera Prevention Tips",
    description: "Specific hygiene measures to prevent cholera outbreaks in communities.",
    category: "prevention",
    language: "Hindi / English",
    type: "infographic",
    downloadable: true
  },
  {
    id: "7",
    title: "Typhoid Awareness",
    description: "Understanding typhoid symptoms and prevention through proper food hygiene.",
    category: "awareness",
    language: "English / Local",
    type: "video",
    duration: "6 min",
    downloadable: true
  },
  {
    id: "8",
    title: "Water Quality Testing",
    description: "Simple methods to test water quality at home using basic indicators.",
    category: "hygiene",
    language: "English / Hindi",
    type: "article",
    duration: "4 min read",
    downloadable: false
  },
  {
    id: "9",
    title: "Hepatitis A Prevention",
    description: "Vaccination and hygiene practices to prevent Hepatitis A transmission.",
    category: "prevention",
    language: "English / Hindi",
    type: "video",
    duration: "7 min",
    downloadable: true
  },
  {
    id: "10",
    title: "Diarrhea Management",
    description: "Oral rehydration therapy and home care for diarrhea patients.",
    category: "treatment",
    language: "Local Dialect",
    type: "audio",
    duration: "10 min",
    downloadable: true
  }
];

export function LearnScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [language, setLanguage] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Topics", icon: BookOpen },
    { id: "hygiene", label: "Hygiene", icon: Heart },
    { id: "prevention", label: "Prevention", icon: Shield },
    { id: "treatment", label: "Treatment", icon: Droplets },
    { id: "awareness", label: "Awareness", icon: Globe },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "hygiene":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "prevention":
        return "bg-green-50 text-green-700 border-green-200";
      case "treatment":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "awareness":
        return "bg-orange-50 text-orange-700 border-orange-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return Play;
      case "audio":
        return Play;
      case "infographic":
        return BookOpen;
      case "article":
        return BookOpen;
      default:
        return BookOpen;
    }
  };

  const filteredContent = learningContent.filter(content => {
    const matchesCategory = selectedCategory === "all" || content.category === selectedCategory;
    const matchesLanguage = language === "all" || content.language.toLowerCase().includes(language);
    return matchesCategory && matchesLanguage;
  });

  return (
    <div className="p-4 pb-24 space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <BookOpen className="h-6 w-6" />
          Health Education
        </h1>
        <p className="text-muted-foreground text-sm">
          Multilingual health tips and prevention guidelines
        </p>
      </div>

      {/* Language Selection */}
      <Card className="p-4 bg-gradient-card">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Select Language
        </h3>
        <div className="flex gap-2 flex-wrap">
          {["all", "english", "hindi", "local"].map((lang) => (
            <Button
              key={lang}
              variant={language === lang ? "default" : "outline"}
              size="sm"
              onClick={() => setLanguage(lang)}
              className="capitalize"
            >
              {lang === "all" ? "All Languages" : lang}
            </Button>
          ))}
        </div>
      </Card>

      {/* Category Filter */}
      <div className="grid grid-cols-2 gap-3">
        {categories.slice(0, 4).map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => setSelectedCategory(category.id)}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{category.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Quick Stats */}
      <Card className="p-4 bg-gradient-card">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-primary">{learningContent.length}</div>
            <div className="text-xs text-muted-foreground">Resources</div>
          </div>
          <div>
            <div className="text-xl font-bold text-green-600">
              {learningContent.filter(c => c.downloadable).length}
            </div>
            <div className="text-xs text-muted-foreground">Offline</div>
          </div>
          <div>
            <div className="text-xl font-bold text-blue-600">3</div>
            <div className="text-xs text-muted-foreground">Languages</div>
          </div>
        </div>
      </Card>

      {/* Learning Content */}
      <div className="space-y-4">
        {filteredContent.map((content, index) => {
          const TypeIcon = getTypeIcon(content.type);
          return (
            <Card 
              key={content.id}
              className="p-4 hover-glow animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <TypeIcon size={16} className="text-primary" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm">{content.title}</h3>
                    <div className="flex items-center gap-2">
                      <Badge className={getCategoryColor(content.category)}>
                        {content.category}
                      </Badge>
                      {content.downloadable && (
                        <Badge variant="outline" className="text-xs">
                          <Download className="h-3 w-3 mr-1" />
                          Offline
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{content.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {content.language}
                      </span>
                      {content.duration && (
                        <span>{content.duration}</span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Play className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      {content.downloadable && (
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredContent.length === 0 && (
        <Card className="p-8 text-center bg-gradient-card">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">No content found</h3>
          <p className="text-sm text-muted-foreground">
            Try selecting different filters to find relevant content
          </p>
        </Card>
      )}
    </div>
  );
}