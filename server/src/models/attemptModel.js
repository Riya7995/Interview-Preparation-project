const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "interview",
      required: true,
    },

    questions: [
      {
        question: {
          type: String,
          required: true,
        },

        type: {
          type: String,
          default: "technical",
        },
        answer: {
          type: String,
          default: "",
        },
      },
    ],

    score: {
      type: Number,
      default: 0,
    },
    feedback: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["started", "completed"],
      default: "started",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("attempt", attemptSchema);
