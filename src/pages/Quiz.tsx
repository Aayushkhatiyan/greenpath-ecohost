import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, ArrowRight, CheckCircle2, XCircle, 
  Trophy, Leaf, Zap, RotateCcw, Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getQuizByModuleId } from "@/data/quizData";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type QuizState = "intro" | "quiz" | "review" | "results";

const Quiz = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const quiz = getQuizByModuleId(Number(moduleId));

  const [state, setState] = useState<QuizState>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (quiz) {
      setSelectedAnswers(new Array(quiz.questions.length).fill(null));
    }
  }, [quiz]);

  if (!quiz) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold mb-4">Quiz Not Found</h1>
            <Link to="/modules">
              <Button>Back to Modules</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const isAnswered = selectedAnswers[currentQuestion] !== null;
  const isCorrect = selectedAnswers[currentQuestion] === question?.correctAnswer;
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  const handleSelectAnswer = (answerIndex: number) => {
    if (isAnswered) return;
    
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };

  const saveQuizProgress = async (correctCount: number) => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const scorePercentage = Math.round((correctCount / quiz!.questions.length) * 100);
      
      const { error } = await supabase
        .from("user_quiz_progress")
        .insert({
          user_id: user.id,
          quiz_id: String(moduleId),
          score: scorePercentage
        });
      
      if (error) throw error;
      
      // Update profile XP and quizzes_completed
      const xpToAdd = scorePercentage >= quiz!.passingScore ? quiz!.xpReward : Math.round(quiz!.xpReward * 0.25);
      
      const { data: profile } = await supabase
        .from("profiles")
        .select("total_xp, quizzes_completed")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (profile) {
        await supabase
          .from("profiles")
          .update({
            total_xp: profile.total_xp + xpToAdd,
            quizzes_completed: profile.quizzes_completed + 1
          })
          .eq("user_id", user.id);
      }
      
      toast.success("Quiz progress saved!");
    } catch (error) {
      console.error("Failed to save quiz progress:", error);
      toast.error("Failed to save progress");
    } finally {
      setIsSaving(false);
    }
  };

  const calculateResults = async () => {
    const correctCount = selectedAnswers.filter(
      (answer, index) => answer === quiz!.questions[index].correctAnswer
    ).length;
    setScore(correctCount);
    setState("results");

    const percentage = (correctCount / quiz!.questions.length) * 100;
    if (percentage >= quiz!.passingScore) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#2dd4bf", "#8b5cf6", "#10b981"]
      });
    }
    
    // Save progress to database
    await saveQuizProgress(correctCount);
  };

  const handleRestart = () => {
    setState("intro");
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(quiz.questions.length).fill(null));
    setShowExplanation(false);
    setScore(0);
  };

  const percentage = Math.round((score / quiz.questions.length) * 100);
  const passed = percentage >= quiz.passingScore;
  const xpEarned = passed ? quiz.xpReward : Math.round(quiz.xpReward * 0.25);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container px-4 max-w-3xl mx-auto">
          {/* Intro State */}
          {state === "intro" && (
            <div className="text-center animate-fade-in">
              <div className="glass rounded-2xl p-4 mb-8 inline-flex glow-mint animate-float">
                <Leaf className="h-10 w-10 text-mint" />
              </div>
              
              <h1 className="font-display text-4xl font-bold mb-4">
                {quiz.title}
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                {quiz.description}
              </p>

              <div className="glass rounded-2xl p-6 mb-8 max-w-md mx-auto">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold gradient-text">{quiz.questions.length}</div>
                    <div className="text-sm text-muted-foreground">Questions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold gradient-text">{quiz.passingScore}%</div>
                    <div className="text-sm text-muted-foreground">To Pass</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold gradient-text">+{quiz.xpReward}</div>
                    <div className="text-sm text-muted-foreground">XP Reward</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => navigate("/modules")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Modules
                </Button>
                <Button 
                  className="bg-gradient-cosmic hover:opacity-90"
                  onClick={() => setState("quiz")}
                >
                  Start Quiz
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Quiz State */}
          {state === "quiz" && question && (
            <div className="animate-fade-in">
              {/* Progress Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Question {currentQuestion + 1} of {quiz.questions.length}
                  </span>
                  <span className="text-sm font-medium gradient-text">
                    {Math.round(progress)}% Complete
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Question Card */}
              <div className="glass rounded-2xl p-8 mb-6">
                <h2 className="font-display text-2xl font-semibold mb-6">
                  {question.question}
                </h2>

                <div className="space-y-3">
                  {question.options.map((option, index) => {
                    const isSelected = selectedAnswers[currentQuestion] === index;
                    const isCorrectAnswer = index === question.correctAnswer;
                    const showResult = isAnswered;

                    return (
                      <button
                        key={index}
                        onClick={() => handleSelectAnswer(index)}
                        disabled={isAnswered}
                        className={cn(
                          "w-full text-left p-4 rounded-xl border-2 transition-all duration-200",
                          !showResult && "hover:border-mint/50 hover:bg-mint/5",
                          !showResult && !isSelected && "border-border bg-muted/30",
                          showResult && isCorrectAnswer && "border-mint bg-mint/10",
                          showResult && isSelected && !isCorrectAnswer && "border-destructive bg-destructive/10",
                          !showResult && isSelected && "border-mint bg-mint/10"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                              showResult && isCorrectAnswer ? "bg-mint text-primary-foreground" :
                              showResult && isSelected ? "bg-destructive text-destructive-foreground" :
                              "bg-muted text-muted-foreground"
                            )}>
                              {String.fromCharCode(65 + index)}
                            </span>
                            <span className={cn(
                              "font-medium",
                              showResult && isCorrectAnswer && "text-mint",
                              showResult && isSelected && !isCorrectAnswer && "text-destructive"
                            )}>
                              {option}
                            </span>
                          </div>
                          {showResult && isCorrectAnswer && (
                            <CheckCircle2 className="h-5 w-5 text-mint" />
                          )}
                          {showResult && isSelected && !isCorrectAnswer && (
                            <XCircle className="h-5 w-5 text-destructive" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Explanation */}
              {showExplanation && (
                <div className={cn(
                  "glass rounded-xl p-4 mb-6 animate-scale-in",
                  isCorrect ? "border border-mint/30" : "border border-destructive/30"
                )}>
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <div className="rounded-full bg-mint/20 p-2">
                        <CheckCircle2 className="h-5 w-5 text-mint" />
                      </div>
                    ) : (
                      <div className="rounded-full bg-destructive/20 p-2">
                        <XCircle className="h-5 w-5 text-destructive" />
                      </div>
                    )}
                    <div>
                      <p className={cn(
                        "font-semibold mb-1",
                        isCorrect ? "text-mint" : "text-destructive"
                      )}>
                        {isCorrect ? "Correct!" : "Not quite right"}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {question.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-end">
                <Button
                  className="bg-gradient-cosmic hover:opacity-90"
                  onClick={handleNext}
                  disabled={!isAnswered}
                >
                  {currentQuestion < quiz.questions.length - 1 ? (
                    <>
                      Next Question
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      See Results
                      <Trophy className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Results State */}
          {state === "results" && (
            <div className="text-center animate-fade-in">
              <div className={cn(
                "glass rounded-2xl p-4 mb-8 inline-flex animate-float",
                passed ? "glow-mint" : "glow-violet"
              )}>
                {passed ? (
                  <Trophy className="h-12 w-12 text-mint" />
                ) : (
                  <Zap className="h-12 w-12 text-violet" />
                )}
              </div>

              <h1 className="font-display text-4xl font-bold mb-2">
                {passed ? "Congratulations!" : "Keep Learning!"}
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                {passed 
                  ? "You've mastered this module's content!" 
                  : "Review the material and try again to earn full XP."}
              </p>

              {/* Score Card */}
              <div className="glass rounded-2xl p-8 mb-8 max-w-md mx-auto">
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(percentage / 100) * 352} 352`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#2dd4bf" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-3xl font-bold gradient-text">
                      {percentage}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="glass rounded-xl p-4">
                    <div className="text-2xl font-bold text-foreground">
                      {score}/{quiz.questions.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Correct</div>
                  </div>
                  <div className="glass rounded-xl p-4">
                    <div className="text-2xl font-bold gradient-text">
                      +{xpEarned}
                    </div>
                    <div className="text-sm text-muted-foreground">XP Earned</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" onClick={handleRestart}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Link to="/modules">
                  <Button className="bg-gradient-cosmic hover:opacity-90">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Modules
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Quiz;
