import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiArrowRight, FiCheck, FiClock } from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../../services/api";

const Interview = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [attempt, setAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState(false);

  const token = localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // Load attempt
  useEffect(() => {
    const loadInterview = async () => {
      try {
        const response = await api.get(`/attempts/${id}`, config);

        let data = response.data.attempt;
        setAttempt(data);

        if (data.questions.length) {
          setQuestions(data.questions);
          setAnswer(data.questions[0].answer || "");
          setLoading(false);
          return;
        }

        const categoryId =
          data.interviewId.categoryId?._id || data.interviewId.categoryId;

        const generated = await api.post(
          "/ai/generate-questions",
          {
            category: categoryId,
            difficulty: data.interviewId.difficulty || "medium",
            noOfQuestions: 5,
          },
          config,
        );

        const questionList = generated.data.questions || [];

        const saved = await api.post(
          `/attempts/${id}/questions`,
          { questions: questionList },
          config,
        );

        const savedQuestions = saved.data.attempt.questions || [];

        setQuestions(savedQuestions);
        setAttempt(saved.data.attempt);
        setAnswer(savedQuestions[0].answer || "");
      } catch (error) {
        toast.error(error.response.data.msg || "Unable to load interview");
        navigate("/interviews");
      } finally {
        setLoading(false);
      }
    };

    loadInterview();
  }, [id]);

  // Save answer
  const saveAnswer = async () => {
    if (!answer.trim()) {
      toast.error("Please write your answer");
      return false;
    }

    try {
      setSaving(true);

      await api.put(
        `/attempts/${id}/question/${questions[current]._id}/answer`,
        { answer },
        config,
      );

      const updated = [...questions];
      updated[current].answer = answer;
      setQuestions(updated);

      return true;
    } catch (error) {
      toast.error(error.response.data.msg || "Unable to save answer");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const nextQuestion = async () => {
    const saved = await saveAnswer();

    if (!saved) return;

    if (current < questions.length - 1) {
      const next = current + 1;
      setCurrent(next);
      setAnswer(questions[next].answer || "");
    }
  };

  const previousQuestion = () => {
    if (current === 0) return;

    const previous = current - 1;
    setCurrent(previous);
    setAnswer(questions[previous].answer || "");
  };

  // Complete
  const completeInterview = async () => {
    const saved = await saveAnswer();

    if (!saved) return;

    try {
      setCompleting(true);

      const response = await api.post(`/attempts/${id}/complete`, {}, config);

      toast.success(response.data.msg || "Interview Completed");

      navigate(`/result/${id}`);
    } catch (error) {
      toast.error(error.response.data.msg || "Unable to complete interview");
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />
      </div>
    );
  }

  if (!questions.length) return null;

  const question = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

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
            Exit
          </button>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <FiClock />
            {attempt.interviewId.duration || 30} min
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-xs text-slate-500">
            <span>
              Question {current + 1} of {questions.length}
            </span>

            <span>{Math.round(progress)}%</span>
          </div>

          <div className="h-2 rounded-full bg-slate-800">
            <div
              className="h-2 rounded-full bg-indigo-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
          <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs capitalize text-indigo-400">
            {question.type || "technical"}
          </span>

          <h1 className="mt-6 text-xl font-bold leading-8 sm:text-2xl">
            {question.question}
          </h1>

          <textarea
            rows="9"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Write your answer here..."
            className="mt-8 w-full resize-none rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm leading-6 outline-none placeholder:text-slate-600 focus:border-indigo-500"
          />

          <div className="mt-6 flex justify-between gap-3">
            <button
              onClick={previousQuestion}
              disabled={current === 0 || saving}
              className="rounded-xl border border-slate-800 px-5 py-3 text-sm text-slate-400 hover:text-white disabled:opacity-40"
            >
              Previous
            </button>

            {current === questions.length - 1 ? (
              <button
                onClick={completeInterview}
                disabled={saving || completing}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold hover:bg-emerald-500 disabled:opacity-60"
              >
                {completing ? "Checking..." : "Finish"}
                <FiCheck />
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold hover:bg-indigo-500 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Next"}
                <FiArrowRight />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Interview;
