import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { FolderGit2, Plus, GitFork, ArrowRight, Loader2, X, AlertCircle } from "lucide-react";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [gitRepository, setGitRepository] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get("/projects");
      setProjects(res.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch projects database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!name || !gitRepository) {
      setFormError("Please fill in name and Git repository link");
      return;
    }

    // Git URL validation regex
    const gitRegex = /^(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(\.git)?\/?$/;
    if (!gitRegex.test(gitRepository)) {
      setFormError("Please enter a valid GitHub repository URL (e.g., https://github.com/user/repo)");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/projects", { name, description, gitRepository });
      
      // Clean form & reload
      setName("");
      setDescription("");
      setGitRepository("");
      setModalOpen(false);
      fetchProjects();
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || "Failed to create project");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
          <div className="h-10 w-36 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in relative">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">Active Projects</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage repository setups and verify pipeline endpoints</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Create Project
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/50 text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj._id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                    <FolderGit2 className="h-5 w-5" />
                  </div>
                  <span
                    className={`px-2.5 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${
                      proj.status === "active"
                        ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    }`}
                  >
                    {proj.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white truncate">
                    {proj.name}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 line-clamp-2 h-8">
                    {proj.description || "No project description provided."}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5 truncate max-w-[150px]">
                  <GitFork className="h-3.5 w-3.5" />
                  <span className="truncate">{proj.gitRepository.split("/").slice(-2).join("/")}</span>
                </div>

                <Link
                  to={`/projects/${proj._id}`}
                  className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  Manage
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
          <FolderGit2 className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-display font-bold text-lg text-slate-700 dark:text-slate-300">No projects found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              You haven't registered any repositories yet. Get started by creating your first project!
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white rounded-xl text-sm font-semibold shadow-md cursor-pointer transition-all"
          >
            Create First Project
          </button>
        </div>
      )}

      {/* Creation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-xl relative animate-scale-up space-y-6">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">Register New Project</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Connect repository configuration endpoints for deployment simulation</p>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/50 text-xs font-semibold flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider" htmlFor="proj-name">
                  Project Name
                </label>
                <input
                  id="proj-name"
                  type="text"
                  placeholder="My microservice app"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider" htmlFor="proj-repo">
                  Git Repository URL (GitHub)
                </label>
                <input
                  id="proj-repo"
                  type="url"
                  placeholder="https://github.com/username/repository"
                  value={gitRepository}
                  onChange={(e) => setGitRepository(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider" htmlFor="proj-desc">
                  Description (Optional)
                </label>
                <textarea
                  id="proj-desc"
                  placeholder="Provide details about the microservice endpoints..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm h-20 resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white text-sm font-semibold shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Register Project
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default Projects;
