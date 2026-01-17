-- Update the function to also send welcome notification to new students
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
    
    -- Send welcome notification to the new student
    INSERT INTO notifications (user_id, title, message, type)
    VALUES (
      NEW.user_id,
      '🎉 Welcome to EduQuest!',
      'Welcome aboard! Here are some tips to get started: 1) Complete your first quiz to earn XP 2) Check out the Daily Challenges for bonus rewards 3) Explore the Modules to learn new skills 4) Climb the Leaderboard by staying consistent. Good luck on your learning journey!',
      'welcome'
    );
    
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