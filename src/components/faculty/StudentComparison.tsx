import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { Users, X, Trophy, Flame, BookOpen, Target, Award, TrendingUp } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

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

interface StudentComparisonProps {
  students: StudentProfile[];
  quizProgress: StudentQuizProgress[];
  challenges: StudentChallenge[];
  achievements: StudentAchievement[];
  selectedForComparison: string[];
  onToggleStudent: (userId: string) => void;
  onClearSelection: () => void;
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

const chartConfig = {
  student1: { label: "Student 1", color: "hsl(var(--primary))" },
  student2: { label: "Student 2", color: "hsl(var(--chart-2))" },
  student3: { label: "Student 3", color: "hsl(var(--chart-3))" },
  student4: { label: "Student 4", color: "hsl(var(--chart-4))" },
  student5: { label: "Student 5", color: "hsl(var(--chart-5))" },
};

export const StudentComparison: React.FC<StudentComparisonProps> = ({
  students,
  quizProgress,
  challenges,
  achievements,
  selectedForComparison,
  onToggleStudent,
  onClearSelection,
}) => {
  const selectedStudents = useMemo(() => 
    students.filter(s => selectedForComparison.includes(s.user_id)),
    [students, selectedForComparison]
  );

  const getStudentStats = (userId: string) => {
    const studentQuizzes = quizProgress.filter(q => q.user_id === userId);
    const studentChallenges = challenges.filter(c => c.user_id === userId);
    const studentAchievements = achievements.filter(a => a.user_id === userId);
    const avgScore = studentQuizzes.length > 0 
      ? Math.round(studentQuizzes.reduce((sum, q) => sum + q.score, 0) / studentQuizzes.length)
      : 0;

    return {
      quizCount: studentQuizzes.length,
      challengeCount: studentChallenges.length,
      achievementCount: studentAchievements.length,
      avgScore,
      totalChallengeXP: studentChallenges.reduce((sum, c) => sum + c.xp_earned, 0),
    };
  };

  // Bar chart data for direct comparison
  const barChartData = useMemo(() => {
    const metrics = ['Total XP', 'Current Streak', 'Quizzes', 'Challenges', 'Badges'];
    
    return metrics.map(metric => {
      const data: Record<string, string | number> = { metric };
      
      selectedStudents.forEach((student, index) => {
        const stats = getStudentStats(student.user_id);
        const key = `student${index + 1}`;
        
        switch (metric) {
          case 'Total XP':
            data[key] = student.total_xp;
            break;
          case 'Current Streak':
            data[key] = student.current_streak;
            break;
          case 'Quizzes':
            data[key] = stats.quizCount;
            break;
          case 'Challenges':
            data[key] = stats.challengeCount;
            break;
          case 'Badges':
            data[key] = stats.achievementCount;
            break;
        }
      });
      
      return data;
    });
  }, [selectedStudents]);

  // Radar chart data for skill comparison
  const radarData = useMemo(() => {
    const maxXP = Math.max(...students.map(s => s.total_xp), 1);
    const maxStreak = Math.max(...students.map(s => s.current_streak), 1);
    const maxQuizzes = Math.max(...students.map(s => quizProgress.filter(q => q.user_id === s.user_id).length), 1);
    const maxChallenges = Math.max(...students.map(s => challenges.filter(c => c.user_id === s.user_id).length), 1);
    const maxBadges = Math.max(...students.map(s => achievements.filter(a => a.user_id === s.user_id).length), 1);

    const categories = [
      { name: 'XP', maxValue: maxXP },
      { name: 'Streak', maxValue: maxStreak },
      { name: 'Quizzes', maxValue: maxQuizzes },
      { name: 'Challenges', maxValue: maxChallenges },
      { name: 'Badges', maxValue: maxBadges },
    ];

    return categories.map(cat => {
      const data: Record<string, string | number> = { category: cat.name };
      
      selectedStudents.forEach((student, index) => {
        const stats = getStudentStats(student.user_id);
        const key = `student${index + 1}`;
        let value = 0;
        
        switch (cat.name) {
          case 'XP':
            value = (student.total_xp / cat.maxValue) * 100;
            break;
          case 'Streak':
            value = (student.current_streak / cat.maxValue) * 100;
            break;
          case 'Quizzes':
            value = (stats.quizCount / cat.maxValue) * 100;
            break;
          case 'Challenges':
            value = (stats.challengeCount / cat.maxValue) * 100;
            break;
          case 'Badges':
            value = (stats.achievementCount / cat.maxValue) * 100;
            break;
        }
        
        data[key] = Math.round(value);
      });
      
      return data;
    });
  }, [selectedStudents, students, quizProgress, challenges, achievements]);

  return (
    <div className="grid lg:grid-cols-4 gap-6">
      {/* Student Selection Panel */}
      <Card className="lg:col-span-1">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Select Students</CardTitle>
            {selectedForComparison.length > 0 && (
              <Button variant="ghost" size="sm" onClick={onClearSelection}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
          <CardDescription>
            Choose up to 5 students to compare
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-2">
              {students.map((student, index) => {
                const isSelected = selectedForComparison.includes(student.user_id);
                const colorIndex = selectedForComparison.indexOf(student.user_id);
                
                return (
                  <div
                    key={student.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      isSelected ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => onToggleStudent(student.user_id)}
                  >
                    <Checkbox
                      checked={isSelected}
                      disabled={!isSelected && selectedForComparison.length >= 5}
                    />
                    {isSelected && (
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: COLORS[colorIndex] }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {student.username || 'Anonymous'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {student.total_xp.toLocaleString()} XP
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Comparison Content */}
      <div className="lg:col-span-3 space-y-6">
        {selectedForComparison.length < 2 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Select Students to Compare</h3>
              <p className="text-muted-foreground">
                Choose at least 2 students from the list to see a side-by-side comparison
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Selected Students Overview */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {selectedStudents.map((student, index) => {
                const stats = getStudentStats(student.user_id);
                return (
                  <Card key={student.id} className="relative overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 right-0 h-1" 
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <CardContent className="pt-4 pb-3 px-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div 
                          className="w-2 h-2 rounded-full flex-shrink-0" 
                          style={{ backgroundColor: COLORS[index] }}
                        />
                        <p className="font-semibold text-sm truncate">
                          {student.username || 'Anonymous'}
                        </p>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">XP</span>
                          <span className="font-medium">{student.total_xp.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Avg Score</span>
                          <span className="font-medium">{stats.avgScore}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Streak</span>
                          <span className="font-medium">{student.current_streak}d</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Charts Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Bar Chart Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Metrics Comparison
                  </CardTitle>
                  <CardDescription>Side-by-side performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <BarChart data={barChartData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" tick={{ fontSize: 11 }} />
                      <YAxis 
                        dataKey="metric" 
                        type="category" 
                        tick={{ fontSize: 11 }} 
                        width={80}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      {selectedStudents.map((student, index) => (
                        <Bar 
                          key={student.user_id}
                          dataKey={`student${index + 1}`}
                          fill={COLORS[index]}
                          name={student.username || 'Anonymous'}
                          radius={[0, 4, 4, 0]}
                        />
                      ))}
                    </BarChart>
                  </ChartContainer>
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {selectedStudents.map((student, index) => (
                      <div key={student.user_id} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded" 
                          style={{ backgroundColor: COLORS[index] }}
                        />
                        <span className="text-sm">{student.username || 'Anonymous'}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Radar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Performance Profile
                  </CardTitle>
                  <CardDescription>Relative strengths across categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                      <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                        <PolarGrid className="stroke-muted" />
                        <PolarAngleAxis dataKey="category" tick={{ fontSize: 11 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                        {selectedStudents.map((student, index) => (
                          <Radar
                            key={student.user_id}
                            name={student.username || 'Anonymous'}
                            dataKey={`student${index + 1}`}
                            stroke={COLORS[index]}
                            fill={COLORS[index]}
                            fillOpacity={0.2}
                            strokeWidth={2}
                          />
                        ))}
                        <Legend />
                      </RadarChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Stats Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Detailed Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Metric</th>
                        {selectedStudents.map((student, index) => (
                          <th key={student.user_id} className="text-center py-3 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <div 
                                className="w-2 h-2 rounded-full" 
                                style={{ backgroundColor: COLORS[index] }}
                              />
                              <span className="font-medium">{student.username || 'Anonymous'}</span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 px-4 flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          Total XP
                        </td>
                        {selectedStudents.map(student => (
                          <td key={student.user_id} className="text-center py-3 px-4 font-semibold">
                            {student.total_xp.toLocaleString()}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 flex items-center gap-2">
                          <Flame className="h-4 w-4 text-orange-500" />
                          Current Streak
                        </td>
                        {selectedStudents.map(student => (
                          <td key={student.user_id} className="text-center py-3 px-4">
                            {student.current_streak} days
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 flex items-center gap-2">
                          <Flame className="h-4 w-4 text-red-500" />
                          Longest Streak
                        </td>
                        {selectedStudents.map(student => (
                          <td key={student.user_id} className="text-center py-3 px-4">
                            {student.longest_streak} days
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-blue-500" />
                          Quizzes Completed
                        </td>
                        {selectedStudents.map(student => {
                          const stats = getStudentStats(student.user_id);
                          return (
                            <td key={student.user_id} className="text-center py-3 px-4">
                              {stats.quizCount}
                            </td>
                          );
                        })}
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-green-500" />
                          Average Quiz Score
                        </td>
                        {selectedStudents.map(student => {
                          const stats = getStudentStats(student.user_id);
                          return (
                            <td key={student.user_id} className="text-center py-3 px-4">
                              <Badge variant={stats.avgScore >= 70 ? "default" : "secondary"}>
                                {stats.avgScore}%
                              </Badge>
                            </td>
                          );
                        })}
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 flex items-center gap-2">
                          <Target className="h-4 w-4 text-purple-500" />
                          Challenges Completed
                        </td>
                        {selectedStudents.map(student => {
                          const stats = getStudentStats(student.user_id);
                          return (
                            <td key={student.user_id} className="text-center py-3 px-4">
                              {stats.challengeCount}
                            </td>
                          );
                        })}
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 flex items-center gap-2">
                          <Award className="h-4 w-4 text-amber-500" />
                          Badges Earned
                        </td>
                        {selectedStudents.map(student => {
                          const stats = getStudentStats(student.user_id);
                          return (
                            <td key={student.user_id} className="text-center py-3 px-4">
                              {stats.achievementCount}
                            </td>
                          );
                        })}
                      </tr>
                      <tr>
                        <td className="py-3 px-4 flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          Member Since
                        </td>
                        {selectedStudents.map(student => (
                          <td key={student.user_id} className="text-center py-3 px-4 text-sm text-muted-foreground">
                            {new Date(student.created_at).toLocaleDateString()}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentComparison;
