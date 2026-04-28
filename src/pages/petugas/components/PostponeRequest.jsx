import { useState } from 'react';
import { X, Clock, AlertCircle } from 'lucide-react';

export default function PostponeRequest({ task, onClose, onSubmit }) {
  const [reason, setReason] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reasonOptions = [
    'Menunggu peralatan',
    'Cuaca buruk',
    'Akses lokasi terbatas',
    'Koordinasi dengan pihak terkait',
    'Menunggu izin',
    'Peralatan rusak',
    'Lainnya'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason || !estimatedTime) {
      alert('Mohon lengkapi alasan dan estimasi waktu penundaan');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    onSubmit({
      reason,
      estimatedTime,
      additionalNotes
    });

    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h2 className="font-semibold text-lg">Ajukan Penundaan</h2>
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
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-blue-900 text-sm">
                  {task?.title || 'Tugas Lapangan'}
                </div>
                <div className="text-xs text-blue-700 mt-1">
                  Laporan #{task?.reportId || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Reason Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alasan Penundaan <span className="text-red-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Pilih alasan</option>
              {reasonOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Estimated Time */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estimasi Waktu Penyelesaian <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" />
              <input
                type="datetime-local"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Pilih tanggal dan waktu estimasi penyelesaian tugas
            </p>
          </div>

          {/* Additional Notes */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catatan Tambahan
            </label>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Jelaskan detail kondisi atau informasi tambahan..."
            />
          </div>

          {/* Info Box */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-yellow-800">
                <strong>Perhatian:</strong> Setelah waktu penundaan berakhir,
                sistem akan mengirimkan pengingat otomatis untuk melanjutkan tugas.
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
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Mengirim...' : 'Ajukan Penundaan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
