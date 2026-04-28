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
  MapPin,
  Send,
  Building2,
  AlertCircle,
  Calendar,
} from "lucide-react";

export default function DisposisiPanel({ userRole }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDispositionForm, setShowDispositionForm] = useState(false);
  const [selectedDinas, setSelectedDinas] = useState("");
  const [priority, setPriority] = useState("");
  const [deadline, setDeadline] = useState("");
  const [instructions, setInstructions] = useState("");
  const [alert, setAlert] = useState(null);
  const [reports, setReports] = useState([
    {
      id: "TKT-2026-001",
      judul: "Jalan Berlubang di Jl. Sudirman",
      pelapor: "Ahmad Fauzi",
      kategori: "Jalan/Infrastruktur",
      wilayah: "Kec. Medan Baru",
      tanggalMasuk: "2026-04-28 08:30",
      tanggalValidasi: "2026-04-28 10:15",
      koordinat: "-3.5952, 98.6722",
      deskripsi: "Lubang besar di tengah jalan Sudirman",
      status: "Menunggu Disposisi",
      prioritasSistem: "Sedang",
      foto: "https://images.unsplash.com/photo-1625935216538-f865d2db4b5e?w=200",
      dinasRekomendasi: "Dinas PU & Penataan Ruang",
    },
    {
      id: "TKT-2026-002",
      judul: "Lampu PJU Mati di Jl. Gatot Subroto",
      pelapor: "Siti Aminah",
      kategori: "Penerangan Jalan",
      wilayah: "Kec. Medan Polonia",
      tanggalMasuk: "2026-04-28 09:15",
      tanggalValidasi: "2026-04-28 11:00",
      koordinat: "-3.5889, 98.6753",
      deskripsi: "Lampu PJU mati sepanjang 200 meter",
      status: "Menunggu Disposisi",
      prioritasSistem: "Tinggi",
      foto: "https://images.unsplash.com/photo-1625935216538-f865d2db4b5e?w=200",
      dinasRekomendasi: "Dinas ESDM",
    },
    {
      id: "TKT-2026-003",
      judul: "Sampah Menumpuk di Taman Beringin",
      pelapor: "Budi Santoso",
      kategori: "Kebersihan/Sampah",
      wilayah: "Kec. Medan Selayang",
      tanggalMasuk: "2026-04-27 14:20",
      tanggalValidasi: "2026-04-28 09:00",
      koordinat: "-3.5678, 98.6891",
      deskripsi: "Sampah tidak diangkut selama 1 minggu",
      status: "Menunggu Disposisi",
      prioritasSistem: "Sedang",
      foto: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200",
      dinasRekomendasi: "Dinas Lingkungan Hidup",
    },
  ]);

  const dinasList = [
    {
      id: "dpu",
      name: "Dinas PU & Penataan Ruang",
      kategori: ["Jalan/Infrastruktur", "Drainase"],
    },
    {
      id: "dlh",
      name: "Dinas Lingkungan Hidup",
      kategori: ["Kebersihan/Sampah", "Taman/RTH"],
    },
    {
      id: "esdm",
      name: "Dinas ESDM",
      kategori: ["Penerangan Jalan", "Listrik"],
    },
    {
      id: "perhubungan",
      name: "Dinas Perhubungan",
      kategori: ["Transportasi", "Parkir", "Rambu Lalu Lintas"],
    },
    {
      id: "damkar",
      name: "Dinas Pemadam Kebakaran",
      kategori: ["Kebakaran", "Bencana"],
    },
    {
      id: "satpol_pp",
      name: "Satpol PP",
      kategori: ["PKL", "Ketertiban"],
    },
  ];

  const handleViewDetail = (report) => {
    if (report.status === "Didisposisikan") {
      return;
    }
    setSelectedReport(report);
    setShowDispositionForm(true);
    const recommendedDinas = dinasList.find(
      (d) => d.name === report.dinasRekomendasi,
    );
    setSelectedDinas(recommendedDinas?.id || "");
    setPriority(report.prioritasSistem);
    setInstructions("");
    setDeadline("");
    setAlert(null);
  };

  const handleDispositionSubmit = (e) => {
    e.preventDefault();

    if (!selectedDinas) {
      setAlert({
        type: "error",
        message: "Pilih Dinas tujuan terlebih dahulu",
      });
      return;
    }

    if (!priority) {
      setAlert({ type: "error", message: "Tentukan tingkat prioritas" });
      return;
    }

    if (!deadline) {
      setAlert({
        type: "error",
        message: "Tentukan target waktu penyelesaian",
      });
      return;
    }

    if (!instructions.trim()) {
      setAlert({ type: "error", message: "Instruksi/catatan wajib diisi" });
      return;
    }

    if (instructions.trim().length < 20) {
      setAlert({ type: "error", message: "Instruksi minimal 20 karakter" });
      return;
    }

    const dinasName = dinasList.find((d) => d.id === selectedDinas)?.name;

    setReports((prev) =>
      prev.map((report) =>
        report.id === selectedReport.id
          ? {
              ...report,
              status: "Didisposisikan",
              disposisi: {
                dinasId: selectedDinas,
                dinasName,
                priority,
                deadline,
                instructions,
                disposisiAt: new Date().toISOString(),
              },
            }
          : report,
      ),
    );

    setAlert({
      type: "success",
      message: `Laporan ${selectedReport.id} berhasil didisposisikan ke ${dinasName}`,
    });

    setTimeout(() => {
      setShowDispositionForm(false);
      setSelectedReport(null);
      setSelectedDinas("");
      setPriority("");
      setDeadline("");
      setInstructions("");
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

  const calculateSLA = (prioritas) => {
    const slaMap = {
      Kritis: "24 jam",
      Tinggi: "3 hari kerja",
      Sedang: "7 hari kerja",
      Rendah: "14 hari kerja",
    };
    return slaMap[prioritas] || "7 hari kerja";
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      "Menunggu Disposisi": "bg-yellow-100 text-yellow-800",
      Didisposisikan: "bg-green-100 text-green-800",
    };
    return (
      <Badge className={statusConfig[status] || "bg-gray-100 text-gray-800"}>
        {status}
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
    (report) => report.status === "Menunggu Disposisi",
  ).length;

  return (
    <div className="space-y-6">
      {alert && (
        <Alert variant={alert.type === "error" ? "destructive" : "default"}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Siap Disposisi</CardTitle>
            <CardDescription>
              {pendingCount} laporan tervalidasi perlu disposisi ke Dinas
              (FR-DSP-01)
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
                  className={`p-4 border rounded-lg transition-all ${
                    report.status === "Didisposisikan"
                      ? "opacity-60 cursor-not-allowed"
                      : "cursor-pointer hover:bg-gray-50"
                  } ${
                    selectedReport?.id === report.id
                      ? "border-blue-500 bg-blue-50"
                      : ""
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
                        {getPrioritasBadge(report.prioritasSistem)}
                      </div>
                      <div className="mb-2">
                        {getStatusBadge(report.status)}
                      </div>
                      <h4 className="font-medium text-sm mb-1 line-clamp-2">
                        {report.judul}
                      </h4>
                      <p className="text-xs text-gray-500 mb-2">
                        {report.kategori}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Building2 className="w-3 h-3 text-green-600" />
                        <span className="text-green-700 font-medium">
                          {report.dinasRekomendasi}
                        </span>
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
            <CardTitle>Form Disposisi</CardTitle>
            <CardDescription>
              Disposisikan laporan ke Dinas terkait dengan instruksi yang jelas
              (FR-DSP-02 sampai FR-DSP-06)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showDispositionForm || !selectedReport ? (
              <div className="flex items-center justify-center h-96 text-gray-400">
                <div className="text-center">
                  <Send className="w-16 h-16 mx-auto mb-4" />
                  <p>Pilih laporan dari daftar untuk mulai disposisi</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-xs text-gray-600">ID Tiket</Label>
                    <p className="font-mono font-semibold">
                      {selectedReport.id}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Pelapor</Label>
                    <p className="font-medium">{selectedReport.pelapor}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs text-gray-600">
                      Judul Laporan
                    </Label>
                    <p className="font-medium">{selectedReport.judul}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Kategori</Label>
                    <Badge variant="outline">{selectedReport.kategori}</Badge>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Wilayah</Label>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <p className="text-sm">{selectedReport.wilayah}</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleDispositionSubmit} className="space-y-4">
                  <div>
                    <Label className="mb-2 block">
                      Dinas Tujuan <span className="text-red-500">*</span>
                    </Label>
                    <div className="space-y-2">
                      {dinasList.map((dinas) => (
                        <label
                          key={dinas.id}
                          className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                            selectedDinas === dinas.id
                              ? "border-blue-500 bg-blue-50"
                              : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name="dinas"
                            value={dinas.id}
                            checked={selectedDinas === dinas.id}
                            onChange={(e) => setSelectedDinas(e.target.value)}
                            className="mt-1 w-4 h-4"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-gray-600" />
                              <p className="font-medium text-sm">
                                {dinas.name}
                              </p>
                              {dinas.name ===
                                selectedReport.dinasRekomendasi && (
                                <Badge className="bg-green-100 text-green-800 text-xs">
                                  Rekomendasi
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Menangani: {dinas.kategori.join(", ")}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block">
                      Tingkat Prioritas <span className="text-red-500">*</span>
                    </Label>
                    <div className="grid grid-cols-4 gap-3">
                      {["Kritis", "Tinggi", "Sedang", "Rendah"].map((p) => (
                        <Button
                          key={p}
                          type="button"
                          variant={priority === p ? "default" : "outline"}
                          className={`${
                            priority === p
                              ? p === "Kritis"
                                ? "bg-red-600 hover:bg-red-700"
                                : p === "Tinggi"
                                  ? "bg-orange-600 hover:bg-orange-700"
                                  : p === "Sedang"
                                    ? "bg-yellow-600 hover:bg-yellow-700"
                                    : "bg-gray-600 hover:bg-gray-700"
                              : ""
                          }`}
                          onClick={() => setPriority(p)}
                        >
                          {p}
                        </Button>
                      ))}
                    </div>
                    {priority && (
                      <p className="text-xs text-gray-600 mt-2">
                        <AlertCircle className="w-3 h-3 inline mr-1" />
                        SLA Target: {calculateSLA(priority)}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="deadline" className="mb-2 block">
                      Target Waktu Penyelesaian{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="deadline"
                        type="datetime-local"
                        className="pl-10"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        min={new Date().toISOString().slice(0, 16)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="instructions" className="mb-2 block">
                      Instruksi & Catatan untuk Dinas{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <textarea
                      id="instructions"
                      rows={5}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Berikan instruksi detail kepada Dinas terkait penanganan laporan ini (minimal 20 karakter)..."
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {instructions.length} karakter (minimal 20)
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      disabled={
                        !selectedDinas ||
                        !priority ||
                        !deadline ||
                        instructions.trim().length < 20
                      }
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Kirim Disposisi
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowDispositionForm(false);
                        setSelectedReport(null);
                        setSelectedDinas("");
                        setPriority("");
                        setDeadline("");
                        setInstructions("");
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
