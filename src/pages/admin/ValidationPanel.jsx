import { useState, useEffect } from "react";
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
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Image as ImageIcon,
  FileText,
  Send,
  User,
  Calendar,
} from "lucide-react";

export default function ValidationPanel({ userRole, selectedLaporan }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [validationAction, setValidationAction] = useState("");
  const [validationReason, setValidationReason] = useState("");
  const [showValidationForm, setShowValidationForm] = useState(false);
  const [alert, setAlert] = useState(null);
  const [reports, setReports] = useState([
    {
      id: "TKT-2026-001",
      judul: "Jalan Berlubang di Jl. Sudirman",
      pelapor: "Ahmad Fauzi",
      kategori: "Jalan/Infrastruktur",
      wilayah: "Kec. Medan Baru",
      tanggalMasuk: "2026-04-28 08:30",
      prioritas: "Sedang",
      koordinat: { lat: -3.5952, lng: 98.6722 },
      koordinatStr: "-3.5952, 98.6722",
      deskripsi:
        "Terdapat lubang besar dengan diameter sekitar 2 meter di tengah jalan Sudirman dekat perempatan lampu merah. Lubang ini sangat berbahaya bagi pengendara sepeda motor dan dapat menyebabkan kecelakaan.",
      foto: "https://images.unsplash.com/photo-1625935216538-f865d2db4b5e?w=400",
      waktuKejadian: "2026-04-27 18:00",
      status: "Menunggu Verifikasi",
    },
    {
      id: "TKT-2026-002",
      judul: "Lampu PJU Mati di Jl. Gatot Subroto",
      pelapor: "Siti Aminah",
      kategori: "Penerangan Jalan",
      wilayah: "Kec. Medan Polonia",
      tanggalMasuk: "2026-04-28 09:15",
      prioritas: "Tinggi",
      koordinat: { lat: -3.5889, lng: 98.6753 },
      koordinatStr: "-3.5889, 98.6753",
      deskripsi:
        "Lampu penerangan jalan umum (PJU) sepanjang 200 meter di Jl. Gatot Subroto tidak menyala sejak 3 hari yang lalu. Kondisi malam hari menjadi sangat gelap dan rawan kejahatan.",
      foto: "https://images.unsplash.com/photo-1625935216538-f865d2db4b5e?w=400",
      waktuKejadian: "2026-04-25 20:00",
      status: "Menunggu Verifikasi",
    },
    {
      id: "TKT-2026-005",
      judul: "Taman Kota Rusak",
      pelapor: "Rina Wijaya",
      kategori: "Fasilitas Umum",
      wilayah: "Kec. Medan Helvetia",
      tanggalMasuk: "2026-04-28 10:45",
      prioritas: "Rendah",
      koordinat: { lat: -3.6123, lng: 98.6654 },
      koordinatStr: "-3.6123, 98.6654",
      deskripsi:
        "Bangku taman dan ayunan anak-anak di Taman Kota Helvetia dalam kondisi rusak dan berkarat. Berbahaya untuk anak-anak yang bermain.",
      foto: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400",
      waktuKejadian: "2026-04-28 09:00",
      status: "Menunggu Verifikasi",
    },
  ]);

  useEffect(() => {
    if (selectedLaporan) {
      const formattedReport = {
        id: selectedLaporan.id,
        judul: selectedLaporan.judul,
        pelapor: selectedLaporan.pelapor,
        kontakPelapor: selectedLaporan.kontakPelapor,
        kategori: selectedLaporan.kategori,
        wilayah: selectedLaporan.wilayah,
        tanggalMasuk: selectedLaporan.tanggalMasuk,
        prioritas: selectedLaporan.prioritas,
        koordinat: {
          lat: parseFloat(selectedLaporan.koordinat.split(",")[0]),
          lng: parseFloat(selectedLaporan.koordinat.split(",")[1]),
        },
        koordinatStr: selectedLaporan.koordinat,
        deskripsi: selectedLaporan.deskripsi,
        foto: selectedLaporan.foto,
        patokan: selectedLaporan.patokan,
        waktuKejadian: selectedLaporan.tanggalMasuk,
        status: selectedLaporan.status || "Menunggu Verifikasi",
      };

      setSelectedReport(formattedReport);
      setShowValidationForm(true);
      setValidationAction("");
      setValidationReason("");
      setAlert(null);
    }
  }, [selectedLaporan]);

  const handleViewDetail = (report) => {
    setSelectedReport(report);
    setShowValidationForm(true);
    setValidationAction("");
    setValidationReason("");
    setAlert(null);
  };

  const handleValidationSubmit = (e) => {
    e.preventDefault();

    if (!validationAction) {
      setAlert({
        type: "error",
        message: "Pilih keputusan validasi terlebih dahulu",
      });
      return;
    }

    if (!validationReason.trim()) {
      setAlert({ type: "error", message: "Alasan/keterangan wajib diisi" });
      return;
    }

    if (validationReason.trim().length < 10) {
      setAlert({ type: "error", message: "Alasan minimal 10 karakter" });
      return;
    }

    const statusMap = {
      approved: "Diterima",
      rejected: "Ditolak",
      revision: "Perlu Revisi",
    };
    const nextStatus = statusMap[validationAction] || "Menunggu Verifikasi";

    setReports((prev) => {
      const exists = prev.some((report) => report.id === selectedReport.id);
      if (!exists) {
        return [
          {
            ...selectedReport,
            status: nextStatus,
            validationReason,
            validatedAt: new Date().toISOString(),
          },
          ...prev,
        ];
      }
      return prev.map((report) =>
        report.id === selectedReport.id
          ? {
              ...report,
              status: nextStatus,
              validationReason,
              validatedAt: new Date().toISOString(),
            }
          : report,
      );
    });

    setSelectedReport((prev) =>
      prev ? { ...prev, status: nextStatus, validationReason } : prev,
    );

    setAlert({
      type: "success",
      message: `Laporan ${selectedReport.id} berhasil divalidasi dengan status: ${nextStatus}`,
    });

    setTimeout(() => {
      setShowValidationForm(false);
      setSelectedReport(null);
      setValidationAction("");
      setValidationReason("");
      setAlert(null);
    }, 2000);
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
  const filteredReports = reports.filter((report) => {
    if (!normalizedQuery) {
      return true;
    }
    return [report.id, report.judul, report.kategori, report.wilayah]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery);
  });

  const pendingCount = reports.filter(
    (report) => report.status === "Menunggu Verifikasi",
  ).length;

  const getStatusBadge = (status) => {
    const statusConfig = {
      "Menunggu Verifikasi": "bg-yellow-100 text-yellow-800",
      Diterima: "bg-green-100 text-green-800",
      Ditolak: "bg-red-100 text-red-800",
      "Perlu Revisi": "bg-blue-100 text-blue-800",
    };
    return (
      <Badge className={statusConfig[status] || "bg-gray-100 text-gray-800"}>
        {status}
      </Badge>
    );
  };

  const isResolved =
    selectedReport?.status && selectedReport.status !== "Menunggu Verifikasi";

  const isGPSValid = (koordinat) => {
    const { lat, lng } = koordinat;
    return lat >= -4.0 && lat <= -3.5 && lng >= 98.5 && lng <= 99.0;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Menunggu Validasi</CardTitle>
          <CardDescription>
            {pendingCount} laporan perlu divalidasi (FR-ADM-05)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari ID atau judul..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedReport?.id === report.id
                    ? "border-blue-500 bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => handleViewDetail(report)}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="font-mono text-sm font-semibold text-blue-600">
                    {report.id}
                  </span>
                  {getPrioritasBadge(report.prioritas)}
                </div>
                <div className="mb-2">{getStatusBadge(report.status)}</div>
                <h4 className="font-medium text-sm mb-1">{report.judul}</h4>
                <p className="text-xs text-gray-500 mb-2">{report.kategori}</p>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Clock className="w-3 h-3" />
                  {report.tanggalMasuk}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Detail Laporan & Validasi</CardTitle>
          <CardDescription>
            Periksa foto, GPS, dan deskripsi sebelum memvalidasi (FR-ADM-06,
            FR-ADM-07)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showValidationForm || !selectedReport ? (
            <div className="flex items-center justify-center h-96 text-gray-400">
              <div className="text-center">
                <FileText className="w-16 h-16 mx-auto mb-4" />
                <p>Pilih laporan dari daftar untuk memulai validasi</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {alert && (
                <Alert
                  variant={alert.type === "error" ? "destructive" : "default"}
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{alert.message}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label className="text-xs text-gray-600">ID Tiket</Label>
                  <p className="font-mono font-semibold">{selectedReport.id}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Prioritas</Label>
                  {getPrioritasBadge(selectedReport.prioritas)}
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Status</Label>
                  {getStatusBadge(selectedReport.status)}
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Nama Pelapor</Label>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3 text-gray-400" />
                    <p className="font-medium">{selectedReport.pelapor}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-600">
                    Kontak Pelapor
                  </Label>
                  <p className="font-medium">
                    {selectedReport.kontakPelapor || "-"}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Tanggal Masuk</Label>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <p className="text-sm">{selectedReport.tanggalMasuk}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Kategori</Label>
                  <p className="font-medium">{selectedReport.kategori}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-xs text-gray-600">Wilayah</Label>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <p className="font-medium text-sm">
                      {selectedReport.wilayah}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <ImageIcon className="w-4 h-4" />
                  Foto Bukti
                </Label>
                <div className="border rounded-lg overflow-hidden">
                  <img
                    src={selectedReport.foto}
                    alt="Foto bukti laporan"
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4" />
                  Lokasi & Koordinat GPS
                </Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Input
                      value={selectedReport.koordinatStr}
                      readOnly
                      className="flex-1"
                    />
                    {isGPSValid(selectedReport.koordinat) ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        GPS Valid
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">
                        <XCircle className="w-3 h-3 mr-1" />
                        GPS Tidak Valid
                      </Badge>
                    )}
                  </div>
                  {selectedReport.patokan && (
                    <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-xs text-gray-600">Patokan Lokasi:</p>
                      <p className="text-sm text-gray-800">
                        {selectedReport.patokan}
                      </p>
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    Waktu Kejadian: {selectedReport.waktuKejadian}
                  </p>
                  <Button variant="outline" size="sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    Buka di Peta (FR-ADM-07)
                  </Button>
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Deskripsi Laporan</Label>
                <div className="p-4 border rounded-lg bg-white">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {selectedReport.deskripsi}
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleValidationSubmit}
                className="space-y-4 border-t pt-6"
              >
                <div>
                  <Label className="mb-3 block font-semibold">
                    Keputusan Validasi
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      type="button"
                      variant={
                        validationAction === "approved" ? "default" : "outline"
                      }
                      className={`flex items-center gap-2 justify-center ${
                        validationAction === "approved"
                          ? "bg-green-600 hover:bg-green-700"
                          : ""
                      }`}
                      onClick={() => setValidationAction("approved")}
                      disabled={isResolved}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Terima (Diterima)
                    </Button>
                    <Button
                      type="button"
                      variant={
                        validationAction === "rejected" ? "default" : "outline"
                      }
                      className={`flex items-center gap-2 justify-center ${
                        validationAction === "rejected"
                          ? "bg-red-600 hover:bg-red-700"
                          : ""
                      }`}
                      onClick={() => setValidationAction("rejected")}
                      disabled={isResolved}
                    >
                      <XCircle className="w-4 h-4" />
                      Tolak (Ditolak)
                    </Button>
                    <Button
                      type="button"
                      variant={
                        validationAction === "revision" ? "default" : "outline"
                      }
                      className={`flex items-center gap-2 justify-center ${
                        validationAction === "revision"
                          ? "bg-yellow-600 hover:bg-yellow-700"
                          : ""
                      }`}
                      onClick={() => setValidationAction("revision")}
                      disabled={isResolved}
                    >
                      <AlertCircle className="w-4 h-4" />
                      Revisi (Perlu Revisi)
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="reason" className="mb-2 block">
                    Alasan / Keterangan <span className="text-red-500">*</span>
                  </Label>
                  <textarea
                    id="reason"
                    rows={4}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Jelaskan alasan keputusan validasi Anda (minimal 10 karakter)..."
                    value={validationReason}
                    onChange={(e) => setValidationReason(e.target.value)}
                    required
                    disabled={isResolved}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {validationReason.length} karakter (minimal 10)
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={
                      isResolved ||
                      !validationAction ||
                      validationReason.trim().length < 10
                    }
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Kirim Validasi
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowValidationForm(false);
                      setSelectedReport(null);
                      setValidationAction("");
                      setValidationReason("");
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
  );
}
