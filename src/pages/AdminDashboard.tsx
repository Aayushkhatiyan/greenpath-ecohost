import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from 'sonner';
import { 
  Shield, Users, BookOpen, GraduationCap, Settings, 
  UserPlus, Trash2, Edit, Plus, Search, X
} from 'lucide-react';

interface UserWithRole {
  id: string;
  user_id: string;
  username: string | null;
  role: 'student' | 'faculty' | 'admin';
  created_at: string;
}

interface Module {
  id: string;
  name: string;
  description: string | null;
  category: string;
  difficulty: string;
  total_lessons: number;
  xp_reward: number;
}

interface FacultyStudent {
  id: string;
  faculty_id: string;
  student_id: string;
  assigned_at: string;
}

interface FacultyModule {
  id: string;
  faculty_id: string;
  module_id: string;
  assigned_at: string;
}

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Data states
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [facultyStudents, setFacultyStudents] = useState<FacultyStudent[]>([]);
  const [facultyModules, setFacultyModules] = useState<FacultyModule[]>([]);
  
  // Dialog states
  const [assignStudentsOpen, setAssignStudentsOpen] = useState(false);
  const [assignModulesOpen, setAssignModulesOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [changeRoleOpen, setChangeRoleOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [newRole, setNewRole] = useState<'student' | 'faculty' | 'admin'>('student');

  useEffect(() => {
    const checkAdminAndFetchData = async () => {
      if (!user) return;
      
      const { data: adminCheck } = await supabase.rpc('has_role', { 
        _user_id: user.id, 
        _role: 'admin' 
      });
      
      if (adminCheck !== true) {
        navigate('/');
        return;
      }
      
      setIsAdmin(true);
      await fetchAllData();
      setLoading(false);
    };

    checkAdminAndFetchData();
  }, [user, navigate]);

  const fetchAllData = async () => {
    const [profilesRes, rolesRes, modulesRes, facultyStudentsRes, facultyModulesRes] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('user_roles').select('*'),
      supabase.from('modules').select('*'),
      supabase.from('faculty_students').select('*'),
      supabase.from('faculty_modules').select('*')
    ]);

    // Merge profiles with roles
    const usersWithRoles: UserWithRole[] = (profilesRes.data || []).map(profile => {
      const userRole = rolesRes.data?.find(r => r.user_id === profile.user_id);
      return {
        id: profile.id,
        user_id: profile.user_id,
        username: profile.username,
        role: (userRole?.role as 'student' | 'faculty' | 'admin') || 'student',
        created_at: profile.created_at
      };
    });

    setUsers(usersWithRoles);
    setModules(modulesRes.data || []);
    setFacultyStudents(facultyStudentsRes.data || []);
    setFacultyModules(facultyModulesRes.data || []);
  };

  const handleChangeRole = async () => {
    if (!selectedUser) return;

    try {
      // Update the role in user_roles table
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', selectedUser.user_id);

      if (error) throw error;

      toast.success(`User role changed to ${newRole}`);
      setChangeRoleOpen(false);
      await fetchAllData();
    } catch (error) {
      toast.error('Failed to change user role');
    }
  };

  const handleAssignStudents = async () => {
    if (!selectedFaculty || selectedStudents.length === 0) return;

    try {
      const assignments = selectedStudents.map(studentId => ({
        faculty_id: selectedFaculty,
        student_id: studentId
      }));

      const { error } = await supabase
        .from('faculty_students')
        .upsert(assignments, { onConflict: 'faculty_id,student_id' });

      if (error) throw error;

      toast.success(`Assigned ${selectedStudents.length} students to faculty`);
      setAssignStudentsOpen(false);
      setSelectedStudents([]);
      await fetchAllData();
    } catch (error) {
      toast.error('Failed to assign students');
    }
  };

  const handleAssignModules = async () => {
    if (!selectedFaculty || selectedModules.length === 0) return;

    try {
      const assignments = selectedModules.map(moduleId => ({
        faculty_id: selectedFaculty,
        module_id: moduleId
      }));

      const { error } = await supabase
        .from('faculty_modules')
        .upsert(assignments, { onConflict: 'faculty_id,module_id' });

      if (error) throw error;

      toast.success(`Assigned ${selectedModules.length} modules to faculty`);
      setAssignModulesOpen(false);
      setSelectedModules([]);
      await fetchAllData();
    } catch (error) {
      toast.error('Failed to assign modules');
    }
  };

  const handleRemoveFacultyStudent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('faculty_students')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Student assignment removed');
      await fetchAllData();
    } catch (error) {
      toast.error('Failed to remove assignment');
    }
  };

  const handleRemoveFacultyModule = async (id: string) => {
    try {
      const { error } = await supabase
        .from('faculty_modules')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Module assignment removed');
      await fetchAllData();
    } catch (error) {
      toast.error('Failed to remove assignment');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const facultyUsers = users.filter(u => u.role === 'faculty');
  const studentUsers = users.filter(u => u.role === 'student');
  const filteredUsers = users.filter(u => 
    u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.user_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFacultyStudentCount = (facultyId: string) => 
    facultyStudents.filter(fs => fs.faculty_id === facultyId).length;

  const getFacultyModuleCount = (facultyId: string) =>
    facultyModules.filter(fm => fm.faculty_id === facultyId).length;

  const getAssignedStudents = (facultyId: string) =>
    facultyStudents.filter(fs => fs.faculty_id === facultyId);

  const getAssignedModules = (facultyId: string) =>
    facultyModules.filter(fm => fm.faculty_id === facultyId);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-primary/10 rounded-full">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage users, faculty, and system settings</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-full">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{users.length}</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
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
                  <p className="text-2xl font-bold">{facultyUsers.length}</p>
                  <p className="text-sm text-muted-foreground">Faculty Members</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-full">
                  <GraduationCap className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{studentUsers.length}</p>
                  <p className="text-sm text-muted-foreground">Students</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500/10 rounded-full">
                  <BookOpen className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{modules.length}</p>
                  <p className="text-sm text-muted-foreground">Modules</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              All Users
            </TabsTrigger>
            <TabsTrigger value="faculty">
              <BookOpen className="h-4 w-4 mr-2" />
              Faculty Management
            </TabsTrigger>
            <TabsTrigger value="modules">
              <GraduationCap className="h-4 w-4 mr-2" />
              Modules
            </TabsTrigger>
          </TabsList>

          {/* All Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>View and manage all users</CardDescription>
                  </div>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell>{u.username || 'Anonymous'}</TableCell>
                        <TableCell>
                          <Badge variant={
                            u.role === 'admin' ? 'default' : 
                            u.role === 'faculty' ? 'secondary' : 
                            'outline'
                          }>
                            {u.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(u.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(u);
                              setNewRole(u.role);
                              setChangeRoleOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Change Role
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Faculty Management Tab */}
          <TabsContent value="faculty">
            <div className="space-y-6">
              {facultyUsers.map((faculty) => (
                <Card key={faculty.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          {faculty.username || 'Anonymous Faculty'}
                        </CardTitle>
                        <CardDescription>
                          {getFacultyStudentCount(faculty.user_id)} students • {getFacultyModuleCount(faculty.user_id)} modules assigned
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedFaculty(faculty.user_id);
                            setSelectedStudents([]);
                            setAssignStudentsOpen(true);
                          }}
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          Assign Students
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedFaculty(faculty.user_id);
                            setSelectedModules([]);
                            setAssignModulesOpen(true);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Assign Modules
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Assigned Students */}
                      <div>
                        <h4 className="font-medium mb-3">Assigned Students</h4>
                        {getAssignedStudents(faculty.user_id).length === 0 ? (
                          <p className="text-sm text-muted-foreground">No students assigned</p>
                        ) : (
                          <div className="space-y-2">
                            {getAssignedStudents(faculty.user_id).map((fs) => {
                              const student = users.find(u => u.user_id === fs.student_id);
                              return (
                                <div key={fs.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                                  <span className="text-sm">{student?.username || 'Anonymous'}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveFacultyStudent(fs.id)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Assigned Modules */}
                      <div>
                        <h4 className="font-medium mb-3">Assigned Modules</h4>
                        {getAssignedModules(faculty.user_id).length === 0 ? (
                          <p className="text-sm text-muted-foreground">No modules assigned</p>
                        ) : (
                          <div className="space-y-2">
                            {getAssignedModules(faculty.user_id).map((fm) => {
                              const module = modules.find(m => m.id === fm.module_id);
                              return (
                                <div key={fm.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                                  <span className="text-sm">{module?.name || 'Unknown Module'}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveFacultyModule(fm.id)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {facultyUsers.length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No faculty members yet</p>
                    <p className="text-sm text-muted-foreground">Change a user's role to faculty to get started</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Modules Tab */}
          <TabsContent value="modules">
            <Card>
              <CardHeader>
                <CardTitle>Learning Modules</CardTitle>
                <CardDescription>Manage available learning modules</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>Lessons</TableHead>
                      <TableHead>XP Reward</TableHead>
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
                          <Badge variant={
                            module.difficulty === 'beginner' ? 'secondary' :
                            module.difficulty === 'intermediate' ? 'default' :
                            'destructive'
                          }>
                            {module.difficulty}
                          </Badge>
                        </TableCell>
                        <TableCell>{module.total_lessons}</TableCell>
                        <TableCell>{module.xp_reward} XP</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />

      {/* Change Role Dialog */}
      <Dialog open={changeRoleOpen} onOpenChange={setChangeRoleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Change the role for {selectedUser?.username || 'this user'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>New Role</Label>
              <Select value={newRole} onValueChange={(v) => setNewRole(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="faculty">Faculty</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleChangeRole} className="w-full">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Students Dialog */}
      <Dialog open={assignStudentsOpen} onOpenChange={setAssignStudentsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Students to Faculty</DialogTitle>
            <DialogDescription>
              Select students to assign (max 15 students per faculty recommended)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-96 overflow-y-auto">
            {studentUsers.map((student) => {
              const isAlreadyAssigned = facultyStudents.some(
                fs => fs.faculty_id === selectedFaculty && fs.student_id === student.user_id
              );
              return (
                <div key={student.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={student.id}
                    checked={selectedStudents.includes(student.user_id) || isAlreadyAssigned}
                    disabled={isAlreadyAssigned}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedStudents(prev => [...prev, student.user_id]);
                      } else {
                        setSelectedStudents(prev => prev.filter(id => id !== student.user_id));
                      }
                    }}
                  />
                  <Label htmlFor={student.id} className="flex-1">
                    {student.username || 'Anonymous'}
                    {isAlreadyAssigned && (
                      <Badge variant="secondary" className="ml-2 text-xs">Already assigned</Badge>
                    )}
                  </Label>
                </div>
              );
            })}
          </div>
          <Button onClick={handleAssignStudents} disabled={selectedStudents.length === 0}>
            Assign {selectedStudents.length} Student(s)
          </Button>
        </DialogContent>
      </Dialog>

      {/* Assign Modules Dialog */}
      <Dialog open={assignModulesOpen} onOpenChange={setAssignModulesOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Modules to Faculty</DialogTitle>
            <DialogDescription>
              Select modules this faculty member will teach
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-96 overflow-y-auto">
            {modules.map((module) => {
              const isAlreadyAssigned = facultyModules.some(
                fm => fm.faculty_id === selectedFaculty && fm.module_id === module.id
              );
              return (
                <div key={module.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={module.id}
                    checked={selectedModules.includes(module.id) || isAlreadyAssigned}
                    disabled={isAlreadyAssigned}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedModules(prev => [...prev, module.id]);
                      } else {
                        setSelectedModules(prev => prev.filter(id => id !== module.id));
                      }
                    }}
                  />
                  <Label htmlFor={module.id} className="flex-1">
                    {module.name}
                    <span className="text-xs text-muted-foreground ml-2">({module.category})</span>
                    {isAlreadyAssigned && (
                      <Badge variant="secondary" className="ml-2 text-xs">Already assigned</Badge>
                    )}
                  </Label>
                </div>
              );
            })}
          </div>
          <Button onClick={handleAssignModules} disabled={selectedModules.length === 0}>
            Assign {selectedModules.length} Module(s)
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;