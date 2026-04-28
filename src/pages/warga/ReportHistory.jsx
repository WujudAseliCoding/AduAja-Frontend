import { useState } from "react";
import {
  ArrowLeft,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

export default function ReportHistory({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");

  const statusOptions = [
    "Semua",
    "Menunggu Verifikasi",
    "Sedang Diproses",
    "Selesai",
    "Ditolak",
  ];

  const allReports = [
    {
      id: "TKT-2026-001",
      title: "Jalan Berlubang di Jl. Gatot Subroto",
      category: "Infrastruktur Jalan",
      status: "Menunggu Verifikasi",
      statusColor: "bg-yellow-100 text-yellow-700",
      icon: Clock,
      iconColor: "text-yellow-600",
      date: "2026-04-28",
      location: "Kec. Medan Baru",
    },
    {
      id: "TKT-2026-002",
      title: "Lampu PJU Mati",
      category: "Penerangan Jalan",
      status: "Sedang Diproses",
      statusColor: "bg-blue-100 text-blue-700",
      icon: AlertCircle,
      iconColor: "text-blue-600",
      date: "2026-04-27",
      location: "Kec. Medan Polonia",
    },
    {
      id: "TKT-2026-003",
      title: "Sampah Menumpuk",
      category: "Kebersihan",
      status: "Selesai",
      statusColor: "bg-green-100 text-green-700",
      icon: CheckCircle2,
      iconColor: "text-green-600",
      date: "2026-04-25",
      location: "Kec. Medan Kota",
    },
    {
      id: "TKT-2026-004",
      title: "Drainase Tersumbat",
      category: "Drainase",
      status: "Selesai",
      statusColor: "bg-green-100 text-green-700",
      icon: CheckCircle2,
      iconColor: "text-green-600",
      date: "2026-04-20",
      location: "Kec. Medan Timur",
    },
    {
      id: "TKT-2026-005",
      title: "Taman Tidak Terawat",
      category: "Taman & RTH",
      status: "Selesai",
      statusColor: "bg-green-100 text-green-700",
      icon: CheckCircle2,
      iconColor: "text-green-600",
      date: "2026-04-18",
      location: "Kec. Medan Baru",
    },
    {
      id: "TKT-2026-006",
      title: "Papan Reklame Rusak",
      category: "Fasilitas Umum",
      status: "Selesai",
      statusColor: "bg-green-100 text-green-700",
      icon: CheckCircle2,
      iconColor: "text-green-600",
      date: "2026-04-15",
      location: "Kec. Medan Helvetia",
    },
    {
      id: "TKT-2026-007",
      title: "Halte Bus Rusak",
      category: "Fasilitas Umum",
      status: "Selesai",
      statusColor: "bg-green-100 text-green-700",
      icon: CheckCircle2,
      iconColor: "text-green-600",
      date: "2026-04-12",
      location: "Kec. Medan Petisah",
    },
  ];

  const filteredReports = allReports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === "Semua" || report.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const statusCounts = {
    Semua: allReports.length,
    "Menunggu Verifikasi": allReports.filter(
      (r) => r.status === "Menunggu Verifikasi",
    ).length,
    "Sedang Diproses": allReports.filter((r) => r.status === "Sedang Diproses")
      .length,
    Selesai: allReports.filter((r) => r.status === "Selesai").length,
    Ditolak: allReports.filter((r) => r.status === "Ditolak").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 h-16">
            <button
              onClick={() => onNavigate("dashboard")}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="font-bold text-gray-900">Riwayat Laporan</h1>
              <p className="text-xs text-gray-500">
                {allReports.length} total laporan
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan judul, nomor tiket, atau kategori..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-2">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                  filterStatus === status
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {status}
                <span className="ml-2 text-xs opacity-75">
                  ({statusCounts[status] ?? 0})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Reports List */}
        {filteredReports.length > 0 ? (
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                onClick={() => onNavigate("detail", report)}
                className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0`}
                  >
                    <report.icon className={`w-6 h-6 ${report.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 truncate">
                          {report.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {report.category}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${report.statusColor} whitespace-nowrap self-start`}
                      >
                        {report.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="font-medium text-gray-700">
                        {report.id}
                      </span>
                      <span>•</span>
                      <span>{report.location}</span>
                      <span>•</span>
                      <span>
                        {new Date(report.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-xl text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Tidak Ada Hasil
            </h3>
            <p className="text-gray-500">
              Tidak ditemukan laporan yang sesuai dengan pencarian Anda
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
