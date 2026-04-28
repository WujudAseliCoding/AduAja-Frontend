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
  Clock,
  GitMerge,
  Link2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  Users,
} from "lucide-react";

export default function MergeTicketPanel({ userRole }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [showMergeConfirm, setShowMergeConfirm] = useState(false);
  const [primaryTicketId, setPrimaryTicketId] = useState("");
  const [mergeReason, setMergeReason] = useState("");
  const [alert, setAlert] = useState(null);
  const [tickets, setTickets] = useState([
    {
      id: "TKT-2026-001",
      judul: "Jalan Berlubang di Jl. Sudirman",
      pelapor: "Ahmad Fauzi",
      kategori: "Jalan/Infrastruktur",
      wilayah: "Kec. Medan Baru",
      tanggalMasuk: "2026-04-28 08:30",
      koordinat: "-3.5952, 98.6722",
      foto: "https://images.unsplash.com/photo-1625935216538-f865d2db4b5e?w=200",
      deskripsi: "Terdapat lubang besar di tengah jalan Sudirman",
      status: "Menunggu Verifikasi",
      similarityScore: 95,
    },
    {
      id: "TKT-2026-006",
      judul: "Lubang Jalan Besar di Jl. Sudirman Dekat Traffic Light",
      pelapor: "Rina Putri",
      kategori: "Jalan/Infrastruktur",
      wilayah: "Kec. Medan Baru",
      tanggalMasuk: "2026-04-28 09:45",
      koordinat: "-3.5953, 98.6721",
      foto: "https://images.unsplash.com/photo-1625935216538-f865d2db4b5e?w=200",
      deskripsi:
        "Lubang jalan diameter 2 meter di Jl. Sudirman yang sangat berbahaya",
      status: "Menunggu Verifikasi",
      similarityScore: 92,
    },
    {
      id: "TKT-2026-007",
      judul: "Jalan Rusak di Sudirman",
      pelapor: "Budi Santoso",
      kategori: "Jalan/Infrastruktur",
      wilayah: "Kec. Medan Baru",
      tanggalMasuk: "2026-04-28 10:20",
      koordinat: "-3.5951, 98.6723",
      foto: "https://images.unsplash.com/photo-1625935216538-f865d2db4b5e?w=200",
      deskripsi:
        "Jalan berlubang besar di Jl. Sudirman membahayakan pengendara",
      status: "Menunggu Verifikasi",
      similarityScore: 88,
    },
    {
      id: "TKT-2026-002",
      judul: "Lampu PJU Mati di Jl. Gatot Subroto",
      pelapor: "Siti Aminah",
      kategori: "Penerangan Jalan",
      wilayah: "Kec. Medan Polonia",
      tanggalMasuk: "2026-04-28 09:15",
      koordinat: "-3.5889, 98.6753",
      foto: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=200",
      deskripsi: "Lampu PJU mati sepanjang 200 meter",
      status: "Menunggu Verifikasi",
      similarityScore: 45,
    },
    {
      id: "TKT-2026-008",
      judul: "Penerangan Jalan Mati di Gatot Subroto",
      pelapor: "Dewi Lestari",
      kategori: "Penerangan Jalan",
      wilayah: "Kec. Medan Polonia",
      tanggalMasuk: "2026-04-28 11:00",
      koordinat: "-3.5890, 98.6752",
      foto: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=200",
      deskripsi: "Lampu jalan tidak menyala di Jl. Gatot Subroto",
      status: "Menunggu Verifikasi",
      similarityScore: 87,
    },
  ]);

  const detectClusters = () => {
    const clusters = [];
    const processed = new Set();

    tickets
      .filter((ticket) => ticket.status !== "Merged")
      .forEach((ticket) => {
        if (!processed.has(ticket.id)) {
          const cluster = tickets.filter(
            (t) =>
              t.status !== "Merged" &&
              !processed.has(t.id) &&
              t.kategori === ticket.kategori &&
              t.wilayah === ticket.wilayah &&
              Math.abs(
                parseFloat(t.koordinat.split(",")[0]) -
                  parseFloat(ticket.koordinat.split(",")[0]),
              ) < 0.001 &&
              Math.abs(
                parseFloat(t.koordinat.split(",")[1]) -
                  parseFloat(ticket.koordinat.split(",")[1]),
              ) < 0.001,
          );

          if (cluster.length > 1) {
            cluster.forEach((t) => processed.add(t.id));
            clusters.push(cluster);
          }
        }
      });

    return clusters;
  };

  const clusters = detectClusters();

  const handleTicketSelect = (ticketId) => {
    setSelectedTickets((prev) => {
      if (prev.includes(ticketId)) {
        return prev.filter((id) => id !== ticketId);
      }
      return [...prev, ticketId];
    });
  };

  const handleMergeInit = () => {
    if (selectedTickets.length < 2) {
      setAlert({
        type: "error",
        message: "Pilih minimal 2 tiket untuk digabungkan",
      });
      return;
    }
    setShowMergeConfirm(true);
    setPrimaryTicketId(selectedTickets[0]);
    setAlert(null);
  };

  const handleMergeSubmit = (e) => {
    e.preventDefault();

    if (!primaryTicketId) {
      setAlert({ type: "error", message: "Pilih tiket utama terlebih dahulu" });
      return;
    }

    if (!mergeReason.trim()) {
      setAlert({ type: "error", message: "Alasan penggabungan wajib diisi" });
      return;
    }

    if (mergeReason.trim().length < 20) {
      setAlert({ type: "error", message: "Alasan minimal 20 karakter" });
      return;
    }

    setTickets((prev) =>
      prev.map((ticket) => {
        if (!selectedTickets.includes(ticket.id)) {
          return ticket;
        }
        return {
          ...ticket,
          status: "Merged",
          mergedInto: ticket.id === primaryTicketId ? null : primaryTicketId,
        };
      }),
    );

    setAlert({
      type: "success",
      message: `Berhasil menggabungkan ${selectedTickets.length} tiket menjadi ${primaryTicketId}`,
    });

    setTimeout(() => {
      setShowMergeConfirm(false);
      setSelectedTickets([]);
      setPrimaryTicketId("");
      setMergeReason("");
      setAlert(null);
    }, 2000);
  };

  const getSimilarityBadge = (score) => {
    if (score >= 90) {
      return (
        <Badge className="bg-red-500 text-white">Sangat Mirip {score}%</Badge>
      );
    }
    if (score >= 75) {
      return <Badge className="bg-orange-500 text-white">Mirip {score}%</Badge>;
    }
    return (
      <Badge className="bg-yellow-500 text-white">Cukup Mirip {score}%</Badge>
    );
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredTickets = tickets.filter((ticket) => {
    if (!normalizedQuery) {
      return true;
    }
    return [ticket.id, ticket.judul, ticket.wilayah, ticket.kategori]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery);
  });

  const getStatusBadge = (ticket) => {
    if (ticket.status !== "Merged") {
      return null;
    }
    const label = ticket.mergedInto
      ? `Merged ke ${ticket.mergedInto}`
      : "Merged";
    return <Badge className="bg-gray-200 text-gray-800">{label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {clusters.length > 0 && (
        <Alert className="border-orange-500 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            Sistem mendeteksi <strong>{clusters.length} cluster</strong> tiket
            duplikat yang perlu ditindaklanjuti. Periksa dan gabungkan tiket
            yang sama.
          </AlertDescription>
        </Alert>
      )}

      {alert && (
        <Alert variant={alert.type === "error" ? "destructive" : "default"}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Deteksi Tiket Duplikat</CardTitle>
                <CardDescription>
                  Sistem otomatis mendeteksi tiket dengan lokasi, kategori, dan
                  waktu serupa (FR-ADM-11, FR-ADM-12)
                </CardDescription>
              </div>
              <Button
                onClick={handleMergeInit}
                disabled={selectedTickets.length < 2}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <GitMerge className="w-4 h-4 mr-2" />
                Gabungkan ({selectedTickets.length})
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Cari berdasarkan ID, judul, atau lokasi..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-3 max-h-[700px] overflow-y-auto">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`p-4 border rounded-lg transition-all cursor-pointer ${
                    ticket.status === "Merged"
                      ? "opacity-60 cursor-not-allowed"
                      : selectedTickets.includes(ticket.id)
                        ? "border-blue-500 bg-blue-50"
                        : "hover:bg-gray-50"
                  }`}
                  onClick={() =>
                    ticket.status !== "Merged" && handleTicketSelect(ticket.id)
                  }
                >
                  <div className="flex gap-4">
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        checked={selectedTickets.includes(ticket.id)}
                        onChange={() => handleTicketSelect(ticket.id)}
                        disabled={ticket.status === "Merged"}
                        className="mt-1 w-4 h-4"
                      />
                    </div>

                    <div className="flex-shrink-0">
                      <img
                        src={ticket.foto}
                        alt="Foto laporan"
                        className="w-20 h-20 object-cover rounded border"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="font-mono text-sm font-semibold text-blue-600">
                            {ticket.id}
                          </span>
                          <h4 className="font-medium text-sm mt-1">
                            {ticket.judul}
                          </h4>
                        </div>
                        {getSimilarityBadge(ticket.similarityScore)}
                      </div>

                      {getStatusBadge(ticket) && (
                        <div className="mb-2">{getStatusBadge(ticket)}</div>
                      )}

                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {ticket.deskripsi}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {ticket.pelapor}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {ticket.tanggalMasuk}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {ticket.wilayah}
                        </div>
                        <div className="text-xs">
                          <Badge variant="outline" className="text-xs">
                            {ticket.kategori}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="w-5 h-5" />
              Cluster Terdeteksi
            </CardTitle>
            <CardDescription>
              Kelompok tiket dengan kesamaan tinggi (FR-ADM-13)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {clusters.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Link2 className="w-12 h-12 mx-auto mb-3" />
                <p className="text-sm">Tidak ada cluster duplikat terdeteksi</p>
              </div>
            ) : (
              <div className="space-y-4">
                {clusters.map((cluster, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-lg bg-orange-50 border-orange-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-orange-600 text-white">
                        Cluster {index + 1}
                      </Badge>
                      <span className="text-xs font-semibold text-orange-700">
                        {cluster.length} Tiket
                      </span>
                    </div>
                    <p className="text-sm font-medium mb-2">
                      {cluster[0].kategori}
                    </p>
                    <p className="text-xs text-gray-600 mb-2">
                      {cluster[0].wilayah}
                    </p>
                    <div className="space-y-1">
                      {cluster.map((ticket) => (
                        <div
                          key={ticket.id}
                          className="text-xs font-mono bg-white px-2 py-1 rounded border"
                        >
                          {ticket.id}
                        </div>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-3 text-xs"
                      onClick={() => {
                        setSelectedTickets(cluster.map((t) => t.id));
                        handleMergeInit();
                      }}
                    >
                      <GitMerge className="w-3 h-3 mr-1" />
                      Gabungkan Cluster
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {showMergeConfirm && (
        <Card className="border-blue-500">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center gap-2">
              <GitMerge className="w-5 h-5" />
              Konfirmasi Penggabungan Tiket
            </CardTitle>
            <CardDescription>
              Gabungkan {selectedTickets.length} tiket menjadi satu tiket utama
              (FR-ADM-14, FR-ADM-15)
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleMergeSubmit} className="space-y-4">
              <div>
                <Label className="mb-2 block">
                  Pilih Tiket Utama <span className="text-red-500">*</span>
                </Label>
                <div className="space-y-2">
                  {selectedTickets.map((ticketId) => {
                    const ticket = tickets.find((t) => t.id === ticketId);
                    return (
                      <label
                        key={ticketId}
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                          primaryTicketId === ticketId
                            ? "border-blue-500 bg-blue-50"
                            : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="primaryTicket"
                          value={ticketId}
                          checked={primaryTicketId === ticketId}
                          onChange={(e) => setPrimaryTicketId(e.target.value)}
                          className="w-4 h-4"
                        />
                        <div className="flex-1">
                          <p className="font-mono text-sm font-semibold">
                            {ticketId}
                          </p>
                          <p className="text-sm text-gray-600">
                            {ticket?.judul}
                          </p>
                          <p className="text-xs text-gray-500">
                            Pelapor: {ticket?.pelapor} | {ticket?.tanggalMasuk}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label className="mb-2 block">
                  Tiket yang Akan Digabungkan
                </Label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {selectedTickets
                      .filter((id) => id !== primaryTicketId)
                      .map((ticketId) => (
                        <Badge
                          key={ticketId}
                          variant="outline"
                          className="font-mono"
                        >
                          {ticketId}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="mergeReason" className="mb-2 block">
                  Alasan Penggabungan <span className="text-red-500">*</span>
                </Label>
                <textarea
                  id="mergeReason"
                  rows={4}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Jelaskan mengapa tiket-tiket ini perlu digabungkan (minimal 20 karakter)..."
                  value={mergeReason}
                  onChange={(e) => setMergeReason(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {mergeReason.length} karakter (minimal 20)
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={!primaryTicketId || mergeReason.trim().length < 20}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Konfirmasi Penggabungan
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowMergeConfirm(false);
                    setPrimaryTicketId("");
                    setMergeReason("");
                  }}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
