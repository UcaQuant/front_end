import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useEffect, useMemo, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import ContactInfoModal from "../../components/admin/ContactInfoModal";

type Student = {
  id: string;
  name: string;
  mobile: string;
  registrationDate: string;
  status: "ACTIVE" | "INACTIVE";
};

export default function StudentDirectory() {
  const { auth } = useContext(AuthContext);

  const [data, setData] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [globalFilter, setGlobalFilter] = useState("");

  /* ---------------- Modal State ---------------- */
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = (id: string) => {
    setSelectedId(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedId(null);
    setModalOpen(false);
  };

  /* ---------------- Fetch Students ---------------- */

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("/api/v1/students", {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch students");

        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  /* ---------------- Columns ---------------- */

  const columns = useMemo<ColumnDef<Student>[]>(
    () => [
      {
        header: "Name",
        accessorKey: "name",
      },
      {
        header: "Mobile",
        accessorKey: "mobile",
      },
      {
        header: "Registration Date",
        accessorKey: "registrationDate",
        cell: (info) =>
          new Date(info.getValue<string>()).toLocaleDateString(),
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (info) => (
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              info.getValue() === "ACTIVE"
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {info.getValue<string>()}
          </span>
        ),
      },
      {
        header: "Action",
        cell: ({ row }) => (
          <button
            onClick={() => openModal(row.original.id)}
            className="text-blue-600 underline"
          >
            View Contact
          </button>
        ),
      },
    ],
    []
  );

  /* ---------------- Table ---------------- */

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Students Directory</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name or mobile..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="border p-2 rounded w-full max-w-sm"
      />

      {/* Loading/Error */}
      {loading && <p>Loading students...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          {/* Table */}
          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id}>
                    {hg.headers.map((header) => (
                      <th
                        key={header.id}
                        className="p-3 text-left cursor-pointer select-none"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}

                        {{
                          asc: " ↑",
                          desc: " ↓",
                        }[header.column.getIsSorted() as string] ?? null}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-t hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Prev
            </button>

            <span>
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Contact Modal */}
      <ContactInfoModal
        studentId={selectedId}
        isOpen={modalOpen}
        onClose={closeModal}
      />
    </div>
  );
}
