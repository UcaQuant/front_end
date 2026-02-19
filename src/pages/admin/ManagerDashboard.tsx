import { useEffect, useState, useContext } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AuthContext } from "../../context/AuthContext";

type Stats = {
  totalStudents: number;
  registeredToday: number;
  examsCompleted: number;
};

export default function ManagerDashboard() {
  const { auth } = useContext(AuthContext);

  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/v1/manager/dashboard-stats", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to load stats");

      const data = await res.json();
      setStats(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchStats();

    const interval = setInterval(fetchStats, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!stats) return null;

  const completionRate =
    stats.totalStudents > 0
      ? Math.round((stats.examsCompleted / stats.totalStudents) * 100)
      : 0;

  const chartData = [
    { name: "Completed", value: stats.examsCompleted },
    { name: "Pending", value: stats.totalStudents - stats.examsCompleted },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Manager Dashboard</h1>


      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Students" value={stats.totalStudents} />
        <StatCard title="Registered Today" value={stats.registeredToday} />
        <StatCard title="Exams Completed" value={stats.examsCompleted} />
      </div>


      <div className="bg-white rounded-xl shadow p-6 h-80">
        <h2 className="mb-4 font-semibold">
          Exam Completion Rate ({completionRate}%)
        </h2>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              innerRadius={60}
              outerRadius={90}
            >
              <Cell />
              <Cell />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}



function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
  );
}
