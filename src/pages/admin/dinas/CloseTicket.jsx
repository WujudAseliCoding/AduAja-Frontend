import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card.jsx";
import { Input } from "../ui/input.jsx";
import { Button } from "../ui/button.jsx";
import { Badge } from "../ui/badge.jsx";
import { Label } from "../ui/label.jsx";
import { Alert, AlertDescription } from "../ui/alert.jsx";
import {
  Search,
  CheckCircle,
  AlertCircle,
  Upload,
  X,
  Clock,
  User,
  MapPin,
  Calendar,
  Image as ImageIcon,
} from "lucide-react";

export default function CloseTicket() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showCloseForm, setShowCloseForm] = useState(false);
  const [completionNote, setCompletionNote] = useState("");
  const [evidencePhotos, setEvidencePhotos] = useState([]);
  const [alert, setAlert] = useState(null);

  const ticketsReadyToClose = [
    {
      id: "TKT-2026-006",
      judul: "Lubang Jalan Besar di Jl. Sudirman (Merged)",
      pelapor: "Ahmad Fauzi + 2 pelapor lainnya",
      kategori: "Jalan/Infrastruktur",
      wilayah: "Kec. Medan Baru",
      tanggalDisposisi: "2026-04-28 12:00",
      koordinat: "-3.5952, 98.6722",
      prioritas: "Tinggi",
      deadline: "2026-04-30 17:00",
      foto: "https://images.unsplash.com/photo-1625935216538-f865d2db4b5e?w=200",
      progressHistory: [
        {
          tanggal: "2026-04-28 13:00",
          keterangan: "Tim survey turun ke lokasi",
          petugas: "Budi Santoso",
        },
        {
          tanggal: "2026-04-28 15:30",
          keterangan: "Material hotmix sudah disiapkan",
          petugas: "Budi Santoso",
        },
        {
          tanggal: "2026-04-29 09:00",
          keterangan: "Pekerjaan perbaikan dimulai",
          petugas: "Budi Santoso",
        },
        {
          tanggal: "2026-04-29 15:00",
          keterangan: "Pekerjaan selesai, lubang sudah ditambal sempurna",
          petugas: "Budi Santoso",
        },
      ],
    },
    {
      id: "TKT-2026-012",
      judul: "Perbaikan Drainase di Jl. Pemuda",
      pelapor: "Siti Aminah",
      kategori: "Drainase",
      wilayah: "Kec. Medan Polonia",
      tanggalDisposisi: "2026-04-27 10:00",
      koordinat: "-3.5889, 98.6753",
      prioritas: "Sedang",
      deadline: "2026-05-04 17:00",
      foto: "https://images.unsplash.com/photo-1625935216538-f865d2db4b5e?w=200",
      progressHistory: [
        {
          tanggal: "2026-04-27 14:00",
          keterangan: "Lokasi sudah disurvey",
          petugas: "Andi Wijaya",
        },
        {
          tanggal: "2026-04-28 10:00",
          keterangan: "Drainase sudah dibersihkan",
          petugas: "Andi Wijaya",
        },
      ],
    },
  ];

  const handleViewDetail = (ticket) => {
    setSelectedTicket(ticket);
    setShowCloseForm(true);
    setCompletionNote("");
    setEvidencePhotos([]);
    setAlert(null);
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length + evidencePhotos.length > 5) {
      setAlert({ type: "error", message: "Maksimal 5 foto bukti" });
      return;
    }
    const newPhotos = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    setEvidencePhotos([...evidencePhotos, ...newPhotos]);
  };

  const removePhoto = (index) => {
    const newPhotos = evidencePhotos.filter((_, i) => i !== index);
    setEvidencePhotos(newPhotos);
  };

  const handleSubmitClose = (e) => {
    e.preventDefault();

    if (!completionNote.trim()) {
      setAlert({
        type: "error",
        message: "Keterangan penyelesaian wajib diisi",
      });
      return;
    }

    if (completionNote.trim().length < 20) {
      setAlert({ type: "error", message: "Keterangan minimal 20 karakter" });
      return;
    }

    if (evidencePhotos.length === 0) {
      setAlert({
        type: "error",
        message: "Minimal upload 1 foto bukti penyelesaian",
      });
      return;
    }

    setAlert({
      type: "success",
      message: `Tiket ${selectedTicket.id} berhasil ditutup dan dikirim ke Admin Pusat untuk verifikasi`,
    });

    setTimeout(() => {
      setShowCloseForm(false);
      setSelectedTicket(null);
      setCompletionNote("");
      setEvidencePhotos([]);
      setAlert(null);
    }, 2500);
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Siap Ditutup</CardTitle>
          <CardDescription>
            {ticketsReadyToClose.length} tiket siap ditutup setelah pekerjaan
            selesai
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
            {ticketsReadyToClose.map((ticket) => (
              <div
                key={ticket.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedTicket?.id === ticket.id
                    ? "border-green-500 bg-green-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => handleViewDetail(ticket)}
              >
                <div className="flex gap-3">
                  <img
                    src={ticket.foto}
                    alt="Foto laporan"
                    className="w-16 h-16 object-cover rounded border flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <span className="font-mono text-xs font-semibold text-green-600">
                        {ticket.id}
                      </span>
                      {getPrioritasBadge(ticket.prioritas)}
                    </div>
                    <h4 className="font-medium text-sm mb-1 line-clamp-2">
                      {ticket.judul}
                    </h4>
                    <p className="text-xs text-gray-500 mb-2">
                      {ticket.kategori}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-green-700 font-medium">
                      <CheckCircle className="w-3 h-3" />
                      {ticket.progressHistory.length} update selesai
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Form Penutupan Tiket</CardTitle>
          <CardDescription>
            Upload foto bukti penyelesaian dan keterangan untuk menutup tiket
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showCloseForm ? (
            <div className="flex items-center justify-center h-96 text-gray-400">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                <p>Pilih tiket dari daftar untuk melakukan penutupan</p>
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
                  <p className="font-mono font-semibold">{selectedTicket.id}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Prioritas</Label>
                  {getPrioritasBadge(selectedTicket.prioritas)}
                </div>
                <div className="col-span-2">
                  <Label className="text-xs text-gray-600">Judul Laporan</Label>
                  <p className="font-medium">{selectedTicket.judul}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Pelapor</Label>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3 text-gray-400" />
                    <p className="text-sm">{selectedTicket.pelapor}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Wilayah</Label>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <p className="text-sm">{selectedTicket.wilayah}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmitClose} className="space-y-4">
                <div>
                  <Label htmlFor="completionNote" className="mb-2 block">
                    Keterangan Penyelesaian{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <textarea
                    id="completionNote"
                    rows={5}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Jelaskan secara detail pekerjaan yang sudah dilakukan untuk menyelesaikan laporan ini (minimal 20 karakter)..."
                    value={completionNote}
                    onChange={(e) => setCompletionNote(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {completionNote.length} karakter (minimal 20)
                  </p>
                </div>

                <div>
                  <Label className="mb-2 block">
                    Foto Bukti Penyelesaian{" "}
                    <span className="text-red-500">*</span> (Minimal 1, Maksimal
                    5)
                  </Label>

                  <div className="mb-3">
                    <label className="flex items-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-all">
                      <Upload className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-600">
                        Upload Foto Bukti
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handlePhotoUpload}
                        disabled={evidencePhotos.length >= 5}
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      {evidencePhotos.length}/5 foto terupload
                    </p>
                  </div>

                  {evidencePhotos.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {evidencePhotos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={photo.preview}
                            alt={`Bukti ${index + 1}`}
                            className="w-full h-32 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <p className="text-xs text-gray-600 mt-1 truncate">
                            {photo.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 text-sm">
                    Setelah submit, tiket akan dikirim ke Admin Pusat untuk
                    verifikasi akhir. Pelapor akan menerima notifikasi bahwa
                    laporan sudah ditangani.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={
                      completionNote.trim().length < 20 ||
                      evidencePhotos.length === 0
                    }
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Tutup Tiket & Kirim Verifikasi
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCloseForm(false);
                      setSelectedTicket(null);
                      setCompletionNote("");
                      setEvidencePhotos([]);
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
