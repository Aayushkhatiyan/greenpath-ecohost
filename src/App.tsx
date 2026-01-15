import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

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
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
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
              {/* Student-only routes - faculty and admin cannot access */}
              <Route path="/leaderboard" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Leaderboard />
                </ProtectedRoute>
              } />
              <Route path="/quiz/:moduleId" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Quiz />
                </ProtectedRoute>
              } />
              <Route path="/achievements" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Achievements />
                </ProtectedRoute>
              } />
              <Route path="/challenges" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <DailyChallenges />
                </ProtectedRoute>
              } />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Profile />
                </ProtectedRoute>
              } />
              {/* Faculty-only route */}
              <Route path="/faculty" element={
                <ProtectedRoute allowedRoles={['faculty']}>
                  <FacultyDashboard />
                </ProtectedRoute>
              } />
              {/* Admin-only route */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
