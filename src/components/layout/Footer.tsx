import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="relative py-16 border-t border-border/30 overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-mint/5 blur-[120px] rounded-full" />

      <div className="container relative z-10 px-4">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <motion.div
                className="glass rounded-xl p-2 glow-mint"
                whileHover={{ rotate: 15, scale: 1.1 }}
              >
                <Leaf className="h-5 w-5 text-mint" />
              </motion.div>
              <span className="font-display text-xl font-bold gradient-text">GreenPath</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Making sustainability education engaging, fun, and accessible for everyone through gamification.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Quick Links</h4>
            <div className="space-y-3">
              {[
                { to: "/modules", label: "Modules" },
                { to: "/leaderboard", label: "Leaderboard" },
                { to: "/challenges", label: "Daily Challenges" },
                { to: "/achievements", label: "Achievements" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block text-muted-foreground hover:text-mint transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Legal</h4>
            <div className="space-y-3">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                <a key={item} href="#" className="block text-muted-foreground hover:text-mint transition-colors text-sm">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/30 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 GreenPath. Made with 💚 for the planet.
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground/60">
            <span>Powered by</span>
            <span className="gradient-text font-semibold">Sustainable Tech</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
