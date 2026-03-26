import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="relative py-16 border-t border-border/30">
      <div className="container relative z-10 px-4">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <motion.div className="rounded-xl p-2 bg-primary/10" whileHover={{ rotate: 15 }}>
                <Leaf className="h-5 w-5 text-primary" />
              </motion.div>
              <span className="font-display text-xl font-bold gradient-text">GreenPath</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Making sustainability education engaging and accessible through gamification.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">Quick Links</h4>
            <div className="space-y-3">
              {[
                { to: "/modules", label: "Modules" },
                { to: "/leaderboard", label: "Leaderboard" },
                { to: "/challenges", label: "Daily Challenges" },
                { to: "/achievements", label: "Achievements" },
              ].map((link) => (
                <Link key={link.to} to={link.to} className="block text-sm text-muted-foreground hover:text-primary transition-colors">{link.label}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">Legal</h4>
            <div className="space-y-3">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                <a key={item} href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">{item}</a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border/30 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© 2024 GreenPath. Made with 💚 for the planet.</p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground/50">
            <span>Powered by</span>
            <span className="gradient-text font-semibold">Sustainable Tech</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
