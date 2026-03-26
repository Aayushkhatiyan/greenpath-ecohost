import { Leaf } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-primary/10 blur-[120px] animate-blob" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-secondary/10 blur-[120px] animate-blob animation-delay-2000" />
      </div>

      <div className="relative flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-cosmic blur-xl opacity-40 animate-pulse-glow" />
          <div className="relative rounded-full p-6 bg-primary/10 border border-primary/20">
            <Leaf className="h-10 w-10 text-primary animate-float" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-3">
          <h2 className="font-display text-xl font-semibold gradient-text tracking-tight">Loading GreenPath</h2>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
