import { useState, useEffect } from 'react';
import PostponeRequest from './PostponeRequest';
import ReportBack from './ReportBack';
import EscalationRequest from './EscalationRequest';

export default function TaskDetail({ task, user, onBack, onStartTask, onNavigate }) {
  const [userLocation, setUserLocation] = useState(null);
  const [distanceToTask, setDistanceToTask] = useState(null);
  const [showStartModal, setShowStartModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showPostponeModal, setShowPostponeModal] = useState(false);
  const [showReportBackModal, setShowReportBackModal] = useState(false);
  const [showEscalationModal, setShowEscalationModal] = useState(false);

  // Get user location dengan fallback untuk demo
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLon = position.coords.longitude;
          setUserLocation({ latitude: userLat, longitude: userLon });

          // Calculate distance only if task has valid coordinates
          if (task.location.latitude != null && task.location.longitude != null) {
            const distance = calculateDistance(
              userLat,
              userLon,
              task.location.latitude,
              task.location.longitude
            );
            setDistanceToTask(distance);
          }
        },
        (error) => {
          console.log('GPS error, using mock location for demo:', error);
          // Fallback: gunakan mock location dekat dengan lokasi tugas untuk demo
          const mockLat = task.location.latitude || -6.2088;
          const mockLon = task.location.longitude || 106.8456;
          setUserLocation({ latitude: mockLat, longitude: mockLon });

          if (task.location.latitude != null && task.location.longitude != null) {
            setDistanceToTask(0.05); // Mock distance 50 meter
          }
        },
        {
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      // Fallback: gunakan mock location untuk demo
      const mockLat = task.location.latitude || -6.2088;
      const mockLon = task.location.longitude || 106.8456;
      setUserLocation({ latitude: mockLat, longitude: mockLon });

      if (task.location.latitude != null && task.location.longitude != null) {
        setDistanceToTask(0.05); // Mock distance 50 meter
      }
    }
  }, [task]);

  // Haversine formula untuk menghitung jarak
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius bumi dalam km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const toRad = (value) => {
    return (value * Math.PI) / 180;
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      critical: { text: 'Kritis', color: 'bg-red-100 text-red-800 border-red-200' },
      high: { text: 'Tinggi', color: 'bg-orange-100 text-orange-800 border-orange-200' },
      medium: { text: 'Sedang', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      low: { text: 'Rendah', color: 'bg-green-100 text-green-800 border-green-200' }
    };
    return badges[priority] || badges.low;
  };

  const getStatusBadge = (status) => {
    const badges = {
      new: { text: 'Tugas Baru', color: 'bg-blue-100 text-blue-800' },
      in_progress: { text: 'Sedang Dikerjakan', color: 'bg-green-100 text-green-800' },
      pending: { text: 'Tertunda', color: 'bg-yellow-100 text-yellow-800' },
      completed: { text: 'Selesai', color: 'bg-gray-100 text-gray-800' }
    };
    return badges[status] || badges.new;
  };

  const getSLAStatus = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const hoursLeft = (deadlineDate - now) / (1000 * 60 * 60);

    if (hoursLeft < 0) {
      return { text: 'Terlambat', color: 'text-red-600', icon: '⚠️' };
    } else if (hoursLeft < 4) {
      return { text: `${Math.floor(hoursLeft)} jam lagi`, color: 'text-red-600', icon: '🔴' };
    } else if (hoursLeft < 24) {
      return { text: `${Math.floor(hoursLeft)} jam lagi`, color: 'text-orange-600', icon: '🟡' };
    } else {
      const daysLeft = Math.floor(hoursLeft / 24);
      return { text: `${daysLeft} hari lagi`, color: 'text-gray-600', icon: '🟢' };
    }
  };

  const handleStartTask = () => {
    // Untuk demo: izinkan mulai tugas meskipun tanpa lokasi atau jauh
    // Di production, validasi ini akan aktif penuh

    // Validasi jarak (maksimal 100 meter dari lokasi tugas) - DEMO MODE: warning only
    if (distanceToTask && distanceToTask > 0.1) {
      const proceed = confirm(
        `Anda berada ${distanceToTask < 1 ? (distanceToTask * 1000).toFixed(0) + ' meter' : distanceToTask.toFixed(2) + ' km'} dari lokasi tugas.\n\n` +
        `Idealnya Anda harus berada dalam radius 100 meter.\n\n` +
        `Lanjutkan memulai tugas? (Mode Demo)`
      );
      if (!proceed) return;
    }

    setShowStartModal(true);
  };

  const confirmStartTask = () => {
    onStartTask(task);
    setShowStartModal(false);
  };

  const handlePostponeSubmit = (data) => {
    console.log('Postpone request:', data);
    alert(`Permintaan penundaan berhasil diajukan. Estimasi penyelesaian: ${new Date(data.estimatedTime).toLocaleString('id-ID')}`);
    setShowPostponeModal(false);
  };

  const handleReportBackSubmit = (data) => {
    console.log('Report back:', data);
    alert(`Laporan balik berhasil dikirim. Alasan: ${data.invalidReason}`);
    setShowReportBackModal(false);
    onBack(); // Return to task list
  };

  const handleEscalationSubmit = (data) => {
    console.log('Escalation request:', data);
    alert(`Permintaan eskalasi berhasil diajukan. Bantuan yang diminta: ${data.requestedSupport.join(', ')}`);
    setShowEscalationModal(false);
  };

  const openMaps = () => {
    if (task.location.latitude == null || task.location.longitude == null) {
      alert('Koordinat lokasi tidak tersedia');
      return;
    }
    const url = `https://www.google.com/maps/dir/?api=1&destination=${task.location.latitude},${task.location.longitude}`;
    window.open(url, '_blank');
  };

  const priorityBadge = getPriorityBadge(task.priority);
  const statusBadge = getStatusBadge(task.status);
  const slaStatus = getSLAStatus(task.slaDeadline);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 sticky top-0 z-10 shadow-md">
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
            <h1 className="text-xl font-semibold">Detail Tugas</h1>
            <p className="text-sm text-blue-100">{task.id}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Status & Priority */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge.color}`}>
              {statusBadge.text}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${priorityBadge.color}`}>
              {priorityBadge.text}
            </span>
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-2">{task.title}</h2>
          <p className="text-gray-600 leading-relaxed">{task.description}</p>
        </div>

        {/* SLA Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Service Level Agreement (SLA)
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Batas Waktu:</span>
              <span className="font-medium text-gray-800">
                {new Date(task.slaDeadline).toLocaleString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Sisa Waktu:</span>
              <span className={`font-bold ${slaStatus.color} flex items-center gap-1`}>
                <span>{slaStatus.icon}</span>
                <span>{slaStatus.text}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Lokasi
          </h3>
          <div className="space-y-3">
            <p className="text-gray-700">{task.location.address}</p>
            {task.location.latitude != null && task.location.longitude != null && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Koordinat:</span>
                <span className="font-mono text-gray-800">
                  {task.location.latitude.toFixed(4)}, {task.location.longitude.toFixed(4)}
                </span>
              </div>
            )}
            {distanceToTask !== null && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Jarak dari Anda:</span>
                <span className="font-semibold text-blue-600">
                  {distanceToTask < 1
                    ? `${(distanceToTask * 1000).toFixed(0)} meter`
                    : `${distanceToTask.toFixed(2)} km`}
                </span>
              </div>
            )}
            <button
              onClick={openMaps}
              className="w-full bg-green-500 text-white py-2.5 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Buka di Google Maps
            </button>
          </div>
        </div>

        {/* Reporter Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Informasi Pelapor
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Nama:</span>
              <span className="font-medium text-gray-800">{task.reporterName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tanggal Laporan:</span>
              <span className="font-medium text-gray-800">
                {new Date(task.reportDate).toLocaleString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Kategori:</span>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                {task.category}
              </span>
            </div>
            <button
              onClick={() => setShowContactModal(true)}
              className="w-full mt-2 border border-blue-600 text-blue-600 py-2.5 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Hubungi Pelapor
            </button>
          </div>
        </div>

        {/* Task History (if in progress or pending) */}
        {(task.status === 'in_progress' || task.status === 'pending') && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Riwayat Status
            </h3>
            <div className="space-y-3">
              {task.status === 'in_progress' && task.startedAt && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="w-0.5 h-8 bg-gray-200"></div>
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-medium text-gray-800">Pekerjaan Dimulai</p>
                    <p className="text-sm text-gray-600">
                      {new Date(task.startedAt).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Oleh: {user.name}</p>
                  </div>
                </div>
              )}
              {task.status === 'pending' && task.pendingReason && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="w-0.5 h-8 bg-gray-200"></div>
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-medium text-gray-800">Ditunda</p>
                    <p className="text-sm text-gray-600">
                      {new Date(task.pendingSince).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <p className="text-sm text-gray-700 mt-1 bg-yellow-50 p-2 rounded border border-yellow-200">
                      {task.pendingReason}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">Laporan Diterima</p>
                  <p className="text-sm text-gray-600">
                    {new Date(task.reportDate).toLocaleString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Dari: {task.reporterName}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Action Buttons (Postpone, Report Back, Escalation) */}
        {(task.status === 'new' || task.status === 'in_progress') && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Tindakan Lainnya</h3>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => setShowPostponeModal(true)}
                className="px-4 py-3 border border-yellow-500 text-yellow-700 rounded-lg font-medium hover:bg-yellow-50 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Ajukan Penundaan
              </button>
              <button
                onClick={() => setShowReportBackModal(true)}
                className="px-4 py-3 border border-red-500 text-red-700 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Lapor Balik (Invalid)
              </button>
              <button
                onClick={() => setShowEscalationModal(true)}
                className="px-4 py-3 border border-orange-500 text-orange-700 rounded-lg font-medium hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Ajukan Eskalasi
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {task.status === 'new' && (
          <div className="sticky bottom-4">
            <button
              onClick={handleStartTask}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Mulai Kerjakan Tugas
            </button>
            {distanceToTask && distanceToTask > 0.1 && (
              <p className="text-center text-sm text-orange-600 mt-2">
                ⚠️ Anda harus berada dalam radius 100 meter dari lokasi untuk memulai tugas
              </p>
            )}
          </div>
        )}

        {task.status === 'in_progress' && (
          <div className="sticky bottom-4">
            <button
              onClick={() => onNavigate('task-execution', task)}
              className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Lanjutkan Pengerjaan
            </button>
          </div>
        )}
      </div>

      {/* Start Task Confirmation Modal */}
      {showStartModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Mulai Tugas?</h3>
              <p className="text-gray-600 mb-4">
                Anda akan memulai pengerjaan tugas <span className="font-semibold">{task.id}</span>
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-left">
                <p className="text-sm text-blue-800 mb-1">
                  <span className="font-semibold">Lokasi:</span> {task.location.address}
                </p>
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Deadline SLA:</span> {slaStatus.text}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowStartModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmStartTask}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Ya, Mulai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Reporter Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Hubungi Pelapor</h3>
            <div className="space-y-3 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Nama Pelapor</p>
                <p className="font-semibold text-gray-800">{task.reporterName}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Nomor Telepon</p>
                <p className="font-semibold text-gray-800">+62 812-3456-7890</p>
                <p className="text-xs text-gray-500 mt-1">Mock data - implementasi nyata dari database</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowContactModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Tutup
              </button>
              <button
                onClick={() => window.open('tel:+6281234567890')}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Telepon
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Postpone Request Modal */}
      {showPostponeModal && (
        <PostponeRequest
          task={task}
          onClose={() => setShowPostponeModal(false)}
          onSubmit={handlePostponeSubmit}
        />
      )}

      {/* Report Back Modal */}
      {showReportBackModal && (
        <ReportBack
          task={task}
          onClose={() => setShowReportBackModal(false)}
          onSubmit={handleReportBackSubmit}
        />
      )}

      {/* Escalation Request Modal */}
      {showEscalationModal && (
        <EscalationRequest
          task={task}
          onClose={() => setShowEscalationModal(false)}
          onSubmit={handleEscalationSubmit}
        />
      )}
    </div>
  );
}
