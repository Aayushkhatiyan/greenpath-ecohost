import { ArrowRight, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-void-light to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-gradient-cosmic opacity-10 blur-3xl" />
      </div>

      <div className="container relative z-10 px-4">
        <div className="glass rounded-3xl p-8 md:p-16 text-center max-w-4xl mx-auto glow-mint">
          {/* Icon */}
          <div className="inline-flex glass rounded-2xl p-4 mb-8 glow-mint animate-float">
            <Leaf className="h-10 w-10 text-mint" />
          </div>

          {/* Content */}
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Ready to Make a{' '}
            <span className="gradient-text">Difference</span>?
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Join the GreenPath community today and start your journey towards 
            a more sustainable lifestyle. Every action counts.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/modules">
              <Button size="lg" className="bg-gradient-cosmic hover:opacity-90 transition-opacity text-lg px-8 py-6">
                Start Learning Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/leaderboard">
              <Button size="lg" variant="outline" className="border-border hover:bg-muted/50 text-lg px-8 py-6">
                View Leaderboard
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <p className="text-sm text-muted-foreground mt-8">
            🌱 No credit card required • Free forever tier • Join 10,000+ learners
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
