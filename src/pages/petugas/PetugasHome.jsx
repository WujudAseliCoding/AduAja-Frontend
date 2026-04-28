import { Camera, ClipboardCheck, MapPin, Timer } from "lucide-react";

export default function PetugasHome() {
  const panels = [
    {
      title: "Absensi Pintar",
      description: "Check-in lokasi tugas dan pantau jam kerja harian.",
      icon: Timer,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Unggah Foto Bukti",
      description: "Upload foto sebelum dan sesudah perbaikan di lapangan.",
      icon: Camera,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Daftar Tugas",
      description: "Lihat tugas aktif, jadwal, dan progress pekerjaan.",
      icon: ClipboardCheck,
      color: "bg-purple-100 text-purple-700",
    },
    {
      title: "Navigasi Lokasi",
      description: "Akses titik lokasi pekerjaan dan rute tercepat.",
      icon: MapPin,
      color: "bg-yellow-100 text-yellow-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h2 className="text-2xl font-bold text-gray-900">Modul Petugas</h2>
          <p className="text-sm text-gray-600">
            Area kerja petugas untuk absensi, dokumentasi, dan tugas lapangan.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {panels.map((panel) => (
            <div
              key={panel.title}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
            >
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center ${panel.color}`}
              >
                <panel.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mt-4">
                {panel.title}
              </h3>
              <p className="text-sm text-gray-600 mt-2">{panel.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
