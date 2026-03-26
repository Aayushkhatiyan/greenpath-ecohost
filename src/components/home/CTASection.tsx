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
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-void-light to-background" />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gradient-cosmic opacity-[0.08] blur-[100px]"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative glass rounded-[2rem] p-10 md:p-20 text-center max-w-5xl mx-auto overflow-hidden"
        >
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-[2rem] p-[1px] overflow-hidden">
            <motion.div
              className="absolute inset-0"
              style={{
                background: "conic-gradient(from 0deg, hsl(168 76% 50% / 0.3), transparent 30%, hsl(258 89% 66% / 0.3), transparent 60%, hsl(168 76% 50% / 0.3))",
              }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <motion.div
              className="inline-flex glass rounded-2xl p-5 mb-10"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Leaf className="h-12 w-12 text-mint" />
            </motion.div>

            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Ready to Make a{' '}
              <span className="gradient-text text-glow-mint">Difference</span>?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
              Join the GreenPath community today and start your journey towards
              a more sustainable lifestyle. Every action counts.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link to="/modules">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" className="bg-gradient-cosmic hover:opacity-90 transition-all text-lg px-10 py-7 rounded-2xl font-semibold glow-mint">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Start Learning Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/leaderboard">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" variant="outline" className="border-mint/20 hover:bg-muted/50 text-lg px-10 py-7 rounded-2xl font-semibold backdrop-blur-sm">
                    View Leaderboard
                  </Button>
                </motion.div>
              </Link>
            </div>

            <p className="text-sm text-muted-foreground">
              🌱 No credit card required • Free forever tier • Join 10,000+ learners
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
