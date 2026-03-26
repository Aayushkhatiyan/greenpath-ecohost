import { ArrowRight, Leaf, Zap, Users, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Hero3DScene from "./Hero3DScene";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* 3D Background */}
      <Hero3DScene />

      {/* Overlays */}
      <div className="absolute inset-0 z-[1]">
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/50 to-background" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 z-[1] opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }}
      />

      <div className="container relative z-10 px-4 py-20">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="glass rounded-full px-6 py-2.5 mb-10 flex items-center gap-3 border border-primary/20"
          >
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
              Gamified Sustainability Platform
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold mb-8 leading-[1.05] tracking-tight"
          >
            Learn to Live{' '}
            <motion.span
              className="inline-block relative"
              style={{
                backgroundSize: "200% 200%",
                backgroundImage: "linear-gradient(135deg, hsl(160 84% 39%), hsl(38 92% 50%), hsl(160 84% 39%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            >
              Sustainably
            </motion.span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-14 leading-relaxed"
          >
            Join thousands of eco-warriors mastering sustainable living through
            interactive modules, challenges, and real-time competition.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 mb-20"
          >
            <Link to="/modules">
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400 }}>
                <Button size="lg" className="bg-gradient-cosmic hover:opacity-90 transition-all glow-mint text-base px-10 py-7 rounded-2xl font-semibold tracking-wide">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400 }}>
              <Button size="lg" variant="outline" className="border-border/60 hover:border-primary/40 hover:bg-primary/5 text-base px-10 py-7 rounded-2xl font-semibold tracking-wide transition-all">
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="flex items-center gap-12 md:gap-20"
          >
            {[
              { icon: Users, value: "10K+", label: "Active Learners" },
              { icon: Leaf, value: "50+", label: "Eco Modules" },
              { icon: Zap, value: "1M+", label: "Actions Taken" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="flex flex-col items-center group cursor-default"
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="mb-3 p-3 rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors duration-300">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="font-display text-2xl md:text-3xl font-bold gradient-text">
                  {stat.value}
                </span>
                <span className="text-xs text-muted-foreground mt-1 tracking-wide uppercase">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">Scroll</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground/40" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
