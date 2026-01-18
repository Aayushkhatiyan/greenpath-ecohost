-- Create quizzes table for faculty to create quizzes
CREATE TABLE public.quizzes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  xp_reward INTEGER NOT NULL DEFAULT 100,
  passing_score INTEGER NOT NULL DEFAULT 70,
  module_id UUID REFERENCES public.modules(id) ON DELETE SET NULL,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quiz_questions table
CREATE TABLE public.quiz_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  correct_answer INTEGER NOT NULL DEFAULT 0,
  explanation TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create attendance_sessions table
CREATE TABLE public.attendance_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_name TEXT NOT NULL,
  session_date DATE NOT NULL DEFAULT CURRENT_DATE,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create attendance_records table
CREATE TABLE public.attendance_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.attendance_sessions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'absent',
  marked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  marked_by UUID NOT NULL,
  notes TEXT,
  UNIQUE(session_id, student_id)
);

-- Enable RLS on all tables
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quizzes
CREATE POLICY "Anyone can view published quizzes" ON public.quizzes
  FOR SELECT USING (is_published = true);

CREATE POLICY "Faculty can view all quizzes" ON public.quizzes
  FOR SELECT USING (has_role(auth.uid(), 'faculty'::app_role));

CREATE POLICY "Faculty can create quizzes" ON public.quizzes
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'faculty'::app_role));

CREATE POLICY "Faculty can update own quizzes" ON public.quizzes
  FOR UPDATE USING (has_role(auth.uid(), 'faculty'::app_role) AND created_by = auth.uid());

CREATE POLICY "Faculty can delete own quizzes" ON public.quizzes
  FOR DELETE USING (has_role(auth.uid(), 'faculty'::app_role) AND created_by = auth.uid());

CREATE POLICY "Admin can manage all quizzes" ON public.quizzes
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for quiz_questions
CREATE POLICY "Anyone can view questions of published quizzes" ON public.quiz_questions
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.quizzes WHERE id = quiz_id AND is_published = true));

CREATE POLICY "Faculty can view all questions" ON public.quiz_questions
  FOR SELECT USING (has_role(auth.uid(), 'faculty'::app_role));

CREATE POLICY "Faculty can manage questions" ON public.quiz_questions
  FOR ALL USING (has_role(auth.uid(), 'faculty'::app_role));

CREATE POLICY "Admin can manage all questions" ON public.quiz_questions
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for attendance_sessions
CREATE POLICY "Faculty can view all sessions" ON public.attendance_sessions
  FOR SELECT USING (has_role(auth.uid(), 'faculty'::app_role));

CREATE POLICY "Faculty can create sessions" ON public.attendance_sessions
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'faculty'::app_role));

CREATE POLICY "Faculty can update own sessions" ON public.attendance_sessions
  FOR UPDATE USING (has_role(auth.uid(), 'faculty'::app_role));

CREATE POLICY "Faculty can delete own sessions" ON public.attendance_sessions
  FOR DELETE USING (has_role(auth.uid(), 'faculty'::app_role) AND created_by = auth.uid());

CREATE POLICY "Students can view active sessions" ON public.attendance_sessions
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage all sessions" ON public.attendance_sessions
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for attendance_records
CREATE POLICY "Faculty can view all records" ON public.attendance_records
  FOR SELECT USING (has_role(auth.uid(), 'faculty'::app_role));

CREATE POLICY "Faculty can manage records" ON public.attendance_records
  FOR ALL USING (has_role(auth.uid(), 'faculty'::app_role));

CREATE POLICY "Students can view own records" ON public.attendance_records
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Students can mark own attendance for active sessions" ON public.attendance_records
  FOR INSERT WITH CHECK (
    student_id = auth.uid() AND
    EXISTS (SELECT 1 FROM public.attendance_sessions WHERE id = session_id AND is_active = true)
  );

CREATE POLICY "Admin can manage all records" ON public.attendance_records
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Enable realtime for live attendance tracking
ALTER PUBLICATION supabase_realtime ADD TABLE public.attendance_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.attendance_records;

-- Add updated_at trigger for quizzes
CREATE TRIGGER update_quizzes_updated_at
  BEFORE UPDATE ON public.quizzes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();