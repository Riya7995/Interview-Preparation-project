import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiAward,
  FiTarget,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";

const Performance = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white"
          >
            <FiArrowLeft />
            Dashboard
          </button>

          <p className="mt-6 text-sm text-indigo-400">Your Progress</p>

          <h1 className="mt-2 text-3xl font-bold">Performance</h1>

          <p className="mt-2 text-sm text-slate-500">
            Track your interview preparation and improvement.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <FiTarget className="text-xl text-indigo-400" />
            <p className="mt-5 text-2xl font-bold">12</p>
            <p className="mt-1 text-xs text-slate-500">Interviews</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <FiAward className="text-xl text-amber-400" />
            <p className="mt-5 text-2xl font-bold">82%</p>
            <p className="mt-1 text-xs text-slate-500">Average Score</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <FiTrendingUp className="text-xl text-emerald-400" />
            <p className="mt-5 text-2xl font-bold">+14%</p>
            <p className="mt-1 text-xs text-slate-500">Improvement</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <FiZap className="text-xl text-violet-400" />
            <p className="mt-5 text-2xl font-bold">8</p>
            <p className="mt-1 text-xs text-slate-500">Best Streak</p>
          </div>
        </div>

        {/* Chart */}
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Score Progress</h2>

              <p className="mt-1 text-xs text-slate-500">
                Your recent interview performance
              </p>
            </div>

            <span className="text-sm font-semibold text-emerald-400">+14%</span>
          </div>

          <div className="mt-8 flex h-56 items-end gap-3">
            {[45, 58, 52, 68, 61, 76, 82].map((value, index) => (
              <div
                key={index}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <div
                  className="w-full rounded-t-lg bg-indigo-600/70 transition hover:bg-indigo-500"
                  style={{ height: `${value}%` }}
                />

                <span className="text-[10px] text-slate-600">{index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Performance;
