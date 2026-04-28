import { useState, useEffect } from 'react';
import { X, AlertCircle, Users, MapPin, Clock } from 'lucide-react';

export default function EscalationRequest({ task, onClose, onSubmit }) {
  const [escalationType, setEscalationType] = useState('');
  const [description, setDescription] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState('medium');
  const [requestedSupport, setRequestedSupport] = useState([]);
  const [location, setLocation] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const escalationTypes = [
    'Membutuhkan bantuan teknis',
    'Membutuhkan peralatan tambahan',
    'Membutuhkan personil tambahan',
    'Masalah keamanan',
    'Koordinasi lintas instansi',
    'Kondisi darurat',
    'Lainnya'
  ];

  const supportOptions = [
    'Tim Teknis',
    'Peralatan Berat',
    'Tim Keamanan',
    'Koordinator Lapangan',
    'Ahli Spesialis',
    'Bantuan Medis'
  ];

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    setIsGettingLocation(true);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Simulate reverse geocoding
          const address = `Lokasi: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

          setLocation({ latitude, longitude, address });
          setIsGettingLocation(false);
        },
        (error) => {
          console.log('GPS error, using mock location for demo:', error);
          // Fallback: gunakan mock location untuk demo
          setLocation({
            latitude: -6.2088,
            longitude: 106.8456,
            address: 'Jl. Sudirman No. 123, Jakarta Pusat (Mock Location)'
          });
          setIsGettingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      // Fallback: gunakan mock location untuk demo
      setLocation({
        latitude: -6.2088,
        longitude: 106.8456,
        address: 'Jl. Sudirman No. 123, Jakarta Pusat (Mock Location)'
      });
      setIsGettingLocation(false);
    }
  };

  const toggleSupport = (support) => {
    if (requestedSupport.includes(support)) {
      setRequestedSupport(requestedSupport.filter(s => s !== support));
    } else {
      setRequestedSupport([...requestedSupport, support]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!escalationType || !description) {
      alert('Mohon lengkapi jenis eskalasi dan deskripsi');
      return;
    }

    if (!location) {
      alert('Mohon tunggu hingga lokasi terdeteksi');
      return;
    }

    if (requestedSupport.length === 0) {
      alert('Pilih minimal satu jenis bantuan yang diperlukan');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    onSubmit({
      escalationType,
      description,
      urgencyLevel,
      requestedSupport,
      location,
      timestamp: new Date().toISOString()
    });

    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h2 className="font-semibold text-lg">Ajukan Eskalasi</h2>
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
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-orange-900 text-sm">
                  {task?.title || 'Tugas Lapangan'}
                </div>
                <div className="text-xs text-orange-700 mt-1">
                  Laporan #{task?.reportId || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Location Info */}
          {location ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs font-medium text-green-900">Lokasi Terdeteksi</div>
                  <div className="text-xs text-green-700 mt-0.5">{location.address}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-700">
                      {new Date().toLocaleTimeString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4 text-center">
              <div className="text-sm text-gray-600">
                {isGettingLocation ? 'Mendeteksi lokasi...' : 'Lokasi belum terdeteksi'}
              </div>
              {!isGettingLocation && (
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="text-sm text-blue-600 hover:text-blue-700 mt-1"
                >
                  Coba Lagi
                </button>
              )}
            </div>
          )}

          {/* Escalation Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jenis Eskalasi <span className="text-red-500">*</span>
            </label>
            <select
              value={escalationType}
              onChange={(e) => setEscalationType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Pilih jenis eskalasi</option>
              {escalationTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Urgency Level */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tingkat Urgensi <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setUrgencyLevel('low')}
                className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                  urgencyLevel === 'low'
                    ? 'bg-green-100 border-green-500 text-green-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Rendah
              </button>
              <button
                type="button"
                onClick={() => setUrgencyLevel('medium')}
                className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                  urgencyLevel === 'medium'
                    ? 'bg-yellow-100 border-yellow-500 text-yellow-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Sedang
              </button>
              <button
                type="button"
                onClick={() => setUrgencyLevel('high')}
                className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                  urgencyLevel === 'high'
                    ? 'bg-red-100 border-red-500 text-red-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Tinggi
              </button>
            </div>
          </div>

          {/* Requested Support */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bantuan yang Diperlukan <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {supportOptions.map((support) => (
                <label
                  key={support}
                  className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={requestedSupport.includes(support)}
                    onChange={() => toggleSupport(support)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{support}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi Detail <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Jelaskan secara detail kondisi yang memerlukan eskalasi dan jenis bantuan yang dibutuhkan..."
              required
            />
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex items-start gap-2">
              <Users className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-800">
                <strong>Informasi:</strong> Permintaan eskalasi akan segera
                diteruskan ke koordinator dan tim terkait. Lokasi dan waktu
                permintaan akan tercatat secara otomatis.
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
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={isSubmitting || !location}
            >
              {isSubmitting ? 'Mengirim...' : 'Ajukan Eskalasi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
