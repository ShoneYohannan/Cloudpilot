import React from "react";
import { Link } from "react-router-dom";
import { Cloud, GitPullRequest, ShieldCheck, Terminal, ArrowRight, Server, Cpu } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-200">
      
      {/* Header */}
      <header className="px-6 lg:px-16 h-20 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white">
            <Cloud className="h-5 w-5 animate-pulse" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
            CloudPilot
          </span>
        </div>
        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white rounded-xl shadow-lg shadow-indigo-500/25 transition-all"
          >
            Register
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 px-6 lg:px-16 flex-1 flex flex-col items-center text-center justify-center overflow-hidden">
        {/* Abstract background grids/circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>
        
        <div className="relative max-w-4xl z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200/50 dark:border-indigo-900/50">
            <Server className="h-3.5 w-3.5" />
            Vite + React + Node.js + Mongoose + Docker + Azure
          </div>

          <h1 className="font-display font-extrabold text-5xl lg:text-7xl leading-tight tracking-tight text-slate-900 dark:text-white">
            Simulate and Orchestrate your <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 dark:from-indigo-400 dark:to-pink-400 bg-clip-text text-transparent">
              Cloud Deployments
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-400 font-light leading-relaxed">
            CloudPilot is a cloud-native development dashboard designed to simulate Docker container builds, push to Azure Container Registry, and run mock deployment pipelines to Azure App Service. Perfect for showcase portfolios.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/35 hover:-translate-y-0.5 transition-all text-base"
            >
              Access Dashboard
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-slate-300 dark:border-slate-800 bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-2xl transition-all hover:-translate-y-0.5 text-base"
            >
              View GitHub Repo
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 lg:px-16 border-t border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-slate-900 dark:text-white">
              Resume-Ready Cloud Architecture
            </h2>
            <p className="max-w-xl mx-auto text-slate-500 dark:text-slate-400">
              Showcases production-grade full-stack patterns conforming to Cloud Developer AZ-204 standards.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex flex-col gap-4">
              <div className="p-3 w-fit rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                <GitPullRequest className="h-6 w-6" />
              </div>
              <h3 className="font-display font-semibold text-lg text-slate-900 dark:text-white">
                Project Tracking
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Seamless project configuration mapping to external GitHub repositories. Full CRUD capability secured by robust REST policies.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex flex-col gap-4">
              <div className="p-3 w-fit rounded-2xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400">
                <Terminal className="h-6 w-6" />
              </div>
              <h3 className="font-display font-semibold text-lg text-slate-900 dark:text-white">
                Simulated Build Runner
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Asynchronous worker simulation compiling Docker files, building tags, pushing image layers, and outputting step-by-step rolling terminal logs.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex flex-col gap-4">
              <div className="p-3 w-fit rounded-2xl bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-display font-semibold text-lg text-slate-900 dark:text-white">
                JWT Guarded Policies
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Session state protected by JWT middleware security. Encrypted passwords powered by salted bcrypt hooks in MongoDB.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-slate-400 dark:text-slate-600 border-t border-slate-200 dark:border-slate-800">
        © 2026 CloudPilot App. Devised for portfolio showcasing purposes. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
