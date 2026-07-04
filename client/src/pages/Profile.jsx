import React from "react";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Shield, Calendar, Terminal } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm relative overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          {/* Avatar */}
          <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white text-4xl font-bold font-display shadow-lg shadow-indigo-500/30">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>

          {/* Core metadata */}
          <div className="text-center md:text-left space-y-2 flex-1">
            <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
              {user?.name}
            </h2>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                <Shield className="h-3 w-3" />
                {user?.role ? user.role.toUpperCase() : "USER"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 text-xs font-semibold border border-indigo-200/30 dark:border-indigo-900/30">
                <Terminal className="h-3 w-3" />
                Cloud Operator
              </span>
            </div>
          </div>
        </div>

        {/* Detailed stats grids */}
        <div className="grid md:grid-cols-2 gap-6 mt-10 border-t border-slate-200 dark:border-slate-800 pt-8 relative z-10">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/50">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Email Address</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/50">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Account Created</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">{formatDate(user?.createdAt)}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
