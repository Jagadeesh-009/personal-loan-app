
import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { FileText, Home, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const Layout: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  const navItems = [
    { title: "Dashboard", href: "/", icon: Home },
    { title: "Apply", href: "/apply", icon: FileText },
    { title: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
          <div className="text-xl sm:text-2xl font-bold text-blue-600">LoanEasy</div>
          <nav className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium",
                  location.pathname === item.href
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-blue-50"
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>
          <div>
            <Link to="/apply">
              <Button size={isMobile ? "sm" : "default"}>Apply Now</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>

      <footer className="bg-white shadow-inner py-3 sm:py-4">
        <div className="container mx-auto px-4 text-center text-gray-500 text-xs sm:text-sm">
          &copy; {new Date().getFullYear()} LoanEasy. All rights reserved.
        </div>
      </footer>

      <div className="md:hidden bg-white border-t fixed bottom-0 left-0 right-0 z-10">
        <div className="grid grid-cols-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-col items-center py-2",
                  location.pathname === item.href
                    ? "text-blue-700"
                    : "text-gray-700"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Layout;
