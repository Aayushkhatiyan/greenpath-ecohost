import { ArrowRight, Leaf, Zap, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Hero3DScene from "./Hero3DScene";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* 3D Background Scene */}
      <Hero3DScene />

      {/* Gradient Overlays for readability */}
      <div className="absolute inset-0 z-[1]">
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 z-[1] opacity-10"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--border)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="container relative z-10 px-4 py-20">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="glass rounded-full px-5 py-2.5 mb-8 flex items-center gap-2.5 glow-mint"
          >
            <Sparkles className="h-4 w-4 text-mint animate-pulse" />
            <span className="text-sm font-semibold tracking-wide text-mint uppercase">
              Gamified Sustainability Learning
            </span>
            <Sparkles className="h-4 w-4 text-mint animate-pulse" />
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.05]"
          >
            Learn to Live{' '}
            <motion.span
              className="gradient-text text-glow-mint inline-block"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{
                backgroundSize: "200% 200%",
                backgroundImage: "linear-gradient(135deg, hsl(168 76% 50%), hsl(258 89% 66%), hsl(168 76% 50%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Sustainably
            </motion.span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mb-12 leading-relaxed"
          >
            Join thousands of eco-warriors on an interactive journey to master sustainable living.
            Complete modules, earn points, and compete while saving the planet.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 mb-20"
          >
            <Link to="/modules">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button size="lg" className="bg-gradient-cosmic hover:opacity-90 transition-all glow-mint text-lg px-10 py-7 rounded-2xl font-semibold">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button size="lg" variant="outline" className="border-border hover:bg-muted/50 text-lg px-10 py-7 rounded-2xl font-semibold backdrop-blur-sm">
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="grid grid-cols-3 gap-6 md:gap-20 w-full max-w-3xl"
          >
            {[
              { icon: Users, value: "10K+", label: "Active Learners" },
              { icon: Leaf, value: "50+", label: "Eco Modules" },
              { icon: Zap, value: "1M+", label: "Actions Taken" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="flex flex-col items-center group"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="glass rounded-2xl p-4 mb-4 glow-mint group-hover:shadow-[0_0_40px_hsl(168_76%_50%/0.4)] transition-shadow duration-500"
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <stat.icon className="h-7 w-7 text-mint" />
                </motion.div>
                <span className="font-display text-3xl md:text-4xl font-bold gradient-text">
                  {stat.value}
                </span>
                <span className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-mint/40 flex items-start justify-center p-1.5">
          <motion.div
            className="w-1.5 h-3 rounded-full bg-mint"
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
