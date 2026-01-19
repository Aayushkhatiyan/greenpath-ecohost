import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Edit, BookOpen, Save, Layers } from 'lucide-react';

interface Module {
  id: string;
  name: string;
  description: string | null;
  category: string;
  difficulty: string | null;
  total_lessons: number | null;
  xp_reward: number | null;
  created_at: string;
}

const ModuleManagement: React.FC = () => {
  const { user } = useAuth();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    difficulty: 'beginner',
    total_lessons: 5,
    xp_reward: 100,
  });

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching modules:', error);
      toast.error('Failed to load modules');
    } else {
      setModules(data || []);
    }
    setLoading(false);
  };

  const handleCreateModule = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('modules')
      .insert({
        name: formData.name,
        description: formData.description || null,
        category: formData.category,
        difficulty: formData.difficulty,
        total_lessons: formData.total_lessons,
        xp_reward: formData.xp_reward,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating module:', error);
      toast.error('Failed to create module. Admin access required.');
    } else {
      toast.success('Module created successfully!');
      setModules([data, ...modules]);
      setIsCreateDialogOpen(false);
      resetForm();
    }
  };

  const handleUpdateModule = async () => {
    if (!selectedModule) return;

    const { error } = await supabase
      .from('modules')
      .update({
        name: formData.name,
        description: formData.description || null,
        category: formData.category,
        difficulty: formData.difficulty,
        total_lessons: formData.total_lessons,
        xp_reward: formData.xp_reward,
      })
      .eq('id', selectedModule.id);

    if (error) {
      console.error('Error updating module:', error);
      toast.error('Failed to update module. Admin access required.');
    } else {
      toast.success('Module updated successfully!');
      fetchModules();
      setIsEditDialogOpen(false);
      setSelectedModule(null);
      resetForm();
    }
  };

  const openEditDialog = (module: Module) => {
    setSelectedModule(module);
    setFormData({
      name: module.name,
      description: module.description || '',
      category: module.category,
      difficulty: module.difficulty || 'beginner',
      total_lessons: module.total_lessons || 5,
      xp_reward: module.xp_reward || 100,
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      difficulty: 'beginner',
      total_lessons: 5,
      xp_reward: 100,
    });
  };

  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/10 text-green-500';
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-500';
      case 'advanced': return 'bg-red-500/10 text-red-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const ModuleFormContent = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Module Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter module name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the module content"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          placeholder="e.g., Sustainability, Energy, Recycling"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select
            value={formData.difficulty}
            onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="total_lessons">Total Lessons</Label>
          <Input
            id="total_lessons"
            type="number"
            value={formData.total_lessons}
            onChange={(e) => setFormData({ ...formData, total_lessons: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="xp_reward">XP Reward</Label>
        <Input
          id="xp_reward"
          type="number"
          value={formData.xp_reward}
          onChange={(e) => setFormData({ ...formData, xp_reward: parseInt(e.target.value) || 0 })}
        />
      </div>
    </div>
  );

  if (loading) {
    return <div className="text-center py-8">Loading modules...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Module Management</h2>
          <p className="text-muted-foreground">View and manage learning modules</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Module
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Module</DialogTitle>
              <DialogDescription>
                Create a new learning module. Admin access is required.
              </DialogDescription>
            </DialogHeader>
            <ModuleFormContent />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateModule} disabled={!formData.name || !formData.category}>
                Create Module
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            All Modules
          </CardTitle>
          <CardDescription>
            {modules.length} module{modules.length !== 1 ? 's' : ''} available
          </CardDescription>
        </CardHeader>
        <CardContent>
          {modules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No modules created yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Lessons</TableHead>
                  <TableHead>XP Reward</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modules.map((module) => (
                  <TableRow key={module.id}>
                    <TableCell className="font-medium">{module.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{module.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getDifficultyColor(module.difficulty)}>
                        {module.difficulty || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell>{module.total_lessons || 0}</TableCell>
                    <TableCell>{module.xp_reward || 0} XP</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(module)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Module Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Module</DialogTitle>
            <DialogDescription>
              Update the module details. Admin access is required.
            </DialogDescription>
          </DialogHeader>
          <ModuleFormContent />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateModule}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModuleManagement;
