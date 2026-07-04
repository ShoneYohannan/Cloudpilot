import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import {
  FolderGit2,
  CheckCircle,
  XCircle,
  Activity as ActivityIcon,
  Plus,
  Loader2,
  ExternalLink,
  GitBranch,
  Terminal
} from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/dashboard");
      setStats(res.data.data.stats);
      setActivities(res.data.data.recentActivities);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch dashboard telemetry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getSuccessRate = () => {
    if (!stats || stats.totalDeployments === 0) return "100%";
    const rate = (stats.successfulDeployments / stats.totalDeployments) * 100;
    return `${rate.toFixed(0)}%`;
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "project_created":
        return <FolderGit2 className="h-5 w-5 text-indigo-500" />;
      case "project_updated":
      case "project_deleted":
        return <FolderGit2 className="h-5 w-5 text-amber-500" />;
      case "deployment_started":
        return <Loader2 className="h-5 w-5 text-sky-500 animate-spin" />;
      case "deployment_success":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case "deployment_failed":
        return <XCircle className="h-5 w-5 text-rose-500" />;
      default:
        return <ActivityIcon className="h-5 w-5 text-slate-500" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Header skeleton */}
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
          <div className="h-10 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
        </div>
        {/* Stats grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-3xl border border-slate-300/30 dark:border-slate-800/30"></div>
          ))}
        </div>
        {/* Content grid skeleton */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
          <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Quick Action Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">Telemetry & Pipeline Statistics</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Real-time status monitoring of cloud resources and pipelines</p>
        </div>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-500/25 transition-all w-fit cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Create New Project
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/50 text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Projects */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Total Projects</p>
            <p className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">{stats?.totalProjects || 0}</p>
          </div>
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/50">
            <FolderGit2 className="h-6 w-6" />
          </div>
        </div>

        {/* Successful Deployments */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Success Builds</p>
            <p className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">{stats?.successfulDeployments || 0}</p>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/50">
            <CheckCircle className="h-6 w-6" />
          </div>
        </div>

        {/* Failed Deployments */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Failed Builds</p>
            <p className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">{stats?.failedDeployments || 0}</p>
          </div>
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100/50 dark:border-rose-900/50">
            <XCircle className="h-6 w-6" />
          </div>
        </div>

        {/* Pipeline Success Rate */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Success Rate</p>
            <p className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">{getSuccessRate()}</p>
          </div>
          <div className="p-4 rounded-2xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 border border-violet-100/50 dark:border-violet-900/50">
            <ActivityIcon className="h-6 w-6" />
          </div>
        </div>

      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Pipeline Success Rate Trend Visualisation */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Active Deployment Pipelines</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Simulated build and health check parameters (successful vs failed ratio)</p>
          </div>
          
          <div className="h-64 flex flex-col justify-center items-center relative overflow-hidden bg-slate-50 dark:bg-slate-950 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-850">
            {/* Mock Graph visualization using pure SVG */}
            {stats && stats.totalDeployments > 0 ? (
              <div className="w-full h-full flex flex-col justify-between">
                <div className="flex-1 flex items-end gap-8 px-6 pb-2">
                  <div className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      style={{ height: `${(stats.successfulDeployments / Math.max(stats.totalDeployments, 1)) * 100}%` }} 
                      className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 dark:from-emerald-700 dark:to-emerald-500 rounded-t-xl min-h-[20px] transition-all duration-500"
                    ></div>
                    <span className="text-xs font-semibold text-slate-500">Successful Builds ({stats.successfulDeployments})</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      style={{ height: `${(stats.failedDeployments / Math.max(stats.totalDeployments, 1)) * 100}%` }} 
                      className="w-full bg-gradient-to-t from-rose-600 to-rose-400 dark:from-rose-700 dark:to-rose-500 rounded-t-xl min-h-[20px] transition-all duration-500"
                    ></div>
                    <span className="text-xs font-semibold text-slate-500">Failed Builds ({stats.failedDeployments})</span>
                  </div>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-800 pt-2 text-center text-xs text-slate-400">
                  Data reflects total compiled pipelines run under your user space ({stats.totalDeployments} builds).
                </div>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <FolderGit2 className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto" />
                <p className="text-sm font-semibold text-slate-400">No deployment telemetry recorded yet.</p>
                <Link to="/projects" className="text-xs text-indigo-500 hover:underline">Launch your first pipeline</Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Recent Activities</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Audit logs of actions performed within your account</p>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[260px] pr-1">
            {activities.length > 0 ? (
              activities.map((act) => (
                <div key={act._id} className="flex gap-3 text-xs leading-relaxed">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/50 shrink-0 h-fit">
                    {getActivityIcon(act.type)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{act.description}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                      {new Date(act.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 space-y-1 text-slate-400">
                <p className="font-semibold text-sm">No recent activities.</p>
                <p className="text-xs">Your system audits will compile here.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
