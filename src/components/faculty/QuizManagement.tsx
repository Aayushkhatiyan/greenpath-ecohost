import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, BookOpen, HelpCircle, Save } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string | null;
  order_index: number;
  created_at?: string;
  quiz_id?: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  xp_reward: number;
  passing_score: number;
  module_id: string | null;
  is_published: boolean;
  created_by: string;
  created_at: string;
  questions?: QuizQuestion[];
}

interface Module {
  id: string;
  name: string;
}

const QuizManagement: React.FC = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [isQuestionsDialogOpen, setIsQuestionsDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state for new/edit quiz
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    xp_reward: 100,
    passing_score: 70,
    module_id: '',
    is_published: false,
    time_limit_minutes: null as number | null,
  });

  // Questions form state
  const [questions, setQuestions] = useState<Partial<QuizQuestion>[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correct_answer: 0,
    explanation: '',
  });

  useEffect(() => {
    fetchQuizzes();
    fetchModules();
  }, []);

  const fetchQuizzes = async () => {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching quizzes:', error);
      toast.error('Failed to load quizzes');
    } else {
      setQuizzes(data || []);
    }
    setLoading(false);
  };

  const fetchModules = async () => {
    const { data, error } = await supabase
      .from('modules')
      .select('id, name')
      .order('name');

    if (error) {
      console.error('Error fetching modules:', error);
    } else {
      setModules(data || []);
    }
  };

  const fetchQuizQuestions = async (quizId: string): Promise<QuizQuestion[]> => {
    const { data, error } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', quizId)
      .order('order_index');

    if (error) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to load questions');
      return [];
    }
    // Ensure options is always an array
    return (data || []).map(q => ({
      ...q,
      options: Array.isArray(q.options) ? q.options : []
    })) as QuizQuestion[];
  };

  const handleCreateQuiz = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('quizzes')
      .insert({
        title: formData.title,
        description: formData.description || null,
        xp_reward: formData.xp_reward,
        passing_score: formData.passing_score,
        module_id: formData.module_id || null,
        is_published: formData.is_published,
        created_by: user.id,
        time_limit_minutes: formData.time_limit_minutes,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating quiz:', error);
      toast.error('Failed to create quiz');
    } else {
      toast.success('Quiz created successfully!');
      setQuizzes([data, ...quizzes]);
      setIsCreateDialogOpen(false);
      resetForm();

      // Send notification to all students
      await sendQuizNotification(data.title, data.description);
    }
  };

  const handleUpdateQuiz = async () => {
    if (!selectedQuiz) return;

    const { error } = await supabase
      .from('quizzes')
      .update({
        title: formData.title,
        description: formData.description || null,
        xp_reward: formData.xp_reward,
        passing_score: formData.passing_score,
        module_id: formData.module_id || null,
        is_published: formData.is_published,
        time_limit_minutes: formData.time_limit_minutes,
      })
      .eq('id', selectedQuiz.id);

    if (error) {
      console.error('Error updating quiz:', error);
      toast.error('Failed to update quiz');
    } else {
      toast.success('Quiz updated successfully!');
      fetchQuizzes();
      setIsEditDialogOpen(false);
      setSelectedQuiz(null);
      resetForm();
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return;

    // First delete all questions
    await supabase.from('quiz_questions').delete().eq('quiz_id', quizId);

    const { error } = await supabase
      .from('quizzes')
      .delete()
      .eq('id', quizId);

    if (error) {
      console.error('Error deleting quiz:', error);
      toast.error('Failed to delete quiz');
    } else {
      toast.success('Quiz deleted successfully!');
      setQuizzes(quizzes.filter(q => q.id !== quizId));
    }
  };

  const openEditDialog = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setFormData({
      title: quiz.title,
      description: quiz.description || '',
      xp_reward: quiz.xp_reward,
      passing_score: quiz.passing_score,
      module_id: quiz.module_id || '',
      is_published: quiz.is_published,
      time_limit_minutes: (quiz as any).time_limit_minutes || null,
    });
    setIsEditDialogOpen(true);
  };

  const openQuestionsDialog = async (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    const questionsData = await fetchQuizQuestions(quiz.id);
    setQuestions(questionsData);
    setIsQuestionsDialogOpen(true);
  };

  const addQuestion = async () => {
    if (!selectedQuiz || !currentQuestion.question) return;

    const { data, error } = await supabase
      .from('quiz_questions')
      .insert({
        quiz_id: selectedQuiz.id,
        question: currentQuestion.question,
        options: currentQuestion.options,
        correct_answer: currentQuestion.correct_answer,
        explanation: currentQuestion.explanation,
        order_index: questions.length,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding question:', error);
      toast.error('Failed to add question');
    } else {
      toast.success('Question added!');
      setQuestions([...questions, data as QuizQuestion]);
      setCurrentQuestion({
        question: '',
        options: ['', '', '', ''],
        correct_answer: 0,
        explanation: '',
      });
    }
  };

  const deleteQuestion = async (questionId: string) => {
    const { error } = await supabase
      .from('quiz_questions')
      .delete()
      .eq('id', questionId);

    if (error) {
      console.error('Error deleting question:', error);
      toast.error('Failed to delete question');
    } else {
      toast.success('Question deleted!');
      setQuestions(questions.filter(q => q.id !== questionId));
    }
  };

  const sendQuizNotification = async (quizTitle: string, description: string | null) => {
    try {
      // Get all student emails
      const { data: students } = await supabase
        .from('profiles')
        .select('user_id, username');

      // For each student, create a notification
      if (students) {
        for (const student of students) {
          await supabase.from('notifications').insert({
            user_id: student.user_id,
            title: 'New Quiz Available',
            message: `A new quiz "${quizTitle}" is now available. Test your knowledge and earn XP!`,
            type: 'quiz',
            related_id: null,
          });
        }
      }
    } catch (error) {
      console.error('Error sending notifications:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      xp_reward: 100,
      passing_score: 70,
      module_id: '',
      is_published: false,
      time_limit_minutes: null,
    });
  };

  const QuizFormContent = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Quiz Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter quiz title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the quiz"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="xp_reward">XP Reward</Label>
          <Input
            id="xp_reward"
            type="number"
            value={formData.xp_reward}
            onChange={(e) => setFormData({ ...formData, xp_reward: parseInt(e.target.value) || 0 })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="passing_score">Passing Score (%)</Label>
          <Input
            id="passing_score"
            type="number"
            min={0}
            max={100}
            value={formData.passing_score}
            onChange={(e) => setFormData({ ...formData, passing_score: parseInt(e.target.value) || 70 })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="module">Link to Module (Optional)</Label>
        <Select
          value={formData.module_id}
          onValueChange={(value) => setFormData({ ...formData, module_id: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a module" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">No Module</SelectItem>
            {modules.map((module) => (
              <SelectItem key={module.id} value={module.id}>
                {module.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="time_limit">Time Limit (minutes, leave empty for no limit)</Label>
        <Input
          id="time_limit"
          type="number"
          min={1}
          max={180}
          value={formData.time_limit_minutes ?? ''}
          onChange={(e) => setFormData({ ...formData, time_limit_minutes: e.target.value ? parseInt(e.target.value) : null })}
          placeholder="No time limit"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="is_published"
          checked={formData.is_published}
          onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
          className="h-4 w-4"
        />
        <Label htmlFor="is_published">Publish immediately</Label>
      </div>
    </div>
  );

  if (loading) {
    return <div className="text-center py-8">Loading quizzes...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => { setError(null); fetchQuizzes(); }}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Quiz Management</h2>
          <p className="text-muted-foreground">Create and manage quizzes for your students</p>
        </div>

        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Quiz
        </Button>
      </div>

      {/* Create Quiz Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Quiz</DialogTitle>
            <DialogDescription>
              Create a new quiz for your students. You can add questions after creating the quiz.
            </DialogDescription>
          </DialogHeader>
          <QuizFormContent />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateQuiz} disabled={!formData.title}>
              Create Quiz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Your Quizzes
          </CardTitle>
          <CardDescription>
            {quizzes.length} quiz{quizzes.length !== 1 ? 'zes' : ''} created
          </CardDescription>
        </CardHeader>
        <CardContent>
          {quizzes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No quizzes created yet. Click "Create Quiz" to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>XP Reward</TableHead>
                  <TableHead>Passing Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quizzes.map((quiz) => (
                  <TableRow key={quiz.id}>
                    <TableCell className="font-medium">{quiz.title}</TableCell>
                    <TableCell>{quiz.xp_reward} XP</TableCell>
                    <TableCell>{quiz.passing_score}%</TableCell>
                    <TableCell>
                      <Badge variant={quiz.is_published ? 'default' : 'secondary'}>
                        {quiz.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(quiz.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openQuestionsDialog(quiz)}
                        >
                          <HelpCircle className="h-4 w-4 mr-1" />
                          Questions
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(quiz)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteQuiz(quiz.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Quiz Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Quiz</DialogTitle>
            <DialogDescription>
              Update the quiz details below.
            </DialogDescription>
          </DialogHeader>
          <QuizFormContent isEdit />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateQuiz}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Questions Dialog */}
      <Dialog open={isQuestionsDialogOpen} onOpenChange={setIsQuestionsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Questions - {selectedQuiz?.title}</DialogTitle>
            <DialogDescription>
              Add and manage questions for this quiz.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Existing Questions */}
            {questions.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Current Questions ({questions.length})</h4>
                {questions.map((q, index) => (
                  <div key={q.id} className="p-3 bg-muted rounded-lg flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium">Q{index + 1}: {q.question}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Correct: Option {(q.correct_answer || 0) + 1}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => q.id && deleteQuestion(q.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Question */}
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-medium">Add New Question</h4>
              
              <div className="space-y-2">
                <Label>Question</Label>
                <Textarea
                  value={currentQuestion.question}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                  placeholder="Enter your question"
                />
              </div>

              <div className="space-y-2">
                <Label>Options</Label>
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct"
                      checked={currentQuestion.correct_answer === index}
                      onChange={() => setCurrentQuestion({ ...currentQuestion, correct_answer: index })}
                    />
                    <Input
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...currentQuestion.options];
                        newOptions[index] = e.target.value;
                        setCurrentQuestion({ ...currentQuestion, options: newOptions });
                      }}
                      placeholder={`Option ${index + 1}`}
                    />
                  </div>
                ))}
                <p className="text-xs text-muted-foreground">Select the radio button for the correct answer</p>
              </div>

              <div className="space-y-2">
                <Label>Explanation (shown after answering)</Label>
                <Textarea
                  value={currentQuestion.explanation}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, explanation: e.target.value })}
                  placeholder="Explain why this answer is correct"
                />
              </div>

              <Button onClick={addQuestion} disabled={!currentQuestion.question || currentQuestion.options.some(o => !o)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsQuestionsDialogOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuizManagement;
