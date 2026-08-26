import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiChevronRight,
  FiClock,
} from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../../services/api";

const History = () => {
  const navigate = useNavigate();

  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // Fetch
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("/attempts/my-attempts", config);

        setAttempts(response.data.attempts || []);
      } catch (error) {
        if (error.response.status !== 404) {
          toast.error(error.response.data.msg || "Unable to load history");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white"
        >
          <FiArrowLeft />
          Dashboard
        </button>

        <div className="mb-8 mt-6">
          <h1 className="text-3xl font-bold">Interview History</h1>

          <p className="mt-2 text-sm text-slate-500">
            Review your previous interview attempts.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />
          </div>
        ) : attempts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 py-16 text-center">
            <p className="text-sm text-slate-500">
              No interview attempts found.
            </p>

            <button
              onClick={() => navigate("/interviews")}
              className="mt-4 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold hover:bg-indigo-500"
            >
              Start Interview
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {attempts.map((attempt) => (
              <div
                key={attempt._id}
                className="flex flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-indigo-500/30 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h2 className="font-semibold">
                    {attempt.interviewId.title || "Interview"}
                  </h2>

                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <FiCalendar />
                      {new Date(attempt.createdAt).toLocaleDateString()}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <FiClock />
                      {attempt.interviewId.duration || 0} min
                    </span>

                    <span className="capitalize">{attempt.status}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:gap-6">
                  <div>
                    <p className="text-xl font-bold text-indigo-400">
                      {attempt.status === "completed"
                        ? `${attempt.score}%`
                        : "--"}
                    </p>

                    <p className="text-[11px] text-slate-600">Score</p>
                  </div>

                  {attempt.status === "completed" ? (
                    <button
                      onClick={() => navigate(`/result/${attempt._id}`)}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:bg-indigo-600 hover:text-white"
                    >
                      <FiChevronRight />
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(`/interview/${attempt._id}`)}
                      className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold hover:bg-indigo-500"
                    >
                      Continue
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default History;
