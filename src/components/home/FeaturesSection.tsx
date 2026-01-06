import { BookOpen, Trophy, Zap, Leaf, Target, BarChart3 } from "lucide-react";

const features = [
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

const FeaturesSection = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-mint/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-violet/5 blur-3xl" />
      </div>

      <div className="container relative z-10 px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="glass rounded-full px-4 py-2 mb-6 inline-flex items-center gap-2">
            <Zap className="h-4 w-4 text-violet" />
            <span className="text-sm font-medium text-violet">Why GreenPath?</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Learn, Play, and{' '}
            <span className="gradient-text">Save the Planet</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Our gamified approach makes sustainability education engaging, 
            fun, and effective for everyone.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group glass rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div
                className={`inline-flex rounded-xl p-3 mb-4 ${
                  feature.color === "mint"
                    ? "bg-mint/10 glow-mint"
                    : "bg-violet/10 glow-violet"
                } group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon
                  className={`h-6 w-6 ${
                    feature.color === "mint" ? "text-mint" : "text-violet"
                  }`}
                />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
