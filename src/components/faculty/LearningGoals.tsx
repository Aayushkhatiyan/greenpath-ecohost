import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Target, Plus, CalendarIcon, Trash2, Edit, TrendingUp, Award, Flame, BookOpen, Zap } from 'lucide-react';

interface StudentProfile {
  id: string;
  user_id: string;
  username: string | null;
  total_xp: number;
  current_streak: number;
  quizzes_completed: number;
  modules_completed: number;
}

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
  created_by: string;
  created_at: string;
}

interface LearningGoalsProps {
  students: StudentProfile[];
  quizProgress: { user_id: string }[];
  challenges: { user_id: string }[];
}

const goalTypeConfig: Record<string, { label: string; icon: React.ReactNode; unit: string }> = {
  xp: { label: 'XP Points', icon: <Zap className="h-4 w-4" />, unit: 'XP' },
  quizzes: { label: 'Quizzes Completed', icon: <BookOpen className="h-4 w-4" />, unit: 'quizzes' },
  challenges: { label: 'Challenges Completed', icon: <Target className="h-4 w-4" />, unit: 'challenges' },
  streak: { label: 'Day Streak', icon: <Flame className="h-4 w-4" />, unit: 'days' },
  modules: { label: 'Modules Completed', icon: <Award className="h-4 w-4" />, unit: 'modules' },
};

const LearningGoals: React.FC<LearningGoalsProps> = ({ students, quizProgress, challenges }) => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<LearningGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<LearningGoal | null>(null);
  
  // Form state
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goalType, setGoalType] = useState<string>('xp');
  const [targetValue, setTargetValue] = useState<number>(100);
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('learning_goals')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast.error('Failed to fetch learning goals');
      console.error(error);
    } else {
      // Calculate current values for each goal
      const updatedGoals = (data || []).map(goal => ({
        ...goal,
        current_value: calculateCurrentValue(goal.student_id, goal.goal_type)
      }));
      setGoals(updatedGoals);
    }
    setLoading(false);
  };

  const calculateCurrentValue = (studentId: string, type: string): number => {
    const student = students.find(s => s.user_id === studentId);
    if (!student) return 0;

    switch (type) {
      case 'xp':
        return student.total_xp;
      case 'quizzes':
        return quizProgress.filter(q => q.user_id === studentId).length;
      case 'challenges':
        return challenges.filter(c => c.user_id === studentId).length;
      case 'streak':
        return student.current_streak;
      case 'modules':
        return student.modules_completed;
      default:
        return 0;
    }
  };

  const resetForm = () => {
    setSelectedStudent('');
    setTitle('');
    setDescription('');
    setGoalType('xp');
    setTargetValue(100);
    setDeadline(undefined);
    setEditingGoal(null);
  };

  const handleSubmit = async () => {
    if (!selectedStudent || !title || !targetValue) {
      toast.error('Please fill in all required fields');
      return;
    }

    const currentValue = calculateCurrentValue(selectedStudent, goalType);
    const status = currentValue >= targetValue ? 'completed' : 'active';

    if (editingGoal) {
      const { error } = await supabase
        .from('learning_goals')
        .update({
          title,
          description: description || null,
          goal_type: goalType,
          target_value: targetValue,
          current_value: currentValue,
          deadline: deadline ? format(deadline, 'yyyy-MM-dd') : null,
          status
        })
        .eq('id', editingGoal.id);

      if (error) {
        toast.error('Failed to update goal');
        console.error(error);
      } else {
        toast.success('Goal updated successfully!');
        fetchGoals();
        setDialogOpen(false);
        resetForm();
      }
    } else {
      const { data: goalData, error } = await supabase
        .from('learning_goals')
        .insert({
          student_id: selectedStudent,
          title,
          description: description || null,
          goal_type: goalType,
          target_value: targetValue,
          current_value: currentValue,
          deadline: deadline ? format(deadline, 'yyyy-MM-dd') : null,
          status,
          created_by: user?.id
        })
        .select()
        .single();

      if (error) {
        toast.error('Failed to create goal');
        console.error(error);
      } else {
        // Send notification to the student
        await supabase.from('notifications').insert({
          user_id: selectedStudent,
          title: 'New Learning Goal Assigned',
          message: `Your teacher has set a new goal for you: "${title}". Target: ${targetValue} ${goalTypeConfig[goalType]?.unit}${deadline ? ` by ${format(deadline, 'PPP')}` : ''}.`,
          type: 'goal',
          related_id: goalData?.id
        });

        // Get student email for notification
        const student = students.find(s => s.user_id === selectedStudent);
        if (student) {
          // Send email notification via edge function
          try {
            await supabase.functions.invoke('send-notification-email', {
              body: {
                to: selectedStudent,
                subject: 'New Learning Goal Assigned',
                studentName: student.username || 'Student',
                message: `Your teacher has set a new goal for you: "${title}". Target: ${targetValue} ${goalTypeConfig[goalType]?.unit}${deadline ? ` by ${format(deadline, 'PPP')}` : ''}.`,
                type: 'goal'
              }
            });
          } catch (emailError) {
            console.error('Failed to send email notification:', emailError);
          }
        }

        toast.success('Goal created and student notified!');
        fetchGoals();
        setDialogOpen(false);
        resetForm();
      }
    }
  };

  const handleEdit = (goal: LearningGoal) => {
    setEditingGoal(goal);
    setSelectedStudent(goal.student_id);
    setTitle(goal.title);
    setDescription(goal.description || '');
    setGoalType(goal.goal_type);
    setTargetValue(goal.target_value);
    setDeadline(goal.deadline ? new Date(goal.deadline) : undefined);
    setDialogOpen(true);
  };

  const handleDelete = async (goalId: string) => {
    const { error } = await supabase
      .from('learning_goals')
      .delete()
      .eq('id', goalId);

    if (error) {
      toast.error('Failed to delete goal');
      console.error(error);
    } else {
      toast.success('Goal deleted successfully!');
      fetchGoals();
    }
  };

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.user_id === studentId);
    return student?.username || 'Unknown Student';
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min(100, Math.round((current / target) * 100));
  };

  const getStatusBadge = (goal: LearningGoal) => {
    const progress = getProgressPercentage(goal.current_value, goal.target_value);
    
    if (progress >= 100) {
      return <Badge className="bg-green-500">Completed</Badge>;
    }
    if (goal.deadline && new Date(goal.deadline) < new Date()) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    if (progress >= 75) {
      return <Badge className="bg-yellow-500">Almost There</Badge>;
    }
    return <Badge variant="secondary">In Progress</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Learning Goals
          </h2>
          <p className="text-muted-foreground">Set and track goals for your students</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingGoal ? 'Edit Goal' : 'Create New Goal'}</DialogTitle>
              <DialogDescription>
                Set a learning goal for a student to track their progress
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="student">Student *</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map(student => (
                      <SelectItem key={student.user_id} value={student.user_id}>
                        {student.username || 'Anonymous'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Goal Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Complete 5 quizzes this week"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Additional details about this goal..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Goal Type *</Label>
                  <Select value={goalType} onValueChange={setGoalType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(goalTypeConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            {config.icon}
                            {config.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target">Target Value *</Label>
                  <Input
                    id="target"
                    type="number"
                    value={targetValue}
                    onChange={(e) => setTargetValue(parseInt(e.target.value) || 0)}
                    min={1}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Deadline (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !deadline && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {deadline ? format(deadline, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={deadline}
                      onSelect={setDeadline}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {selectedStudent && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Current Progress: <strong>{calculateCurrentValue(selectedStudent, goalType)}</strong> {goalTypeConfig[goalType]?.unit}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setDialogOpen(false);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingGoal ? 'Update Goal' : 'Create Goal'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{goals.length}</p>
                <p className="text-sm text-muted-foreground">Total Goals</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-full">
                <Award className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {goals.filter(g => getProgressPercentage(g.current_value, g.target_value) >= 100).length}
                </p>
                <p className="text-sm text-muted-foreground">Completed</p>
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
                <p className="text-2xl font-bold">
                  {goals.filter(g => {
                    const p = getProgressPercentage(g.current_value, g.target_value);
                    return p > 0 && p < 100;
                  }).length}
                </p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-full">
                <Zap className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {new Set(goals.map(g => g.student_id)).size}
                </p>
                <p className="text-sm text-muted-foreground">Students with Goals</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Learning Goals</CardTitle>
          <CardDescription>Track progress towards each goal</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8 text-muted-foreground">Loading goals...</p>
          ) : goals.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No learning goals yet. Create one to get started!
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Goal</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {goals.map(goal => {
                  const progress = getProgressPercentage(goal.current_value, goal.target_value);
                  const config = goalTypeConfig[goal.goal_type];
                  
                  return (
                    <TableRow key={goal.id}>
                      <TableCell className="font-medium">
                        {getStudentName(goal.student_id)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{goal.title}</p>
                          {goal.description && (
                            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {goal.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {config?.icon}
                          <span className="text-sm">{config?.label}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 min-w-[120px]">
                          <div className="flex justify-between text-sm">
                            <span>{goal.current_value}/{goal.target_value}</span>
                            <span>{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell>
                        {goal.deadline ? format(new Date(goal.deadline), 'MMM d, yyyy') : '-'}
                      </TableCell>
                      <TableCell>{getStatusBadge(goal)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(goal)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(goal.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningGoals;
