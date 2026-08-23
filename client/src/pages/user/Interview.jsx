import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiArrowRight, FiCheck, FiClock } from "react-icons/fi";

const Interview = () => {
  const navigate = useNavigate();
  const [answer, setAnswer] = useState("");

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate("/interviews")}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white"
          >
            <FiArrowLeft />
            Exit Interview
          </button>

          <div className="flex items-center gap-2 text-sm text-slate-400">
            <FiClock />
            24:35
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-xs text-slate-500">
            <span>Question 3 of 10</span>
            <span>30%</span>
          </div>

          <div className="h-2 rounded-full bg-slate-800">
            <div className="h-2 w-[30%] rounded-full bg-indigo-600" />
          </div>
        </div>

        {/* Question */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
          <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs text-indigo-400">
            Technical Question
          </span>

          <h1 className="mt-6 text-2xl font-bold leading-9 sm:text-3xl">
            What is the difference between useState and useEffect in React?
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Explain the purpose of both hooks and when you would use them.
          </p>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows="9"
            placeholder="Write your answer here..."
            className="mt-8 w-full resize-none rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          />

          <div className="mt-6 flex justify-between gap-3">
            <button
              type="button"
              className="rounded-xl border border-slate-800 px-5 py-3 text-sm text-slate-400 hover:text-white"
            >
              Previous
            </button>

            <button
              type="button"
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold hover:bg-indigo-500"
            >
              Next
              <FiArrowRight />
            </button>
          </div>
        </div>

        {/* Finish */}
        <div className="mt-5 text-center">
          <button
            type="button"
            className="inline-flex items-center gap-2 text-xs text-slate-600 hover:text-slate-400"
          >
            <FiCheck />
            Finish Interview
          </button>
        </div>
      </main>
    </div>
  );
};

export default Interview;
