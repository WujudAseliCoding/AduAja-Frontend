import { useEffect, useState } from "react";
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
import {
  Search,
  Filter,
  MapPin,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

export default function LaporanQueue({ userRole, onNavigateToValidation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filterPrioritas, setFilterPrioritas] = useState("all");
  const [sortBy, setSortBy] = useState("tanggal");
  const [sortDirection, setSortDirection] = useState("desc");

  const laporanData = [
    {
      id: "TKT-2026-001",
      judul: "Jalan Berlubang di Jl. Sudirman",
      pelapor: "Ahmad Fauzi",
      kontakPelapor: "0812-3456-7890",
      kategori: "Jalan/Infrastruktur",
      wilayah: "Kec. Medan Baru",
      tanggalMasuk: "2026-04-28 08:30",
      status: "Menunggu Verifikasi",
      prioritas: "Sedang",
      sisaWaktuSLA: "2 hari 5 jam",
      koordinat: "-3.5952, 98.6722",
      deskripsi:
        "Terdapat lubang besar dengan diameter sekitar 2 meter di tengah jalan Sudirman dekat perempatan lampu merah. Lubang ini sangat berbahaya bagi pengendara sepeda motor dan dapat menyebabkan kecelakaan.",
      foto: "https://images.unsplash.com/photo-1625935216538-f865d2db4b5e?w=600",
      patokan: "Dekat lampu merah perempatan Sudirman",
    },
    {
      id: "TKT-2026-002",
      judul: "Lampu PJU Mati di Jl. Gatot Subroto",
      pelapor: "Siti Aminah",
      kontakPelapor: "0813-4567-8901",
      kategori: "Penerangan Jalan",
      wilayah: "Kec. Medan Polonia",
      tanggalMasuk: "2026-04-28 09:15",
      status: "Menunggu Verifikasi",
      prioritas: "Tinggi",
      sisaWaktuSLA: "1 hari 3 jam",
      koordinat: "-3.5889, 98.6753",
      deskripsi:
        "Lampu penerangan jalan umum (PJU) sepanjang 200 meter di Jl. Gatot Subroto tidak menyala sejak 3 hari yang lalu. Kondisi malam hari menjadi sangat gelap dan rawan kejahatan.",
      foto: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600",
      patokan: "Depan Bank BRI Gatot Subroto",
    },
    {
      id: "TKT-2026-003",
      judul: "Sampah Menumpuk di Taman Beringin",
      pelapor: "Budi Santoso",
      kontakPelapor: "0821-2345-6789",
      kategori: "Kebersihan/Sampah",
      wilayah: "Kec. Medan Selayang",
      tanggalMasuk: "2026-04-27 14:20",
      status: "Dalam Peninjauan",
      prioritas: "Sedang",
      sisaWaktuSLA: "18 jam",
      koordinat: "-3.5678, 98.6891",
      deskripsi:
        "Sampah tidak diangkut selama 1 minggu di area Taman Beringin. Menimbulkan bau tidak sedap dan lalat berterbangan.",
      foto: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600",
      patokan: "Taman Beringin dekat playground anak",
    },
    {
      id: "TKT-2026-004",
      judul: "Gorong-gorong Tersumbat",
      pelapor: "Dewi Lestari",
      kontakPelapor: "0822-3456-7891",
      kategori: "Jalan/Infrastruktur",
      wilayah: "Kec. Medan Baru",
      tanggalMasuk: "2026-04-27 10:00",
      status: "Terlambat",
      prioritas: "Kritis",
      sisaWaktuSLA: "Lewat 4 jam",
      koordinat: "-3.5945, 98.6700",
      deskripsi:
        "Gorong-gorong tersumbat menyebabkan banjir setiap kali hujan. Air menggenang hingga setinggi 30cm.",
      foto: "https://images.unsplash.com/photo-1625935216538-f865d2db4b5e?w=600",
      patokan: "Jl. Sisingamangaraja dekat minimarket Indomaret",
    },
  ];

  const handleViewDetail = (laporan) => {
    if (onNavigateToValidation) {
      onNavigateToValidation(laporan);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus, filterPrioritas, sortBy, sortDirection]);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const statusFilterMap = {
    menunggu: "Menunggu Verifikasi",
    peninjauan: "Dalam Peninjauan",
    terlambat: "Terlambat",
  };
  const activeStatusFilter = statusFilterMap[filterStatus] || null;
  const activePrioritasFilter =
    filterPrioritas === "all" ? null : filterPrioritas;

  const filteredReports = laporanData.filter((laporan) => {
    const matchesStatus = activeStatusFilter
      ? laporan.status === activeStatusFilter
      : true;
    const matchesPrioritas = activePrioritasFilter
      ? laporan.prioritas === activePrioritasFilter
      : true;
    const matchesQuery = normalizedQuery
      ? [
          laporan.id,
          laporan.judul,
          laporan.pelapor,
          laporan.wilayah,
          laporan.kategori,
        ].some((value) => value.toLowerCase().includes(normalizedQuery))
      : true;
    return matchesStatus && matchesPrioritas && matchesQuery;
  });

  const priorityOrder = {
    Kritis: 4,
    Tinggi: 3,
    Sedang: 2,
    Rendah: 1,
  };

  const sortedReports = [...filteredReports].sort((a, b) => {
    let compareValue = 0;
    if (sortBy === "tanggal") {
      const dateA = new Date(a.tanggalMasuk.replace(" ", "T"));
      const dateB = new Date(b.tanggalMasuk.replace(" ", "T"));
      compareValue = dateA - dateB;
    } else if (sortBy === "prioritas") {
      compareValue =
        (priorityOrder[a.prioritas] || 0) - (priorityOrder[b.prioritas] || 0);
    } else if (sortBy === "status") {
      compareValue = a.status.localeCompare(b.status);
    }
    return sortDirection === "asc" ? compareValue : -compareValue;
  });

  const pageSize = 4;
  const totalPages = Math.max(1, Math.ceil(sortedReports.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex =
    sortedReports.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIndex = Math.min(safePage * pageSize, sortedReports.length);
  const pagedReports = sortedReports.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  const getStatusBadge = (status) => {
    const statusConfig = {
      "Menunggu Verifikasi": {
        variant: "secondary",
        className: "bg-yellow-100 text-yellow-800",
      },
      "Dalam Peninjauan": {
        variant: "default",
        className: "bg-blue-100 text-blue-800",
      },
      Terlambat: {
        variant: "destructive",
        className: "bg-red-100 text-red-800",
      },
      Diterima: {
        variant: "default",
        className: "bg-green-100 text-green-800",
      },
    };
    const config = statusConfig[status] || { variant: "outline" };
    return (
      <Badge variant={config.variant} className={config.className}>
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Antrean Laporan Masuk</CardTitle>
            <CardDescription>
              Daftar laporan yang perlu divalidasi dan diproses (sesuai
              FR-ADM-01)
            </CardDescription>
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setShowFilters((prev) => !prev)}
          >
            <Filter className="w-4 h-4" />
            {showFilters ? "Tutup Filter" : "Filter & Sortir"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showFilters && (
          <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">
                Prioritas
              </label>
              <select
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterPrioritas}
                onChange={(e) => setFilterPrioritas(e.target.value)}
              >
                <option value="all">Semua Prioritas</option>
                <option value="Kritis">Kritis</option>
                <option value="Tinggi">Tinggi</option>
                <option value="Sedang">Sedang</option>
                <option value="Rendah">Rendah</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">
                Urutkan
              </label>
              <select
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="tanggal">Tanggal Masuk</option>
                <option value="prioritas">Prioritas</option>
                <option value="status">Status</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Arah</label>
              <select
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortDirection}
                onChange={(e) => setSortDirection(e.target.value)}
              >
                <option value="desc">Terbaru / Tertinggi</option>
                <option value="asc">Terlama / Terendah</option>
              </select>
            </div>
          </div>
        )}
        <div className="mb-4 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari berdasarkan ID Tiket, Nama Pelapor, atau Wilayah..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Semua Status</option>
            <option value="menunggu">Menunggu Verifikasi</option>
            <option value="peninjauan">Dalam Peninjauan</option>
            <option value="terlambat">Terlambat (SLA)</option>
          </select>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    ID Tiket
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Judul & Kategori
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Pelapor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Wilayah
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Tanggal Masuk
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    SLA
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pagedReports.map((laporan) => (
                  <tr key={laporan.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold">
                          {laporan.id}
                        </span>
                        {getPrioritasBadge(laporan.prioritas)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-sm">{laporan.judul}</p>
                        <p className="text-xs text-gray-500">
                          {laporan.kategori}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{laporan.pelapor}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {laporan.wilayah}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="w-3 h-3 text-gray-400" />
                        {laporan.tanggalMasuk}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(laporan.status)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-sm font-medium ${
                          laporan.status === "Terlambat"
                            ? "text-red-600"
                            : "text-gray-700"
                        }`}
                      >
                        {laporan.sisaWaktuSLA}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetail(laporan)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Detail
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <p>
            Menampilkan {startIndex}-{endIndex} dari {sortedReports.length}{" "}
            laporan
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={safePage <= 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            >
              Sebelumnya
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={safePage >= totalPages || sortedReports.length === 0}
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
