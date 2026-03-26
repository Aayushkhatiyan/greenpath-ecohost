import { useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Leaf, Menu, X, User, Trophy, BookOpen, Home, Award, Calendar, LogOut, GraduationCap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import NotificationBell from "@/components/student/NotificationBell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const studentNavLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/modules", label: "Modules", icon: BookOpen },
  { href: "/challenges", label: "Daily", icon: Calendar },
  { href: "/achievements", label: "Badges", icon: Award },
  { href: "/leaderboard", label: "Ranks", icon: Trophy },
];

const facultyNavLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/faculty", label: "Dashboard", icon: GraduationCap },
];

const adminNavLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/admin", label: "Dashboard", icon: Shield },
];

const publicNavLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/modules", label: "Modules", icon: BookOpen },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, userRole } = useAuth();

  const navLinks = useMemo(() => {
    if (!user) return publicNavLinks;
    switch (userRole) {
      case 'faculty': return facultyNavLinks;
      case 'admin': return adminNavLinks;
      case 'student':
      default: return studentNavLinks;
    }
  }, [user, userRole]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="border-b border-border/30 bg-background/80 backdrop-blur-2xl">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="absolute inset-0 rounded-lg bg-primary/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative rounded-lg p-2 bg-primary/10 border border-primary/20">
                  <Leaf className="h-5 w-5 text-primary" />
                </div>
              </div>
              <span className="font-display text-lg font-bold gradient-text tracking-tight">
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
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Auth */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  {userRole === 'student' && <NotificationBell />}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium max-w-[120px] truncate">
                          {user.email?.split('@')[0]}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {userRole === 'admin' && (
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <Link to="/admin"><Shield className="h-4 w-4 mr-2" />Admin Dashboard</Link>
                        </DropdownMenuItem>
                      )}
                      {userRole === 'faculty' && (
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <Link to="/faculty"><GraduationCap className="h-4 w-4 mr-2" />Faculty Dashboard</Link>
                        </DropdownMenuItem>
                      )}
                      {userRole === 'student' && (
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <Link to="/profile"><User className="h-4 w-4 mr-2" />My Profile</Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                        <LogOut className="h-4 w-4 mr-2" />Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" className="text-muted-foreground text-sm" asChild>
                    <Link to="/auth">Sign In</Link>
                  </Button>
                  <Button className="bg-gradient-cosmic hover:opacity-90 transition-all rounded-xl text-sm font-semibold tracking-wide" asChild>
                    <Link to="/auth">
                      <User className="h-4 w-4 mr-2" />
                      Get Started
                    </Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu */}
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden rounded-lg p-2 bg-muted/50 border border-border/50">
              {isOpen ? <X className="h-5 w-5 text-primary" /> : <Menu className="h-5 w-5 text-primary" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-2xl border-b border-border/30 animate-fade-in">
          <div className="container mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-4 border-t border-border/30 space-y-2">
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />{user.email}
                  </div>
                  <Button variant="ghost" className="w-full justify-start text-destructive" onClick={() => { handleSignOut(); setIsOpen(false); }}>
                    <LogOut className="h-4 w-4 mr-2" />Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link to="/auth" onClick={() => setIsOpen(false)}>Sign In</Link>
                  </Button>
                  <Button className="w-full bg-gradient-cosmic rounded-xl" asChild>
                    <Link to="/auth" onClick={() => setIsOpen(false)}><User className="h-4 w-4 mr-2" />Get Started</Link>
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
