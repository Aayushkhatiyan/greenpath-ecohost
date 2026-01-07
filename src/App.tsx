import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Lazy load pages for optimal performance
const Index = lazy(() => import("./pages/Index"));
const Modules = lazy(() => import("./pages/Modules"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const Quiz = lazy(() => import("./pages/Quiz"));
const Achievements = lazy(() => import("./pages/Achievements"));
const DailyChallenges = lazy(() => import("./pages/DailyChallenges"));
const Auth = lazy(() => import("./pages/Auth"));
const Profile = lazy(() => import("./pages/Profile"));
const FacultyDashboard = lazy(() => import("./pages/FacultyDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/modules" element={<Modules />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/quiz/:moduleId" element={<Quiz />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/challenges" element={<DailyChallenges />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/faculty" element={<FacultyDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
