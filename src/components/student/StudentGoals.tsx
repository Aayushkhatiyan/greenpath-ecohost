import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, Trophy, Flame, BookOpen, Zap, Award, Clock } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

interface LearningGoal {
  id: string;
  student_id: string;
  title: string;
  description: string | null;
  goal_type: string;
  target_value: number;
  current_value: number;
  deadline: string | null;
  status: string;
  created_at: string;
}

interface StudentGoalsProps {
  totalXp: number;
  currentStreak: number;
  quizzesCompleted: number;
  modulesCompleted: number;
  challengesCompleted: number;
}

const goalTypeConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  xp: { label: 'XP Points', icon: <Zap className="h-5 w-5" />, color: 'text-yellow-500' },
  quizzes: { label: 'Quizzes', icon: <BookOpen className="h-5 w-5" />, color: 'text-blue-500' },
  challenges: { label: 'Challenges', icon: <Target className="h-5 w-5" />, color: 'text-purple-500' },
  streak: { label: 'Day Streak', icon: <Flame className="h-5 w-5" />, color: 'text-orange-500' },
  modules: { label: 'Modules', icon: <Award className="h-5 w-5" />, color: 'text-green-500' },
};

const StudentGoals: React.FC<StudentGoalsProps> = ({
  totalXp,
  currentStreak,
  quizzesCompleted,
  modulesCompleted,
  challengesCompleted
}) => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<LearningGoal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('learning_goals')
      .select('*')
      .eq('student_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Failed to fetch goals:', error);
    } else {
      setGoals(data || []);
    }
    setLoading(false);
  };

  const getCurrentValue = (goalType: string): number => {
    switch (goalType) {
      case 'xp':
        return totalXp;
      case 'quizzes':
        return quizzesCompleted;
      case 'challenges':
        return challengesCompleted;
      case 'streak':
        return currentStreak;
      case 'modules':
        return modulesCompleted;
      default:
        return 0;
    }
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min(100, Math.round((current / target) * 100));
  };

  const getStatusInfo = (goal: LearningGoal) => {
    const currentValue = getCurrentValue(goal.goal_type);
    const progress = getProgressPercentage(currentValue, goal.target_value);
    
    if (progress >= 100) {
      return { label: 'Completed', variant: 'default' as const, className: 'bg-green-500' };
    }
    if (goal.deadline && new Date(goal.deadline) < new Date()) {
      return { label: 'Expired', variant: 'destructive' as const, className: '' };
    }
    if (progress >= 75) {
      return { label: 'Almost There!', variant: 'default' as const, className: 'bg-yellow-500' };
    }
    return { label: 'In Progress', variant: 'secondary' as const, className: '' };
  };

  const getDaysRemaining = (deadline: string) => {
    const days = differenceInDays(new Date(deadline), new Date());
    if (days < 0) return 'Overdue';
    if (days === 0) return 'Due today';
    if (days === 1) return '1 day left';
    return `${days} days left`;
  };

  const activeGoals = goals.filter(g => {
    const current = getCurrentValue(g.goal_type);
    return getProgressPercentage(current, g.target_value) < 100;
  });

  const completedGoals = goals.filter(g => {
    const current = getCurrentValue(g.goal_type);
    return getProgressPercentage(current, g.target_value) >= 100;
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            My Learning Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">Loading goals...</p>
        </CardContent>
      </Card>
    );
  }

  if (goals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            My Learning Goals
          </CardTitle>
          <CardDescription>Goals assigned by your instructor</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No learning goals assigned yet.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Your instructor will set goals for you to track your progress.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeGoals.length}</p>
                <p className="text-sm text-muted-foreground">Active Goals</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-full">
                <Trophy className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedGoals.length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-500/10 rounded-full">
                <Zap className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {goals.length > 0 
                    ? Math.round(goals.reduce((sum, g) => {
                        const current = getCurrentValue(g.goal_type);
                        return sum + getProgressPercentage(current, g.target_value);
                      }, 0) / goals.length)
                    : 0}%
                </p>
                <p className="text-sm text-muted-foreground">Avg Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Active Goals
            </CardTitle>
            <CardDescription>Goals you're currently working on</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeGoals.map(goal => {
              const currentValue = getCurrentValue(goal.goal_type);
              const progress = getProgressPercentage(currentValue, goal.target_value);
              const status = getStatusInfo(goal);
              const config = goalTypeConfig[goal.goal_type];
              
              return (
                <div key={goal.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg bg-muted ${config?.color}`}>
                        {config?.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold">{goal.title}</h4>
                        {goal.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {goal.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge className={status.className} variant={status.variant}>
                      {status.label}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {currentValue} / {goal.target_value} {config?.label.toLowerCase()}
                      </span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  
                  {goal.deadline && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Deadline: {format(new Date(goal.deadline), 'MMM d, yyyy')}</span>
                      <Badge variant="outline" className="ml-2">
                        {getDaysRemaining(goal.deadline)}
                      </Badge>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-green-500" />
              Completed Goals
            </CardTitle>
            <CardDescription>Goals you've achieved</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {completedGoals.map(goal => {
              const config = goalTypeConfig[goal.goal_type];
              
              return (
                <div key={goal.id} className="p-3 border rounded-lg flex items-center gap-3 bg-green-500/5">
                  <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                    {config?.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{goal.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {goal.target_value} {config?.label.toLowerCase()} achieved
                    </p>
                  </div>
                  <Badge className="bg-green-500">
                    <Trophy className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentGoals;
