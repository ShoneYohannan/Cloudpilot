import React, { useState, useEffect } from "react";
import api from "../utils/api";
import {
  History,
  CheckCircle,
  XCircle,
  Loader2,
  Terminal as TerminalIcon,
  X,
  AlertCircle
} from "lucide-react";

const HistoryPage = () => {
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal State
  const [activeDeployment, setActiveDeployment] = useState(null);
  const [showLogModal, setShowLogModal] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get("/deploy/history");
      setDeployments(res.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch historical deployment pipelines.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const viewLogs = (dep) => {
    setActiveDeployment(dep);
    setShowLogModal(true);
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
        <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in">
      <div>
        <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">Deployment Pipeline History</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Global audit logs of all build actions running across your clusters</p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-200/50 text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      <div className="overflow-x-auto">
        {deployments.length > 0 ? (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="pb-3 font-medium">Build ID</th>
                <th className="pb-3 font-medium">Project Name</th>
                <th className="pb-3 font-medium">Commit Hash</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Build Duration</th>
                <th className="pb-3 font-medium">Execution Date</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850/60">
              {deployments.map((dep) => (
                <tr key={dep._id} className="text-slate-650 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-850/10">
                  <td className="py-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    #{dep._id.slice(-6)}
                  </td>
                  <td className="py-4 font-semibold text-slate-800 dark:text-white">
                    {dep.project?.name || "Deleted Project"}
                  </td>
                  <td className="py-4 font-mono font-medium">{dep.commitHash}</td>
                  <td className="py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-semibold ${
                        dep.status === "success"
                          ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"
                          : dep.status === "failed"
                          ? "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400"
                          : "bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400 animate-pulse"
                      }`}
                    >
                      {dep.status === "success" && <CheckCircle className="h-3 w-3" />}
                      {dep.status === "failed" && <XCircle className="h-3 w-3" />}
                      {dep.status === "in_progress" && <Loader2 className="h-3 w-3 animate-spin" />}
                      {dep.status}
                    </span>
                  </td>
                  <td className="py-4 font-medium">
                    {dep.duration ? `${dep.duration}s` : "Pending"}
                  </td>
                  <td className="py-4 font-medium">
                    {new Date(dep.createdAt).toLocaleString()}
                  </td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => viewLogs(dep)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                    >
                      <TerminalIcon className="h-3.5 w-3.5" />
                      Logs
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-16 space-y-1 text-slate-400">
            <p className="font-semibold text-sm">No deployment records found.</p>
            <p className="text-xs font-light">Trigger a build sequence inside one of your Projects.</p>
          </div>
        )}
      </div>

      {/* Terminal Log Stream Modal */}
      {showLogModal && activeDeployment && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-3xl w-full max-w-4xl shadow-2xl relative flex flex-col h-[550px] overflow-hidden">
            
            {/* Terminal Header */}
            <div className="px-6 py-4 bg-[#1e293b]/70 border-b border-[#334155] flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500"></span>
                <span className="h-3 w-3 rounded-full bg-amber-500"></span>
                <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-semibold text-[#94a3b8] font-mono ml-3">
                  cloudpilot@azure-app-service: ~ (Build #{activeDeployment._id.slice(-6)})
                </span>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="p-1 rounded hover:bg-slate-700 text-[#94a3b8] hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Terminal Body */}
            <div className="flex-1 overflow-y-auto p-6 font-mono text-xs text-[#cbd5e1] space-y-2.5 terminal-scrollbar bg-[#020617]">
              {activeDeployment.logs.map((log, index) => {
                let colorClass = "text-[#cbd5e1]";
                if (log.type === "success") colorClass = "text-emerald-400 font-bold";
                if (log.type === "error") colorClass = "text-rose-400 font-bold";
                if (log.type === "warning") colorClass = "text-amber-400";
                return (
                  <div key={index} className="flex gap-3 leading-relaxed">
                    <span className="text-[#475569] shrink-0">
                      [{new Date(log.timestamp).toLocaleTimeString()}]
                    </span>
                    <span className={colorClass}>{log.message}</span>
                  </div>
                );
              })}

              <div className="pt-2 text-[#475569] border-t border-[#1e293b]/50 text-[10px] mt-6">
                Build initialized by user token at {new Date(activeDeployment.createdAt).toString()}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default HistoryPage;
