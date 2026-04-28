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
  Send,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  MapPin,
  Calendar,
  Image as ImageIcon,
} from "lucide-react";

export default function ProgressUpdate() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [progressNote, setProgressNote] = useState("");
  const [estimatedCompletion, setEstimatedCompletion] = useState("");
  const [alert, setAlert] = useState(null);

  const ticketsInProgress = [
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
      instruksiAdmin:
        "Laporan gabungan dari 3 pelapor. Segera tangani karena sangat mengganggu lalu lintas.",
      foto: "https://images.unsplash.com/photo-1625935216538-f865d2db4b5e?w=200",
      progressHistory: [
        {
          tanggal: "2026-04-28 13:00",
          keterangan: "Tim survey turun ke lokasi",
          petugas: "Budi Santoso",
          estimasi: "2026-04-30 12:00",
        },
        {
          tanggal: "2026-04-28 15:30",
          keterangan: "Material hotmix sudah disiapkan",
          petugas: "Budi Santoso",
          estimasi: "2026-04-30 12:00",
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
      instruksiAdmin: "Drainase tersumbat menyebabkan genangan saat hujan.",
      foto: "https://images.unsplash.com/photo-1625935216538-f865d2db4b5e?w=200",
      progressHistory: [
        {
          tanggal: "2026-04-27 14:00",
          keterangan:
            "Lokasi sudah disurvey, drainase memang tersumbat sampah dan tanah",
          petugas: "Andi Wijaya",
          estimasi: "2026-05-03 17:00",
        },
      ],
    },
  ];

  const handleViewDetail = (ticket) => {
    setSelectedTicket(ticket);
    setShowUpdateForm(true);
    setProgressNote("");
    setEstimatedCompletion("");
    setAlert(null);
  };

  const handleSubmitUpdate = (e) => {
    e.preventDefault();

    if (!progressNote.trim()) {
      setAlert({ type: "error", message: "Keterangan progress wajib diisi" });
      return;
    }

    if (progressNote.trim().length < 10) {
      setAlert({ type: "error", message: "Keterangan minimal 10 karakter" });
      return;
    }

    setAlert({
      type: "success",
      message: `Update progress untuk ${selectedTicket.id} berhasil disimpan`,
    });

    setTimeout(() => {
      setProgressNote("");
      setEstimatedCompletion("");
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Dalam Penanganan</CardTitle>
          <CardDescription>
            {ticketsInProgress.length} tiket sedang ditangani
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
            {ticketsInProgress.map((ticket) => (
              <div
                key={ticket.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedTicket?.id === ticket.id
                    ? "border-blue-500 bg-blue-50"
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
                      <span className="font-mono text-xs font-semibold text-blue-600">
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
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Clock className="w-3 h-3" />
                      {ticket.progressHistory.length} update
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
          <CardTitle>Update Progress Penanganan</CardTitle>
          <CardDescription>
            Tambahkan update progress untuk transparansi kepada pelapor
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showUpdateForm ? (
            <div className="flex items-center justify-center h-96 text-gray-400">
              <div className="text-center">
                <Clock className="w-16 h-16 mx-auto mb-4" />
                <p>Pilih tiket dari daftar untuk update progress</p>
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
                  <Label className="text-xs text-gray-600">Deadline</Label>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <p className="text-sm">{selectedTicket.deadline}</p>
                  </div>
                </div>
              </div>

              <div>
                <Label className="mb-3 block font-semibold">
                  Riwayat Update Progress
                </Label>
                <div className="space-y-3">
                  {selectedTicket.progressHistory.map((progress, index) => (
                    <div
                      key={index}
                      className="p-3 border-l-4 border-blue-500 bg-blue-50 rounded"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Clock className="w-4 h-4" />
                          {progress.tanggal}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {progress.petugas}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-800">
                        {progress.keterangan}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Estimasi selesai: {progress.estimasi}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <form
                onSubmit={handleSubmitUpdate}
                className="space-y-4 border-t pt-6"
              >
                <div>
                  <Label htmlFor="progressNote" className="mb-2 block">
                    Keterangan Update <span className="text-red-500">*</span>
                  </Label>
                  <textarea
                    id="progressNote"
                    rows={4}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Jelaskan progress penanganan yang sudah dilakukan (minimal 10 karakter)..."
                    value={progressNote}
                    onChange={(e) => setProgressNote(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {progressNote.length} karakter (minimal 10)
                  </p>
                </div>

                <div>
                  <Label htmlFor="estimatedCompletion" className="mb-2 block">
                    Estimasi Waktu Penyelesaian (Opsional)
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="estimatedCompletion"
                      type="datetime-local"
                      className="pl-10"
                      value={estimatedCompletion}
                      onChange={(e) => setEstimatedCompletion(e.target.value)}
                    />
                  </div>
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800 text-sm">
                    Update progress ini akan dikirimkan ke pelapor melalui
                    notifikasi untuk transparansi penanganan laporan.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={progressNote.trim().length < 10}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Kirim Update Progress
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowUpdateForm(false);
                      setSelectedTicket(null);
                      setProgressNote("");
                      setEstimatedCompletion("");
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
