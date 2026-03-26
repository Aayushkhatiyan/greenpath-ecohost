import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { TreePine, Droplets, Wind, Recycle } from "lucide-react";

const stats = [
  { icon: TreePine, value: 12500, suffix: "+", label: "Trees Saved", color: "primary" as const },
  { icon: Droplets, value: 2.4, suffix: "M L", label: "Water Conserved", color: "secondary" as const },
  { icon: Wind, value: 850, suffix: "T", label: "CO₂ Reduced", color: "primary" as const },
  { icon: Recycle, value: 98, suffix: "%", label: "Satisfaction", color: "secondary" as const },
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
      if (current >= target) { setCount(target); clearInterval(timer); }
      else { setCount(Math.floor(current * 10) / 10); }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  const display = target >= 100 ? Math.floor(count).toLocaleString() : count.toFixed(1);
  return <span className="font-display text-4xl md:text-5xl font-bold gradient-text">{display}{suffix}</span>;
};

const testimonials = [
  { quote: "GreenPath made learning about sustainability genuinely fun. The gamification keeps me coming back every day!", name: "Sarah K.", role: "Environmental Science Student" },
  { quote: "The daily challenges have completely changed my habits. I'm now far more conscious about my environmental impact.", name: "James L.", role: "Computer Science Major" },
  { quote: "As faculty, the analytics dashboard gives me incredible insights into student engagement and progress.", name: "Dr. Patel", role: "Sustainability Professor" },
];

const StatsSection = () => {
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const testimonialRef = useRef(null);
  const isTestimonialInView = useInView(testimonialRef, { once: true, margin: "-50px" });

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />

      <div className="container relative z-10 px-4">
        {/* Stats */}
        <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-32">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="text-center"
            >
              <motion.div
                className={`inline-flex rounded-2xl p-4 mb-5 ${
                  stat.color === "primary" ? "bg-primary/10" : "bg-secondary/10"
                }`}
                whileHover={{ scale: 1.1, rotate: 8 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <stat.icon className={`h-7 w-7 ${stat.color === "primary" ? "text-primary" : "text-secondary"}`} />
              </motion.div>
              <div className="mb-2">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} inView={isStatsInView} />
              </div>
              <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <div ref={testimonialRef}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isTestimonialInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-6 border border-border/50 bg-card/50">
              <span className="text-xs font-semibold text-primary uppercase tracking-[0.2em]">Testimonials</span>
            </div>
            <h3 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
              Trusted by <span className="gradient-text">Our Community</span>
            </h3>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={isTestimonialInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                whileHover={{ y: -4 }}
                className="rounded-2xl bg-card p-8 border border-border/50 hover:border-primary/15 transition-all duration-500 relative overflow-hidden group"
              >
                {/* Quote mark */}
                <div className="absolute top-3 right-5 font-display text-6xl text-primary/[0.06] group-hover:text-primary/[0.12] leading-none select-none transition-colors duration-500">"</div>

                <p className="text-foreground/75 leading-relaxed mb-6 text-sm relative z-10">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-cosmic flex items-center justify-center text-sm font-bold text-primary-foreground">
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
