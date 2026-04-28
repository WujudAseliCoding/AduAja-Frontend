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
  UserPlus,
  MapPin,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  Building2,
  Calendar,
} from "lucide-react";

export default function PenugasanPetugas() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [selectedPetugas, setSelectedPetugas] = useState("");
  const [alert, setAlert] = useState(null);

  const incomingReports = [
    {
      id: "TKT-2026-001",
      judul: "Jalan Berlubang di Jl. Sudirman",
      pelapor: "Ahmad Fauzi",
      kategori: "Jalan/Infrastruktur",
      wilayah: "Kec. Medan Baru",
      koordinat: "-3.5952, 98.6722",
      tanggalDisposisi: "2026-04-28 11:00",
      deadline: "2026-05-01 17:00",
      prioritas: "Tinggi",
      instruksiAdmin:
        "Segera tinjau lokasi dan lakukan perbaikan jalan. Prioritaskan karena sering dilalui kendaraan berat.",
      foto: "https://images.unsplash.com/photo-1625935216538-f865d2db4b5e?w=200",
      status: "Dalam Peninjauan",
    },
    {
      id: "TKT-2026-002",
      judul: "Lampu PJU Mati di Jl. Gatot Subroto",
      pelapor: "Siti Aminah",
      kategori: "Penerangan Jalan",
      wilayah: "Kec. Medan Polonia",
      koordinat: "-3.5889, 98.6753",
      tanggalDisposisi: "2026-04-28 09:15",
      deadline: "2026-04-30 17:00",
      prioritas: "Kritis",
      instruksiAdmin: "URGENT! Lampu PJU mati sepanjang 200 meter.",
      foto: "https://images.unsplash.com/photo-1625935216538-f865d2db4b5e?w=200",
      status: "Dalam Peninjauan",
    },
  ];

  const petugasList = [
    {
      id: "PTG-001",
      nama: "Budi Santoso",
      nip: "198501152010011001",
      wilayahTugas: "Kec. Medan Baru",
      statusKetersediaan: "Siap Bertugas",
      tugasAktif: 0,
      kontak: "0812-3456-7890",
    },
    {
      id: "PTG-002",
      nama: "Andi Wijaya",
      nip: "199003102015021002",
      wilayahTugas: "Kec. Medan Polonia",
      statusKetersediaan: "Siap Bertugas",
      tugasAktif: 0,
      kontak: "0813-4567-8901",
    },
    {
      id: "PTG-003",
      nama: "Siti Rahmawati",
      nip: "198707252012012003",
      wilayahTugas: "Kec. Medan Baru",
      statusKetersediaan: "Sedang Bertugas",
      tugasAktif: 2,
      kontak: "0821-2345-6789",
    },
    {
      id: "PTG-004",
      nama: "Dedi Kurniawan",
      nip: "199205152018011004",
      wilayahTugas: "Kec. Medan Selayang",
      statusKetersediaan: "Siap Bertugas",
      tugasAktif: 0,
      kontak: "0822-3456-7891",
    },
    {
      id: "PTG-005",
      nama: "Rina Pratiwi",
      nip: "199108202016022005",
      wilayahTugas: "Kec. Medan Helvetia",
      statusKetersediaan: "Istirahat",
      tugasAktif: 0,
      kontak: "0823-4567-8902",
    },
  ];

  const handleViewDetail = (report) => {
    setSelectedReport(report);
    setShowAssignForm(true);
    setSelectedPetugas("");
    setAlert(null);
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();

    if (!selectedPetugas) {
      setAlert({ type: "error", message: "Pilih petugas terlebih dahulu" });
      return;
    }

    const petugas = petugasList.find((p) => p.id === selectedPetugas);

    if (petugas.wilayahTugas !== selectedReport.wilayah) {
      setAlert({
        type: "warning",
        message: `PERINGATAN: Wilayah tugas ${petugas.nama} (${petugas.wilayahTugas}) tidak sesuai dengan lokasi laporan (${selectedReport.wilayah}). Penugasan tetap bisa dilanjutkan dengan pertimbangan khusus.`,
      });
    }

    setAlert({
      type: "success",
      message: `Berhasil menugaskan laporan ${selectedReport.id} kepada ${petugas.nama}. Status laporan diubah menjadi "Ditugaskan".`,
    });

    setTimeout(() => {
      setShowAssignForm(false);
      setSelectedReport(null);
      setSelectedPetugas("");
      setAlert(null);
    }, 2500);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      "Siap Bertugas": "bg-green-100 text-green-800",
      "Sedang Bertugas": "bg-blue-100 text-blue-800",
      Istirahat: "bg-yellow-100 text-yellow-800",
      "Selesai Shift": "bg-gray-100 text-gray-800",
    };
    return (
      <Badge className={statusConfig[status] || "bg-gray-100 text-gray-800"}>
        {status}
      </Badge>
    );
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
          <CardTitle>Laporan Masuk Dinas</CardTitle>
          <CardDescription>
            {incomingReports.length} laporan dari disposisi Admin Pusat
            (FR-PRS-01)
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
            {incomingReports.map((report) => (
              <div
                key={report.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedReport?.id === report.id
                    ? "border-blue-500 bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => handleViewDetail(report)}
              >
                <div className="flex gap-3">
                  <img
                    src={report.foto}
                    alt="Foto laporan"
                    className="w-16 h-16 object-cover rounded border flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <span className="font-mono text-xs font-semibold text-blue-600">
                        {report.id}
                      </span>
                      {getPrioritasBadge(report.prioritas)}
                    </div>
                    <h4 className="font-medium text-sm mb-1 line-clamp-2">
                      {report.judul}
                    </h4>
                    <p className="text-xs text-gray-500 mb-2">
                      {report.kategori}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Calendar className="w-3 h-3" />
                      Disposisi: {report.tanggalDisposisi}
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
          <CardTitle>Penugasan Petugas Lapangan</CardTitle>
          <CardDescription>
            Tugaskan laporan ke petugas sesuai wilayah kerja (FR-PRS-02,
            FR-PRS-03, FR-PRS-04)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showAssignForm ? (
            <div className="flex items-center justify-center h-96 text-gray-400">
              <div className="text-center">
                <UserPlus className="w-16 h-16 mx-auto mb-4" />
                <p>Pilih laporan dari daftar untuk menugaskan petugas</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {alert && (
                <Alert
                  variant={alert.type === "error" ? "destructive" : "default"}
                  className={
                    alert.type === "warning"
                      ? "border-yellow-500 bg-yellow-50"
                      : ""
                  }
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{alert.message}</AlertDescription>
                </Alert>
              )}

              <div className="p-4 bg-gray-50 rounded-lg border">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-600">ID Tiket</Label>
                    <p className="font-mono font-semibold">
                      {selectedReport.id}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Prioritas</Label>
                    {getPrioritasBadge(selectedReport.prioritas)}
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs text-gray-600">
                      Judul Laporan
                    </Label>
                    <p className="font-medium">{selectedReport.judul}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Wilayah</Label>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <p className="text-sm">{selectedReport.wilayah}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">
                      Deadline SLA
                    </Label>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <p className="text-sm">{selectedReport.deadline}</p>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs text-gray-600">
                      Instruksi dari Admin Pusat
                    </Label>
                    <p className="text-sm bg-blue-50 p-2 rounded border border-blue-200">
                      {selectedReport.instruksiAdmin}
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleAssignSubmit} className="space-y-4">
                <div>
                  <Label className="mb-3 block font-semibold">
                    Pilih Petugas Lapangan{" "}
                    <span className="text-red-500">*</span>
                  </Label>

                  <div className="space-y-2">
                    {petugasList.map((petugas) => {
                      const isAvailable =
                        petugas.statusKetersediaan === "Siap Bertugas";
                      const isWrongArea =
                        petugas.wilayahTugas !== selectedReport.wilayah;

                      return (
                        <label
                          key={petugas.id}
                          className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                            selectedPetugas === petugas.id
                              ? "border-blue-500 bg-blue-50"
                              : ""
                          } ${!isAvailable ? "opacity-50 cursor-not-allowed" : ""} ${
                            isWrongArea && isAvailable
                              ? "border-yellow-500 bg-yellow-50"
                              : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name="petugas"
                            value={petugas.id}
                            checked={selectedPetugas === petugas.id}
                            onChange={(e) => setSelectedPetugas(e.target.value)}
                            disabled={!isAvailable}
                            className="mt-1 w-4 h-4"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-medium text-sm">
                                  {petugas.nama}
                                </p>
                                <p className="text-xs text-gray-500">
                                  NIP: {petugas.nip}
                                </p>
                              </div>
                              {getStatusBadge(petugas.statusKetersediaan)}
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                              <div className="flex items-center gap-1">
                                <Building2 className="w-3 h-3" />
                                {petugas.wilayahTugas}
                                {isWrongArea && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs ml-1 bg-yellow-100 text-yellow-800 border-yellow-300"
                                  >
                                    Beda Wilayah
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                Tugas Aktif: {petugas.tugasAktif}
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {petugas.kontak}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800 text-sm">
                    <strong>FR-PRS-03 - Validasi Wilayah:</strong> Sistem akan
                    memberi peringatan jika wilayah tugas petugas tidak sesuai
                    lokasi laporan, namun penugasan tetap bisa dilanjutkan.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={!selectedPetugas}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Tugaskan Petugas (FR-PRS-04)
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAssignForm(false);
                      setSelectedReport(null);
                      setSelectedPetugas("");
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
