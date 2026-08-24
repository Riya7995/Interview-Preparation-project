import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiAward,
  FiTarget,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../../services/api";

const Performance = () => {
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // Fetch
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get(
          "/attempts/analytics/my-analytics",
          config,
        );
        console.log(response);

        setAnalytics(response.data.analytics);
      } catch (error) {
        if (error.response.status !== 404) {
          toast.error(error.response.data.msg || "Unable to load performance");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white"
        >
          <FiArrowLeft />
          Dashboard
        </button>

        <div className="mb-8 mt-6">
          <p className="text-sm text-indigo-400">Your Progress</p>

          <h1 className="mt-2 text-3xl font-bold">Performance</h1>

          <p className="mt-2 text-sm text-slate-500">
            Track your interview preparation and progress.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />
          </div>
        ) : !analytics ? (
          <div className="rounded-2xl border border-dashed border-slate-800 py-16 text-center">
            <p className="text-sm text-slate-500">
              Complete an interview to see your performance.
            </p>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <FiTarget className="text-xl text-indigo-400" />

                <p className="mt-5 text-2xl font-bold">
                  {analytics.totalAttempts}
                </p>

                <p className="mt-1 text-xs text-slate-500">Total Attempts</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <FiAward className="text-xl text-emerald-400" />

                <p className="mt-5 text-2xl font-bold">
                  {analytics.completedAttempts}
                </p>

                <p className="mt-1 text-xs text-slate-500">Completed</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <FiTrendingUp className="text-xl text-amber-400" />

                <p className="mt-5 text-2xl font-bold">
                  {analytics.averageScore}%
                </p>

                <p className="mt-1 text-xs text-slate-500">Average Score</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <FiZap className="text-xl text-violet-400" />

                <p className="mt-5 text-2xl font-bold">
                  {analytics.pendingAttempts}
                </p>

                <p className="mt-1 text-xs text-slate-500">Pending</p>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">Interview Progress</h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Completed vs pending interviews
                  </p>
                </div>

                <span className="text-sm font-semibold text-indigo-400">
                  {analytics.totalAttempts
                    ? Math.round(
                        (analytics.completedAttempts /
                          analytics.totalAttempts) *
                          100,
                      )
                    : 0}
                  %
                </span>
              </div>

              <div className="mt-6 h-3 rounded-full bg-slate-800">
                <div
                  className="h-3 rounded-full bg-indigo-600"
                  style={{
                    width: `${
                      analytics.totalAttempts
                        ? (analytics.completedAttempts /
                            analytics.totalAttempts) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>

              <div className="mt-5 flex justify-between text-xs text-slate-500">
                <span>Completed: {analytics.completedAttempts}</span>

                <span>Pending: {analytics.pendingAttempts}</span>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Performance;
