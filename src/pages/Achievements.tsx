import { useState, useMemo } from "react";
import { Award, Lock, Trophy, Zap, Flame, Star, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { achievements, tierColors, categoryLabels, Achievement } from "@/data/achievementData";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

// Mock user progress - in a real app, this would come from a database
const mockUserProgress = {
  quizzesCompleted: 2,
  perfectScores: 1,
  totalXp: 350,
  streakDays: 5,
  moduleScores: {
    1: 100, // Perfect score on Recycling
    2: 80,  // Energy Efficiency
  } as Record<number, number>
};

type CategoryFilter = "all" | "quiz" | "xp" | "streak" | "special";

const Achievements = () => {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");

  const { unlockedAchievements, progressData } = useMemo(() => {
    const unlocked: string[] = [];
    const progress: Record<string, { current: number; target: number; percentage: number }> = {};

    achievements.forEach((achievement) => {
      let current = 0;
      const target = achievement.requirement.value;

      switch (achievement.requirement.type) {
        case "quizzes_completed":
          current = mockUserProgress.quizzesCompleted;
          break;
        case "perfect_score":
          current = mockUserProgress.perfectScores;
          break;
        case "total_xp":
          current = mockUserProgress.totalXp;
          break;
        case "streak_days":
          current = mockUserProgress.streakDays;
          break;
        case "module_complete":
          const moduleId = achievement.requirement.moduleId;
          if (moduleId && mockUserProgress.moduleScores[moduleId]) {
            current = mockUserProgress.moduleScores[moduleId];
          }
          break;
      }

      const percentage = Math.min((current / target) * 100, 100);
      progress[achievement.id] = { current, target, percentage };

      if (current >= target) {
        unlocked.push(achievement.id);
      }
    });

    return { unlockedAchievements: unlocked, progressData: progress };
  }, []);

  const filteredAchievements = achievements.filter((a) => {
    if (categoryFilter === "all") return true;
    return a.category === categoryFilter;
  });

  const stats = {
    total: achievements.length,
    unlocked: unlockedAchievements.length,
    totalXpFromBadges: achievements
      .filter((a) => unlockedAchievements.includes(a.id))
      .reduce((sum, a) => sum + a.xpReward, 0)
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="glass rounded-full px-4 py-2 mb-6 inline-flex items-center gap-2 glow-mint">
              <Award className="h-4 w-4 text-mint" />
              <span className="text-sm font-medium text-mint">Achievement Gallery</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Your <span className="gradient-text">Badges</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Unlock achievements by completing quizzes, earning XP, and maintaining streaks
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
            <div className="glass rounded-2xl p-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="rounded-xl bg-mint/10 p-3">
                  <Trophy className="h-6 w-6 text-mint" />
                </div>
              </div>
              <div className="font-display text-2xl font-bold gradient-text">
                {stats.unlocked}/{stats.total}
              </div>
              <div className="text-sm text-muted-foreground">Unlocked</div>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="rounded-xl bg-violet/10 p-3">
                  <Zap className="h-6 w-6 text-violet" />
                </div>
              </div>
              <div className="font-display text-2xl font-bold gradient-text">
                +{stats.totalXpFromBadges}
              </div>
              <div className="text-sm text-muted-foreground">XP from Badges</div>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="rounded-xl bg-orange-500/10 p-3">
                  <Flame className="h-6 w-6 text-orange-500" />
                </div>
              </div>
              <div className="font-display text-2xl font-bold gradient-text">
                {mockUserProgress.streakDays}
              </div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {(["all", "quiz", "xp", "streak", "special"] as CategoryFilter[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium text-sm transition-all",
                  categoryFilter === cat
                    ? "bg-gradient-cosmic text-primary-foreground"
                    : "glass text-muted-foreground hover:text-foreground"
                )}
              >
                {cat === "all" ? "All Badges" : categoryLabels[cat]}
              </button>
            ))}
          </div>

          {/* Achievements Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAchievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                isUnlocked={unlockedAchievements.includes(achievement.id)}
                progress={progressData[achievement.id]}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

interface AchievementCardProps {
  achievement: Achievement;
  isUnlocked: boolean;
  progress: { current: number; target: number; percentage: number };
}

const AchievementCard = ({ achievement, isUnlocked, progress }: AchievementCardProps) => {
  const Icon = achievement.icon;
  const tier = tierColors[achievement.tier];

  return (
    <div
      className={cn(
        "group relative glass rounded-2xl p-6 transition-all duration-300",
        isUnlocked 
          ? `ring-1 ${tier.border} hover:scale-[1.02]` 
          : "opacity-70 hover:opacity-90"
      )}
    >
      {/* Unlocked Indicator */}
      {isUnlocked && (
        <div className="absolute -top-2 -right-2 bg-mint rounded-full p-1">
          <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
        </div>
      )}

      {/* Tier Badge */}
      <div className="absolute top-4 right-4">
        <span className={cn(
          "text-xs font-medium uppercase tracking-wider px-2 py-1 rounded-full",
          tier.bg, tier.text
        )}>
          {achievement.tier}
        </span>
      </div>

      {/* Icon */}
      <div className={cn(
        "relative w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300",
        isUnlocked 
          ? `${tier.bg} shadow-lg ${tier.glow}` 
          : "bg-muted/50"
      )}>
        {isUnlocked ? (
          <Icon className={cn("h-8 w-8", tier.text)} />
        ) : (
          <Lock className="h-6 w-6 text-muted-foreground" />
        )}
      </div>

      {/* Content */}
      <h3 className={cn(
        "font-display text-lg font-semibold mb-1",
        isUnlocked ? "text-foreground" : "text-muted-foreground"
      )}>
        {achievement.name}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        {achievement.description}
      </p>

      {/* Progress */}
      {!isUnlocked && (
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Progress</span>
            <span className={tier.text}>
              {progress.current}/{progress.target}
            </span>
          </div>
          <Progress value={progress.percentage} className="h-1.5" />
        </div>
      )}

      {/* XP Reward */}
      <div className={cn(
        "flex items-center gap-2 text-sm",
        isUnlocked ? "text-mint" : "text-muted-foreground"
      )}>
        <Star className="h-4 w-4" />
        <span>+{achievement.xpReward} XP {isUnlocked ? "earned" : "reward"}</span>
      </div>

      {/* Category Tag */}
      <div className="mt-4 pt-4 border-t border-border/50">
        <span className="text-xs text-muted-foreground">
          {categoryLabels[achievement.category]}
        </span>
      </div>
    </div>
  );
};

export default Achievements;
