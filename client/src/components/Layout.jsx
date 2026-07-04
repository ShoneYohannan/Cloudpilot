import React from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  FolderGit2,
  History,
  User,
  LogOut,
  Sun,
  Moon,
  Cloud,
  Menu,
  X
} from "lucide-react";

const Layout = () => {
  const { user, logout, darkMode, toggleDarkMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/projects", icon: FolderGit2 },
    { name: "Deployment History", href: "/history", icon: History },
    { name: "Profile", href: "/profile", icon: User }
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getPageTitle = () => {
    const currentPath = location.pathname;
    if (currentPath === "/dashboard") return "Dashboard Overview";
    if (currentPath === "/projects") return "Projects Management";
    if (currentPath.startsWith("/projects/")) return "Project Configuration";
    if (currentPath === "/history") return "Deployment Pipeline History";
    if (currentPath === "/profile") return "User Profile Settings";
    return "CloudPilot";
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200">
      
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0">
        {/* Brand Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="p-2 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30">
            <Cloud className="h-5 w-5 animate-pulse" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
            CloudPilot
          </span>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || (item.href !== "/dashboard" && location.pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 shadow-sm border-l-4 border-indigo-600 dark:border-indigo-500"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer / User Profile & Logout */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-indigo-100 dark:bg-slate-800 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-slate-700">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="truncate max-w-[120px]">
                <p className="font-semibold text-sm truncate">{user?.name || "User"}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 font-medium transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Menu */}
      <div className="md:hidden flex items-center justify-between px-6 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-30">
        <div className="flex items-center gap-3">
          <Cloud className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <span className="font-display font-bold text-lg tracking-tight">CloudPilot</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white dark:bg-slate-900 z-20 flex flex-col px-6 py-8 space-y-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-4 py-3 px-4 rounded-xl text-lg font-medium ${
                  isActive ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400" : "text-slate-700 dark:text-slate-300"
                }`}
              >
                <Icon className="h-6 w-6" />
                {item.name}
              </Link>
            );
          })}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center gap-4 py-3 px-4 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {darkMode ? <Sun className="h-6 w-6 text-amber-500" /> : <Moon className="h-6 w-6" />}
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center gap-4 py-3 px-4 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              <LogOut className="h-6 w-6" />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="hidden md:flex h-16 items-center justify-between px-8 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <h1 className="font-display font-semibold text-lg text-slate-800 dark:text-white">
            {getPageTitle()}
          </h1>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              {darkMode ? <Sun className="h-4.5 w-4.5 text-amber-500" /> : <Moon className="h-4.5 w-4.5" />}
            </button>
            
            {/* Server Connectivity Status Indicator */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/50 text-xs font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live: Connected
            </div>
          </div>
        </header>

        {/* Route view wrapper */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
