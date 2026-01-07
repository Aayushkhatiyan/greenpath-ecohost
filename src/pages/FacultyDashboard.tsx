import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Users, Trophy, Flame, BookOpen, Award, Search, TrendingUp, Target } from 'lucide-react';
import { achievements } from '@/data/achievementData';
import { quizData } from '@/data/quizData';
import { dailyChallenges } from '@/data/challengeData';

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

interface StudentAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
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

const FacultyDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [allAchievements, setAllAchievements] = useState<StudentAchievement[]>([]);
  const [allQuizProgress, setAllQuizProgress] = useState<StudentQuizProgress[]>([]);
  const [allChallenges, setAllChallenges] = useState<StudentChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFaculty, setIsFaculty] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  useEffect(() => {
    const checkFacultyRole = async () => {
      if (!user) return;
      
      const { data } = await supabase.rpc('has_role', { 
        _user_id: user.id, 
        _role: 'faculty' 
      });
      
      setIsFaculty(data === true);
      
      if (data !== true) {
        navigate('/');
      }
    };

    if (user) {
      checkFacultyRole();
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!isFaculty) return;
      
      setLoading(true);
      
      const [profilesRes, achievementsRes, quizRes, challengesRes] = await Promise.all([
        supabase.from('profiles').select('*').order('total_xp', { ascending: false }),
        supabase.from('user_achievements').select('*'),
        supabase.from('user_quiz_progress').select('*'),
        supabase.from('user_daily_challenges').select('*')
      ]);

      if (profilesRes.data) setStudents(profilesRes.data);
      if (achievementsRes.data) setAllAchievements(achievementsRes.data);
      if (quizRes.data) setAllQuizProgress(quizRes.data);
      if (challengesRes.data) setAllChallenges(challengesRes.data);
      
      setLoading(false);
    };

    if (isFaculty) {
      fetchAllData();
    }
  }, [isFaculty]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user || !isFaculty) {
    return null;
  }

  const filteredStudents = students.filter(student =>
    student.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.user_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalXP = students.reduce((sum, s) => sum + s.total_xp, 0);
  const avgXP = students.length > 0 ? Math.round(totalXP / students.length) : 0;
  const totalQuizzes = allQuizProgress.length;
  const totalChallengesCompleted = allChallenges.length;

  const getStudentAchievements = (userId: string) =>
    allAchievements.filter(a => a.user_id === userId);

  const getStudentQuizzes = (userId: string) =>
    allQuizProgress.filter(q => q.user_id === userId);

  const getStudentChallenges = (userId: string) =>
    allChallenges.filter(c => c.user_id === userId);

  const getAchievementName = (achievementId: string) =>
    achievements.find(a => a.id === achievementId)?.name || achievementId;

  const getQuizName = (quizId: string) =>
    quizData.find(q => q.moduleId.toString() === quizId)?.title || `Quiz ${quizId}`;

  const getChallengeName = (challengeId: string) =>
    dailyChallenges.find(c => c.id === challengeId)?.title || challengeId;

  const selectedStudentData = selectedStudent
    ? students.find(s => s.user_id === selectedStudent)
    : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Faculty Dashboard</h1>
          <p className="text-muted-foreground">Monitor student progress and performance</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{students.length}</p>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-500/10 rounded-full">
                  <TrendingUp className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{avgXP}</p>
                  <p className="text-sm text-muted-foreground">Average XP</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-full">
                  <BookOpen className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalQuizzes}</p>
                  <p className="text-sm text-muted-foreground">Quizzes Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-full">
                  <Target className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalChallengesCompleted}</p>
                  <p className="text-sm text-muted-foreground">Challenges Done</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="students" className="space-y-6">
          <TabsList>
            <TabsTrigger value="students">All Students</TabsTrigger>
            <TabsTrigger value="details" disabled={!selectedStudent}>Student Details</TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle>Student Overview</CardTitle>
                    <CardDescription>Click on a student to view detailed progress</CardDescription>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead className="text-right">Total XP</TableHead>
                        <TableHead className="text-right">Current Streak</TableHead>
                        <TableHead className="text-right">Quizzes</TableHead>
                        <TableHead className="text-right">Badges</TableHead>
                        <TableHead className="text-right">Challenges</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student) => {
                        const studentAchievements = getStudentAchievements(student.user_id);
                        const studentQuizzes = getStudentQuizzes(student.user_id);
                        const studentChallenges = getStudentChallenges(student.user_id);
                        
                        return (
                          <TableRow
                            key={student.id}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => setSelectedStudent(student.user_id)}
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                {student.username || 'Anonymous'}
                                {student.current_streak >= 7 && (
                                  <Badge variant="secondary" className="gap-1">
                                    <Flame className="h-3 w-3 text-orange-500" />
                                    {student.current_streak}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-semibold text-primary">
                              {student.total_xp.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">{student.current_streak}</TableCell>
                            <TableCell className="text-right">{studentQuizzes.length}</TableCell>
                            <TableCell className="text-right">{studentAchievements.length}</TableCell>
                            <TableCell className="text-right">{studentChallenges.length}</TableCell>
                          </TableRow>
                        );
                      })}
                      {filteredStudents.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                            No students found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            {selectedStudentData && (
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      {selectedStudentData.username || 'Anonymous'}
                    </CardTitle>
                    <CardDescription>
                      Joined {new Date(selectedStudentData.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <p className="text-2xl font-bold text-primary">{selectedStudentData.total_xp}</p>
                        <p className="text-sm text-muted-foreground">Total XP</p>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <p className="text-2xl font-bold">{selectedStudentData.current_streak}</p>
                        <p className="text-sm text-muted-foreground">Current Streak</p>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <p className="text-2xl font-bold">{selectedStudentData.longest_streak}</p>
                        <p className="text-sm text-muted-foreground">Longest Streak</p>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <p className="text-2xl font-bold">{selectedStudentData.quizzes_completed}</p>
                        <p className="text-sm text-muted-foreground">Quizzes Done</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Quiz Progress */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Quiz Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {getStudentQuizzes(selectedStudentData.user_id).length > 0 ? (
                          getStudentQuizzes(selectedStudentData.user_id).map((quiz) => (
                            <div key={quiz.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                              <span className="text-sm font-medium">{getQuizName(quiz.quiz_id)}</span>
                              <Badge variant={quiz.score >= 70 ? "default" : "secondary"}>
                                {quiz.score}%
                              </Badge>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground text-sm text-center py-4">No quizzes completed yet</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Achievements */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Earned Badges
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {getStudentAchievements(selectedStudentData.user_id).length > 0 ? (
                          getStudentAchievements(selectedStudentData.user_id).map((achievement) => (
                            <div key={achievement.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                              <span className="text-sm font-medium">{getAchievementName(achievement.achievement_id)}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(achievement.unlocked_at).toLocaleDateString()}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground text-sm text-center py-4">No badges earned yet</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Challenges */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Completed Challenges
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {getStudentChallenges(selectedStudentData.user_id).length > 0 ? (
                        getStudentChallenges(selectedStudentData.user_id).map((challenge) => (
                          <div key={challenge.id} className="p-3 bg-muted rounded-lg">
                            <p className="font-medium text-sm">{getChallengeName(challenge.challenge_id)}</p>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs text-muted-foreground">
                                {new Date(challenge.completed_date).toLocaleDateString()}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                +{challenge.xp_earned} XP
                              </Badge>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm text-center py-4 col-span-full">
                          No challenges completed yet
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default FacultyDashboard;