import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Users, Calendar, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, parseISO } from 'date-fns';

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
}

interface StudentProfile {
  user_id: string;
  username: string | null;
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

const AttendanceAnalytics: React.FC = () => {
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const fetchData = async () => {
    setLoading(true);
    const daysAgo = parseInt(timeRange);
    const startDate = format(subDays(new Date(), daysAgo), 'yyyy-MM-dd');

    // Fetch sessions
    const { data: sessionsData } = await supabase
      .from('attendance_sessions')
      .select('*')
      .gte('session_date', startDate)
      .order('session_date', { ascending: true });

    // Fetch records
    const { data: recordsData } = await supabase
      .from('attendance_records')
      .select('*');

    // Fetch students
    const { data: rolesData } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'student');

    const studentUserIds = rolesData?.map(r => r.user_id) || [];

    if (studentUserIds.length > 0) {
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, username')
        .in('user_id', studentUserIds);

      setStudents(profilesData || []);
    }

    setSessions(sessionsData || []);
    setRecords(recordsData || []);
    setLoading(false);
  };

  // Calculate overall stats
  const overallStats = useMemo(() => {
    const sessionIds = sessions.map(s => s.id);
    const relevantRecords = records.filter(r => sessionIds.includes(r.session_id));
    
    const present = relevantRecords.filter(r => r.status === 'present').length;
    const late = relevantRecords.filter(r => r.status === 'late').length;
    const absent = relevantRecords.filter(r => r.status === 'absent').length;
    const total = present + late + absent;

    return {
      totalSessions: sessions.length,
      totalRecords: total,
      presentCount: present,
      lateCount: late,
      absentCount: absent,
      attendanceRate: total > 0 ? ((present + late) / total * 100).toFixed(1) : '0',
      punctualityRate: total > 0 ? (present / total * 100).toFixed(1) : '0',
    };
  }, [sessions, records]);

  // Attendance trend over time (by session date)
  const trendData = useMemo(() => {
    return sessions.map(session => {
      const sessionRecords = records.filter(r => r.session_id === session.id);
      const present = sessionRecords.filter(r => r.status === 'present').length;
      const late = sessionRecords.filter(r => r.status === 'late').length;
      const absent = sessionRecords.filter(r => r.status === 'absent').length;
      const total = present + late + absent;

      return {
        date: format(parseISO(session.session_date), 'MMM d'),
        name: session.session_name,
        present,
        late,
        absent,
        rate: total > 0 ? Math.round((present + late) / total * 100) : 0,
      };
    });
  }, [sessions, records]);

  // Pie chart data
  const pieData = useMemo(() => [
    { name: 'Present', value: overallStats.presentCount, color: 'hsl(var(--chart-1))' },
    { name: 'Late', value: overallStats.lateCount, color: 'hsl(var(--chart-2))' },
    { name: 'Absent', value: overallStats.absentCount, color: 'hsl(var(--chart-3))' },
  ].filter(d => d.value > 0), [overallStats]);

  // Student attendance breakdown
  const studentStats = useMemo(() => {
    const sessionIds = sessions.map(s => s.id);
    
    return students.map(student => {
      const studentRecords = records.filter(
        r => r.student_id === student.user_id && sessionIds.includes(r.session_id)
      );
      
      const present = studentRecords.filter(r => r.status === 'present').length;
      const late = studentRecords.filter(r => r.status === 'late').length;
      const absent = studentRecords.filter(r => r.status === 'absent').length;
      const attended = present + late;
      const total = sessions.length;
      const rate = total > 0 ? (attended / total * 100) : 0;

      return {
        userId: student.user_id,
        username: student.username || 'Anonymous',
        present,
        late,
        absent,
        attended,
        total,
        rate,
        status: rate >= 80 ? 'good' : rate >= 60 ? 'warning' : 'critical',
      };
    }).sort((a, b) => b.rate - a.rate);
  }, [students, records, sessions]);

  // Students at risk (below 70% attendance)
  const atRiskStudents = useMemo(() => 
    studentStats.filter(s => s.rate < 70 && s.total > 0),
    [studentStats]
  );

  if (loading) {
    return <div className="text-center py-8">Loading attendance analytics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with Time Range Filter */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Attendance Analytics</h2>
          <p className="text-muted-foreground">Track attendance trends and identify patterns</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="14">Last 14 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Total Sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{overallStats.totalSessions}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Students Tracked
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{students.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Attendance Rate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{overallStats.attendanceRate}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Punctuality Rate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{overallStats.punctualityRate}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Attendance Trend Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Attendance Trend
            </CardTitle>
            <CardDescription>Attendance rate per session over time</CardDescription>
          </CardHeader>
          <CardContent>
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, 'Attendance Rate']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                No session data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
            <CardDescription>Overall attendance status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                No attendance records yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Session Breakdown Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Session Breakdown</CardTitle>
          <CardDescription>Attendance counts per session</CardDescription>
        </CardHeader>
        <CardContent>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" name="Present" fill="hsl(var(--chart-1))" stackId="a" />
                <Bar dataKey="late" name="Late" fill="hsl(var(--chart-2))" stackId="a" />
                <Bar dataKey="absent" name="Absent" fill="hsl(var(--chart-3))" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No session data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Students At Risk */}
      {atRiskStudents.length > 0 && (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Students At Risk
            </CardTitle>
            <CardDescription>
              Students with attendance below 70% require attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {atRiskStudents.map((student) => (
                <div key={student.userId} className="flex items-center justify-between p-3 bg-destructive/5 rounded-lg">
                  <div>
                    <p className="font-medium">{student.username}</p>
                    <p className="text-sm text-muted-foreground">
                      Attended {student.attended} of {student.total} sessions
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="destructive">{student.rate.toFixed(0)}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Student Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Attendance Report</CardTitle>
          <CardDescription>Individual student attendance breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          {studentStats.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead className="text-center">Present</TableHead>
                  <TableHead className="text-center">Late</TableHead>
                  <TableHead className="text-center">Absent</TableHead>
                  <TableHead>Attendance Rate</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentStats.map((student) => (
                  <TableRow key={student.userId}>
                    <TableCell className="font-medium">{student.username}</TableCell>
                    <TableCell className="text-center text-green-600">{student.present}</TableCell>
                    <TableCell className="text-center text-yellow-600">{student.late}</TableCell>
                    <TableCell className="text-center text-red-600">{student.absent}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={student.rate} className="flex-1" />
                        <span className="text-sm font-medium w-12">{student.rate.toFixed(0)}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={
                          student.status === 'good' ? 'default' : 
                          student.status === 'warning' ? 'secondary' : 'destructive'
                        }
                      >
                        {student.status === 'good' ? 'Good' : 
                         student.status === 'warning' ? 'At Risk' : 'Critical'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No student attendance data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceAnalytics;