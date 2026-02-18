import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function ReportsPage() {
  const { auth } = useContext(AuthContext);

  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const downloadReports = async () => {
    try {
      setDownloading(true);
      setProgress(0);

      const response = await fetch(
        "/api/v1/manager/reports/download-all",
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (!response.ok || !response.body) {
        throw new Error("Download failed");
      }

      const contentLength = Number(
        response.headers.get("Content-Length")
      );

      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];

      let received = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        received += value.length;

        if (contentLength) {
          setProgress(Math.round((received / contentLength) * 100));
        }
      }

      const blob = new Blob(chunks, {
        type: "application/zip",
      });

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "reports.zip";
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Download failed");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reports</h1>

      <button
        onClick={downloadReports}
        disabled={downloading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {downloading ? "Downloading..." : "Download All Reports"}
      </button>

      {/* Progress Bar */}
      {downloading && (
        <div className="w-full max-w-md bg-gray-200 rounded h-4 overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {downloading && (
        <p className="text-sm text-gray-600">{progress}% complete</p>
      )}
    </div>
  );
}
