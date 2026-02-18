import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QuestionPreviewModal from "../../components/admin/QuestionPreviewModal";

type Question = {
  id: string;
  subject: string;
  text: string;
  options: string[];
  correct: number;
};

export default function QuestionEditor() {
  const { examId } = useParams();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState<Question | null>(null);
  const [preview, setPreview] = useState(false);

  const token = localStorage.getItem("token");

  const fetchQuestions = async () => {
    const res = await fetch(`/api/v1/teacher/exams/${examId}/questions`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setQuestions(await res.json());
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const save = async () => {
    await fetch(`/api/v1/teacher/exams/${examId}/questions`, {
      method: current?.id ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(current),
    });

    fetchQuestions();
  };

  const del = async (id: string) => {
    await fetch(`/api/v1/teacher/questions/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchQuestions();
  };

  return (
    <div className="grid grid-cols-2 h-screen">
      {/* LEFT */}
      <div className="border-r p-4 overflow-y-auto space-y-2">
        {questions.map((q) => (
          <div
            key={q.id}
            className="border p-2 rounded flex justify-between"
          >
            <span>{q.text.slice(0, 40)}</span>
            <button onClick={() => setCurrent(q)}>Edit</button>
            <button onClick={() => del(q.id)}>Delete</button>
          </div>
        ))}
      </div>

      {/* RIGHT */}
      <div className="p-6 space-y-3">
        <textarea
          className="border w-full p-2"
          placeholder="Question text"
          value={current?.text || ""}
          onChange={(e) =>
            setCurrent({ ...current!, text: e.target.value })
          }
        />

        {current?.options.map((o, i) => (
          <input
            key={i}
            className="border w-full p-2"
            value={o}
            onChange={(e) => {
              const opts = [...current.options];
              opts[i] = e.target.value;
              setCurrent({ ...current, options: opts });
            }}
          />
        ))}

        <button onClick={() => setPreview(true)}>Preview</button>
        <button onClick={save} className="bg-indigo-600 text-white px-3 py-2">
          Save Question
        </button>
      </div>

      {preview && current && (
        <QuestionPreviewModal
          question={current}
          onClose={() => setPreview(false)}
        />
      )}
    </div>
  );
}
