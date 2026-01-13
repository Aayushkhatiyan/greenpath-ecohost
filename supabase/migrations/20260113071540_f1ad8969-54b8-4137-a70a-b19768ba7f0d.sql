-- Create learning goals table
CREATE TABLE public.learning_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  goal_type TEXT NOT NULL CHECK (goal_type IN ('xp', 'quizzes', 'challenges', 'streak', 'modules')),
  target_value INTEGER NOT NULL,
  current_value INTEGER NOT NULL DEFAULT 0,
  deadline DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired')),
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.learning_goals ENABLE ROW LEVEL SECURITY;

-- Faculty can view all learning goals
CREATE POLICY "Faculty can view all learning goals"
ON public.learning_goals
FOR SELECT
USING (has_role(auth.uid(), 'faculty'::app_role));

-- Faculty can create learning goals
CREATE POLICY "Faculty can create learning goals"
ON public.learning_goals
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'faculty'::app_role));

-- Faculty can update learning goals
CREATE POLICY "Faculty can update learning goals"
ON public.learning_goals
FOR UPDATE
USING (has_role(auth.uid(), 'faculty'::app_role));

-- Faculty can delete learning goals
CREATE POLICY "Faculty can delete learning goals"
ON public.learning_goals
FOR DELETE
USING (has_role(auth.uid(), 'faculty'::app_role));

-- Students can view their own learning goals
CREATE POLICY "Students can view own learning goals"
ON public.learning_goals
FOR SELECT
USING (auth.uid() = student_id);

-- Create trigger for updated_at
CREATE TRIGGER update_learning_goals_updated_at
BEFORE UPDATE ON public.learning_goals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();