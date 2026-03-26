import { ArrowRight, Leaf, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-32 overflow-hidden" ref={ref}>
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/[0.06] blur-[120px]"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="relative rounded-[2rem] bg-card border border-border/50 p-12 md:p-20 text-center max-w-5xl mx-auto overflow-hidden"
        >
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
            <motion.div
              className="absolute -inset-[1px]"
              style={{
                background: "conic-gradient(from 0deg, hsl(160 84% 39% / 0.2), transparent 25%, hsl(38 92% 50% / 0.2), transparent 50%, hsl(160 84% 39% / 0.2), transparent 75%, hsl(38 92% 50% / 0.2))",
              }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-[1px] rounded-[calc(2rem-1px)] bg-card" />
          </div>

          <div className="relative z-10">
            <motion.div
              className="inline-flex rounded-2xl p-5 mb-10 bg-primary/10"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Leaf className="h-10 w-10 text-primary" />
            </motion.div>

            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              Ready to Make a{' '}
              <span className="gradient-text">Difference</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
              Join the GreenPath community and start your journey towards
              a sustainable lifestyle. Every action counts.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link to="/modules">
                <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400 }}>
                  <Button size="lg" className="bg-gradient-cosmic hover:opacity-90 transition-all text-base px-10 py-7 rounded-2xl font-semibold tracking-wide glow-mint">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Start Learning Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/leaderboard">
                <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400 }}>
                  <Button size="lg" variant="outline" className="border-border/60 hover:border-primary/30 hover:bg-primary/5 text-base px-10 py-7 rounded-2xl font-semibold tracking-wide transition-all">
                    View Leaderboard
                  </Button>
                </motion.div>
              </Link>
            </div>

            <p className="text-xs text-muted-foreground tracking-wide">
              🌱 No credit card required · Free forever tier · 10,000+ active learners
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
