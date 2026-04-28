import { useState, useEffect, useRef } from 'react';

export default function TaskExecution({ task, user, onComplete, onBack }) {
  const [step, setStep] = useState('before'); // before, working, after, notes, review
  const [photoBefore, setPhotoBefore] = useState([]);
  const [photoAfter, setPhotoAfter] = useState([]);
  const [workNotes, setWorkNotes] = useState('');
  const [materialUsed, setMaterialUsed] = useState([]);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [obstacles, setObstacles] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [workStartTime] = useState(new Date());
  const [workDuration, setWorkDuration] = useState('00:00:00');
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const fileBeforeRef = useRef(null);
  const fileAfterRef = useRef(null);

  // Timer untuk durasi pengerjaan
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = now - workStartTime;
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setWorkDuration(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [workStartTime]);

  // Get location
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        }
      );
    }
  }, []);

  const handlePhotoCapture = (type) => {
    if (type === 'before') {
      fileBeforeRef.current?.click();
    } else {
      fileAfterRef.current?.click();
    }
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const photoData = {
          id: Date.now() + Math.random(),
          url: event.target.result,
          timestamp: new Date().toISOString(),
          location: userLocation,
          type: type
        };

        if (type === 'before') {
          setPhotoBefore(prev => [...prev, photoData]);
        } else {
          setPhotoAfter(prev => [...prev, photoData]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (id, type) => {
    if (type === 'before') {
      setPhotoBefore(prev => prev.filter(p => p.id !== id));
    } else {
      setPhotoAfter(prev => prev.filter(p => p.id !== id));
    }
  };

  const addMaterial = (material) => {
    setMaterialUsed(prev => [...prev, {
      id: Date.now(),
      name: material.name,
      quantity: material.quantity,
      unit: material.unit
    }]);
    setShowMaterialModal(false);
  };

  const removeMaterial = (id) => {
    setMaterialUsed(prev => prev.filter(m => m.id !== id));
  };

  const canProceedFromBefore = () => {
    return photoBefore.length >= 2;
  };

  const canComplete = () => {
    return photoAfter.length >= 2 && workNotes.trim().length > 0;
  };

  const handleComplete = () => {
    if (!canComplete()) {
      alert('Harap lengkapi foto sesudah (minimal 2) dan catatan pekerjaan');
      return;
    }
    setShowCompleteModal(true);
  };

  const confirmComplete = () => {
    const completionData = {
      task: task,
      photoBefore: photoBefore,
      photoAfter: photoAfter,
      workNotes: workNotes,
      materialUsed: materialUsed,
      obstacles: obstacles,
      workDuration: workDuration,
      completedBy: user,
      completedAt: new Date().toISOString(),
      location: userLocation
    };

    onComplete(completionData);
  };

  const renderBeforeStep = () => (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Foto Kondisi Awal
        </h3>
        <p className="text-sm text-blue-700">
          Ambil minimal 2 foto dari berbagai sudut untuk mendokumentasikan kondisi sebelum perbaikan.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          {photoBefore.map((photo) => (
            <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img src={photo.url} alt="Before" className="w-full h-full object-cover" />
              <button
                onClick={() => removePhoto(photo.id, 'before')}
                className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <p className="text-xs text-white">
                  {new Date(photo.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>

        <input
          ref={fileBeforeRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          onChange={(e) => handleFileChange(e, 'before')}
          className="hidden"
        />

        <button
          onClick={() => handlePhotoCapture('before')}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Ambil Foto ({photoBefore.length}/2 minimum)
        </button>

        {canProceedFromBefore() && (
          <button
            onClick={() => setStep('working')}
            className="w-full mt-3 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            Lanjut ke Pengerjaan
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );

  const renderWorkingStep = () => (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Proses Pengerjaan
        </h3>
        <p className="text-sm text-green-700">
          Lakukan pekerjaan perbaikan. Catat material yang digunakan dan hambatan jika ada.
        </p>
      </div>

      {/* Material Used */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">Material yang Digunakan</h3>
          <button
            onClick={() => setShowMaterialModal(true)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah
          </button>
        </div>

        {materialUsed.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">Belum ada material ditambahkan</p>
        ) : (
          <div className="space-y-2">
            {materialUsed.map((material) => (
              <div key={material.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{material.name}</p>
                  <p className="text-sm text-gray-600">{material.quantity} {material.unit}</p>
                </div>
                <button
                  onClick={() => removeMaterial(material.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Obstacles */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Hambatan / Catatan (Opsional)</h3>
        <textarea
          value={obstacles}
          onChange={(e) => setObstacles(e.target.value)}
          placeholder="Catat jika ada hambatan atau hal penting selama pengerjaan..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      <button
        onClick={() => setStep('after')}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
      >
        Selesai - Ambil Foto Sesudah
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>
    </div>
  );

  const renderAfterStep = () => (
    <div className="space-y-4">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Foto Kondisi Akhir
        </h3>
        <p className="text-sm text-purple-700">
          Ambil minimal 2 foto dari berbagai sudut untuk mendokumentasikan hasil perbaikan.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          {photoAfter.map((photo) => (
            <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img src={photo.url} alt="After" className="w-full h-full object-cover" />
              <button
                onClick={() => removePhoto(photo.id, 'after')}
                className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <p className="text-xs text-white">
                  {new Date(photo.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>

        <input
          ref={fileAfterRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          onChange={(e) => handleFileChange(e, 'after')}
          className="hidden"
        />

        <button
          onClick={() => handlePhotoCapture('after')}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Ambil Foto ({photoAfter.length}/2 minimum)
        </button>
      </div>

      {/* Work Notes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Catatan Pekerjaan *</h3>
        <textarea
          value={workNotes}
          onChange={(e) => setWorkNotes(e.target.value)}
          placeholder="Jelaskan pekerjaan yang telah dilakukan..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      <button
        onClick={handleComplete}
        disabled={!canComplete()}
        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Selesaikan Tugas
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-semibold">Pengerjaan Tugas</h1>
              <p className="text-sm text-blue-100">{task.id} - {task.title}</p>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2">
          <div className={`flex-1 h-2 rounded-full ${step === 'before' || step === 'working' || step === 'after' ? 'bg-white' : 'bg-blue-400'}`}></div>
          <div className={`flex-1 h-2 rounded-full ${step === 'working' || step === 'after' ? 'bg-white' : 'bg-blue-400'}`}></div>
          <div className={`flex-1 h-2 rounded-full ${step === 'after' ? 'bg-white' : 'bg-blue-400'}`}></div>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span>Foto Awal</span>
          <span>Pengerjaan</span>
          <span>Foto Akhir</span>
        </div>

        {/* Timer */}
        <div className="mt-3 bg-blue-700 rounded-lg p-3 flex items-center justify-between">
          <span className="text-sm">Durasi Pengerjaan:</span>
          <span className="text-lg font-mono font-bold">{workDuration}</span>
        </div>
      </div>

      <div className="p-4">
        {step === 'before' && renderBeforeStep()}
        {step === 'working' && renderWorkingStep()}
        {step === 'after' && renderAfterStep()}
      </div>

      {/* Material Modal */}
      {showMaterialModal && (
        <MaterialModal
          onClose={() => setShowMaterialModal(false)}
          onAdd={addMaterial}
        />
      )}

      {/* Complete Confirmation Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Konfirmasi Penyelesaian</h3>
              <p className="text-gray-600 mb-4">
                Pastikan semua data sudah benar sebelum menyelesaikan tugas
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-600 mb-1">Tugas</p>
                <p className="font-semibold text-gray-800">{task.id} - {task.title}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-600 mb-1">Durasi Pengerjaan</p>
                <p className="font-semibold text-gray-800">{workDuration}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-600 mb-1">Dokumentasi</p>
                <p className="font-semibold text-gray-800">
                  Foto Sebelum: {photoBefore.length} foto<br />
                  Foto Sesudah: {photoAfter.length} foto
                </p>
              </div>
              {materialUsed.length > 0 && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-600 mb-1">Material Digunakan</p>
                  <p className="font-semibold text-gray-800">{materialUsed.length} item</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCompleteModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmComplete}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Ya, Selesaikan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Material Modal Component
function MaterialModal({ onClose, onAdd }) {
  const [materialName, setMaterialName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('unit');

  const predefinedMaterials = [
    { name: 'Aspal', unit: 'kg' },
    { name: 'Semen', unit: 'sak' },
    { name: 'Pasir', unit: 'm³' },
    { name: 'Batu Koral', unit: 'm³' },
    { name: 'Paving Block', unit: 'buah' },
    { name: 'Cat', unit: 'liter' },
    { name: 'Lampu Jalan', unit: 'unit' },
    { name: 'Pipa PVC', unit: 'meter' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!materialName || !quantity) {
      alert('Nama material dan jumlah harus diisi');
      return;
    }
    onAdd({ name: materialName, quantity: parseFloat(quantity), unit });
    setMaterialName('');
    setQuantity('');
    setUnit('unit');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Tambah Material</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Material
            </label>
            <select
              value={materialName}
              onChange={(e) => {
                setMaterialName(e.target.value);
                const selected = predefinedMaterials.find(m => m.name === e.target.value);
                if (selected) setUnit(selected.unit);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Pilih Material</option>
              {predefinedMaterials.map((material) => (
                <option key={material.name} value={material.name}>
                  {material.name}
                </option>
              ))}
              <option value="custom">Material Lainnya...</option>
            </select>
          </div>

          {materialName === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Material Khusus
              </label>
              <input
                type="text"
                onChange={(e) => setMaterialName(e.target.value)}
                placeholder="Masukkan nama material"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jumlah
              </label>
              <input
                type="number"
                step="0.01"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Satuan
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="unit">Unit</option>
                <option value="kg">Kg</option>
                <option value="sak">Sak</option>
                <option value="m³">m³</option>
                <option value="meter">Meter</option>
                <option value="liter">Liter</option>
                <option value="buah">Buah</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Tambah
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
