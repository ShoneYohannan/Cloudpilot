import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import {
  FolderGit2,
  GitFork,
  ArrowLeft,
  Play,
  Terminal as TerminalIcon,
  Loader2,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Calendar,
  AlertCircle
} from "lucide-react";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Deploy State
  const [activeDeploymentId, setActiveDeploymentId] = useState(null);
  const [activeDeployment, setActiveDeployment] = useState(null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const logEndRef = useRef(null);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editRepo, setEditRepo] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editStatus, setEditStatus] = useState("active");
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const projRes = await api.get(`/projects/${id}`);
      setProject(projRes.data.data);
      
      // Seed edit form
      setEditName(projRes.data.data.name);
      setEditRepo(projRes.data.data.gitRepository);
      setEditDesc(projRes.data.data.description || "");
      setEditStatus(projRes.data.data.status);

      // Fetch deployments
      const depRes = await api.get("/deploy/history");
      const filtered = depRes.data.data.filter((dep) => dep.project._id === id);
      setDeployments(filtered);
    } catch (err) {
      console.error(err);
      setError("Failed to load project parameters.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  // Log Poller
  useEffect(() => {
    let poller;
    if (activeDeploymentId) {
      const pollLogs = async () => {
        try {
          const res = await api.get(`/deploy/${activeDeploymentId}`);
          const dep = res.data.data;
          setActiveDeployment(dep);

          // Auto-scroll logs
          setTimeout(() => {
            logEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100);

          if (dep.status === "success" || dep.status === "failed") {
            setActiveDeploymentId(null);
            // Refresh deployment history
            const histRes = await api.get("/deploy/history");
            const filtered = histRes.data.data.filter((d) => d.project._id === id);
            setDeployments(filtered);
          }
        } catch (err) {
          console.error("Poller failed:", err);
          setActiveDeploymentId(null);
        }
      };
      
      pollLogs();
      poller = setInterval(pollLogs, 1500);
    }
    return () => clearInterval(poller);
  }, [activeDeploymentId]);

  const handleTriggerDeploy = async () => {
    setDeploying(true);
    try {
      const res = await api.post("/deploy", { projectId: id });
      const initialDeployment = res.data.data;
      setActiveDeploymentId(initialDeployment._id);
      setActiveDeployment(initialDeployment);
      setShowLogModal(true);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to trigger deployment runner");
    } finally {
      setDeploying(false);
    }
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    setEditError("");

    if (!editName || !editRepo) {
      setEditError("Name and Repository cannot be blank");
      return;
    }

    try {
      setSaving(true);
      const res = await api.put(`/projects/${id}`, {
        name: editName,
        gitRepository: editRepo,
        description: editDesc,
        status: editStatus
      });
      setProject(res.data.data);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setEditError("Failed to update project fields.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm("Are you sure you want to permanently delete this project? This action is irreversible.")) {
      return;
    }
    try {
      await api.delete(`/projects/${id}`);
      navigate("/projects");
    } catch (err) {
      console.error(err);
      alert("Failed to delete project.");
    }
  };

  const viewLogs = (dep) => {
    setActiveDeployment(dep);
    setShowLogModal(true);
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
        <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-6 text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-rose-500 mx-auto" />
        <p className="font-semibold text-slate-800 dark:text-white">{error || "Project context not found"}</p>
        <button onClick={() => navigate("/projects")} className="text-indigo-500 hover:underline">Return to Projects list</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate("/projects")}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-white font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </button>
      </div>

      {/* Main Details and Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left / Project Info Panel */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          
          {isEditing ? (
            <form onSubmit={handleUpdateProject} className="space-y-4">
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Modify Configuration</h3>
              {editError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-200/50 text-xs font-semibold rounded-xl">
                  {editError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Project Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Git Repository</label>
                <input
                  type="url"
                  value={editRepo}
                  onChange={(e) => setEditRepo(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</label>
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 h-20 resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Project Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-slate-500 hover:text-slate-850 dark:hover:text-white font-semibold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-sm flex items-center gap-1.5"
                >
                  {saving && <Loader2 className="h-4.5 w-4.5 animate-spin" />}
                  Save Configurations
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200/30">
                    {project.status}
                  </span>
                  <h2 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white mt-2">
                    {project.name}
                  </h2>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-500 hover:text-slate-800 cursor-pointer"
                    title="Edit configurations"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleDeleteProject}
                    className="p-2 border border-rose-200 dark:border-red-950 rounded-xl hover:bg-rose-50 dark:hover:bg-red-950/20 text-rose-500 cursor-pointer"
                    title="Delete project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                {project.description || "No project description has been specified."}
              </p>

              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-500 dark:text-slate-450">
                <div className="flex items-center gap-2">
                  <GitFork className="h-4.5 w-4.5 text-indigo-500" />
                  <div>
                    <p className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">GitHub Source</p>
                    <a
                      href={project.gitRepository}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-800 dark:text-slate-300 font-semibold hover:underline truncate inline-block max-w-[200px]"
                    >
                      {project.gitRepository.split("/").slice(-2).join("/")}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4.5 w-4.5 text-indigo-500" />
                  <div>
                    <p className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">Registered On</p>
                    <p className="text-slate-800 dark:text-slate-300 font-semibold">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right / Pipeline Execution Control Panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Deployment Pipeline</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">
              Trigger port builds, Docker compiles, Container Registry pushes, and Web App updates simulated via cloud nodes.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
            <button
              onClick={handleTriggerDeploy}
              disabled={deploying || activeDeploymentId !== null}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {deploying || activeDeploymentId !== null ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Build Running...
                </>
              ) : (
                <>
                  <Play className="h-4.5 w-4.5" />
                  Deploy to Azure App Service
                </>
              )}
            </button>

            {activeDeploymentId && (
              <button
                onClick={() => setShowLogModal(true)}
                className="w-full py-2.5 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <TerminalIcon className="h-4 w-4" />
                Show Live Log Stream
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Deployment History Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
        <div>
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Pipeline Executions</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Historic logs and deployment status indicators</p>
        </div>

        <div className="overflow-x-auto">
          {deployments.length > 0 ? (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="pb-3 font-medium">Build ID</th>
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
            <div className="text-center py-10 space-y-1 text-slate-400">
              <p className="font-semibold text-sm">No deployment records found.</p>
              <p className="text-xs">Trigger your first Azure App Service deployment above.</p>
            </div>
          )}
        </div>
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

              {activeDeployment.status === "in_progress" && (
                <div className="flex items-center gap-2 text-indigo-400 animate-pulse pt-2 font-bold">
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                  <span>Azure deployment build runner in execution...</span>
                </div>
              )}

              <div ref={logEndRef} />
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ProjectDetails;
