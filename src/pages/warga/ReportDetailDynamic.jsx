import { useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Tag,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  X,
  FileText,
  XCircle,
  Camera,
  AlertTriangle,
} from "lucide-react";

// Possible report statuses/paths: 'happy' | 'revision' | 'rejected' | 'merged' | 'dispute'
// Possible report status: 'submitted' | 'pending_verification' | 'revision_required' | 'accepted' | 'in_progress' | 'awaiting_confirmation' | 'completed' | 'rejected' | 'merged' | 'disputed' | 'dispute_resolved'

export default function ReportDetailDynamic({ report, onNavigate }) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showDisputeDialog, setShowDisputeDialog] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [disputePhoto, setDisputePhoto] = useState(null);
  const [showFinalWarning, setShowFinalWarning] = useState(false);

  // Simulate different paths for demo - in real app this comes from backend
  const [currentPath] = useState("happy"); // Change to 'revision', 'rejected', 'merged', 'dispute' to test
  const [currentStatus, setCurrentStatus] = useState("awaiting_confirmation");

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Laporan tidak ditemukan</p>
          <button
            onClick={() => onNavigate("dashboard")}
            className="text-blue-600 hover:underline"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Define timelines for each path
  const getTimeline = () => {
    switch (currentPath) {
      case "happy":
        return [
          {
            status: "submitted",
            title: "Laporan Diterima Sistem",
            description:
              "Laporan Anda telah masuk ke sistem dan menunggu verifikasi admin",
            date: "2026-04-28 10:30",
            icon: CheckCircle2,
            color: "bg-green-100 text-green-600",
            completed: true,
          },
          {
            status: "pending_verification",
            title: "Menunggu Verifikasi",
            description:
              "Admin sedang memverifikasi kelengkapan dan validitas laporan",
            date: "2026-04-28 10:31",
            icon: Clock,
            color: "bg-yellow-100 text-yellow-600",
            completed: true,
          },
          {
            status: "accepted",
            title: "Laporan Diterima",
            description:
              "Laporan telah diverifikasi dan diterima untuk ditindaklanjuti",
            date: "2026-04-28 14:00",
            icon: CheckCircle2,
            color: "bg-green-100 text-green-600",
            completed: true,
          },
          {
            status: "in_progress",
            title: "Sedang Diproses",
            description:
              "Tim lapangan sedang melakukan perbaikan infrastruktur",
            date: "2026-04-29 09:00",
            icon: AlertCircle,
            color: "bg-blue-100 text-blue-600",
            completed: true,
          },
          {
            status: "awaiting_confirmation",
            title: "Menunggu Konfirmasi Warga",
            description:
              "Perbaikan selesai dilakukan. Menunggu konfirmasi dari pelapor",
            date: "2026-04-30 16:00",
            icon: MessageSquare,
            color: "bg-purple-100 text-purple-600",
            completed: true,
            active: currentStatus === "awaiting_confirmation",
          },
          {
            status: "completed",
            title: "Selesai",
            description: "Laporan telah diselesaikan dan ditutup",
            date: currentStatus === "completed" ? "2026-04-30 17:00" : "",
            icon: CheckCircle2,
            color: "bg-green-100 text-green-600",
            completed: currentStatus === "completed",
          },
        ];

      case "revision":
        return [
          {
            status: "submitted",
            title: "Laporan Diterima Sistem",
            description: "Laporan Anda telah masuk ke sistem",
            date: "2026-04-28 10:30",
            icon: CheckCircle2,
            color: "bg-green-100 text-green-600",
            completed: true,
          },
          {
            status: "pending_verification",
            title: "Sedang Diverifikasi",
            description: "Admin sedang memeriksa kelengkapan laporan",
            date: "2026-04-28 10:31",
            icon: Clock,
            color: "bg-yellow-100 text-yellow-600",
            completed: true,
          },
          {
            status: "revision_required",
            title: "Perlu Revisi",
            description:
              'Admin meminta revisi: "Mohon tambahkan foto yang lebih jelas menunjukkan lokasi kerusakan"',
            date: "2026-04-28 15:00",
            icon: FileText,
            color: "bg-orange-100 text-orange-600",
            completed: true,
            active: true,
            note: "Catatan Admin: Foto yang diunggah kurang jelas dan tidak menampakkan patokan lokasi. Mohon foto ulang dengan pencahayaan yang lebih baik.",
          },
          {
            status: "accepted",
            title: "Menunggu Revisi dari Warga",
            description: "Silakan perbaiki laporan sesuai catatan admin",
            date: "",
            icon: AlertTriangle,
            color: "bg-yellow-100 text-yellow-600",
            completed: false,
          },
        ];

      case "rejected":
        return [
          {
            status: "submitted",
            title: "Laporan Diterima Sistem",
            description: "Laporan Anda telah masuk ke sistem",
            date: "2026-04-28 10:30",
            icon: CheckCircle2,
            color: "bg-green-100 text-green-600",
            completed: true,
          },
          {
            status: "pending_verification",
            title: "Sedang Diverifikasi",
            description: "Admin sedang memeriksa kelengkapan laporan",
            date: "2026-04-28 10:31",
            icon: Clock,
            color: "bg-yellow-100 text-yellow-600",
            completed: true,
          },
          {
            status: "rejected",
            title: "Laporan Ditolak",
            description:
              "Alasan: Kerusakan yang dilaporkan bukan kewenangan Dinas PU, silakan hubungi PLN untuk masalah listrik",
            date: "2026-04-28 16:00",
            icon: XCircle,
            color: "bg-red-100 text-red-600",
            completed: true,
            active: true,
            note: "Laporan Anda mengenai kerusakan tiang listrik. Mohon hubungi PLN di nomor 123 atau website pln.co.id",
          },
        ];

      case "merged":
        return [
          {
            status: "submitted",
            title: "Laporan Diterima Sistem",
            description: "Laporan Anda telah masuk ke sistem",
            date: "2026-04-28 10:30",
            icon: CheckCircle2,
            color: "bg-green-100 text-green-600",
            completed: true,
          },
          {
            status: "pending_verification",
            title: "Sedang Diverifikasi",
            description: "Admin sedang memeriksa laporan",
            date: "2026-04-28 10:31",
            icon: Clock,
            color: "bg-yellow-100 text-yellow-600",
            completed: true,
          },
          {
            status: "merged",
            title: "Laporan Digabung",
            description:
              "Laporan digabung dengan TKT-2026-015 (lokasi dan kategori sama)",
            date: "2026-04-28 14:30",
            icon: FileText,
            color: "bg-blue-100 text-blue-600",
            completed: true,
            active: true,
            note: "Laporan Anda mengenai jalan berlubang di Jl. Gatot Subroto telah digabung dengan laporan serupa yang lebih dulu masuk. Anda dapat memantau progress di tiket TKT-2026-015.",
            relatedTicket: "TKT-2026-015",
          },
        ];

      case "dispute":
        return [
          {
            status: "submitted",
            title: "Laporan Diterima Sistem",
            description: "Laporan Anda telah masuk ke sistem",
            date: "2026-04-25 10:30",
            icon: CheckCircle2,
            color: "bg-green-100 text-green-600",
            completed: true,
          },
          {
            status: "accepted",
            title: "Laporan Diterima",
            description: "Laporan diverifikasi dan diterima",
            date: "2026-04-25 14:00",
            icon: CheckCircle2,
            color: "bg-green-100 text-green-600",
            completed: true,
          },
          {
            status: "in_progress",
            title: "Sedang Diproses",
            description: "Tim lapangan melakukan perbaikan",
            date: "2026-04-26 09:00",
            icon: AlertCircle,
            color: "bg-blue-100 text-blue-600",
            completed: true,
          },
          {
            status: "awaiting_confirmation",
            title: "Menunggu Konfirmasi Warga",
            description: "Perbaikan selesai, menunggu konfirmasi",
            date: "2026-04-27 16:00",
            icon: MessageSquare,
            color: "bg-purple-100 text-purple-600",
            completed: true,
          },
          {
            status: "disputed",
            title: "Disengketakan",
            description: "Warga mengajukan sengketa terhadap hasil perbaikan",
            date: "2026-04-28 10:00",
            icon: AlertTriangle,
            color: "bg-red-100 text-red-600",
            completed: true,
            active: currentStatus === "disputed",
            note: "Sengketa Anda sedang ditinjau oleh tim supervisor. Estimasi waktu peninjauan: 3 hari kerja.",
          },
          {
            status: "dispute_resolved",
            title: "Sengketa Selesai Ditinjau",
            description:
              "Tim akan melakukan perbaikan ulang sesuai catatan sengketa",
            date:
              currentStatus === "dispute_resolved" ? "2026-04-30 14:00" : "",
            icon: CheckCircle2,
            color: "bg-green-100 text-green-600",
            completed: currentStatus === "dispute_resolved",
          },
        ];

      default:
        return [];
    }
  };

  const timeline = getTimeline();

  const handleDisputePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("File harus berupa gambar");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran foto maksimal 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setDisputePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    setShowFinalWarning(false);
    setShowConfirmDialog(false);
    setCurrentStatus("completed");
    alert("Terima kasih! Konfirmasi Anda telah diterima. Laporan ditutup.");
    setTimeout(() => onNavigate("dashboard"), 1500);
  };

  const handleDispute = () => {
    if (disputeReason.trim().length < 20) {
      alert("Alasan sengketa minimal 20 karakter");
      return;
    }
    if (!disputePhoto) {
      alert("Foto bukti wajib dilampirkan");
      return;
    }
    setCurrentStatus("disputed");
    alert(
      "Sengketa Anda telah diajukan dan akan segera ditinjau oleh tim supervisor.",
    );
    setShowDisputeDialog(false);
    setDisputeReason("");
    setDisputePhoto(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 h-16">
            <button
              onClick={() => onNavigate("history")}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="font-bold text-gray-900">Detail Laporan</h1>
              <p className="text-xs text-gray-500">{report.id}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${report.statusColor}`}
            >
              {report.status}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Photo */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-6xl">📸</span>
          </div>
        </div>

        {/* Report Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {report.title}
          </h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Tag className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Kategori</p>
                <p className="font-medium text-gray-900">{report.category}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Lokasi</p>
                <p className="font-medium text-gray-900">{report.location}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Dekat Indomaret Gatot Subroto
                </p>
                <div className="mt-2 flex gap-2 text-xs font-mono bg-gray-50 p-2 rounded">
                  <span>3.5952° N</span>
                  <span>•</span>
                  <span>98.6722° E</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Tanggal Laporan</p>
                <p className="font-medium text-gray-900">
                  {new Date(report.date).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Deskripsi</p>
                <p className="text-gray-900 mt-1">
                  Terdapat jalan berlubang dengan ukuran cukup besar di Jl.
                  Gatot Subroto. Lubang tersebut berbahaya bagi pengendara dan
                  sudah menyebabkan beberapa pengendara motor terjatuh.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Timeline */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
          <h3 className="font-semibold text-gray-900 mb-6">Timeline Status</h3>
          <div className="space-y-6">
            {timeline.map((item, index) => (
              <div key={item.status} className="relative flex gap-4">
                {index !== timeline.length - 1 && (
                  <div
                    className={`absolute left-6 top-12 w-0.5 h-full ${item.completed ? "bg-green-200" : "bg-gray-200"}`}
                  />
                )}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${item.color} ${item.active ? "ring-4 ring-blue-100" : ""}`}
                >
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4
                        className={`font-semibold ${item.active ? "text-blue-900" : "text-gray-900"}`}
                      >
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.description}
                      </p>
                      {item.note && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-800">{item.note}</p>
                        </div>
                      )}
                      {item.relatedTicket && (
                        <p className="text-sm text-blue-600 mt-2">
                          Tiket terkait: {item.relatedTicket}
                        </p>
                      )}
                    </div>
                    {item.date && (
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {new Date(item.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        {currentStatus === "awaiting_confirmation" && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">
              Konfirmasi Hasil Perbaikan
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Mohon konfirmasi apakah perbaikan sudah sesuai dengan laporan
              Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowFinalWarning(true)}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <ThumbsUp className="w-5 h-5" />
                Sudah Sesuai
              </button>
              <button
                onClick={() => setShowDisputeDialog(true)}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <ThumbsDown className="w-5 h-5" />
                Ajukan Sengketa
              </button>
            </div>
          </div>
        )}

        {/* Confirmation Dialog */}
        {showFinalWarning && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Konfirmasi Penyelesaian
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Dengan mengonfirmasi, laporan akan ditutup dan tidak dapat
                diajukan sengketa lagi.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowFinalWarning(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Ya, Selesaikan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dispute Dialog */}
        {showDisputeDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Ajukan Sengketa
                </h3>
                <button
                  onClick={() => setShowDisputeDialog(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alasan Sengketa
                  </label>
                  <textarea
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Jelaskan alasan sengketa (minimal 20 karakter)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto Bukti
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    {disputePhoto ? (
                      <img
                        src={disputePhoto}
                        alt="Bukti"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <>
                        <Camera className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">
                          Klik untuk upload foto
                        </p>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleDisputePhotoChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <button
                  onClick={handleDispute}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Kirim Sengketa
                </button>
              </div>
            </div>
          </div>
        )}

        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <p className="text-gray-600">Konfirmasi laporan</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
