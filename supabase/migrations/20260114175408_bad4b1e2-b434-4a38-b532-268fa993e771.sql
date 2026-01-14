-- Create faculty_students junction table for faculty-student relationships
CREATE TABLE public.faculty_students (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id uuid NOT NULL,
    student_id uuid NOT NULL,
    assigned_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE(faculty_id, student_id)
);

ALTER TABLE public.faculty_students ENABLE ROW LEVEL SECURITY;

-- Faculty can view their assigned students
CREATE POLICY "Faculty can view their students"
ON public.faculty_students
FOR SELECT
USING (has_role(auth.uid(), 'faculty'::app_role) AND faculty_id = auth.uid());

-- Admin can manage all faculty-student relationships
CREATE POLICY "Admin can view all faculty_students"
ON public.faculty_students
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin can insert faculty_students"
ON public.faculty_students
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin can update faculty_students"
ON public.faculty_students
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin can delete faculty_students"
ON public.faculty_students
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create modules table for tracking available modules
CREATE TABLE public.modules (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    category text NOT NULL,
    difficulty text DEFAULT 'beginner',
    total_lessons integer DEFAULT 0,
    xp_reward integer DEFAULT 100,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

-- Everyone can view modules
CREATE POLICY "Anyone can view modules"
ON public.modules
FOR SELECT
USING (true);

-- Admin can manage modules
CREATE POLICY "Admin can insert modules"
ON public.modules
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin can update modules"
ON public.modules
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin can delete modules"
ON public.modules
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create faculty_modules junction table
CREATE TABLE public.faculty_modules (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id uuid NOT NULL,
    module_id uuid NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    assigned_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE(faculty_id, module_id)
);

ALTER TABLE public.faculty_modules ENABLE ROW LEVEL SECURITY;

-- Faculty can view their assigned modules
CREATE POLICY "Faculty can view their modules"
ON public.faculty_modules
FOR SELECT
USING (has_role(auth.uid(), 'faculty'::app_role) AND faculty_id = auth.uid());

-- Admin can manage all faculty_modules
CREATE POLICY "Admin can view all faculty_modules"
ON public.faculty_modules
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin can insert faculty_modules"
ON public.faculty_modules
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin can update faculty_modules"
ON public.faculty_modules
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin can delete faculty_modules"
ON public.faculty_modules
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create student_module_progress table for tracking real-time progress
CREATE TABLE public.student_module_progress (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id uuid NOT NULL,
    module_id uuid NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    lessons_completed integer DEFAULT 0,
    progress_percentage integer DEFAULT 0,
    status text DEFAULT 'not_started',
    started_at timestamp with time zone,
    completed_at timestamp with time zone,
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE(student_id, module_id)
);

ALTER TABLE public.student_module_progress ENABLE ROW LEVEL SECURITY;

-- Students can view and update their own progress
CREATE POLICY "Students can view their progress"
ON public.student_module_progress
FOR SELECT
USING (auth.uid() = student_id);

CREATE POLICY "Students can insert their progress"
ON public.student_module_progress
FOR INSERT
WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their progress"
ON public.student_module_progress
FOR UPDATE
USING (auth.uid() = student_id);

-- Faculty can view progress of their assigned students
CREATE POLICY "Faculty can view assigned student progress"
ON public.student_module_progress
FOR SELECT
USING (
    has_role(auth.uid(), 'faculty'::app_role) 
    AND EXISTS (
        SELECT 1 FROM public.faculty_students 
        WHERE faculty_id = auth.uid() AND student_id = student_module_progress.student_id
    )
);

-- Admin can view all progress
CREATE POLICY "Admin can view all progress"
ON public.student_module_progress
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create notifications table
CREATE TABLE public.notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    type text NOT NULL DEFAULT 'info',
    read boolean DEFAULT false,
    related_id uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view their notifications"
ON public.notifications
FOR SELECT
USING (auth.uid() = user_id);

-- Users can update (mark as read) their own notifications
CREATE POLICY "Users can update their notifications"
ON public.notifications
FOR UPDATE
USING (auth.uid() = user_id);

-- Faculty can create notifications for their students
CREATE POLICY "Faculty can create notifications for their students"
ON public.notifications
FOR INSERT
WITH CHECK (
    has_role(auth.uid(), 'faculty'::app_role)
    AND EXISTS (
        SELECT 1 FROM public.faculty_students 
        WHERE faculty_id = auth.uid() AND student_id = notifications.user_id
    )
);

-- Admin can create any notification
CREATE POLICY "Admin can create any notification"
ON public.notifications
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at on modules
CREATE TRIGGER update_modules_updated_at
BEFORE UPDATE ON public.modules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add trigger for updated_at on student_module_progress
CREATE TRIGGER update_student_module_progress_updated_at
BEFORE UPDATE ON public.student_module_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.student_module_progress;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.learning_goals;

-- Add admin RLS policies to existing tables
CREATE POLICY "Admin can view all learning goals"
ON public.learning_goals
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin can manage all learning goals"
ON public.learning_goals
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin can view all quiz progress"
ON public.user_quiz_progress
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin can view all user achievements"
ON public.user_achievements
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin can view all user daily challenges"
ON public.user_daily_challenges
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin can view all roles"
ON public.user_roles
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin can manage all roles"
ON public.user_roles
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default modules
INSERT INTO public.modules (name, description, category, difficulty, total_lessons, xp_reward) VALUES
('Climate Basics', 'Introduction to climate science and global warming', 'Climate', 'beginner', 5, 100),
('Renewable Energy', 'Learn about solar, wind, and other renewable energy sources', 'Energy', 'intermediate', 8, 150),
('Water Conservation', 'Techniques for conserving water in daily life', 'Conservation', 'beginner', 4, 80),
('Biodiversity', 'Understanding ecosystems and species protection', 'Ecology', 'intermediate', 6, 120),
('Sustainable Living', 'Practical tips for eco-friendly lifestyle', 'Lifestyle', 'beginner', 5, 100),
('Carbon Footprint', 'Measuring and reducing your environmental impact', 'Climate', 'intermediate', 7, 140),
('Ocean Health', 'Marine ecosystems and ocean conservation', 'Ecology', 'advanced', 8, 180),
('Green Technology', 'Innovations in environmental technology', 'Technology', 'advanced', 9, 200);