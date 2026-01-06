import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Lazy load pages for optimal performance
const Index = lazy(() => import("./pages/Index"));
const Modules = lazy(() => import("./pages/Modules"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const Quiz = lazy(() => import("./pages/Quiz"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
