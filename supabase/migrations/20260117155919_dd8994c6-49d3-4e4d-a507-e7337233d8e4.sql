-- Create a function to notify faculty when a new student registers
CREATE OR REPLACE FUNCTION public.notify_faculty_new_student()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  faculty_record RECORD;
  new_username TEXT;
BEGIN
  -- Only trigger for student role
  IF NEW.role = 'student' THEN
    -- Get the username from profiles (may be null initially)
    SELECT username INTO new_username FROM profiles WHERE user_id = NEW.user_id;
    
    -- Insert notification for each faculty member
    FOR faculty_record IN 
      SELECT user_id FROM user_roles WHERE role = 'faculty'
    LOOP
      INSERT INTO notifications (user_id, title, message, type, related_id)
      VALUES (
        faculty_record.user_id,
        'New Student Enrolled',
        'A new student ' || COALESCE(new_username, '(username pending)') || ' has registered on the platform.',
        'enrollment',
        NEW.user_id
      );
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on user_roles table
DROP TRIGGER IF EXISTS on_new_student_notify_faculty ON user_roles;
CREATE TRIGGER on_new_student_notify_faculty
  AFTER INSERT ON user_roles
  FOR EACH ROW
  EXECUTE FUNCTION notify_faculty_new_student();