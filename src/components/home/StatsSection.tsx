import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { TreePine, Droplets, Wind, Recycle } from "lucide-react";

const stats = [
  { icon: TreePine, value: 12500, suffix: "+", label: "Trees Saved", color: "mint" as const },
  { icon: Droplets, value: 2.4, suffix: "M L", label: "Water Conserved", color: "violet" as const },
  { icon: Wind, value: 850, suffix: "T", label: "CO₂ Reduced", color: "mint" as const },
  { icon: Recycle, value: 98, suffix: "%", label: "Student Satisfaction", color: "violet" as const },
];

const AnimatedCounter = ({ target, suffix, inView }: { target: number; suffix: string; inView: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current * 10) / 10);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  const display = target >= 100 ? Math.floor(count).toLocaleString() : count.toFixed(1);

  return (
    <span className="font-display text-4xl md:text-5xl lg:text-6xl font-bold gradient-text">
      {display}{suffix}
    </span>
  );
};

const testimonials = [
  {
    quote: "GreenPath made learning about sustainability genuinely fun. The gamification aspect keeps me coming back every day!",
    name: "Sarah K.",
    role: "Environmental Science Student",
  },
  {
    quote: "The daily challenges have changed my habits completely. I'm now more conscious about my environmental impact.",
    name: "James L.",
    role: "Computer Science Major",
  },
  {
    quote: "As a faculty member, the analytics dashboard gives me incredible insights into student engagement.",
    name: "Dr. Patel",
    role: "Sustainability Professor",
  },
];

const StatsSection = () => {
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const testimonialRef = useRef(null);
  const isTestimonialInView = useInView(testimonialRef, { once: true, margin: "-50px" });

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-void-light/50 to-background" />

      <div className="container relative z-10 px-4">
        {/* Stats Grid */}
        <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-32">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="text-center"
            >
              <motion.div
                className={`inline-flex rounded-2xl p-4 mb-5 ${
                  stat.color === "mint" ? "bg-mint/10" : "bg-violet/10"
                }`}
                whileHover={{ scale: 1.15, rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <stat.icon className={`h-8 w-8 ${stat.color === "mint" ? "text-mint" : "text-violet"}`} />
              </motion.div>
              <div className="mb-2">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} inView={isStatsInView} />
              </div>
              <p className="text-muted-foreground font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <div ref={testimonialRef}>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={isTestimonialInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-display text-3xl md:text-4xl font-bold text-center mb-12"
          >
            What Our <span className="gradient-text">Community</span> Says
          </motion.h3>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={isTestimonialInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ y: -5 }}
                className="glass rounded-2xl p-8 relative overflow-hidden group"
              >
                {/* Quote mark */}
                <div className="absolute top-4 right-6 font-display text-7xl text-mint/10 leading-none select-none group-hover:text-mint/20 transition-colors duration-500">
                  "
                </div>

                <p className="text-foreground/80 leading-relaxed mb-6 relative z-10">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-cosmic flex items-center justify-center text-sm font-bold text-primary-foreground">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
