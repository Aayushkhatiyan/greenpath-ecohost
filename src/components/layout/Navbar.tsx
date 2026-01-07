import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Leaf, Menu, X, User, Trophy, BookOpen, Home, Award, Calendar, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/modules", label: "Modules", icon: BookOpen },
  { href: "/challenges", label: "Daily", icon: Calendar },
  { href: "/achievements", label: "Badges", icon: Award },
  { href: "/leaderboard", label: "Ranks", icon: Trophy },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="glass border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 rounded-lg bg-mint/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative glass rounded-lg p-2 glow-mint">
                  <Leaf className="h-5 w-5 text-mint" />
                </div>
              </div>
              <span className="font-display text-xl font-bold gradient-text">
                GreenPath
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200",
                      isActive
                        ? "bg-mint/10 text-mint"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Auth Button */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-mint/20 flex items-center justify-center">
                        <User className="h-4 w-4 text-mint" />
                      </div>
                      <span className="text-sm font-medium max-w-[120px] truncate">
                        {user.email?.split('@')[0]}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
                    <Link to="/auth">Sign In</Link>
                  </Button>
                  <Button className="bg-gradient-cosmic hover:opacity-90 transition-opacity glow-mint" asChild>
                    <Link to="/auth">
                      <User className="h-4 w-4 mr-2" />
                      Get Started
                    </Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden glass rounded-lg p-2"
            >
              {isOpen ? (
                <X className="h-5 w-5 text-mint" />
              ) : (
                <Menu className="h-5 w-5 text-mint" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass border-b border-border/50 animate-fade-in">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all",
                    isActive
                      ? "bg-mint/10 text-mint"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-4 border-t border-border/50 space-y-2">
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    {user.email}
                  </div>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-destructive"
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link to="/auth" onClick={() => setIsOpen(false)}>Sign In</Link>
                  </Button>
                  <Button className="w-full bg-gradient-cosmic" asChild>
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      <User className="h-4 w-4 mr-2" />
                      Get Started
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
