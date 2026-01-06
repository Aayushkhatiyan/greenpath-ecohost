import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-mint/10 blur-3xl animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-violet/10 blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="relative z-10 text-center px-4">
        <div className="glass rounded-2xl p-3 mb-8 inline-flex glow-mint animate-float">
          <Leaf className="h-8 w-8 text-mint" />
        </div>
        
        <h1 className="font-display text-8xl font-bold gradient-text mb-4">404</h1>
        <h2 className="font-display text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Looks like you've wandered off the green path. Let's get you back on track!
        </p>

        <Link to="/">
          <Button className="bg-gradient-cosmic hover:opacity-90 transition-opacity">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
