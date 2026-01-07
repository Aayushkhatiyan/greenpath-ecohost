-- Create an enum for user roles
CREATE TYPE public.app_role AS ENUM ('student', 'faculty');

-- Create the user_roles table
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'student',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable Row-Level Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check if a user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Security definer function to get user's role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own role"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own role during signup"
ON public.user_roles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Faculty can view all profiles (update existing policy)
CREATE POLICY "Faculty can view all profiles"
ON public.profiles
FOR SELECT
USING (public.has_role(auth.uid(), 'faculty'));

-- Faculty can view all user achievements
CREATE POLICY "Faculty can view all achievements"
ON public.user_achievements
FOR SELECT
USING (public.has_role(auth.uid(), 'faculty'));

-- Faculty can view all daily challenges
CREATE POLICY "Faculty can view all daily challenges"
ON public.user_daily_challenges
FOR SELECT
USING (public.has_role(auth.uid(), 'faculty'));

-- Faculty can view all quiz progress
CREATE POLICY "Faculty can view all quiz progress"
ON public.user_quiz_progress
FOR SELECT
USING (public.has_role(auth.uid(), 'faculty'));

-- Update handle_new_user function to also create a role entry
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, username)
  VALUES (new.id, new.raw_user_meta_data ->> 'username');
  
  -- Insert role from user metadata, default to 'student'
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, COALESCE((new.raw_user_meta_data ->> 'role')::app_role, 'student'));
  
  RETURN new;
END;
$function$;