import {
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  History,
  LogOut,
  User,
  Bell,
} from "lucide-react";

export default function Dashboard({ onNavigate, onLogout }) {
  const stats = [
    {
      label: "Menunggu Verifikasi",
      count: 2,
      icon: Clock,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      label: "Sedang Diproses",
      count: 1,
      icon: AlertCircle,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Selesai",
      count: 5,
      icon: CheckCircle2,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Ditolak",
      count: 0,
      icon: XCircle,
      color: "bg-red-100 text-red-600",
    },
  ];

  const recentReports = [
    {
      id: "TKT-2026-001",
      title: "Jalan Berlubang di Jl. Gatot Subroto",
      category: "Infrastruktur Jalan",
      status: "Menunggu Verifikasi",
      statusColor: "bg-yellow-100 text-yellow-700",
      date: "2026-04-28",
      location: "Kec. Medan Baru",
    },
    {
      id: "TKT-2026-002",
      title: "Lampu PJU Mati",
      category: "Penerangan Jalan",
      status: "Sedang Diproses",
      statusColor: "bg-blue-100 text-blue-700",
      date: "2026-04-27",
      location: "Kec. Medan Polonia",
    },
    {
      id: "TKT-2026-003",
      title: "Sampah Menumpuk",
      category: "Kebersihan",
      status: "Selesai",
      statusColor: "bg-green-100 text-green-700",
      date: "2026-04-25",
      location: "Kec. Medan Kota",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AduAja</h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Pengaduan Masyarakat
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => onNavigate("notifications")}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                title="Notifikasi"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>
              <button
                onClick={() => onNavigate("profile")}
                className="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-1 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    Ahmad Warga
                  </p>
                  <p className="text-xs text-gray-500">Warga</p>
                </div>
              </button>
              <button
                onClick={onLogout}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                title="Keluar"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Selamat Datang, Ahmad!
          </h2>
          <p className="text-gray-600">
            Laporkan kerusakan infrastruktur di sekitar Anda
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => onNavigate("create-report")}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <PlusCircle className="w-8 h-8" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg mb-1">
                  Buat Laporan Baru
                </h3>
                <p className="text-blue-100 text-sm">
                  Laporkan kerusakan infrastruktur
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onNavigate("history")}
            className="bg-white border-2 border-gray-200 p-6 rounded-xl shadow hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <History className="w-8 h-8 text-gray-700" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg mb-1 text-gray-900">
                  Riwayat Laporan
                </h3>
                <p className="text-gray-500 text-sm">
                  Lihat semua laporan Anda
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Statistics */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ringkasan Laporan
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100"
              >
                <div
                  className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-3`}
                >
                  <stat.icon className="w-6 h-6" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                  {stat.count}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Laporan Terbaru
            </h3>
            <button
              onClick={() => onNavigate("history")}
              className="text-blue-600 text-sm font-medium hover:underline"
            >
              Lihat Semua
            </button>
          </div>

          <div className="space-y-4">
            {recentReports.map((report) => (
              <div
                key={report.id}
                onClick={() => onNavigate("detail", report)}
                className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">📍</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-1 truncate">
                        {report.title}
                      </h4>
                      <p className="text-sm text-gray-500">{report.category}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${report.statusColor} whitespace-nowrap self-start sm:self-center`}
                  >
                    {report.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="font-medium text-gray-700">
                      {report.id}
                    </span>
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
            ))}
          </div>

          {recentReports.length === 0 && (
            <div className="bg-white p-12 rounded-xl text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <History className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Belum Ada Laporan
              </h3>
              <p className="text-gray-500 mb-6">
                Mulai laporkan kerusakan infrastruktur di sekitar Anda
              </p>
              <button
                onClick={() => onNavigate("create-report")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <PlusCircle className="w-5 h-5" />
                Buat Laporan Pertama
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
