import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateExamModal from "../../components/admin/CreateExamModal";

type Exam = {
  id: string;
  title: string;
  duration: number;
  questionCount: number;
};

export default function ExamDashboard() {
  const navigate = useNavigate();

  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const fetchExams = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/v1/teacher/exams", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setExams(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Exams</h1>
        <button
          onClick={() => setOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Create New Exam
        </button>
      </div>

      {/* grid */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white rounded-xl shadow p-4 space-y-2"
            >
              <h2 className="font-semibold">{exam.title}</h2>
              <p className="text-sm text-gray-600">
                Duration: {exam.duration} mins
              </p>
              <p className="text-sm text-gray-600">
                Questions: {exam.questionCount}
              </p>

              <button
                onClick={() =>
                  navigate(`/admin/exams/${exam.id}/questions`)
                }
                className="text-indigo-600 text-sm"
              >
                Edit Questions →
              </button>
            </div>
          ))}
        </div>
      )}

      <CreateExamModal
        open={open}
        onClose={() => setOpen(false)}
        onCreated={fetchExams}
      />
    </div>
  );
}
