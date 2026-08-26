import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle, FiClock, FiTarget } from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../../services/api";

const Result = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // Fetch result
  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await api.get(`/attempts/${id}`, config);

        const attemptData = response.data.attempt;

        if (attemptData.status !== "completed") {
          toast.info("This interview is not completed yet");
          navigate(`/interview/${id}`);
          return;
        }

        setAttempt(attemptData);
      } catch (error) {
        toast.error(error.response?.data?.msg || "Unable to load result");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />
      </div>
    );
  }

  if (!attempt) return null;

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
          <p className="text-sm text-indigo-400">Interview Completed</p>

          <h1 className="mt-2 text-3xl font-bold">Your Interview Result</h1>

          <p className="mt-2 text-sm text-slate-500">
            {attempt.interviewId.title || "Interview"}
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10 text-2xl font-bold text-indigo-400">
              {attempt.score}%
            </div>

            <p className="mt-4 text-sm text-slate-500">Overall Score</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <FiTarget className="text-xl text-emerald-400" />

            <p className="mt-5 text-2xl font-bold">
              {attempt.questions.length || 0}
            </p>

            <p className="text-sm text-slate-500">Questions</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <FiClock className="text-xl text-amber-400" />

            <p className="mt-5 text-2xl font-bold capitalize">
              {attempt.status}
            </p>

            <p className="text-sm text-slate-500">Status</p>
          </div>
        </div>

        {/* Feedback */}
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <FiCheckCircle className="text-xl text-emerald-400" />

            <h2 className="text-lg font-semibold">AI Feedback</h2>
          </div>

          <p className="mt-5 text-sm leading-7 text-slate-400">
            {attempt.feedback || "No feedback available."}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/interviews")}
            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold hover:bg-indigo-500"
          >
            Practice Again
          </button>

          <button
            onClick={() => navigate("/history")}
            className="rounded-xl border border-slate-800 px-5 py-3 text-sm text-slate-400 hover:text-white"
          >
            View History
          </button>
        </div>
      </main>
    </div>
  );
};

export default Result;
