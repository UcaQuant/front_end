import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export default function CreateExamModal({ open, onClose, onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const submit = async () => {
    if (!title.trim()) return alert("Title required");
    if (duration < 5 || duration > 120)
      return alert("Time must be 5-120 minutes");

    setLoading(true);

    const token = localStorage.getItem("token");

    await fetch("/api/v1/teacher/exams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, duration }),
    });

    setLoading(false);
    onClose();
    onCreated();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-96 space-y-4">
        <h2 className="font-semibold">Create Exam</h2>

        <input
          className="border w-full p-2 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="number"
          className="border w-full p-2 rounded"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={submit}
            className="bg-indigo-600 text-white px-3 py-1 rounded"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
