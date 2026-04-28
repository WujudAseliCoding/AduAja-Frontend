import { useState } from 'react';
import { X, Upload, Camera, AlertTriangle, FileText } from 'lucide-react';

export default function ReportBack({ task, onClose, onSubmit }) {
  const [invalidReason, setInvalidReason] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const invalidReasonOptions = [
    'Lokasi tidak sesuai',
    'Informasi tidak lengkap',
    'Duplikasi laporan',
    'Bukan kewenangan instansi',
    'Laporan tidak jelas',
    'Alamat tidak ditemukan',
    'Kondisi berbeda dari laporan',
    'Lainnya'
  ];

  const handlePhotoChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setPhotos([...photos, ...newFiles]);
    }
  };

  const handleDocumentChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setDocuments([...documents, ...newFiles]);
    }
  };

  const removePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const removeDocument = (index) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!invalidReason || !description) {
      alert('Mohon lengkapi alasan dan deskripsi laporan balik');
      return;
    }

    if (photos.length === 0) {
      alert('Minimal upload 1 foto bukti');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    onSubmit({
      invalidReason,
      description,
      photos,
      documents
    });

    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h2 className="font-semibold text-lg">Lapor Balik (Invalid)</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4">
          {/* Task Info */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-red-900 text-sm">
                  {task?.title || 'Tugas Lapangan'}
                </div>
                <div className="text-xs text-red-700 mt-1">
                  Laporan #{task?.reportId || 'N/A'}
                </div>
                <div className="text-xs text-red-600 mt-1">
                  Gunakan fitur ini jika laporan tidak valid atau tidak sesuai dengan kondisi di lapangan
                </div>
              </div>
            </div>
          </div>

          {/* Invalid Reason */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alasan Laporan Tidak Valid <span className="text-red-500">*</span>
            </label>
            <select
              value={invalidReason}
              onChange={(e) => setInvalidReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Pilih alasan</option>
              {invalidReasonOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi Lengkap <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Jelaskan secara detail mengapa laporan dianggap tidak valid dan kondisi sebenarnya di lapangan..."
              required
            />
          </div>

          {/* Photo Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto Bukti <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="flex flex-col items-center cursor-pointer"
              >
                <Camera className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">Upload Foto</span>
                <span className="text-xs text-gray-400">Max 5 foto</span>
              </label>
            </div>

            {photos.length > 0 && (
              <div className="mt-2 space-y-2">
                {photos.map((photo, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                  >
                    <span className="text-sm text-gray-700 truncate flex-1">
                      {photo.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Document Upload (Optional) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dokumen Pendukung (Opsional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                multiple
                onChange={handleDocumentChange}
                className="hidden"
                id="document-upload"
              />
              <label
                htmlFor="document-upload"
                className="flex flex-col items-center cursor-pointer"
              >
                <FileText className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">Upload Dokumen</span>
                <span className="text-xs text-gray-400">PDF, DOC, DOCX</span>
              </label>
            </div>

            {documents.length > 0 && (
              <div className="mt-2 space-y-2">
                {documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                  >
                    <span className="text-sm text-gray-700 truncate flex-1">
                      {doc.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeDocument(index)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-yellow-800">
                <strong>Perhatian:</strong> Laporan balik akan direview oleh
                admin. Pastikan bukti dan deskripsi yang Anda berikan akurat.
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim Laporan Balik'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
