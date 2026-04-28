import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  MessageSquare,
  FileText,
} from "lucide-react";
import { useState } from "react";

export default function Notifications({ onNavigate }) {
  const [filter, setFilter] = useState("semua");

  const notifications = [
    {
      id: 1,
      type: "status_update",
      title: "Laporan Anda Sedang Diproses",
      message:
        'Laporan TKT-2026-002 "Lampu PJU Mati" telah diverifikasi dan sedang dalam proses perbaikan oleh Dinas Penerangan Jalan.',
      icon: AlertCircle,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
      time: "2 jam yang lalu",
      isRead: false,
      reportId: "TKT-2026-002",
    },
    {
      id: 2,
      type: "confirmation_required",
      title: "Konfirmasi Penyelesaian Diperlukan",
      message:
        'Perbaikan pada laporan TKT-2026-003 "Sampah Menumpuk" telah selesai. Mohon konfirmasi apakah hasil perbaikan sudah sesuai.',
      icon: CheckCircle2,
      iconColor: "text-green-600",
      bgColor: "bg-green-100",
      time: "5 jam yang lalu",
      isRead: false,
      reportId: "TKT-2026-003",
      action: true,
    },
    {
      id: 3,
      type: "sla_warning",
      title: "Pengingat SLA Mendekati Batas",
      message:
        'Laporan TKT-2026-001 "Jalan Berlubang di Jl. Gatot Subroto" akan mencapai batas SLA dalam 2 hari. Tim sedang mempercepat proses.',
      icon: Clock,
      iconColor: "text-yellow-600",
      bgColor: "bg-yellow-100",
      time: "1 hari yang lalu",
      isRead: true,
      reportId: "TKT-2026-001",
    },
    {
      id: 4,
      type: "revision_required",
      title: "Laporan Perlu Revisi",
      message:
        "Laporan TKT-2026-004 memerlukan revisi. Admin meminta foto tambahan yang lebih jelas untuk verifikasi lokasi kerusakan.",
      icon: FileText,
      iconColor: "text-orange-600",
      bgColor: "bg-orange-100",
      time: "2 hari yang lalu",
      isRead: true,
      reportId: "TKT-2026-004",
      action: true,
    },
    {
      id: 5,
      type: "report_accepted",
      title: "Laporan Diterima",
      message:
        'Laporan TKT-2026-001 "Jalan Berlubang di Jl. Gatot Subroto" telah diverifikasi dan diterima sistem. Nomor tiket telah diterbitkan.',
      icon: CheckCircle2,
      iconColor: "text-green-600",
      bgColor: "bg-green-100",
      time: "3 hari yang lalu",
      isRead: true,
      reportId: "TKT-2026-001",
    },
    {
      id: 6,
      type: "dispute_review",
      title: "Sengketa Sedang Ditinjau",
      message:
        "Sengketa Anda pada laporan TKT-2025-089 sedang ditinjau oleh tim supervisor. Estimasi waktu peninjauan: 3 hari kerja.",
      icon: AlertCircle,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-100",
      time: "4 hari yang lalu",
      isRead: true,
      reportId: "TKT-2025-089",
    },
    {
      id: 7,
      type: "report_merged",
      title: "Laporan Digabungkan",
      message:
        "Laporan TKT-2026-005 telah digabung dengan laporan serupa TKT-2026-003 karena lokasi dan kategori yang sama.",
      icon: FileText,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
      time: "5 hari yang lalu",
      isRead: true,
      reportId: "TKT-2026-005",
    },
    {
      id: 8,
      type: "report_rejected",
      title: "Laporan Ditolak",
      message:
        "Laporan TKT-2026-006 ditolak karena tidak sesuai dengan kategori pengaduan infrastruktur. Silakan hubungi instansi terkait.",
      icon: XCircle,
      iconColor: "text-red-600",
      bgColor: "bg-red-100",
      time: "1 minggu yang lalu",
      isRead: true,
      reportId: "TKT-2026-006",
    },
    {
      id: 9,
      type: "comment_reply",
      title: "Balasan dari Admin",
      message:
        'Admin telah membalas komentar Anda pada laporan TKT-2026-002: "Perbaikan akan segera dilakukan minggu depan."',
      icon: MessageSquare,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
      time: "1 minggu yang lalu",
      isRead: true,
      reportId: "TKT-2026-002",
    },
  ];

  const filteredNotifications =
    filter === "belum-dibaca"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

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
            <div className="flex-1">
              <h1 className="font-bold text-gray-900">Notifikasi</h1>
              <p className="text-xs text-gray-500">
                {unreadCount > 0
                  ? `${unreadCount} notifikasi belum dibaca`
                  : "Semua notifikasi sudah dibaca"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter("semua")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filter === "semua"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            Semua ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("belum-dibaca")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filter === "belum-dibaca"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            Belum Dibaca ({unreadCount})
          </button>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => {
                  if (notification.reportId) {
                    onNavigate("detail", { id: notification.reportId });
                  }
                }}
                className={`bg-white p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                  notification.isRead
                    ? "border-gray-100"
                    : "border-blue-200 bg-blue-50/30"
                }`}
              >
                <div className="flex gap-4">
                  <div
                    className={`w-12 h-12 ${notification.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}
                  >
                    <notification.icon
                      className={`w-6 h-6 ${notification.iconColor}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3
                        className={`font-semibold ${notification.isRead ? "text-gray-900" : "text-blue-900"}`}
                      >
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        {notification.time}
                      </p>
                      {notification.action && (
                        <button className="text-xs font-medium text-blue-600 hover:underline">
                          Lihat Detail
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-xl text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Tidak Ada Notifikasi
            </h3>
            <p className="text-gray-500">
              {filter === "belum-dibaca"
                ? "Semua notifikasi sudah dibaca"
                : "Belum ada notifikasi untuk ditampilkan"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
