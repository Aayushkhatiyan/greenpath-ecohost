import { 
  Leaf, Trophy, Zap, Target, Star, Crown, Flame, 
  BookOpen, Recycle, Droplets, Home, Car, Utensils, 
  Award, Medal, Sparkles, Shield, Rocket, Heart, Globe
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: "quiz" | "xp" | "streak" | "special";
  tier: "bronze" | "silver" | "gold" | "platinum";
  requirement: {
    type: "quizzes_completed" | "total_xp" | "streak_days" | "perfect_score" | "module_complete" | "speed_run";
    value: number;
    moduleId?: number;
  };
  xpReward: number;
}

export const achievements: Achievement[] = [
  // Quiz Completion Achievements
  {
    id: "first_quiz",
    name: "First Steps",
    description: "Complete your first quiz",
    icon: Leaf,
    category: "quiz",
    tier: "bronze",
    requirement: { type: "quizzes_completed", value: 1 },
    xpReward: 25
  },
  {
    id: "quiz_explorer",
    name: "Quiz Explorer",
    description: "Complete 3 different quizzes",
    icon: BookOpen,
    category: "quiz",
    tier: "bronze",
    requirement: { type: "quizzes_completed", value: 3 },
    xpReward: 50
  },
  {
    id: "knowledge_seeker",
    name: "Knowledge Seeker",
    description: "Complete 5 different quizzes",
    icon: Target,
    category: "quiz",
    tier: "silver",
    requirement: { type: "quizzes_completed", value: 5 },
    xpReward: 100
  },
  {
    id: "eco_scholar",
    name: "Eco Scholar",
    description: "Complete all 8 quizzes",
    icon: Award,
    category: "quiz",
    tier: "gold",
    requirement: { type: "quizzes_completed", value: 8 },
    xpReward: 250
  },

  // Perfect Score Achievements
  {
    id: "perfectionist",
    name: "Perfectionist",
    description: "Get a perfect score on any quiz",
    icon: Star,
    category: "quiz",
    tier: "silver",
    requirement: { type: "perfect_score", value: 1 },
    xpReward: 75
  },
  {
    id: "flawless_five",
    name: "Flawless Five",
    description: "Get perfect scores on 5 quizzes",
    icon: Sparkles,
    category: "quiz",
    tier: "gold",
    requirement: { type: "perfect_score", value: 5 },
    xpReward: 200
  },
  {
    id: "master_mind",
    name: "Master Mind",
    description: "Get perfect scores on all 8 quizzes",
    icon: Crown,
    category: "quiz",
    tier: "platinum",
    requirement: { type: "perfect_score", value: 8 },
    xpReward: 500
  },

  // XP Achievements
  {
    id: "xp_starter",
    name: "Getting Started",
    description: "Earn 100 XP",
    icon: Zap,
    category: "xp",
    tier: "bronze",
    requirement: { type: "total_xp", value: 100 },
    xpReward: 10
  },
  {
    id: "xp_rising",
    name: "Rising Star",
    description: "Earn 500 XP",
    icon: Rocket,
    category: "xp",
    tier: "bronze",
    requirement: { type: "total_xp", value: 500 },
    xpReward: 25
  },
  {
    id: "xp_dedicated",
    name: "Dedicated Learner",
    description: "Earn 1,000 XP",
    icon: Medal,
    category: "xp",
    tier: "silver",
    requirement: { type: "total_xp", value: 1000 },
    xpReward: 50
  },
  {
    id: "xp_champion",
    name: "Eco Champion",
    description: "Earn 2,500 XP",
    icon: Trophy,
    category: "xp",
    tier: "gold",
    requirement: { type: "total_xp", value: 2500 },
    xpReward: 100
  },
  {
    id: "xp_legend",
    name: "Sustainability Legend",
    description: "Earn 5,000 XP",
    icon: Crown,
    category: "xp",
    tier: "platinum",
    requirement: { type: "total_xp", value: 5000 },
    xpReward: 250
  },

  // Streak Achievements
  {
    id: "streak_3",
    name: "Getting Consistent",
    description: "Maintain a 3-day learning streak",
    icon: Flame,
    category: "streak",
    tier: "bronze",
    requirement: { type: "streak_days", value: 3 },
    xpReward: 30
  },
  {
    id: "streak_7",
    name: "Week Warrior",
    description: "Maintain a 7-day learning streak",
    icon: Flame,
    category: "streak",
    tier: "silver",
    requirement: { type: "streak_days", value: 7 },
    xpReward: 75
  },
  {
    id: "streak_30",
    name: "Monthly Master",
    description: "Maintain a 30-day learning streak",
    icon: Flame,
    category: "streak",
    tier: "gold",
    requirement: { type: "streak_days", value: 30 },
    xpReward: 200
  },
  {
    id: "streak_100",
    name: "Unstoppable",
    description: "Maintain a 100-day learning streak",
    icon: Shield,
    category: "streak",
    tier: "platinum",
    requirement: { type: "streak_days", value: 100 },
    xpReward: 500
  },

  // Module-Specific Achievements
  {
    id: "recycling_master",
    name: "Recycling Master",
    description: "Complete the Recycling Basics quiz with a perfect score",
    icon: Recycle,
    category: "special",
    tier: "silver",
    requirement: { type: "module_complete", value: 100, moduleId: 1 },
    xpReward: 50
  },
  {
    id: "energy_expert",
    name: "Energy Expert",
    description: "Complete the Energy Efficiency quiz with a perfect score",
    icon: Zap,
    category: "special",
    tier: "silver",
    requirement: { type: "module_complete", value: 100, moduleId: 2 },
    xpReward: 50
  },
  {
    id: "water_guardian",
    name: "Water Guardian",
    description: "Complete the Water Conservation quiz with a perfect score",
    icon: Droplets,
    category: "special",
    tier: "silver",
    requirement: { type: "module_complete", value: 100, moduleId: 4 },
    xpReward: 50
  },
  {
    id: "green_architect",
    name: "Green Architect",
    description: "Complete the Green Home quiz with a perfect score",
    icon: Home,
    category: "special",
    tier: "silver",
    requirement: { type: "module_complete", value: 100, moduleId: 5 },
    xpReward: 50
  },
  {
    id: "eco_driver",
    name: "Eco Driver",
    description: "Complete the Eco Transportation quiz with a perfect score",
    icon: Car,
    category: "special",
    tier: "silver",
    requirement: { type: "module_complete", value: 100, moduleId: 6 },
    xpReward: 50
  },
  {
    id: "conscious_eater",
    name: "Conscious Eater",
    description: "Complete the Sustainable Diet quiz with a perfect score",
    icon: Utensils,
    category: "special",
    tier: "silver",
    requirement: { type: "module_complete", value: 100, moduleId: 7 },
    xpReward: 50
  },
  {
    id: "zero_waste_hero",
    name: "Zero Waste Hero",
    description: "Complete the Zero Waste Living quiz with a perfect score",
    icon: Globe,
    category: "special",
    tier: "gold",
    requirement: { type: "module_complete", value: 100, moduleId: 8 },
    xpReward: 100
  },

  // Special Achievements
  {
    id: "planet_lover",
    name: "Planet Lover",
    description: "Earn all module-specific badges",
    icon: Heart,
    category: "special",
    tier: "platinum",
    requirement: { type: "quizzes_completed", value: 8 },
    xpReward: 300
  }
];

export const tierColors = {
  bronze: {
    bg: "bg-amber-900/20",
    border: "border-amber-700/30",
    text: "text-amber-500",
    glow: "shadow-amber-500/20"
  },
  silver: {
    bg: "bg-slate-400/20",
    border: "border-slate-400/30",
    text: "text-slate-300",
    glow: "shadow-slate-300/20"
  },
  gold: {
    bg: "bg-yellow-500/20",
    border: "border-yellow-500/30",
    text: "text-yellow-400",
    glow: "shadow-yellow-400/30"
  },
  platinum: {
    bg: "bg-cyan-400/20",
    border: "border-cyan-400/30",
    text: "text-cyan-300",
    glow: "shadow-cyan-300/30"
  }
};

export const categoryLabels = {
  quiz: "Quiz Mastery",
  xp: "Experience",
  streak: "Consistency",
  special: "Special"
};
