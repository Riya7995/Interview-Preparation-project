import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiTarget,
  FiTrendingUp,
} from "react-icons/fi";

const Result = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white"
          >
            <FiArrowLeft />
            Dashboard
          </button>

          <p className="mt-6 text-sm text-indigo-400">Interview Completed</p>

          <h1 className="mt-2 text-3xl font-bold">Your Interview Result</h1>
        </div>

        {/* Score */}
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10 text-2xl font-bold text-indigo-400">
              82
            </div>

            <p className="mt-4 text-sm text-slate-500">Overall Score</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <FiTarget className="text-xl text-emerald-400" />

            <p className="mt-5 text-2xl font-bold">8/10</p>

            <p className="mt-1 text-sm text-slate-500">Questions Completed</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <FiClock className="text-xl text-amber-400" />

            <p className="mt-5 text-2xl font-bold">24 min</p>

            <p className="mt-1 text-sm text-slate-500">Time Taken</p>
          </div>
        </div>

        {/* Feedback */}
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <FiCheckCircle className="text-xl text-emerald-400" />

            <h2 className="text-lg font-semibold">AI Feedback</h2>
          </div>

          <p className="mt-5 text-sm leading-7 text-slate-400">
            Your answers showed a good understanding of the core concepts. Try
            to give more structured explanations and include practical examples
            when answering technical questions.
          </p>

          <div className="mt-6 rounded-xl bg-indigo-500/5 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-indigo-400">
              <FiTrendingUp />
              Improvement Area
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Focus on explaining concepts with real-world examples.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/interviews")}
          className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold hover:bg-indigo-500"
        >
          Practice Again
        </button>
      </main>
    </div>
  );
};

export default Result;
