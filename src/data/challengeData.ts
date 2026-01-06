import { 
  Leaf, Droplets, Zap, Recycle, ShoppingBag, Car, 
  Utensils, Home, TreePine, Sun, Wind, Bike,
  Coffee, Shirt, Lightbulb, Thermometer
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  tip: string;
  icon: LucideIcon;
  category: "water" | "energy" | "waste" | "transport" | "food" | "lifestyle";
  xpReward: number;
  difficulty: "easy" | "medium" | "hard";
  impactMetric: string;
}

export const dailyChallenges: DailyChallenge[] = [
  // Water Challenges
  {
    id: "shorter_shower",
    title: "5-Minute Shower Challenge",
    description: "Take a shower under 5 minutes today",
    tip: "Play a short song to time yourself!",
    icon: Droplets,
    category: "water",
    xpReward: 30,
    difficulty: "easy",
    impactMetric: "Saves ~10 gallons of water"
  },
  {
    id: "turn_off_tap",
    title: "Tap Guardian",
    description: "Turn off the tap while brushing teeth and washing hands",
    tip: "You can save 8 gallons per day just from brushing!",
    icon: Droplets,
    category: "water",
    xpReward: 20,
    difficulty: "easy",
    impactMetric: "Saves ~8 gallons of water"
  },
  {
    id: "full_load_laundry",
    title: "Full Load Only",
    description: "Only run washing machine with a full load",
    tip: "Wait until you have enough clothes for a complete load",
    icon: Droplets,
    category: "water",
    xpReward: 25,
    difficulty: "easy",
    impactMetric: "Saves ~20 gallons per load"
  },

  // Energy Challenges
  {
    id: "unplug_devices",
    title: "Phantom Power Hunter",
    description: "Unplug 5 devices not in use to eliminate phantom power",
    tip: "Check chargers, TVs, and kitchen appliances",
    icon: Zap,
    category: "energy",
    xpReward: 35,
    difficulty: "easy",
    impactMetric: "Saves ~0.5 kWh daily"
  },
  {
    id: "natural_light",
    title: "Sunshine Day",
    description: "Use only natural light until sunset",
    tip: "Open curtains and blinds to maximize daylight",
    icon: Sun,
    category: "energy",
    xpReward: 40,
    difficulty: "medium",
    impactMetric: "Saves ~1 kWh of electricity"
  },
  {
    id: "thermostat_adjust",
    title: "Temperature Tweak",
    description: "Adjust thermostat 2°F closer to outside temperature",
    tip: "Layer up in winter, dress light in summer",
    icon: Thermometer,
    category: "energy",
    xpReward: 45,
    difficulty: "medium",
    impactMetric: "Reduces heating/cooling by 6%"
  },
  {
    id: "led_switch",
    title: "LED Champion",
    description: "Replace one incandescent bulb with LED",
    tip: "LEDs use 75% less energy and last 25x longer",
    icon: Lightbulb,
    category: "energy",
    xpReward: 50,
    difficulty: "medium",
    impactMetric: "Saves ~$75 over bulb lifetime"
  },

  // Waste Challenges
  {
    id: "zero_plastic",
    title: "Plastic-Free Morning",
    description: "Avoid single-use plastics until noon",
    tip: "Use reusable water bottle, containers, and bags",
    icon: Recycle,
    category: "waste",
    xpReward: 40,
    difficulty: "medium",
    impactMetric: "Prevents ~5 plastic items from waste"
  },
  {
    id: "compost_today",
    title: "Compost Champion",
    description: "Compost all food scraps from meals today",
    tip: "Fruit peels, veggie scraps, coffee grounds all work!",
    icon: Leaf,
    category: "waste",
    xpReward: 35,
    difficulty: "medium",
    impactMetric: "Diverts ~1 lb from landfill"
  },
  {
    id: "repair_item",
    title: "Fix It First",
    description: "Repair something instead of throwing it away",
    tip: "Sew a button, fix a tear, or glue something broken",
    icon: Home,
    category: "waste",
    xpReward: 60,
    difficulty: "hard",
    impactMetric: "Extends item life significantly"
  },
  {
    id: "declutter_donate",
    title: "Declutter & Donate",
    description: "Find 5 items to donate instead of trash",
    tip: "Clothes, books, and kitchenware are always needed",
    icon: ShoppingBag,
    category: "waste",
    xpReward: 50,
    difficulty: "medium",
    impactMetric: "Gives items second life"
  },

  // Transport Challenges
  {
    id: "walk_errands",
    title: "Walk It Out",
    description: "Walk instead of drive for one errand today",
    tip: "Great for short trips under 1 mile",
    icon: TreePine,
    category: "transport",
    xpReward: 45,
    difficulty: "medium",
    impactMetric: "Saves ~1 lb CO2 per mile"
  },
  {
    id: "bike_commute",
    title: "Pedal Power",
    description: "Use a bike for transportation today",
    tip: "Even a short bike ride makes a difference",
    icon: Bike,
    category: "transport",
    xpReward: 55,
    difficulty: "medium",
    impactMetric: "Zero emissions transport"
  },
  {
    id: "carpool_day",
    title: "Carpool Connection",
    description: "Share a ride with someone today",
    tip: "Coordinate with coworkers or neighbors",
    icon: Car,
    category: "transport",
    xpReward: 50,
    difficulty: "medium",
    impactMetric: "Cuts emissions in half"
  },
  {
    id: "public_transit",
    title: "Transit Rider",
    description: "Use public transportation instead of driving",
    tip: "Buses and trains are much more efficient per person",
    icon: Wind,
    category: "transport",
    xpReward: 45,
    difficulty: "medium",
    impactMetric: "Saves ~20 lbs CO2 vs driving"
  },

  // Food Challenges
  {
    id: "meatless_meal",
    title: "Meatless Meal",
    description: "Enjoy one completely plant-based meal today",
    tip: "Try a veggie stir-fry, salad, or pasta primavera",
    icon: Utensils,
    category: "food",
    xpReward: 35,
    difficulty: "easy",
    impactMetric: "Saves ~6 lbs CO2 equivalent"
  },
  {
    id: "local_food",
    title: "Local Foodie",
    description: "Buy or eat something produced locally",
    tip: "Check farmers markets or local sections in stores",
    icon: Leaf,
    category: "food",
    xpReward: 40,
    difficulty: "medium",
    impactMetric: "Reduces food miles significantly"
  },
  {
    id: "no_food_waste",
    title: "Clean Plate Club",
    description: "Eat all leftovers and avoid food waste today",
    tip: "Plan portions carefully and save extras",
    icon: Utensils,
    category: "food",
    xpReward: 30,
    difficulty: "easy",
    impactMetric: "Prevents food waste emissions"
  },
  {
    id: "reusable_cup",
    title: "BYOC (Bring Your Own Cup)",
    description: "Use a reusable cup for all beverages today",
    tip: "Keep one in your bag or car for convenience",
    icon: Coffee,
    category: "food",
    xpReward: 25,
    difficulty: "easy",
    impactMetric: "Saves 1-3 disposable cups"
  },

  // Lifestyle Challenges
  {
    id: "eco_learning",
    title: "Eco Education",
    description: "Learn one new fact about sustainability today",
    tip: "Read an article, watch a documentary clip, or take a quiz!",
    icon: Leaf,
    category: "lifestyle",
    xpReward: 25,
    difficulty: "easy",
    impactMetric: "Knowledge is power!"
  },
  {
    id: "share_knowledge",
    title: "Spread the Word",
    description: "Share an eco-tip with a friend or family member",
    tip: "Personal conversations make the biggest impact",
    icon: TreePine,
    category: "lifestyle",
    xpReward: 40,
    difficulty: "easy",
    impactMetric: "Multiplies your impact"
  },
  {
    id: "air_dry_clothes",
    title: "Sun-Dried Fresh",
    description: "Air dry your clothes instead of using the dryer",
    tip: "Use a drying rack or clothesline",
    icon: Sun,
    category: "lifestyle",
    xpReward: 45,
    difficulty: "medium",
    impactMetric: "Saves ~3 kWh per load"
  },
  {
    id: "secondhand_first",
    title: "Secondhand First",
    description: "Check thrift stores before buying new",
    tip: "Great for clothes, books, furniture, and more",
    icon: Shirt,
    category: "lifestyle",
    xpReward: 50,
    difficulty: "medium",
    impactMetric: "Reduces manufacturing demand"
  }
];

export const categoryColors = {
  water: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
  energy: { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/30" },
  waste: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30" },
  transport: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" },
  food: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/30" },
  lifestyle: { bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/30" }
};

export const difficultyColors = {
  easy: "text-mint",
  medium: "text-yellow-400",
  hard: "text-orange-500"
};

// Get today's challenges based on the date
export const getTodaysChallenges = (count: number = 3): DailyChallenge[] => {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // Use day of year as seed for pseudo-random but consistent daily selection
  const shuffled = [...dailyChallenges].sort((a, b) => {
    const hashA = (a.id.charCodeAt(0) * dayOfYear) % 100;
    const hashB = (b.id.charCodeAt(0) * dayOfYear) % 100;
    return hashA - hashB;
  });
  
  // Ensure variety - pick from different categories
  const categories = ["water", "energy", "waste", "transport", "food", "lifestyle"];
  const selected: DailyChallenge[] = [];
  
  for (let i = 0; i < count && selected.length < count; i++) {
    const categoryIndex = (dayOfYear + i) % categories.length;
    const category = categories[categoryIndex];
    const fromCategory = shuffled.find(
      c => c.category === category && !selected.includes(c)
    );
    if (fromCategory) {
      selected.push(fromCategory);
    }
  }
  
  // Fill remaining slots if needed
  while (selected.length < count) {
    const remaining = shuffled.find(c => !selected.includes(c));
    if (remaining) selected.push(remaining);
    else break;
  }
  
  return selected;
};
