import { useState, useEffect } from "react";
import { 
  Calendar, CheckCircle2, Clock, Flame, Gift, 
  Leaf, Star, Zap, RefreshCw, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  getTodaysChallenges, 
  categoryColors, 
  difficultyColors,
  DailyChallenge 
} from "@/data/challengeData";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

const STORAGE_KEY = "greenpath_daily_challenges";

interface ChallengeState {
  date: string;
  completed: string[];
  claimed: boolean;
}

const DailyChallenges = () => {
  const [challenges] = useState<DailyChallenge[]>(() => getTodaysChallenges(3));
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [bonusClaimed, setBonusClaimed] = useState(false);
  const [streak, setStreak] = useState(5); // Mock streak

  const today = new Date().toISOString().split("T")[0];

  // Load state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const state: ChallengeState = JSON.parse(saved);
      if (state.date === today) {
        setCompletedIds(state.completed);
        setBonusClaimed(state.claimed);
      }
    }
  }, [today]);

  // Save state to localStorage
  useEffect(() => {
    const state: ChallengeState = {
      date: today,
      completed: completedIds,
      claimed: bonusClaimed
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [completedIds, bonusClaimed, today]);

  const handleComplete = (challengeId: string) => {
    if (!completedIds.includes(challengeId)) {
      setCompletedIds([...completedIds, challengeId]);
      
      // Small celebration
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: ["#2dd4bf", "#8b5cf6"]
      });
    }
  };

  const handleClaimBonus = () => {
    if (allCompleted && !bonusClaimed) {
      setBonusClaimed(true);
      
      // Big celebration!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#2dd4bf", "#8b5cf6", "#fbbf24"]
      });
    }
  };

  const allCompleted = completedIds.length === challenges.length;
  const totalXp = challenges.reduce((sum, c) => sum + c.xpReward, 0);
  const earnedXp = challenges
    .filter(c => completedIds.includes(c.id))
    .reduce((sum, c) => sum + c.xpReward, 0);
  const bonusXp = 50;

  // Calculate time until reset
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const hoursLeft = Math.floor((tomorrow.getTime() - now.getTime()) / (1000 * 60 * 60));
  const minutesLeft = Math.floor(((tomorrow.getTime() - now.getTime()) % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container px-4 max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="glass rounded-full px-4 py-2 mb-6 inline-flex items-center gap-2 glow-mint">
              <Calendar className="h-4 w-4 text-mint" />
              <span className="text-sm font-medium text-mint">Daily Challenges</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Today's <span className="gradient-text">Eco Tasks</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Complete all challenges for a bonus reward!
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="glass rounded-xl p-4 text-center">
              <div className="flex justify-center mb-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="font-display text-lg font-bold text-foreground">
                {hoursLeft}h {minutesLeft}m
              </div>
              <div className="text-xs text-muted-foreground">Until Reset</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="flex justify-center mb-2">
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
              <div className="font-display text-lg font-bold text-orange-500">
                {streak} days
              </div>
              <div className="text-xs text-muted-foreground">Current Streak</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="flex justify-center mb-2">
                <CheckCircle2 className="h-5 w-5 text-mint" />
              </div>
              <div className="font-display text-lg font-bold gradient-text">
                {completedIds.length}/{challenges.length}
              </div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="flex justify-center mb-2">
                <Zap className="h-5 w-5 text-violet" />
              </div>
              <div className="font-display text-lg font-bold gradient-text">
                +{earnedXp + (bonusClaimed ? bonusXp : 0)}
              </div>
              <div className="text-xs text-muted-foreground">XP Earned</div>
            </div>
          </div>

          {/* Progress to Bonus */}
          <div className="glass rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Gift className={cn(
                  "h-5 w-5",
                  allCompleted ? "text-mint" : "text-muted-foreground"
                )} />
                <span className="font-medium">Daily Bonus</span>
              </div>
              <span className={cn(
                "font-display font-bold",
                allCompleted ? "text-mint" : "text-muted-foreground"
              )}>
                +{bonusXp} XP
              </span>
            </div>
            <Progress 
              value={(completedIds.length / challenges.length) * 100} 
              className="h-3 mb-3" 
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {allCompleted 
                  ? bonusClaimed 
                    ? "Bonus claimed! Come back tomorrow 🌟" 
                    : "All tasks complete! Claim your bonus!"
                  : `Complete ${challenges.length - completedIds.length} more task${challenges.length - completedIds.length > 1 ? 's' : ''}`
                }
              </span>
              {allCompleted && !bonusClaimed && (
                <Button 
                  size="sm" 
                  className="bg-gradient-cosmic hover:opacity-90"
                  onClick={handleClaimBonus}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Claim Bonus
                </Button>
              )}
            </div>
          </div>

          {/* Challenge Cards */}
          <div className="space-y-4">
            {challenges.map((challenge, index) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                isCompleted={completedIds.includes(challenge.id)}
                onComplete={() => handleComplete(challenge.id)}
                index={index}
              />
            ))}
          </div>

          {/* Refresh Info */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-muted-foreground text-sm">
              <RefreshCw className="h-4 w-4" />
              <span>New challenges every day at midnight</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

interface ChallengeCardProps {
  challenge: DailyChallenge;
  isCompleted: boolean;
  onComplete: () => void;
  index: number;
}

const ChallengeCard = ({ challenge, isCompleted, onComplete, index }: ChallengeCardProps) => {
  const Icon = challenge.icon;
  const colors = categoryColors[challenge.category];
  const diffColor = difficultyColors[challenge.difficulty];

  return (
    <div
      className={cn(
        "glass rounded-2xl p-6 transition-all duration-300 animate-fade-in",
        isCompleted ? "ring-1 ring-mint/30 opacity-80" : "hover:scale-[1.01]"
      )}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Icon & Status */}
        <div className="flex items-start gap-4 flex-1">
          <div className={cn(
            "rounded-xl p-3 transition-all",
            isCompleted ? "bg-mint/20" : colors.bg
          )}>
            {isCompleted ? (
              <CheckCircle2 className="h-6 w-6 text-mint" />
            ) : (
              <Icon className={cn("h-6 w-6", colors.text)} />
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className={cn(
                "font-display text-lg font-semibold",
                isCompleted && "line-through text-muted-foreground"
              )}>
                {challenge.title}
              </h3>
              <span className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full",
                colors.bg, colors.text
              )}>
                {challenge.category}
              </span>
              <span className={cn("text-xs font-medium", diffColor)}>
                {challenge.difficulty}
              </span>
            </div>
            <p className="text-muted-foreground text-sm mb-2">
              {challenge.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <span className="flex items-center gap-1 text-mint">
                <Leaf className="h-3 w-3" />
                {challenge.impactMetric}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Star className="h-3 w-3" />
                Tip: {challenge.tip}
              </span>
            </div>
          </div>
        </div>

        {/* XP & Action */}
        <div className="flex items-center gap-4 md:flex-col md:items-end">
          <div className={cn(
            "font-display font-bold",
            isCompleted ? "text-mint" : "gradient-text"
          )}>
            +{challenge.xpReward} XP
          </div>
          <Button
            onClick={onComplete}
            disabled={isCompleted}
            className={cn(
              "min-w-[120px]",
              isCompleted
                ? "bg-mint/20 text-mint hover:bg-mint/20"
                : "bg-gradient-cosmic hover:opacity-90"
            )}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Done
              </>
            ) : (
              "Mark Complete"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DailyChallenges;
