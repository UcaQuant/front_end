import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type StartExamResponse = {
  sessionId: string;
  duration: number; // minutes (optional from backend)
};

export default function InstructionsPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);

  /* --------------------------------------------------
     Guard: must have studentId
  -------------------------------------------------- */
  useEffect(() => {
    const studentId = localStorage.getItem("studentId");

    if (!studentId) {
      navigate("/registration", { replace: true });
    }
  }, [navigate]);

  /* --------------------------------------------------
     Start Exam
  -------------------------------------------------- */
  const handleStartExam = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch("/api/v1/exams/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to start exam");
      }

      const data: StartExamResponse = await res.json();

      // save session
      localStorage.setItem("examSessionId", data.sessionId);

      if (data.duration) setDuration(data.duration);

      navigate("/exam");
    } catch (err) {
      alert("Unable to start exam. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* --------------------------------------------------
     UI
  -------------------------------------------------- */
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-md p-8 space-y-6">
        <h1 className="text-2xl font-semibold">Exam Instructions</h1>

        {/* Rules */}
        <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
          <li>No tab switching during the exam.</li>
          <li>Do not refresh the browser.</li>
          <li>Each question may have a time limit.</li>
          <li>Once submitted, answers cannot be changed.</li>
          <li>Ensure stable internet connection.</li>
        </ul>

        {/* Duration */}
        <div className="bg-slate-100 rounded-lg p-4 text-sm">
          <strong>Duration:</strong> {duration ?? "90"} minutes
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartExam}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Starting..." : "Start Exam"}
        </button>
      </div>
    </div>
  );
}
