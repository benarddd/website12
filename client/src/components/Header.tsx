import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import SchoolLogo from "./SchoolLogo";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";

// Added ThemeToggle component
function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    
    document.body.classList.toggle('dark');
  };

  useEffect(() => {
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode === 'true') {
      setIsDarkMode(true);
      document.body.classList.add('dark');
    }
  }, []);

  return (
    <button onClick={toggleTheme} className="p-2 rounded-md bg-gray-200 dark:bg-gray-700">
      {isDarkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}


export default function Header() {
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [, setLocation] = useLocation();
  const [scrollPosition, setScrollPosition] = useState(0);
  const isScrolled = scrollPosition > 50;
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAdminLogin = () => {
    if (adminPassword === "admin123") {
      setIsAuthenticated(true);
      setAdminPassword("");
      setLocation("/admin");
      setIsAdminDialogOpen(false);
      toast({
        title: "Autentikimi u bë me sukses",
        description: "Mirë se vini në panelin e administratorit.",
        variant: "default",
      });
    } else {
      toast({
        title: "Gabim autentikimi",
        description: "Fjalëkalimi i dhënë nuk është i saktë. Ju lutemi provoni përsëri.",
        variant: "destructive",
      });
    }
  };

  // Handle scroll position manually instead of using hook
  useEffect(() => {
    const handlePositionChange = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handlePositionChange, { passive: true });
    return () => window.removeEventListener('scroll', handlePositionChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-30 shadow-lg transition-all duration-300 ${
        isScrolled 
          ? "py-2 bg-black bg-opacity-80 backdrop-blur-md" 
          : "py-4 bg-black bg-opacity-60"
      }`}
      initial={{ y: -100 }}
      animate={{ 
        y: isVisible ? 0 : -100,
        opacity: isVisible ? 1 : 0
      }}
      transition={{
        duration: 0.4,
        type: "spring",
        stiffness: 120,
        damping: 18,
      }}
      style={{
        willChange: 'transform, opacity',
        transform: 'translateZ(0)'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo and School Name */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setLocation("/")}
          >
            <motion.div
              className="mr-3 relative"
              initial={{ rotate: 0 }}
              animate={isScrolled ? {
                x: 0,
                y: 0,
                rotate: [0, 10, -10, 0],
                scale: 0.85,
              } : {
                x: 0,
                y: [0, -5, 0],
                rotate: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.8,
                ease: "easeInOut",
                y: {
                  duration: 2.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                },
                rotate: {
                  duration: 0.6,
                  ease: [0.6, 0.05, -0.01, 0.9],
                },
                scale: {
                  duration: 0.4
                }
              }}
              style={{ 
                transformStyle: 'preserve-3d',
                transformOrigin: 'center center',
                willChange: 'transform',
                backfaceVisibility: 'hidden'
              }}
            >
              <SchoolLogo 
                size="medium" 
                withShadow={isScrolled} 
                animated={true}
                pulse={isScrolled}
                colorEffect={true}
              />
            </motion.div>
            <div className="hidden md:block">
              <h1 className="text-[#26a69a] font-montserrat font-bold text-xl tracking-wide">
                Gjimnazi Abdulla Keta
              </h1>
              <p className="text-[#c0c0c0] text-xs">
                Cilësi • Edukim • Përsosmëri
              </p>
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            {[
              { path: "/maturashtetrore", label: "Matura Shteterore" },
              { path: "/about", label: "Rreth Shkollës" },
              { path: "/sections", label: "Kategoritë" },
              { path: "/news", label: "Lajmet" },
              { path: "/calendar", label: "Kalendari" },
              { path: "/schedule", label: "Orari" },
            ].map((item) => (
              <motion.div 
                key={item.path}
                whileHover={{ y: -2 }} 
                transition={{ duration: 0.2, type: "tween" }}
                style={{ willChange: "transform" }}
              >
                <Link
                  href={item.path}
                  className="text-light hover:text-[#26a69a] transition-colors duration-300"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}

            <motion.div 
              whileHover={{ scale: 1.05 }} 
              transition={{ duration: 0.2, type: "tween" }}
              style={{ willChange: "transform" }}
            >
              <Button
                onClick={() => setIsAdminDialogOpen(true)}
                className="bg-[#26a69a] hover:bg-opacity-80 text-white px-4 py-2 rounded-md transition-all duration-300 flex items-center gap-2"
              >
                <span className="text-xl">👥</span>
                Staff
              </Button>
            </motion.div>

            {/* Staff Login Dialog */}
            <Dialog open={isAdminDialogOpen} onOpenChange={setIsAdminDialogOpen}>
              <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle className="text-teal-400">Hyrje për Stafin</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Ju lutem vendosni fjalëkalimin e stafit për të menaxhuar sistemin.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-300">
                      Fjalëkalimi
                    </label>
                    <Input
                      id="password"
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Vendosni fjalëkalimin"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAdminLogin();
                        }
                      }}
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      onClick={() => setIsAdminDialogOpen(false)}
                    >
                      Anulo
                    </Button>

                    <Button
                      className="bg-teal-600 hover:bg-teal-700 text-white"
                      onClick={handleAdminLogin}
                    >
                      Kyçu
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-light hover:text-[#26a69a] focus:outline-none"
          >
            <i
              className={`fas ${
                isMobileMenuOpen ? "fa-times" : "fa-bars"
              } text-2xl`}
            ></i>
          </button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className="md:hidden mt-4 overflow-hidden"
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isMobileMenuOpen ? 1 : 0,
            height: isMobileMenuOpen ? "auto" : 0,
          }}
          transition={{ 
            duration: 0.3, 
            ease: [0.04, 0.62, 0.23, 0.98]
          }}
          style={{ 
            willChange: "opacity, height",
            transformOrigin: "top center" 
          }}
        >
          <motion.div 
            className="flex flex-col space-y-3 py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: isMobileMenuOpen ? 1 : 0 }}
            transition={{ 
              duration: 0.2,
              delay: 0.05
            }}
            style={{ willChange: "opacity" }}
          >
            {[
              { path: "/", label: "Kryefaqja" },
              { path: "/about", label: "Rreth Shkollës" },
              { path: "/sections", label: "Seksionet" },
              { path: "/news", label: "Lajmet" },
              { path: "/calendar", label: "Kalendari" },
              { path: "/schedule", label: "Orari" },
              { path: "/admin", label: "Staff" }
            ].map((item, index) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-light hover:text-[#26a69a] transition-all py-2 block transform translate-x-0 opacity-100 ${
                  isMobileMenuOpen ? 'animate-fadeInLeft' : ''
                }`}
                style={{ 
                  animationDelay: `${index * 30}ms`,
                  animationDuration: '250ms' 
                }}
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.nav>
  );
}