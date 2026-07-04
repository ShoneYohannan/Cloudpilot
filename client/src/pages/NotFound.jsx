import React from "react";
import { Link } from "react-router-dom";
import { CloudOff, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center transition-colors duration-200">
      <div className="max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
        <div className="p-4 w-fit mx-auto rounded-full bg-red-50 dark:bg-red-950/20 text-red-500">
          <CloudOff className="h-12 w-12 animate-bounce" />
        </div>

        <div className="space-y-2">
          <h1 className="font-display font-extrabold text-4xl text-slate-900 dark:text-white">404 - Lost in Cloud</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            The cluster node you are trying to reach does not exist or has been decommissioned. Please check the URL or head back home.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 w-full bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white font-semibold rounded-xl shadow-lg transition-all"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
            Back to Safety
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
