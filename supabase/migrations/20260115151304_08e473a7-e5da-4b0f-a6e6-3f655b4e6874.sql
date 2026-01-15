-- Drop the restrictive policy
DROP POLICY IF EXISTS "Faculty can create notifications for their students" ON public.notifications;

-- Create a more permissive policy for faculty to create notifications
CREATE POLICY "Faculty can create notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'faculty'::app_role));