import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Leaf, Recycle, Zap, ShoppingBag, Droplets, Home, 
  Car, Utensils, Lock, CheckCircle2, Clock, ArrowRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

const modules = [
  {
    id: 1,
    title: "Recycling Basics",
    description: "Learn the fundamentals of sorting and recycling waste properly.",
    icon: Recycle,
    duration: "15 min",
    xp: 100,
    status: "completed",
    color: "mint",
    progress: 100,
  },
  {
    id: 2,
    title: "Energy Efficiency",
    description: "Discover ways to reduce energy consumption at home and work.",
    icon: Zap,
    duration: "20 min",
    xp: 150,
    status: "in-progress",
    color: "violet",
    progress: 60,
  },
  {
    id: 3,
    title: "Sustainable Shopping",
    description: "Make eco-conscious choices when buying products and services.",
    icon: ShoppingBag,
    duration: "25 min",
    xp: 200,
    status: "available",
    color: "mint",
    progress: 0,
  },
  {
    id: 4,
    title: "Water Conservation",
    description: "Essential tips for reducing water waste in daily life.",
    icon: Droplets,
    duration: "15 min",
    xp: 100,
    status: "available",
    color: "violet",
    progress: 0,
  },
  {
    id: 5,
    title: "Green Home",
    description: "Transform your living space into an eco-friendly haven.",
    icon: Home,
    duration: "30 min",
    xp: 250,
    status: "locked",
    color: "mint",
    progress: 0,
  },
  {
    id: 6,
    title: "Eco Transportation",
    description: "Explore sustainable alternatives for your daily commute.",
    icon: Car,
    duration: "20 min",
    xp: 150,
    status: "locked",
    color: "violet",
    progress: 0,
  },
  {
    id: 7,
    title: "Sustainable Diet",
    description: "Understand the environmental impact of food choices.",
    icon: Utensils,
    duration: "25 min",
    xp: 200,
    status: "locked",
    color: "mint",
    progress: 0,
  },
  {
    id: 8,
    title: "Zero Waste Living",
    description: "Master the art of minimizing waste in every aspect of life.",
    icon: Leaf,
    duration: "35 min",
    xp: 300,
    status: "locked",
    color: "violet",
    progress: 0,
  },
];

const Modules = () => {
  const [filter, setFilter] = useState<string>("all");

  const filteredModules = modules.filter((m) => {
    if (filter === "all") return true;
    return m.status === filter;
  });

  const totalXP = modules.filter(m => m.status === "completed").reduce((sum, m) => sum + m.xp, 0);
  const totalModules = modules.length;
  const completedModules = modules.filter(m => m.status === "completed").length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="glass rounded-full px-4 py-2 mb-4 inline-flex items-center gap-2">
                <Leaf className="h-4 w-4 text-mint" />
                <span className="text-sm font-medium text-mint">Learning Modules</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
                Your <span className="gradient-text">Eco Journey</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Complete modules to earn XP and unlock new content
              </p>
            </div>

            {/* Stats Card */}
            <div className="glass rounded-2xl p-6 min-w-[280px]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-display font-bold text-mint">
                  {completedModules}/{totalModules} Modules
                </span>
              </div>
              <Progress value={(completedModules / totalModules) * 100} className="h-2 mb-4" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total XP Earned</span>
                <span className="font-bold gradient-text">{totalXP} XP</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {["all", "completed", "in-progress", "available", "locked"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium text-sm transition-all",
                  filter === f
                    ? "bg-mint/10 text-mint"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {f.charAt(0).toUpperCase() + f.slice(1).replace("-", " ")}
              </button>
            ))}
          </div>

          {/* Modules Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredModules.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

interface ModuleCardProps {
  module: typeof modules[0];
}

const ModuleCard = ({ module }: ModuleCardProps) => {
  const Icon = module.icon;
  const isLocked = module.status === "locked";
  const isCompleted = module.status === "completed";
  const isInProgress = module.status === "in-progress";

  return (
    <div
      className={cn(
        "group glass rounded-2xl p-6 transition-all duration-300",
        isLocked ? "opacity-60" : "hover:scale-[1.02]",
        isCompleted && "ring-1 ring-mint/30"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            "rounded-xl p-3 transition-transform duration-300",
            module.color === "mint" ? "bg-mint/10" : "bg-violet/10",
            !isLocked && "group-hover:scale-110"
          )}
        >
          <Icon
            className={cn(
              "h-6 w-6",
              module.color === "mint" ? "text-mint" : "text-violet"
            )}
          />
        </div>
        {isCompleted && (
          <div className="flex items-center gap-1 text-mint text-sm">
            <CheckCircle2 className="h-4 w-4" />
            <span>Done</span>
          </div>
        )}
        {isLocked && <Lock className="h-5 w-5 text-muted-foreground" />}
      </div>

      {/* Content */}
      <h3 className="font-display text-lg font-semibold mb-2">{module.title}</h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {module.description}
      </p>

      {/* Progress (if in progress) */}
      {isInProgress && (
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-violet">{module.progress}%</span>
          </div>
          <Progress value={module.progress} className="h-1" />
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center justify-between text-sm mb-4">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{module.duration}</span>
        </div>
        <span className="font-medium gradient-text">+{module.xp} XP</span>
      </div>

      {/* Action */}
      <Button
        className={cn(
          "w-full",
          isLocked && "opacity-50 cursor-not-allowed",
          isCompleted
            ? "bg-mint/10 text-mint hover:bg-mint/20"
            : isInProgress
            ? "bg-gradient-cosmic"
            : "bg-muted hover:bg-muted/80"
        )}
        disabled={isLocked}
      >
        {isCompleted ? (
          "Review"
        ) : isInProgress ? (
          <>
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </>
        ) : isLocked ? (
          "Locked"
        ) : (
          "Start Module"
        )}
      </Button>
    </div>
  );
};

export default Modules;
