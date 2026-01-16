import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationEmailRequest {
  type: 'goal_assigned' | 'task_assigned' | 'attendance_started' | 'new_student' | 'quiz_created' | 'general';
  recipientEmail: string;
  recipientName?: string;
  subject: string;
  data: {
    title?: string;
    description?: string;
    assignedBy?: string;
    studentName?: string;
    quizTitle?: string;
    sessionName?: string;
    deadline?: string;
    [key: string]: unknown;
  };
}

const getEmailTemplate = (type: string, data: NotificationEmailRequest['data']): string => {
  const baseStyle = `
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    color: #333;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  `;
  
  const headerStyle = `
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    color: white;
    padding: 30px;
    border-radius: 10px 10px 0 0;
    text-align: center;
  `;
  
  const contentStyle = `
    background: #f9fafb;
    padding: 30px;
    border-radius: 0 0 10px 10px;
    border: 1px solid #e5e7eb;
    border-top: none;
  `;

  switch (type) {
    case 'goal_assigned':
      return `
        <div style="${baseStyle}">
          <div style="${headerStyle}">
            <h1 style="margin: 0; font-size: 24px;">🎯 New Learning Goal Assigned</h1>
          </div>
          <div style="${contentStyle}">
            <h2 style="color: #22c55e; margin-top: 0;">${data.title || 'New Goal'}</h2>
            <p>${data.description || 'A new learning goal has been assigned to you.'}</p>
            ${data.deadline ? `<p><strong>Deadline:</strong> ${data.deadline}</p>` : ''}
            <p><strong>Assigned by:</strong> ${data.assignedBy || 'Faculty'}</p>
            <p style="margin-top: 20px;">Log in to EcoLearn to view your goal and start making progress!</p>
          </div>
        </div>
      `;

    case 'task_assigned':
      return `
        <div style="${baseStyle}">
          <div style="${headerStyle}">
            <h1 style="margin: 0; font-size: 24px;">📋 New Task Assigned</h1>
          </div>
          <div style="${contentStyle}">
            <h2 style="color: #22c55e; margin-top: 0;">${data.title || 'New Task'}</h2>
            <p>${data.description || 'A new task has been assigned to you.'}</p>
            ${data.deadline ? `<p><strong>Deadline:</strong> ${data.deadline}</p>` : ''}
            <p><strong>Assigned by:</strong> ${data.assignedBy || 'Faculty'}</p>
            <p style="margin-top: 20px;">Check your dashboard to get started!</p>
          </div>
        </div>
      `;

    case 'attendance_started':
      return `
        <div style="${baseStyle}">
          <div style="${headerStyle}">
            <h1 style="margin: 0; font-size: 24px;">📍 Attendance Session Started</h1>
          </div>
          <div style="${contentStyle}">
            <h2 style="color: #22c55e; margin-top: 0;">${data.sessionName || 'Attendance Session'}</h2>
            <p>An attendance session has started. Please mark your attendance now!</p>
            <p><strong>Started by:</strong> ${data.assignedBy || 'Faculty'}</p>
            <p style="margin-top: 20px; color: #ef4444;"><strong>Note:</strong> Make sure to mark your attendance before the session ends.</p>
          </div>
        </div>
      `;

    case 'new_student':
      return `
        <div style="${baseStyle}">
          <div style="${headerStyle}">
            <h1 style="margin: 0; font-size: 24px;">👋 New Student Registered</h1>
          </div>
          <div style="${contentStyle}">
            <h2 style="color: #22c55e; margin-top: 0;">Welcome ${data.studentName || 'New Student'}!</h2>
            <p>A new student has joined your class on EcoLearn.</p>
            <p><strong>Student Name:</strong> ${data.studentName || 'Anonymous'}</p>
            <p style="margin-top: 20px;">You can now assign learning goals and track their progress from your faculty dashboard.</p>
          </div>
        </div>
      `;

    case 'quiz_created':
      return `
        <div style="${baseStyle}">
          <div style="${headerStyle}">
            <h1 style="margin: 0; font-size: 24px;">📝 New Quiz Available</h1>
          </div>
          <div style="${contentStyle}">
            <h2 style="color: #22c55e; margin-top: 0;">${data.quizTitle || 'New Quiz'}</h2>
            <p>${data.description || 'A new quiz is now available for you to take.'}</p>
            <p style="margin-top: 20px;">Test your knowledge and earn XP by completing this quiz!</p>
          </div>
        </div>
      `;

    default:
      return `
        <div style="${baseStyle}">
          <div style="${headerStyle}">
            <h1 style="margin: 0; font-size: 24px;">🌱 EcoLearn Notification</h1>
          </div>
          <div style="${contentStyle}">
            <h2 style="color: #22c55e; margin-top: 0;">${data.title || 'Notification'}</h2>
            <p>${data.description || 'You have a new notification from EcoLearn.'}</p>
          </div>
        </div>
      `;
  }
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: NotificationEmailRequest = await req.json();
    const { type, recipientEmail, subject, data } = requestData;

    console.log(`Sending ${type} notification email to ${recipientEmail}`);

    const htmlContent = getEmailTemplate(type, data);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "EcoLearn <onboarding@resend.dev>",
        to: [recipientEmail],
        subject: subject,
        html: htmlContent,
      }),
    });

    const emailResponse = await res.json();

    if (!res.ok) {
      console.error("Resend API error:", emailResponse);
      throw new Error(emailResponse.message || "Failed to send email");
    }

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error in send-notification-email function:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
