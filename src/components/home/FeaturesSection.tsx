import { BookOpen, Trophy, Zap, Leaf, Target, BarChart3, LucideIcon } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: "primary" | "secondary";
}

const features: Feature[] = [
  { icon: BookOpen, title: "Interactive Modules", description: "Bite-sized lessons on recycling, energy saving, sustainable shopping, and more.", color: "primary" },
  { icon: Trophy, title: "Earn Achievements", description: "Complete challenges and unlock badges as you progress through your eco-journey.", color: "secondary" },
  { icon: BarChart3, title: "Track Your Impact", description: "Visualize your carbon footprint reduction and environmental contributions.", color: "primary" },
  { icon: Target, title: "Daily Challenges", description: "New eco-friendly tasks every day to keep you engaged and learning.", color: "secondary" },
  { icon: Leaf, title: "Real-World Actions", description: "Apply what you learn with practical tips you can implement immediately.", color: "primary" },
  { icon: Zap, title: "Community Leaderboard", description: "Compete with friends and climb the ranks of eco-conscious citizens.", color: "secondary" },
];

const FeatureCard = ({ feature, index }: { feature: Feature; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const isPrimary = feature.color === "primary";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className="group relative"
    >
      <div className={`absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
        isPrimary ? "bg-primary/10" : "bg-secondary/10"
      } blur-xl`} />

      <div className="relative rounded-2xl bg-card p-8 h-full border border-border/50 group-hover:border-primary/20 transition-all duration-500">
        {/* Number watermark */}
        <div className="absolute top-5 right-6 font-display text-[4rem] font-bold leading-none text-foreground/[0.03] group-hover:text-foreground/[0.06] transition-all duration-500 select-none">
          {String(index + 1).padStart(2, '0')}
        </div>

        <motion.div
          className={`inline-flex rounded-xl p-3.5 mb-6 ${
            isPrimary ? "bg-primary/10" : "bg-secondary/10"
          }`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <feature.icon className={`h-6 w-6 ${isPrimary ? "text-primary" : "text-secondary"}`} />
        </motion.div>

        <h3 className="font-display text-lg font-semibold mb-2.5 tracking-tight">{feature.title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>

        {/* Bottom accent line */}
        <motion.div
          className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-b-2xl ${
            isPrimary ? "bg-gradient-to-r from-primary/60 via-primary/30 to-transparent" : "bg-gradient-to-r from-secondary/60 via-secondary/30 to-transparent"
          }`}
          initial={{ scaleX: 0, originX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: index * 0.08 + 0.3 }}
          viewport={{ once: true }}
        />
      </div>
    </motion.div>
  );
};

const FeaturesSection = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-primary/[0.03] blur-[150px]"
          animate={{ x: [0, 40, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-secondary/[0.03] blur-[150px]"
          animate={{ x: [0, -40, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container relative z-10 px-4">
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isHeaderInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-8 border border-border/50 bg-card/50"
          >
            <Zap className="h-3.5 w-3.5 text-secondary" />
            <span className="text-xs font-semibold text-secondary uppercase tracking-[0.2em]">Features</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
          >
            Learn, Play, and{' '}
            <span className="gradient-text">Save the Planet</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-lg leading-relaxed"
          >
            Our gamified approach makes sustainability education engaging,
            fun, and effective for everyone.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {features.map((feature, i) => (
            <FeatureCard key={i} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
