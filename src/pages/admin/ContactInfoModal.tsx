import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

type Props = {
  studentId: string | null;
  isOpen: boolean;
  onClose: () => void;
};

type ContactInfo = {
  fullName: string;
  mobile: string;
  email?: string;
};

export default function ContactInfoModal({
  studentId,
  isOpen,
  onClose,
}: Props) {
  const { auth } = useContext(AuthContext);

  const [data, setData] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || !studentId) return;

    const fetchContact = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `/api/v1/manager/students/${studentId}/contact-info`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to load contact info");

        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [isOpen, studentId]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">Contact Information</h2>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {data && (
          <div className="space-y-2 text-sm">
            <p>
              <strong>Name:</strong> {data.fullName}
            </p>
            <p>
              <strong>Mobile:</strong> {data.mobile}
            </p>
            {data.email && (
              <p>
                <strong>Email:</strong> {data.email}
              </p>
            )}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full bg-gray-800 text-white rounded p-2"
        >
          Close
        </button>
      </div>
    </div>
  );
}
