import { Leaf } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-mint/20 blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-violet/20 blur-3xl animate-blob animation-delay-2000" />
      </div>

      {/* Loading Content */}
      <div className="relative flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-cosmic blur-xl opacity-50 animate-pulse-glow" />
          <div className="relative glass rounded-full p-6 glow-mint">
            <Leaf className="h-10 w-10 text-mint animate-float" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <h2 className="font-display text-xl font-semibold gradient-text">
            Loading GreenPath
          </h2>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-2 w-2 rounded-full bg-mint animate-pulse"
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
