import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Plus, Users, Calendar, CheckCircle2, Clock, UserCheck, Play, Square } from 'lucide-react';
import { format } from 'date-fns';

interface AttendanceSession {
  id: string;
  session_name: string;
  session_date: string;
  start_time: string | null;
  end_time: string | null;
  is_active: boolean;
  created_by: string;
  created_at: string;
}

interface AttendanceRecord {
  id: string;
  session_id: string;
  student_id: string;
  status: string;
  marked_at: string;
  marked_by: string;
  notes: string | null;
}

interface StudentProfile {
  id: string;
  user_id: string;
  username: string | null;
}

const AttendanceManagement: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<AttendanceSession | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, string>>({});
  const [sessionName, setSessionName] = useState('');
  const [sessionDate, setSessionDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    fetchSessions();
    fetchStudents();

    // Subscribe to realtime updates for live attendance
    const sessionsChannel = supabase
      .channel('attendance_sessions_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'attendance_sessions' },
        () => {
          fetchSessions();
        }
      )
      .subscribe();

    const recordsChannel = supabase
      .channel('attendance_records_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'attendance_records' },
        (payload) => {
          // Update attendance records in real-time when dialog is open
          if (selectedSession && payload.new && (payload.new as any).session_id === selectedSession.id) {
            setAttendanceRecords(prev => ({
              ...prev,
              [(payload.new as any).student_id]: (payload.new as any).status
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sessionsChannel);
      supabase.removeChannel(recordsChannel);
    };
  }, [selectedSession]);

  const fetchSessions = async () => {
    const { data, error } = await supabase
      .from('attendance_sessions')
      .select('*')
      .order('session_date', { ascending: false });

    if (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Failed to load attendance sessions');
    } else {
      setSessions(data || []);
    }
    setLoading(false);
  };

  const fetchStudents = async () => {
    // Get all student user IDs first
    const { data: rolesData } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'student');

    const studentUserIds = rolesData?.map(r => r.user_id) || [];

    if (studentUserIds.length > 0) {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, user_id, username')
        .in('user_id', studentUserIds);

      if (error) {
        console.error('Error fetching students:', error);
      } else {
        setStudents(data || []);
      }
    }
  };

  const fetchAttendanceForSession = async (sessionId: string) => {
    const { data, error } = await supabase
      .from('attendance_records')
      .select('*')
      .eq('session_id', sessionId);

    if (error) {
      console.error('Error fetching attendance:', error);
      return {};
    }

    const records: Record<string, string> = {};
    data?.forEach(record => {
      records[record.student_id] = record.status;
    });
    return records;
  };

  const handleCreateSession = async () => {
    if (!user || !sessionName) return;

    const { data, error } = await supabase
      .from('attendance_sessions')
      .insert({
        session_name: sessionName,
        session_date: sessionDate,
        is_active: false,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating session:', error);
      toast.error('Failed to create session');
    } else {
      toast.success('Attendance session created!');
      setSessions([data, ...sessions]);
      setIsCreateDialogOpen(false);
      setSessionName('');
    }
  };

  const toggleSessionActive = async (session: AttendanceSession) => {
    const newActiveState = !session.is_active;

    const updateData: {
      is_active: boolean;
      start_time?: string;
      end_time?: string | null;
    } = {
      is_active: newActiveState,
    };

    if (newActiveState) {
      updateData.start_time = new Date().toISOString();
      updateData.end_time = null;
    } else {
      updateData.end_time = new Date().toISOString();
    }

    const { error } = await supabase
      .from('attendance_sessions')
      .update(updateData)
      .eq('id', session.id);

    if (error) {
      console.error('Error updating session:', error);
      toast.error('Failed to update session');
    } else {
      toast.success(newActiveState ? 'Session started!' : 'Session ended!');
      fetchSessions();

      // Send notification to students if session started
      if (newActiveState) {
        await notifyStudentsOfSession(session);
      }
    }
  };

  const notifyStudentsOfSession = async (session: AttendanceSession) => {
    try {
      for (const student of students) {
        await supabase.from('notifications').insert({
          user_id: student.user_id,
          title: 'Attendance Session Started',
          message: `The attendance session "${session.session_name}" has started. Please mark your attendance.`,
          type: 'attendance',
          related_id: session.id,
        });
      }
    } catch (error) {
      console.error('Error sending notifications:', error);
    }
  };

  const openAttendanceDialog = async (session: AttendanceSession) => {
    setSelectedSession(session);
    const records = await fetchAttendanceForSession(session.id);
    setAttendanceRecords(records);
    setIsAttendanceDialogOpen(true);
  };

  const updateAttendance = async (studentId: string, status: string) => {
    if (!selectedSession || !user) return;

    // Check if record exists
    const existing = attendanceRecords[studentId];

    if (existing) {
      // Update existing record
      const { error } = await supabase
        .from('attendance_records')
        .update({ status, marked_at: new Date().toISOString() })
        .eq('session_id', selectedSession.id)
        .eq('student_id', studentId);

      if (error) {
        console.error('Error updating attendance:', error);
        toast.error('Failed to update attendance');
        return;
      }
    } else {
      // Create new record
      const { error } = await supabase
        .from('attendance_records')
        .insert({
          session_id: selectedSession.id,
          student_id: studentId,
          status,
          marked_by: user.id,
        });

      if (error) {
        console.error('Error marking attendance:', error);
        toast.error('Failed to mark attendance');
        return;
      }
    }

    setAttendanceRecords({ ...attendanceRecords, [studentId]: status });
    toast.success('Attendance updated!');
  };

  const markAllPresent = async () => {
    if (!selectedSession || !user) return;

    for (const student of students) {
      if (!attendanceRecords[student.user_id]) {
        await supabase.from('attendance_records').insert({
          session_id: selectedSession.id,
          student_id: student.user_id,
          status: 'present',
          marked_by: user.id,
        });
      }
    }

    const records = await fetchAttendanceForSession(selectedSession.id);
    setAttendanceRecords(records);
    toast.success('All students marked present!');
  };

  if (loading) {
    return <div className="text-center py-8">Loading attendance data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Attendance Management</h2>
          <p className="text-muted-foreground">Track student attendance with manual check-in</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Session
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Attendance Session</DialogTitle>
              <DialogDescription>
                Create a new attendance session for your class.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sessionName">Session Name</Label>
                <Input
                  id="sessionName"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  placeholder="e.g., Week 1 - Monday Class"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sessionDate">Date</Label>
                <Input
                  id="sessionDate"
                  type="date"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateSession} disabled={!sessionName}>
                Create Session
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sessions List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Attendance Sessions
          </CardTitle>
          <CardDescription>
            {sessions.length} session{sessions.length !== 1 ? 's' : ''} created
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No attendance sessions yet. Click "New Session" to create one.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">{session.session_name}</TableCell>
                    <TableCell>{format(new Date(session.session_date), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <Badge variant={session.is_active ? 'default' : session.end_time ? 'secondary' : 'outline'}>
                        {session.is_active ? (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 animate-pulse" />
                            Active
                          </span>
                        ) : session.end_time ? (
                          'Completed'
                        ) : (
                          'Not Started'
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {session.start_time
                        ? format(new Date(session.start_time), 'h:mm a')
                        : '-'}
                      {session.end_time && ` - ${format(new Date(session.end_time), 'h:mm a')}`}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant={session.is_active ? 'destructive' : 'outline'}
                          size="sm"
                          onClick={() => toggleSessionActive(session)}
                        >
                          {session.is_active ? (
                            <>
                              <Square className="h-4 w-4 mr-1" />
                              End
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-1" />
                              Start
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openAttendanceDialog(session)}
                        >
                          <UserCheck className="h-4 w-4 mr-1" />
                          Mark
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

      {/* Students Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Students
          </CardTitle>
          <CardDescription>
            {students.length} student{students.length !== 1 ? 's' : ''} enrolled
          </CardDescription>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No students registered yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {students.map((student) => (
                <div key={student.id} className="p-3 bg-muted rounded-lg text-center">
                  <p className="font-medium">{student.username || 'Anonymous'}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attendance Dialog */}
      <Dialog open={isAttendanceDialogOpen} onOpenChange={setIsAttendanceDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Mark Attendance - {selectedSession?.session_name}</DialogTitle>
            <DialogDescription>
              {selectedSession && format(new Date(selectedSession.session_date), 'MMMM d, yyyy')}
            </DialogDescription>
          </DialogHeader>

          <div className="mb-4">
            <Button onClick={markAllPresent} variant="outline" size="sm">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Mark All Present
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead className="text-center">Present</TableHead>
                <TableHead className="text-center">Late</TableHead>
                <TableHead className="text-center">Absent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.username || 'Anonymous'}</TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={attendanceRecords[student.user_id] === 'present'}
                      onCheckedChange={() => updateAttendance(student.user_id, 'present')}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={attendanceRecords[student.user_id] === 'late'}
                      onCheckedChange={() => updateAttendance(student.user_id, 'late')}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={attendanceRecords[student.user_id] === 'absent'}
                      onCheckedChange={() => updateAttendance(student.user_id, 'absent')}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <DialogFooter>
            <Button onClick={() => setIsAttendanceDialogOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AttendanceManagement;
