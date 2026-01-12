import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, BarChart3, Activity, PieChart as PieChartIcon } from 'lucide-react';
import { format, subDays, eachDayOfInterval, startOfDay } from 'date-fns';

interface StudentQuizProgress {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  completed_at: string;
}

interface StudentChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  completed_date: string;
  xp_earned: number;
}

interface StudentAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
}

interface StudentProfile {
  id: string;
  user_id: string;
  username: string | null;
  total_xp: number;
  current_streak: number;
  longest_streak: number;
  quizzes_completed: number;
  modules_completed: number;
  created_at: string;
}

interface ProgressChartsProps {
  quizProgress: StudentQuizProgress[];
  challenges: StudentChallenge[];
  achievements: StudentAchievement[];
  students: StudentProfile[];
}

const chartConfig = {
  quizzes: {
    label: "Quizzes",
    color: "hsl(var(--primary))",
  },
  challenges: {
    label: "Challenges",
    color: "hsl(var(--chart-2))",
  },
  achievements: {
    label: "Achievements",
    color: "hsl(var(--chart-3))",
  },
  xp: {
    label: "XP Earned",
    color: "hsl(var(--chart-4))",
  },
  score: {
    label: "Avg Score",
    color: "hsl(var(--chart-5))",
  },
};

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export const ProgressCharts: React.FC<ProgressChartsProps> = ({
  quizProgress,
  challenges,
  achievements,
  students,
}) => {
  // Activity over time (last 30 days)
  const activityData = useMemo(() => {
    const today = new Date();
    const thirtyDaysAgo = subDays(today, 29);
    const days = eachDayOfInterval({ start: thirtyDaysAgo, end: today });

    return days.map(day => {
      const dayStart = startOfDay(day);
      const dayStr = format(day, 'yyyy-MM-dd');

      const quizCount = quizProgress.filter(q => 
        format(new Date(q.completed_at), 'yyyy-MM-dd') === dayStr
      ).length;

      const challengeCount = challenges.filter(c => 
        c.completed_date === dayStr
      ).length;

      const achievementCount = achievements.filter(a => 
        format(new Date(a.unlocked_at), 'yyyy-MM-dd') === dayStr
      ).length;

      return {
        date: format(day, 'MMM d'),
        quizzes: quizCount,
        challenges: challengeCount,
        achievements: achievementCount,
        total: quizCount + challengeCount + achievementCount,
      };
    });
  }, [quizProgress, challenges, achievements]);

  // XP earned over time
  const xpData = useMemo(() => {
    const today = new Date();
    const thirtyDaysAgo = subDays(today, 29);
    const days = eachDayOfInterval({ start: thirtyDaysAgo, end: today });

    return days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');

      const dailyXP = challenges
        .filter(c => c.completed_date === dayStr)
        .reduce((sum, c) => sum + c.xp_earned, 0);

      // Add XP from quizzes (estimate based on score)
      const quizXP = quizProgress
        .filter(q => format(new Date(q.completed_at), 'yyyy-MM-dd') === dayStr)
        .reduce((sum, q) => sum + Math.floor(q.score * 1.5), 0);

      return {
        date: format(day, 'MMM d'),
        xp: dailyXP + quizXP,
      };
    });
  }, [quizProgress, challenges]);

  // Quiz score distribution
  const scoreDistribution = useMemo(() => {
    const ranges = [
      { range: '0-20%', min: 0, max: 20, count: 0 },
      { range: '21-40%', min: 21, max: 40, count: 0 },
      { range: '41-60%', min: 41, max: 60, count: 0 },
      { range: '61-80%', min: 61, max: 80, count: 0 },
      { range: '81-100%', min: 81, max: 100, count: 0 },
    ];

    quizProgress.forEach(q => {
      const range = ranges.find(r => q.score >= r.min && q.score <= r.max);
      if (range) range.count++;
    });

    return ranges;
  }, [quizProgress]);

  // Student engagement levels
  const engagementData = useMemo(() => {
    const levels = [
      { name: 'Highly Active', value: 0 },
      { name: 'Active', value: 0 },
      { name: 'Moderate', value: 0 },
      { name: 'Low', value: 0 },
      { name: 'Inactive', value: 0 },
    ];

    students.forEach(student => {
      const quizCount = quizProgress.filter(q => q.user_id === student.user_id).length;
      const challengeCount = challenges.filter(c => c.user_id === student.user_id).length;
      const total = quizCount + challengeCount;

      if (total >= 20) levels[0].value++;
      else if (total >= 10) levels[1].value++;
      else if (total >= 5) levels[2].value++;
      else if (total >= 1) levels[3].value++;
      else levels[4].value++;
    });

    return levels.filter(l => l.value > 0);
  }, [students, quizProgress, challenges]);

  // Average quiz score over time
  const avgScoreData = useMemo(() => {
    const today = new Date();
    const thirtyDaysAgo = subDays(today, 29);
    const days = eachDayOfInterval({ start: thirtyDaysAgo, end: today });

    let runningTotal = 0;
    let runningCount = 0;

    return days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');

      const dayQuizzes = quizProgress.filter(q => 
        format(new Date(q.completed_at), 'yyyy-MM-dd') === dayStr
      );

      if (dayQuizzes.length > 0) {
        runningTotal += dayQuizzes.reduce((sum, q) => sum + q.score, 0);
        runningCount += dayQuizzes.length;
      }

      return {
        date: format(day, 'MMM d'),
        score: runningCount > 0 ? Math.round(runningTotal / runningCount) : null,
      };
    });
  }, [quizProgress]);

  return (
    <div className="grid gap-6">
      {/* Activity Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity Trend (Last 30 Days)
          </CardTitle>
          <CardDescription>Daily completions across quizzes, challenges, and achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fontSize: 12 }} tickLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area 
                type="monotone" 
                dataKey="quizzes" 
                stackId="1"
                stroke="hsl(var(--primary))" 
                fill="hsl(var(--primary))" 
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="challenges" 
                stackId="1"
                stroke="hsl(var(--chart-2))" 
                fill="hsl(var(--chart-2))" 
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="achievements" 
                stackId="1"
                stroke="hsl(var(--chart-3))" 
                fill="hsl(var(--chart-3))" 
                fillOpacity={0.6}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* XP Earned Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              XP Earned Daily
            </CardTitle>
            <CardDescription>Total XP earned by all students per day</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <LineChart data={xpData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 11 }} 
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="xp" 
                  stroke="hsl(var(--chart-4))" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Quiz Score Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Quiz Score Distribution
            </CardTitle>
            <CardDescription>How students are performing on quizzes</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart data={scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="range" tick={{ fontSize: 11 }} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Student Engagement Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Student Engagement Levels
            </CardTitle>
            <CardDescription>Distribution of student activity levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={engagementData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {engagementData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {engagementData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-muted-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Average Score Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Average Quiz Score Trend
            </CardTitle>
            <CardDescription>Running average of quiz scores over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <LineChart data={avgScoreData.filter(d => d.score !== null)}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 11 }} 
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  domain={[0, 100]} 
                  tick={{ fontSize: 11 }} 
                  tickLine={false}
                  tickFormatter={(value) => `${value}%`}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value) => [`${value}%`, 'Avg Score']}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="hsl(var(--chart-5))" 
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProgressCharts;
