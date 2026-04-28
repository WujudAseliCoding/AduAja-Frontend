import { useState } from "react";
import { Camera, MapPin, ArrowLeft, X, AlertCircle } from "lucide-react";

export default function CreateReport({ onNavigate }) {
  const [formData, setFormData] = useState({
    category: "",
    description: "",
    landmark: "",
    latitude: "",
    longitude: "",
  });
  const [photo, setPhoto] = useState(null);
  const [gpsStatus, setGpsStatus] = useState("idle");
  const [errors, setErrors] = useState({});

  const categories = [
    "Infrastruktur Jalan",
    "Penerangan Jalan",
    "Kebersihan",
    "Drainase",
    "Taman & RTH",
    "Fasilitas Umum",
    "Lainnya",
  ];

  const handleGetLocation = () => {
    setGpsStatus("loading");
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
          });
          setGpsStatus("success");
          setErrors({ ...errors, location: "" });
        },
        () => {
          setGpsStatus("error");
          setErrors({
            ...errors,
            location: "Gagal mendapatkan lokasi. Pastikan GPS aktif.",
          });
        },
      );
    } else {
      setGpsStatus("error");
      setErrors({ ...errors, location: "Browser tidak mendukung GPS" });
    }
  };

  const handleCameraCapture = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors({ ...errors, photo: "File harus berupa gambar" });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, photo: "Ukuran foto maksimal 5MB" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
        setErrors({ ...errors, photo: "" });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.category) newErrors.category = "Kategori harus dipilih";
    if (!formData.description) {
      newErrors.description = "Deskripsi harus diisi";
    } else if (formData.description.length < 20) {
      newErrors.description = "Deskripsi minimal 20 karakter";
    }
    if (!formData.landmark) newErrors.landmark = "Patokan lokasi harus diisi";
    if (!formData.latitude || !formData.longitude) {
      newErrors.location = "Lokasi GPS harus diambil";
    }
    if (!photo) newErrors.photo = "Foto harus diambil dari kamera";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const ticketId = `TKT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`;
      alert(`Laporan berhasil dibuat!\nNomor Tiket: ${ticketId}`);
      onNavigate("dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 h-16">
            <button
              onClick={() => onNavigate("dashboard")}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="font-bold text-gray-900">Buat Laporan Baru</h1>
              <p className="text-xs text-gray-500">
                Laporkan kerusakan infrastruktur
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Kategori Laporan <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Pilih kategori</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.category}
              </p>
            )}
          </div>

          {/* Photo */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Foto Laporan <span className="text-red-500">*</span>
            </label>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Wajib menggunakan kamera:</strong> Foto harus diambil
                  langsung menggunakan kamera perangkat Anda, bukan dari
                  galeri/file. Ini untuk memastikan autentisitas laporan.
                </span>
              </p>
            </div>

            {photo ? (
              <div className="relative">
                <img
                  src={photo}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setPhoto(null)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                  ✓ Foto berhasil diambil
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-all bg-gradient-to-br from-blue-50 to-white">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Camera className="w-10 h-10 text-blue-600" />
                </div>
                <p className="text-base font-semibold text-blue-900 mb-1">
                  Buka Kamera
                </p>
                <p className="text-sm text-blue-600 mb-1">
                  Ambil foto kerusakan secara langsung
                </p>
                <p className="text-xs text-gray-500 px-6 text-center">
                  Klik untuk mengakses kamera perangkat Anda
                </p>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleCameraCapture}
                  className="hidden"
                  id="camera-input"
                />
              </label>
            )}
            {errors.photo && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.photo}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Deskripsi Kerusakan <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Jelaskan detail kerusakan yang Anda laporkan (minimal 20 karakter)"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                {formData.description.length}/20 karakter minimum
              </p>
              {errors.description && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Lokasi <span className="text-red-500">*</span>
            </label>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">
                Patokan Lokasi
              </label>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contoh: Dekat Indomaret, seberang Bank BCA"
              />
              {errors.landmark && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.landmark}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleGetLocation}
              disabled={gpsStatus === "loading"}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              <MapPin className="w-5 h-5" />
              {gpsStatus === "loading"
                ? "Mendapatkan Lokasi..."
                : "Ambil Koordinat GPS"}
            </button>

            {gpsStatus === "success" && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-900 mb-2">
                  Lokasi Berhasil Diambil
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-green-700">Latitude:</p>
                    <p className="font-mono font-medium text-green-900">
                      {formData.latitude}
                    </p>
                  </div>
                  <div>
                    <p className="text-green-700">Longitude:</p>
                    <p className="font-mono font-medium text-green-900">
                      {formData.longitude}
                    </p>
                  </div>
                </div>
                <div className="mt-3 aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500 text-sm">Peta Pratinjau</p>
                </div>
              </div>
            )}

            {errors.location && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.location}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg font-medium hover:shadow-lg transition-shadow"
            >
              Kirim Laporan
            </button>
            <p className="text-xs text-gray-500 text-center mt-3">
              Pastikan semua informasi sudah benar sebelum mengirim
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
