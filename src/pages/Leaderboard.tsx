import { useState } from "react";
import { Trophy, Medal, Crown, Leaf, TrendingUp, TrendingDown, Minus, User } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

const leaderboardData = [
  { rank: 1, name: "EcoWarrior", avatar: "🌿", xp: 15420, modules: 48, streak: 45, trend: "up" },
  { rank: 2, name: "GreenQueen", avatar: "👑", xp: 14850, modules: 45, streak: 38, trend: "up" },
  { rank: 3, name: "NatureLover", avatar: "🌸", xp: 13200, modules: 42, streak: 32, trend: "same" },
  { rank: 4, name: "PlanetSaver", avatar: "🌍", xp: 12100, modules: 40, streak: 28, trend: "down" },
  { rank: 5, name: "RecycleKing", avatar: "♻️", xp: 11500, modules: 38, streak: 25, trend: "up" },
  { rank: 6, name: "SolarPunk", avatar: "☀️", xp: 10800, modules: 36, streak: 22, trend: "same" },
  { rank: 7, name: "TreeHugger", avatar: "🌲", xp: 9500, modules: 32, streak: 18, trend: "up" },
  { rank: 8, name: "OceanGuard", avatar: "🌊", xp: 8900, modules: 30, streak: 15, trend: "down" },
  { rank: 9, name: "WindRider", avatar: "💨", xp: 8200, modules: 28, streak: 12, trend: "same" },
  { rank: 10, name: "EarthChild", avatar: "🌱", xp: 7500, modules: 25, streak: 10, trend: "up" },
];

const currentUser = {
  rank: 47,
  name: "You",
  avatar: "😊",
  xp: 1250,
  modules: 8,
  streak: 5,
  trend: "up",
};

type TimeFilter = "weekly" | "monthly" | "all-time";

const Leaderboard = () => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("weekly");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="glass rounded-full px-4 py-2 mb-6 inline-flex items-center gap-2">
              <Trophy className="h-4 w-4 text-mint" />
              <span className="text-sm font-medium text-mint">Community Rankings</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Leaderboard</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Compete with eco-warriors worldwide and climb the ranks
            </p>
          </div>

          {/* Time Filter */}
          <div className="flex justify-center gap-2 mb-12">
            {(["weekly", "monthly", "all-time"] as TimeFilter[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={cn(
                  "px-6 py-2 rounded-lg font-medium transition-all",
                  timeFilter === filter
                    ? "bg-gradient-cosmic text-primary-foreground"
                    : "glass text-muted-foreground hover:text-foreground"
                )}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1).replace("-", " ")}
              </button>
            ))}
          </div>

          {/* Top 3 Podium */}
          <div className="flex justify-center items-end gap-4 mb-12">
            {/* 2nd Place */}
            <div className="flex flex-col items-center">
              <div className="glass rounded-2xl p-6 text-center w-[140px] md:w-[180px] mb-4 glow-violet">
                <div className="text-4xl mb-2">{leaderboardData[1].avatar}</div>
                <div className="font-display font-bold truncate">{leaderboardData[1].name}</div>
                <div className="text-sm text-muted-foreground">{leaderboardData[1].xp.toLocaleString()} XP</div>
              </div>
              <div className="glass rounded-xl p-3 flex items-center gap-2">
                <Medal className="h-5 w-5 text-gray-400" />
                <span className="font-bold">2nd</span>
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center -mt-8">
              <div className="relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Crown className="h-8 w-8 text-yellow-400" />
                </div>
                <div className="glass rounded-2xl p-8 text-center w-[160px] md:w-[200px] mb-4 glow-mint ring-2 ring-mint/30">
                  <div className="text-5xl mb-2">{leaderboardData[0].avatar}</div>
                  <div className="font-display text-xl font-bold truncate">{leaderboardData[0].name}</div>
                  <div className="text-mint font-medium">{leaderboardData[0].xp.toLocaleString()} XP</div>
                </div>
              </div>
              <div className="glass rounded-xl p-3 flex items-center gap-2 bg-mint/10">
                <Trophy className="h-5 w-5 text-mint" />
                <span className="font-bold text-mint">1st</span>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center">
              <div className="glass rounded-2xl p-6 text-center w-[140px] md:w-[180px] mb-4">
                <div className="text-4xl mb-2">{leaderboardData[2].avatar}</div>
                <div className="font-display font-bold truncate">{leaderboardData[2].name}</div>
                <div className="text-sm text-muted-foreground">{leaderboardData[2].xp.toLocaleString()} XP</div>
              </div>
              <div className="glass rounded-xl p-3 flex items-center gap-2">
                <Medal className="h-5 w-5 text-amber-600" />
                <span className="font-bold">3rd</span>
              </div>
            </div>
          </div>

          {/* Full Leaderboard Table */}
          <div className="glass rounded-2xl overflow-hidden max-w-4xl mx-auto">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-border/50 text-sm text-muted-foreground font-medium">
              <div className="col-span-1">Rank</div>
              <div className="col-span-5">Player</div>
              <div className="col-span-2 text-right">XP</div>
              <div className="col-span-2 text-right hidden sm:block">Modules</div>
              <div className="col-span-2 text-right hidden md:block">Streak</div>
            </div>

            {/* Rows */}
            {leaderboardData.slice(3).map((player) => (
              <div
                key={player.rank}
                className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-border/50 hover:bg-muted/30 transition-colors items-center"
              >
                <div className="col-span-1">
                  <span className="font-display font-bold text-muted-foreground">
                    #{player.rank}
                  </span>
                </div>
                <div className="col-span-5 flex items-center gap-3">
                  <span className="text-2xl">{player.avatar}</span>
                  <span className="font-medium truncate">{player.name}</span>
                  <TrendIndicator trend={player.trend} />
                </div>
                <div className="col-span-2 text-right font-display font-bold gradient-text">
                  {player.xp.toLocaleString()}
                </div>
                <div className="col-span-2 text-right text-muted-foreground hidden sm:block">
                  {player.modules}
                </div>
                <div className="col-span-2 text-right hidden md:block">
                  <span className="inline-flex items-center gap-1 text-mint">
                    🔥 {player.streak}
                  </span>
                </div>
              </div>
            ))}

            {/* Current User Row */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-mint/5 border-t-2 border-mint/30 items-center">
              <div className="col-span-1">
                <span className="font-display font-bold text-mint">
                  #{currentUser.rank}
                </span>
              </div>
              <div className="col-span-5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-cosmic flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-medium text-mint">{currentUser.name}</span>
                <TrendIndicator trend={currentUser.trend} />
              </div>
              <div className="col-span-2 text-right font-display font-bold text-mint">
                {currentUser.xp.toLocaleString()}
              </div>
              <div className="col-span-2 text-right text-muted-foreground hidden sm:block">
                {currentUser.modules}
              </div>
              <div className="col-span-2 text-right hidden md:block">
                <span className="inline-flex items-center gap-1 text-mint">
                  🔥 {currentUser.streak}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const TrendIndicator = ({ trend }: { trend: string }) => {
  if (trend === "up") {
    return <TrendingUp className="h-4 w-4 text-mint" />;
  }
  if (trend === "down") {
    return <TrendingDown className="h-4 w-4 text-destructive" />;
  }
  return <Minus className="h-4 w-4 text-muted-foreground" />;
};

export default Leaderboard;
