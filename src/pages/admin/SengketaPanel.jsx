import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card.jsx";
import { Input } from "./ui/input.jsx";
import { Button } from "./ui/button.jsx";
import { Badge } from "./ui/badge.jsx";
import { Label } from "./ui/label.jsx";
import { Alert, AlertDescription } from "./ui/alert.jsx";
import {
  Search,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  FileText,
  User,
  Calendar,
  Scale,
} from "lucide-react";

export default function SengketaPanel({ userRole }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [showResolutionForm, setShowResolutionForm] = useState(false);
  const [resolutionDecision, setResolutionDecision] = useState("");
  const [resolutionNote, setResolutionNote] = useState("");
  const [alert, setAlert] = useState(null);
  const [disputes, setDisputes] = useState([
    {
      id: "SNK-2026-001",
      ticketId: "TKT-2026-001",
      judul: "Jalan Berlubang di Jl. Sudirman",
      pelapor: "Ahmad Fauzi",
      kategori: "Jalan/Infrastruktur",
      tanggalLaporan: "2026-04-28 08:30",
      tanggalSelesai: "2026-04-29 16:00",
      statusSebelum: "Selesai",
      alasanSengketa:
        "Perbaikan tidak sesuai dengan yang dilaporkan. Lubang masih ada dan hanya ditutup sebagian kecil. Kondisi jalan masih berbahaya untuk kendaraan.",
      tanggalSengketa: "2026-04-30 09:15",
      fotoBuktiSengketa:
        "https://images.unsplash.com/photo-1625935216538-f865d2db4b5e?w=200",
      statusSengketa: "Menunggu Peninjauan",
      prioritas: "Tinggi",
      dinas: "Dinas PU & Penataan Ruang",
      keteranganDinas:
        "Perbaikan sudah dilakukan sesuai standar pada tanggal 29 April 2026. Lubang telah ditambal dengan aspal hotmix.",
    },
    {
      id: "SNK-2026-002",
      ticketId: "TKT-2026-008",
      judul: "Lampu PJU Mati di Jl. Imam Bonjol",
      pelapor: "Siti Rahma",
      kategori: "Penerangan Jalan",
      tanggalLaporan: "2026-04-25 19:00",
      tanggalSelesai: "2026-04-28 14:00",
      statusSebelum: "Selesai",
      alasanSengketa:
        "Lampu sudah diperbaiki tapi hanya menyala 1 hari lalu mati lagi. Sepertinya perbaikan tidak mengatasi akar masalah.",
      tanggalSengketa: "2026-04-30 08:00",
      fotoBuktiSengketa:
        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=200",
      statusSengketa: "Menunggu Peninjauan",
      prioritas: "Sedang",
      dinas: "Dinas ESDM",
      keteranganDinas:
        "Lampu PJU telah diperbaiki dan sudah menyala normal saat pengecekan tim kami.",
    },
    {
      id: "SNK-2026-003",
      ticketId: "TKT-2026-012",
      judul: "PKL Mengganggu Trotoar",
      pelapor: "Budi Wirawan",
      kategori: "Ketertiban",
      tanggalLaporan: "2026-04-26 10:00",
      tanggalSelesai: "2026-04-28 11:00",
      statusSebelum: "Ditolak",
      alasanSengketa:
        "Laporan saya ditolak dengan alasan tidak valid, padahal saya sudah melampirkan foto dan lokasi yang jelas. PKL masih berjualan di trotoar.",
      tanggalSengketa: "2026-04-29 15:30",
      fotoBuktiSengketa:
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200",
      statusSengketa: "Dalam Investigasi",
      prioritas: "Rendah",
      dinas: "Satpol PP",
      keteranganDinas:
        "Laporan ditolak karena PKL sudah memiliki izin resmi dari Dinas Perdagangan untuk berjualan di area tersebut.",
    },
  ]);

  const handleViewDetail = (dispute) => {
    setSelectedDispute(dispute);
    setShowResolutionForm(true);
    setResolutionDecision("");
    setResolutionNote("");
    setAlert(null);
  };

  const handleResolutionSubmit = (e) => {
    e.preventDefault();

    if (!resolutionDecision) {
      setAlert({
        type: "error",
        message: "Pilih keputusan resolusi terlebih dahulu",
      });
      return;
    }

    if (!resolutionNote.trim()) {
      setAlert({ type: "error", message: "Catatan resolusi wajib diisi" });
      return;
    }

    if (resolutionNote.trim().length < 30) {
      setAlert({
        type: "error",
        message: "Catatan resolusi minimal 30 karakter",
      });
      return;
    }

    let message = "";
    if (resolutionDecision === "valid") {
      message = `Sengketa ${selectedDispute.id} dinyatakan VALID. Tiket akan dibuka kembali.`;
    } else if (resolutionDecision === "invalid") {
      message = `Sengketa ${selectedDispute.id} dinyatakan TIDAK VALID. Status tetap ${selectedDispute.statusSebelum}.`;
    } else if (resolutionDecision === "partial") {
      message = `Sengketa ${selectedDispute.id} diterima SEBAGIAN. Tindak lanjut akan dilakukan.`;
    }

    const statusMap = {
      valid: "Selesai - Valid",
      invalid: "Selesai - Tidak Valid",
      partial: "Selesai - Diterima Sebagian",
    };
    const nextStatus = statusMap[resolutionDecision] || "Menunggu Peninjauan";

    setDisputes((prev) =>
      prev.map((dispute) =>
        dispute.id === selectedDispute.id
          ? {
              ...dispute,
              statusSengketa: nextStatus,
              resolutionNote,
              resolvedAt: new Date().toISOString(),
            }
          : dispute,
      ),
    );

    setSelectedDispute((prev) =>
      prev ? { ...prev, statusSengketa: nextStatus, resolutionNote } : prev,
    );

    setAlert({ type: "success", message });

    setTimeout(() => {
      setShowResolutionForm(false);
      setSelectedDispute(null);
      setResolutionDecision("");
      setResolutionNote("");
      setAlert(null);
    }, 2500);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      "Menunggu Peninjauan": { className: "bg-yellow-100 text-yellow-800" },
      "Dalam Investigasi": { className: "bg-blue-100 text-blue-800" },
      "Selesai - Valid": { className: "bg-green-100 text-green-800" },
      "Selesai - Tidak Valid": { className: "bg-red-100 text-red-800" },
      "Selesai - Diterima Sebagian": {
        className: "bg-orange-100 text-orange-800",
      },
    };
    const config = statusConfig[status] || {
      className: "bg-gray-100 text-gray-800",
    };
    return <Badge className={config.className}>{status}</Badge>;
  };

  const getPrioritasBadge = (prioritas) => {
    const prioritasConfig = {
      Kritis: "bg-red-500 text-white",
      Tinggi: "bg-orange-500 text-white",
      Sedang: "bg-yellow-500 text-white",
      Rendah: "bg-gray-500 text-white",
    };
    return (
      <Badge className={prioritasConfig[prioritas] || "bg-gray-500 text-white"}>
        {prioritas}
      </Badge>
    );
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredDisputes = disputes.filter((dispute) => {
    if (!normalizedQuery) {
      return true;
    }
    return [dispute.id, dispute.ticketId, dispute.judul, dispute.pelapor]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery);
  });

  return (
    <div className="space-y-6">
      <Alert className="border-orange-500 bg-orange-50">
        <Scale className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <strong>Panel Resolusi Sengketa</strong> - Kelola pengajuan banding
          dari masyarakat terhadap status laporan yang telah ditutup (FR-RSL-09
          sampai FR-RSL-13)
        </AlertDescription>
      </Alert>

      {alert && (
        <Alert variant={alert.type === "error" ? "destructive" : "default"}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Daftar Sengketa
            </CardTitle>
            <CardDescription>
              {disputes.length} sengketa perlu ditinjau (FR-RSL-09)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Cari ID sengketa atau tiket..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredDisputes.map((dispute) => (
                <div
                  key={dispute.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedDispute?.id === dispute.id
                      ? "border-orange-500 bg-orange-50"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleViewDetail(dispute)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-mono text-xs font-semibold text-orange-600">
                        {dispute.id}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        Tiket: {dispute.ticketId}
                      </p>
                    </div>
                    {getPrioritasBadge(dispute.prioritas)}
                  </div>
                  <h4 className="font-medium text-sm mb-2 line-clamp-2">
                    {dispute.judul}
                  </h4>
                  {getStatusBadge(dispute.statusSengketa)}
                  <div className="flex items-center gap-1 text-xs text-gray-600 mt-2">
                    <Clock className="w-3 h-3" />
                    {dispute.tanggalSengketa}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Detail Sengketa & Resolusi</CardTitle>
            <CardDescription>
              Tinjau bukti dan argumen dari kedua belah pihak sebelum memutuskan
              (FR-RSL-10, FR-RSL-11)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showResolutionForm || !selectedDispute ? (
              <div className="flex items-center justify-center h-96 text-gray-400">
                <div className="text-center">
                  <Scale className="w-16 h-16 mx-auto mb-4" />
                  <p>Pilih sengketa dari daftar untuk memulai peninjauan</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-gray-400">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Informasi Tiket Asli
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <Label className="text-xs text-gray-600">ID Tiket</Label>
                      <p className="font-mono font-semibold">
                        {selectedDispute.ticketId}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">Pelapor</Label>
                      <p className="font-medium">{selectedDispute.pelapor}</p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs text-gray-600">Judul</Label>
                      <p className="font-medium">{selectedDispute.judul}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">
                        Tanggal Laporan
                      </Label>
                      <p>{selectedDispute.tanggalLaporan}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">
                        Tanggal Selesai
                      </Label>
                      <p>{selectedDispute.tanggalSelesai}</p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs text-gray-600">
                        Status Sebelumnya
                      </Label>
                      <Badge variant="outline">
                        {selectedDispute.statusSebelum}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Argumen Pelapor (Pengaju Sengketa)
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-600 mb-1 block">
                        Tanggal Pengajuan Sengketa
                      </Label>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        {selectedDispute.tanggalSengketa}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600 mb-1 block">
                        Alasan Pengajuan Sengketa
                      </Label>
                      <p className="text-sm text-gray-700 leading-relaxed p-3 bg-white rounded border">
                        {selectedDispute.alasanSengketa}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600 mb-1 block">
                        Foto Bukti Pendukung
                      </Label>
                      <img
                        src={selectedDispute.fotoBuktiSengketa}
                        alt="Bukti sengketa"
                        className="w-full max-w-md h-48 object-cover rounded border"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Argumen Dinas ({selectedDispute.dinas})
                  </h3>
                  <div>
                    <Label className="text-xs text-gray-600 mb-1 block">
                      Keterangan Resmi dari Dinas
                    </Label>
                    <p className="text-sm text-gray-700 leading-relaxed p-3 bg-white rounded border">
                      {selectedDispute.keteranganDinas}
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={handleResolutionSubmit}
                  className="space-y-4 border-t pt-6"
                >
                  <div>
                    <Label className="mb-3 block font-semibold">
                      Keputusan Resolusi <span className="text-red-500">*</span>
                    </Label>
                    <div className="grid grid-cols-3 gap-3">
                      <Button
                        type="button"
                        variant={
                          resolutionDecision === "valid" ? "default" : "outline"
                        }
                        className={`flex flex-col items-center gap-2 h-auto py-4 ${
                          resolutionDecision === "valid"
                            ? "bg-green-600 hover:bg-green-700"
                            : ""
                        }`}
                        onClick={() => setResolutionDecision("valid")}
                      >
                        <CheckCircle className="w-5 h-5" />
                        <div className="text-center">
                          <p className="font-semibold">Sengketa Valid</p>
                          <p className="text-xs opacity-80">
                            Tiket dibuka kembali
                          </p>
                        </div>
                      </Button>
                      <Button
                        type="button"
                        variant={
                          resolutionDecision === "invalid"
                            ? "default"
                            : "outline"
                        }
                        className={`flex flex-col items-center gap-2 h-auto py-4 ${
                          resolutionDecision === "invalid"
                            ? "bg-red-600 hover:bg-red-700"
                            : ""
                        }`}
                        onClick={() => setResolutionDecision("invalid")}
                      >
                        <XCircle className="w-5 h-5" />
                        <div className="text-center">
                          <p className="font-semibold">Tidak Valid</p>
                          <p className="text-xs opacity-80">Status tetap</p>
                        </div>
                      </Button>
                      <Button
                        type="button"
                        variant={
                          resolutionDecision === "partial"
                            ? "default"
                            : "outline"
                        }
                        className={`flex flex-col items-center gap-2 h-auto py-4 ${
                          resolutionDecision === "partial"
                            ? "bg-yellow-600 hover:bg-yellow-700"
                            : ""
                        }`}
                        onClick={() => setResolutionDecision("partial")}
                      >
                        <AlertTriangle className="w-5 h-5" />
                        <div className="text-center">
                          <p className="font-semibold">Diterima Sebagian</p>
                          <p className="text-xs opacity-80">
                            Perlu tindak lanjut
                          </p>
                        </div>
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="resolutionNote" className="mb-2 block">
                      Catatan Resolusi & Justifikasi{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <textarea
                      id="resolutionNote"
                      rows={6}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Jelaskan dengan detail dasar keputusan Anda, bukti yang dipertimbangkan, dan langkah selanjutnya (minimal 30 karakter)..."
                      value={resolutionNote}
                      onChange={(e) => setResolutionNote(e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {resolutionNote.length} karakter (minimal 30)
                    </p>
                  </div>

                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertTriangle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800 text-sm">
                      Keputusan resolusi akan dikirim ke pelapor dan dinas
                      terkait. Pastikan keputusan objektif berdasarkan bukti
                      yang ada.
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      disabled={
                        !resolutionDecision || resolutionNote.trim().length < 30
                      }
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Kirim Keputusan Resolusi
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowResolutionForm(false);
                        setSelectedDispute(null);
                        setResolutionDecision("");
                        setResolutionNote("");
                        setAlert(null);
                      }}
                    >
                      Batal
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
