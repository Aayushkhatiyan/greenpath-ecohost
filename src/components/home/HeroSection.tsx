import { ArrowRight, Leaf, Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-void-light" />
        
        {/* Floating Blobs */}
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-mint/10 blur-3xl animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-violet/10 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-mint/5 blur-3xl animate-pulse-glow" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--border)) 1px, transparent 1px),
                             linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="container relative z-10 px-4 py-20">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="glass rounded-full px-4 py-2 mb-8 flex items-center gap-2 glow-mint animate-fade-in">
            <Leaf className="h-4 w-4 text-mint" />
            <span className="text-sm font-medium text-mint">
              Gamified Sustainability Learning
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Learn to Live{' '}
            <span className="gradient-text text-glow-mint">
              Sustainably
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Join thousands of eco-warriors on an interactive journey to master sustainable living. 
            Complete modules, earn points, and compete with friends while saving the planet.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Link to="/modules">
              <Button size="lg" className="bg-gradient-cosmic hover:opacity-90 transition-opacity glow-mint text-lg px-8 py-6">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-border hover:bg-muted/50 text-lg px-8 py-6">
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 md:gap-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {[
              { icon: Users, value: "10K+", label: "Active Learners" },
              { icon: Leaf, value: "50+", label: "Eco Modules" },
              { icon: Zap, value: "1M+", label: "Actions Taken" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="glass rounded-xl p-3 mb-3 glow-mint">
                  <stat.icon className="h-6 w-6 text-mint" />
                </div>
                <span className="font-display text-2xl md:text-3xl font-bold gradient-text">
                  {stat.value}
                </span>
                <span className="text-sm text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
