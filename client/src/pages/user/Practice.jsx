import { useEffect, useState } from "react";
import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

const Practice = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    category: "",
    difficulty: "medium",
    count: 5,
  });
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get("/categories/all-categories", config);
        setCategories(res.data.categories || []);
      } catch (error) {
        toast.error(error.response?.data?.msg || "Unable to load categories");
      }
    };

    loadCategories();
  }, []);

  const startPractice = async (e) => {
    e.preventDefault();

    if (!form.category) {
      return toast.error("Select a category");
    }

    try {
      setLoading(true);

      const res = await api.post(
        "/ai/generate-questions",
        {
          category: form.category,
          difficulty: form.difficulty,
          noOfQuestions: Number(form.count),
        },
        config,
      );

      setQuestions(res.data.questions || []);
      setAnswers({});
      setCurrent(0);
      setResult(null);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Unable to generate questions");
    } finally {
      setLoading(false);
    }
  };

  const checkAnswer = async () => {
    const question = questions[current];
    const answer = answers[current];

    if (!answer?.trim()) {
      return toast.error("Write your answer first");
    }

    try {
      setLoading(true);

      const res = await api.post(
        "/ai/answer-feedback",
        {
          question: question.question,
          answer,
        },
        config,
      );

      setResult(res.data);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Unable to evaluate answer");
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    if (current < questions.length - 1) {
      setCurrent((prev) => prev + 1);
      setResult(null);
    }
  };

  const resetPractice = () => {
    setQuestions([]);
    setAnswers({});
    setCurrent(0);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-7 flex items-center gap-2 text-sm text-slate-400 hover:text-white"
        >
          <FiArrowLeft /> Dashboard
        </button>

        {!questions.length ? (
          <>
            <div className="mb-8">
              <p className="text-sm text-indigo-400">Practice</p>
              <h1 className="mt-1 text-3xl font-bold">
                Quick Interview Practice
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Practice questions and improve your interview skills.
              </p>
            </div>

            <form
              onSubmit={startPractice}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-400">
                    Category
                  </label>

                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
                  >
                    <option value="">Select Category</option>

                    {categories.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-400">
                    Difficulty
                  </label>

                  <select
                    value={form.difficulty}
                    onChange={(e) =>
                      setForm({ ...form, difficulty: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-400">
                    Questions
                  </label>

                  <select
                    value={form.count}
                    onChange={(e) =>
                      setForm({ ...form, count: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
                  >
                    <option value="5">5 Questions</option>
                    <option value="10">10 Questions</option>
                  </select>
                </div>
              </div>

              <button
                disabled={loading}
                className="mt-6 w-full rounded-xl bg-indigo-600 py-3 font-semibold hover:bg-indigo-500 disabled:opacity-60"
              >
                {loading ? "Generating..." : "Start Practice"}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-sm text-indigo-400">
                Question {current + 1} / {questions.length}
              </p>

              <h1 className="mt-1 text-2xl font-bold">Practice Session</h1>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <h2 className="text-lg font-semibold leading-7">
                {questions[current]?.question}
              </h2>

              <textarea
                value={answers[current] || ""}
                onChange={(e) =>
                  setAnswers({
                    ...answers,
                    [current]: e.target.value,
                  })
                }
                rows="7"
                placeholder="Write your answer..."
                className="mt-6 w-full resize-none rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm outline-none focus:border-indigo-500"
              />

              {result?.feedback && (
                <div className="mt-5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
                  <div className="flex items-center gap-2 text-indigo-400">
                    <FiCheckCircle />
                    <span className="font-semibold">AI Feedback</span>
                  </div>

                  <p className="mt-3 text-sm text-slate-400">
                    <b>Ideal Answer:</b> {result.feedback.idealAnswer}
                  </p>

                  <p className="mt-3 text-sm text-slate-400">
                    <b>Improvement:</b> {result.feedback.improvementSuggestions}
                  </p>
                </div>
              )}

              <div className="mt-6 flex justify-between gap-3">
                <button
                  onClick={resetPractice}
                  className="rounded-xl border border-slate-800 px-5 py-3 text-sm text-slate-400 hover:text-white"
                >
                  Exit
                </button>

                {!result ? (
                  <button
                    onClick={checkAnswer}
                    disabled={loading}
                    className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold hover:bg-indigo-500 disabled:opacity-60"
                  >
                    {loading ? "Checking..." : "Check Answer"}
                  </button>
                ) : (
                  <button
                    onClick={nextQuestion}
                    className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold hover:bg-indigo-500"
                  >
                    {current === questions.length - 1
                      ? "Finish"
                      : "Next Question"}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Practice;
