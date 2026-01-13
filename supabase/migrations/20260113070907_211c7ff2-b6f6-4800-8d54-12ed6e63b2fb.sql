-- Allow faculty to view all user roles
CREATE POLICY "Faculty can view all user roles" 
ON public.user_roles 
FOR SELECT 
USING (has_role(auth.uid(), 'faculty'::app_role));