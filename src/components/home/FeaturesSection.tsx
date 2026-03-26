import { BookOpen, Trophy, Zap, Leaf, Target, BarChart3, LucideIcon } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: "mint" | "violet";
}

const features: Feature[] = [
  {
    icon: BookOpen,
    title: "Interactive Modules",
    description: "Bite-sized lessons on recycling, energy saving, sustainable shopping, and more.",
    color: "mint",
  },
  {
    icon: Trophy,
    title: "Earn Achievements",
    description: "Complete challenges and unlock badges as you progress through your eco-journey.",
    color: "violet",
  },
  {
    icon: BarChart3,
    title: "Track Your Impact",
    description: "Visualize your carbon footprint reduction and environmental contributions.",
    color: "mint",
  },
  {
    icon: Target,
    title: "Daily Challenges",
    description: "New eco-friendly tasks every day to keep you engaged and learning.",
    color: "violet",
  },
  {
    icon: Leaf,
    title: "Real-World Actions",
    description: "Apply what you learn with practical tips you can implement immediately.",
    color: "mint",
  },
  {
    icon: Zap,
    title: "Community Leaderboard",
    description: "Compete with friends and climb the ranks of eco-conscious citizens.",
    color: "violet",
  },
];

const FeatureCard = ({ feature, index }: { feature: Feature; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const isMint = feature.color === "mint";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, rotateX: 10 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative"
    >
      {/* Glow backdrop on hover */}
      <div className={`absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl ${
        isMint ? "bg-mint/20" : "bg-violet/20"
      }`} />

      <div className="relative glass rounded-2xl p-8 h-full border border-transparent group-hover:border-mint/20 transition-all duration-500 overflow-hidden">
        {/* Corner accent */}
        <div className={`absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
          isMint
            ? "bg-gradient-to-bl from-mint/10 to-transparent"
            : "bg-gradient-to-bl from-violet/10 to-transparent"
        }`} />

        {/* Icon */}
        <motion.div
          className={`inline-flex rounded-2xl p-4 mb-5 ${
            isMint ? "bg-mint/10" : "bg-violet/10"
          }`}
          whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
          transition={{ duration: 0.5 }}
        >
          <feature.icon className={`h-7 w-7 ${isMint ? "text-mint" : "text-violet"}`} />
        </motion.div>

        {/* Number */}
        <div className={`absolute top-6 right-6 font-display text-6xl font-bold opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-500 ${
          isMint ? "text-mint" : "text-violet"
        }`}>
          0{index + 1}
        </div>

        <h3 className="font-display text-xl font-semibold mb-3">{feature.title}</h3>
        <p className="text-muted-foreground leading-relaxed">{feature.description}</p>

        {/* Bottom line accent */}
        <motion.div
          className={`absolute bottom-0 left-0 h-[2px] ${
            isMint ? "bg-gradient-to-r from-mint to-transparent" : "bg-gradient-to-r from-violet to-transparent"
          }`}
          initial={{ width: "0%" }}
          whileInView={{ width: "100%" }}
          transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
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
      {/* Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-0 h-[500px] w-[500px] rounded-full bg-mint/5 blur-[120px]"
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-0 h-[500px] w-[500px] rounded-full bg-violet/5 blur-[120px]"
          animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container relative z-10 px-4">
        {/* Section Header */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isHeaderInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="glass rounded-full px-5 py-2.5 mb-8 inline-flex items-center gap-2"
          >
            <Zap className="h-4 w-4 text-violet" />
            <span className="text-sm font-semibold text-violet uppercase tracking-wide">Why GreenPath?</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            Learn, Play, and{' '}
            <span className="gradient-text text-glow-mint">Save the Planet</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-lg md:text-xl leading-relaxed"
          >
            Our gamified approach makes sustainability education engaging,
            fun, and effective for everyone.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, i) => (
            <FeatureCard key={i} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
