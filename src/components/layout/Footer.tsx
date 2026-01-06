import { Leaf, Github, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative py-12 border-t border-border/50">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="glass rounded-lg p-2">
              <Leaf className="h-5 w-5 text-mint" />
            </div>
            <span className="font-display text-lg font-bold gradient-text">
              GreenPath
            </span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/modules" className="hover:text-foreground transition-colors">
              Modules
            </Link>
            <Link to="/leaderboard" className="hover:text-foreground transition-colors">
              Leaderboard
            </Link>
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms
            </a>
          </div>

          {/* Social */}
          <div className="flex items-center gap-3">
            <a href="#" className="glass rounded-lg p-2 hover:bg-muted/50 transition-colors">
              <Twitter className="h-4 w-4 text-muted-foreground" />
            </a>
            <a href="#" className="glass rounded-lg p-2 hover:bg-muted/50 transition-colors">
              <Github className="h-4 w-4 text-muted-foreground" />
            </a>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          © 2024 GreenPath. Made with 💚 for the planet.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
