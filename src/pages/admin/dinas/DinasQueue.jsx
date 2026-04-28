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
import {
  Search,
  Filter,
  MapPin,
  Clock,
  Eye,
  AlertCircle,
  Calendar,
  User,
  Building2,
} from "lucide-react";

export default function DinasQueue({ dinasName }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const laporanDinas = [
    {
      id: "TKT-2026-001",
      judul: "Jalan Berlubang di Jl. Sudirman",
      pelapor: "Ahmad Fauzi",
      kategori: "Jalan/Infrastruktur",
      wilayah: "Kec. Medan Baru",
      tanggalLaporan: "2026-04-28 08:30",
      tanggalDisposisi: "2026-04-28 11:00",
      koordinat: "-3.5952, 98.6722",
      prioritas: "Sedang",
      deadline: "2026-05-05 17:00",
      status: "Diterima - Belum Ditindaklanjuti",
      instruksiAdmin:
        "Segera tinjau lokasi dan lakukan perbaikan jalan. Prioritaskan karena sering dilalui kendaraan berat.",
      sisaWaktu: "6 hari 4 jam",
      foto: "https://images.unsplash.com/photo-1625935216538-f865d2db4b5e?w=200",
    },
    {
      id: "TKT-2026-006",
      judul: "Lubang Jalan Besar di Jl. Sudirman (Merged)",
      pelapor: "Ahmad Fauzi + 2 pelapor lainnya",
      kategori: "Jalan/Infrastruktur",
      wilayah: "Kec. Medan Baru",
      tanggalLaporan: "2026-04-28 08:30",
      tanggalDisposisi: "2026-04-28 12:00",
      koordinat: "-3.5952, 98.6722",
      prioritas: "Tinggi",
      deadline: "2026-04-30 17:00",
      status: "Dalam Penanganan",
      instruksiAdmin:
        "Laporan gabungan dari 3 pelapor. Segera tangani karena sangat mengganggu lalu lintas.",
      sisaWaktu: "1 hari 3 jam",
      foto: "https://images.unsplash.com/photo-1625935216538-f865d2db4b5e?w=200",
      progressUpdate: [
        {
          tanggal: "2026-04-28 13:00",
          keterangan: "Tim survey turun ke lokasi",
          petugas: "Budi S.",
        },
        {
          tanggal: "2026-04-28 15:30",
          keterangan: "Material hotmix sudah disiapkan",
          petugas: "Budi S.",
        },
      ],
    },
    {
      id: "TKT-2026-010",
      judul: "Jalan Rusak di Jl. Gatot Subroto",
      pelapor: "Dewi Lestari",
      kategori: "Jalan/Infrastruktur",
      wilayah: "Kec. Medan Polonia",
      tanggalLaporan: "2026-04-27 10:00",
      tanggalDisposisi: "2026-04-27 14:00",
      koordinat: "-3.5889, 98.6753",
      prioritas: "Kritis",
      deadline: "2026-04-28 17:00",
      status: "Terlambat SLA",
      instruksiAdmin:
        "URGENT! Jalan utama menuju rumah sakit. Segera perbaiki.",
      sisaWaktu: "Terlambat 2 jam",
      foto: "https://images.unsplash.com/photo-1625935216538-f865d2db4b5e?w=200",
    },
    {
      id: "TKT-2026-015",
      judul: "Perbaikan Gorong-gorong di Jl. Sisingamangaraja",
      pelapor: "Rina Putri",
      kategori: "Drainase",
      wilayah: "Kec. Medan Baru",
      tanggalLaporan: "2026-04-26 09:00",
      tanggalDisposisi: "2026-04-26 15:00",
      koordinat: "-3.5945, 98.6700",
      prioritas: "Sedang",
      deadline: "2026-05-03 17:00",
      status: "Selesai - Menunggu Verifikasi Admin",
      instruksiAdmin: "Gorong-gorong tersumbat menyebabkan banjir saat hujan.",
      sisaWaktu: "4 hari 2 jam",
      foto: "https://images.unsplash.com/photo-1625935216538-f865d2db4b5e?w=200",
      tanggalSelesai: "2026-04-28 10:00",
      fotoBukti:
        "https://images.unsplash.com/photo-1625935216538-f865d2db4b5e?w=200",
      keteranganPenyelesaian:
        "Gorong-gorong sudah dibersihkan dan diperbaiki. Air mengalir lancar.",
    },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      "Diterima - Belum Ditindaklanjuti": {
        className: "bg-gray-100 text-gray-800",
      },
      "Dalam Penanganan": { className: "bg-blue-100 text-blue-800" },
      "Terlambat SLA": { className: "bg-red-100 text-red-800" },
      "Selesai - Menunggu Verifikasi Admin": {
        className: "bg-green-100 text-green-800",
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

  const terlambatCount = laporanDinas.filter(
    (laporan) => laporan.status === "Terlambat SLA",
  ).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Antrean Laporan - {dinasName}</CardTitle>
            <CardDescription>
              Daftar laporan yang didisposisikan untuk ditindaklanjuti
            </CardDescription>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter & Sortir
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari berdasarkan ID Tiket atau Judul..."
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
            <option value="baru">Belum Ditindaklanjuti</option>
            <option value="proses">Dalam Penanganan</option>
            <option value="selesai">Selesai</option>
            <option value="terlambat">Terlambat SLA</option>
          </select>
        </div>

        {terlambatCount > 0 && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <span className="font-semibold">
                Perhatian! {terlambatCount} laporan terlambat SLA
              </span>
            </div>
          </div>
        )}

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
                    Disposisi
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Deadline
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {laporanDinas.map((laporan) => (
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
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm">
                        <User className="w-3 h-3 text-gray-400" />
                        {laporan.pelapor}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {laporan.wilayah}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        {laporan.tanggalDisposisi}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(laporan.status)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-sm font-medium ${
                          laporan.status === "Terlambat SLA"
                            ? "text-red-600"
                            : "text-gray-700"
                        }`}
                      >
                        {laporan.sisaWaktu}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Button size="sm" variant="outline">
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
          <p>Menampilkan 1-4 dari 4 laporan</p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled>
              Sebelumnya
            </Button>
            <Button size="sm" variant="outline" disabled>
              Selanjutnya
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
