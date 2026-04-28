import { useState, useEffect } from 'react';

export default function Dashboard({ user, onNavigate, onLogout }) {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [currentStatus, setCurrentStatus] = useState('Belum Check-In');
  const [workDuration, setWorkDuration] = useState('00:00:00');
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [location, setLocation] = useState(null);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [stats, setStats] = useState({
    tugasBaru: 5,
    sedangDikerjakan: 2,
    tertunda: 1,
    selesaiHariIni: 3
  });

  // Timer untuk durasi kerja
  useEffect(() => {
    if (isCheckedIn && checkInTime) {
      const interval = setInterval(() => {
        const now = new Date();
        const diff = now - checkInTime;
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setWorkDuration(
          `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        );
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isCheckedIn, checkInTime]);

  const handleCheckIn = () => {
    // Capture device information
    const userAgent = navigator.userAgent;
    let browser = 'Unknown';
    let os = 'Unknown';

    // Detect browser
    if (userAgent.indexOf('Chrome') > -1) browser = 'Chrome';
    else if (userAgent.indexOf('Safari') > -1) browser = 'Safari';
    else if (userAgent.indexOf('Firefox') > -1) browser = 'Firefox';
    else if (userAgent.indexOf('Edge') > -1) browser = 'Edge';

    // Detect OS
    if (userAgent.indexOf('Windows') > -1) os = 'Windows';
    else if (userAgent.indexOf('Mac') > -1) os = 'macOS';
    else if (userAgent.indexOf('Linux') > -1) os = 'Linux';
    else if (userAgent.indexOf('Android') > -1) os = 'Android';
    else if (userAgent.indexOf('iOS') > -1) os = 'iOS';

    setDeviceInfo({
      browser,
      os,
      userAgent,
      timestamp: new Date().toISOString()
    });

    // Validasi lokasi GPS dengan fallback untuk demo
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setShowCheckInModal(true);
        },
        (error) => {
          // Fallback: gunakan mock location untuk demo
          console.log('GPS error, using mock location for demo:', error);
          setLocation({
            latitude: -6.2088,
            longitude: 106.8456
          });
          setShowCheckInModal(true);
        },
        {
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      // Fallback: gunakan mock location untuk demo
      setLocation({
        latitude: -6.2088,
        longitude: 106.8456
      });
      setShowCheckInModal(true);
    }
  };

  const confirmCheckIn = () => {
    const checkInData = {
      timestamp: new Date().toISOString(),
      location: location,
      deviceInfo: deviceInfo,
      userId: user.id,
      userName: user.name
    };

    // In real implementation, this would be sent to the backend
    console.log('Check-in data:', checkInData);

    setIsCheckedIn(true);
    setCheckInTime(new Date());
    setCurrentStatus('Siap Bertugas');
    setShowCheckInModal(false);
    alert('Check-in berhasil! Anda siap menerima tugas.');
  };

  const handleCheckOut = () => {
    if (stats.sedangDikerjakan > 0) {
      alert('Tidak dapat check-out. Masih ada tugas yang sedang dikerjakan.');
      return;
    }

    if (confirm('Apakah Anda yakin ingin check-out?')) {
      // Capture check-out location dengan fallback
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const checkOutData = {
              timestamp: new Date().toISOString(),
              checkInTime: checkInTime?.toISOString(),
              duration: workDuration,
              location: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              },
              deviceInfo: deviceInfo,
              userId: user.id,
              userName: user.name
            };

            // In real implementation, this would be sent to the backend
            console.log('Check-out data:', checkOutData);

            setIsCheckedIn(false);
            setCheckInTime(null);
            setCurrentStatus('Selesai Shift');
            setWorkDuration('00:00:00');
            alert('Check-out berhasil. Terima kasih atas kerja keras Anda hari ini!');
          },
          (error) => {
            // Fallback: use mock location for demo
            console.log('GPS error on checkout, using mock location:', error);
            const checkOutData = {
              timestamp: new Date().toISOString(),
              checkInTime: checkInTime?.toISOString(),
              duration: workDuration,
              location: {
                latitude: -6.2090,
                longitude: 106.8460
              },
              deviceInfo: deviceInfo,
              userId: user.id,
              userName: user.name
            };
            console.log('Check-out data (mock location):', checkOutData);

            setIsCheckedIn(false);
            setCheckInTime(null);
            setCurrentStatus('Selesai Shift');
            setWorkDuration('00:00:00');
            alert('Check-out berhasil. Terima kasih atas kerja keras Anda hari ini!');
          },
          {
            timeout: 5000,
            maximumAge: 0
          }
        );
      } else {
        // Fallback: use mock location for demo
        const checkOutData = {
          timestamp: new Date().toISOString(),
          checkInTime: checkInTime?.toISOString(),
          duration: workDuration,
          location: {
            latitude: -6.2090,
            longitude: 106.8460
          },
          deviceInfo: deviceInfo,
          userId: user.id,
          userName: user.name
        };
        console.log('Check-out data (no GPS):', checkOutData);

        setIsCheckedIn(false);
        setCheckInTime(null);
        setCurrentStatus('Selesai Shift');
        setWorkDuration('00:00:00');
        alert('Check-out berhasil. Terima kasih atas kerja keras Anda hari ini!');
      }
    }
  };

  const changeStatus = (status) => {
    setCurrentStatus(status);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Siap Bertugas':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Sedang Bertugas':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Istirahat':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Selesai Shift':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">AduAja</h1>
                <p className="text-xs text-gray-500">Portal Petugas</p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.dinas}</p>
              </div>
              <button
                onClick={onLogout}
                className="text-gray-600 hover:text-gray-900"
                title="Logout"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Status dan Absensi Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Status Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Status Ketersediaan</h3>
            <div className={`px-4 py-2 rounded-lg border-2 text-center font-semibold mb-4 ${getStatusColor(currentStatus)}`}>
              {currentStatus}
            </div>

            {isCheckedIn && currentStatus !== 'Sedang Bertugas' && (
              <div className="space-y-2">
                <button
                  onClick={() => changeStatus('Siap Bertugas')}
                  className="w-full px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                >
                  Siap Bertugas
                </button>
                <button
                  onClick={() => changeStatus('Istirahat')}
                  className="w-full px-3 py-2 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700"
                >
                  Istirahat
                </button>
              </div>
            )}
          </div>

          {/* Absensi Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Absensi Hari Ini</h3>

            {!isCheckedIn ? (
              <button
                onClick={handleCheckIn}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Check-In
              </button>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Check-in:</span>
                  <span className="text-sm font-semibold">{checkInTime.toLocaleTimeString('id-ID')}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">Durasi:</span>
                  <span className="text-sm font-semibold">{workDuration}</span>
                </div>
                <button
                  onClick={handleCheckOut}
                  className="w-full px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Check-Out
                </button>
              </div>
            )}
          </div>

          {/* Performa Hari Ini */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Performa Hari Ini</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Selesai:</span>
                <span className="text-lg font-bold text-green-600">{stats.selesaiHariIni}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sedang Dikerjakan:</span>
                <span className="text-lg font-bold text-blue-600">{stats.sedangDikerjakan}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tertunda:</span>
                <span className="text-lg font-bold text-yellow-600">{stats.tertunda}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.tugasBaru}</p>
                <p className="text-sm text-gray-600">Tugas Baru</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.sedangDikerjakan}</p>
                <p className="text-sm text-gray-600">Dikerjakan</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-yellow-600">{stats.tertunda}</p>
                <p className="text-sm text-gray-600">Tertunda</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-600">{stats.selesaiHariIni}</p>
                <p className="text-sm text-gray-600">Selesai Hari Ini</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Menu Utama</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => onNavigate('tasks')}
              disabled={!isCheckedIn}
              className="flex items-center p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">Daftar Tugas</h4>
                <p className="text-sm text-gray-600">Lihat dan kelola tugas</p>
              </div>
            </button>

            <button
              onClick={() => onNavigate('history')}
              className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">Riwayat</h4>
                <p className="text-sm text-gray-600">Lihat riwayat tugas</p>
              </div>
            </button>

            <button
              onClick={() => onNavigate('reports')}
              className="flex items-center p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition-colors"
            >
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">Laporan</h4>
                <p className="text-sm text-gray-600">Statistik performa</p>
              </div>
            </button>

            <button
              onClick={() => onNavigate('attendance-history')}
              className="flex items-center p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
            >
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">Riwayat Absensi</h4>
                <p className="text-sm text-gray-600">Lihat riwayat check-in/out</p>
              </div>
            </button>
          </div>
        </div>

        {/* Info Penting */}
        {!isCheckedIn && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <span className="font-semibold">Perhatian!</span> Anda belum check-in. Silakan check-in terlebih dahulu untuk dapat menerima dan mengerjakan tugas.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Check-In Confirmation Modal */}
      {showCheckInModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Konfirmasi Check-In</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Waktu:</span>
                <span className="text-sm font-semibold">{new Date().toLocaleString('id-ID')}</span>
              </div>
              {location && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Lokasi:</span>
                  <span className="text-sm font-semibold">
                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className="text-sm font-semibold text-green-600">Dalam Wilayah Kerja</span>
              </div>
              {deviceInfo && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Browser:</span>
                    <span className="text-sm font-semibold">{deviceInfo.browser}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Sistem Operasi:</span>
                    <span className="text-sm font-semibold">{deviceInfo.os}</span>
                  </div>
                </>
              )}
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-blue-800">
                <strong>Informasi:</strong> Data lokasi dan perangkat akan tersimpan untuk keperluan administrasi dan keamanan.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCheckInModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={confirmCheckIn}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Konfirmasi Check-In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
