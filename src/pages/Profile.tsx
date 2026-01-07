import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  User, Trophy, Flame, BookOpen, Calendar, Award, 
  TrendingUp, Star, Target, Zap 
} from 'lucide-react';
import { achievements } from '@/data/achievementData';

interface ProfileData {
  username: string | null;
  total_xp: number;
  current_streak: number;
  longest_streak: number;
  modules_completed: number;
  quizzes_completed: number;
}

interface UserAchievement {
  achievement_id: string;
  unlocked_at: string;
}

interface DailyChallenge {
  challenge_id: string;
  completed_date: string;
  xp_earned: number;
}

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [recentChallenges, setRecentChallenges] = useState<DailyChallenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    if (!user) return;

    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch achievements
      const { data: achievementsData } = await supabase
        .from('user_achievements')
        .select('achievement_id, unlocked_at')
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false });

      if (achievementsData) {
        setUserAchievements(achievementsData);
      }

      // Fetch recent challenges
      const { data: challengesData } = await supabase
        .from('user_daily_challenges')
        .select('challenge_id, completed_date, xp_earned')
        .eq('user_id', user.id)
        .order('completed_date', { ascending: false })
        .limit(10);

      if (challengesData) {
        setRecentChallenges(challengesData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevel = (xp: number) => {
    return Math.floor(xp / 500) + 1;
  };

  const getXpProgress = (xp: number) => {
    return (xp % 500) / 500 * 100;
  };

  const getUnlockedAchievements = () => {
    return achievements.filter(a => 
      userAchievements.some(ua => ua.achievement_id === a.id)
    );
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="space-y-6">
            <Skeleton className="h-40 w-full" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!user) return null;

  const level = profile ? getLevel(profile.total_xp) : 1;
  const xpProgress = profile ? getXpProgress(profile.total_xp) : 0;
  const unlockedAchievements = getUnlockedAchievements();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Profile Header */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-primary/20 via-mint/20 to-sky/20 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-mint to-sky flex items-center justify-center ring-4 ring-background">
                  <User className="h-12 w-12 text-background" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                  Lvl {level}
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold">
                  {profile?.username || user.email?.split('@')[0] || 'Eco Learner'}
                </h1>
                <p className="text-muted-foreground mt-1">{user.email}</p>
                
                <div className="mt-4 max-w-md">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Level {level} Progress</span>
                    <span className="font-medium">{profile?.total_xp || 0} XP</span>
                  </div>
                  <Progress value={xpProgress} className="h-3" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {500 - ((profile?.total_xp || 0) % 500)} XP to Level {level + 1}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Zap}
            label="Total XP"
            value={profile?.total_xp || 0}
            color="text-yellow-500"
          />
          <StatCard
            icon={Flame}
            label="Current Streak"
            value={`${profile?.current_streak || 0} days`}
            color="text-orange-500"
          />
          <StatCard
            icon={BookOpen}
            label="Quizzes Done"
            value={profile?.quizzes_completed || 0}
            color="text-mint"
          />
          <StatCard
            icon={Award}
            label="Badges Earned"
            value={unlockedAchievements.length}
            color="text-purple-500"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Achievements Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Earned Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              {unlockedAchievements.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {unlockedAchievements.slice(0, 6).map((achievement) => {
                    const IconComponent = achievement.icon;
                    return (
                      <div
                        key={achievement.id}
                        className="flex flex-col items-center p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="text-3xl mb-2">
                          <IconComponent className="h-8 w-8 text-mint" />
                        </div>
                        <span className="text-xs text-center font-medium line-clamp-2">
                          {achievement.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Award className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No badges earned yet</p>
                  <p className="text-sm">Complete quizzes and challenges to earn badges!</p>
                </div>
              )}
              {unlockedAchievements.length > 6 && (
                <p className="text-sm text-muted-foreground text-center mt-4">
                  +{unlockedAchievements.length - 6} more badges
                </p>
              )}
            </CardContent>
          </Card>

          {/* Recent Challenges Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-mint" />
                Recent Challenges
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentChallenges.length > 0 ? (
                <div className="space-y-3">
                  {recentChallenges.slice(0, 5).map((challenge, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-mint/20 flex items-center justify-center">
                          <Target className="h-4 w-4 text-mint" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Challenge Completed</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(challenge.completed_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-mint/10 text-mint">
                        +{challenge.xp_earned} XP
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No challenges completed yet</p>
                  <p className="text-sm">Check out daily challenges to start earning XP!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* XP Milestones */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-sky" />
              XP Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              {[100, 500, 1000, 2500, 5000, 10000].map((milestone) => {
                const reached = (profile?.total_xp || 0) >= milestone;
                return (
                  <div
                    key={milestone}
                    className={`flex-shrink-0 flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                      reached
                        ? 'border-mint bg-mint/10'
                        : 'border-muted bg-muted/30 opacity-60'
                    }`}
                  >
                    <Star
                      className={`h-6 w-6 mb-2 ${
                        reached ? 'text-mint fill-mint' : 'text-muted-foreground'
                      }`}
                    />
                    <span className="font-bold">{milestone.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground">XP</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}

const StatCard = ({ icon: Icon, label, value, color }: StatCardProps) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-muted ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default Profile;
