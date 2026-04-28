import { ArrowLeft, MapPin, Clock, Smartphone } from 'lucide-react';

export default function AttendanceHistory({ user, onNavigate }) {
  // Mock data - in real app, this would come from backend
  const attendanceRecords = [
    {
      id: '1',
      date: '2026-04-28',
      checkInTime: '08:00:15',
      checkOutTime: '16:30:45',
      checkInLocation: {
        latitude: -6.2088,
        longitude: 106.8456,
        address: 'Jl. Sudirman No. 123, Jakarta Pusat'
      },
      checkOutLocation: {
        latitude: -6.2090,
        longitude: 106.8460,
        address: 'Jl. Sudirman No. 125, Jakarta Pusat'
      },
      duration: '08:30:30',
      status: 'completed',
      deviceInfo: {
        browser: 'Chrome 122.0',
        os: 'Windows 11',
        ip: '192.168.1.100'
      }
    },
    {
      id: '2',
      date: '2026-04-27',
      checkInTime: '08:05:20',
      checkOutTime: '16:25:10',
      checkInLocation: {
        latitude: -6.2088,
        longitude: 106.8456,
        address: 'Jl. Sudirman No. 123, Jakarta Pusat'
      },
      checkOutLocation: {
        latitude: -6.2088,
        longitude: 106.8456,
        address: 'Jl. Sudirman No. 123, Jakarta Pusat'
      },
      duration: '08:19:50',
      status: 'completed',
      deviceInfo: {
        browser: 'Chrome 122.0',
        os: 'Windows 11',
        ip: '192.168.1.100'
      }
    },
    {
      id: '3',
      date: '2026-04-26',
      checkInTime: '08:10:00',
      checkOutTime: '16:40:00',
      checkInLocation: {
        latitude: -6.2088,
        longitude: 106.8456,
        address: 'Jl. Sudirman No. 123, Jakarta Pusat'
      },
      checkOutLocation: {
        latitude: -6.2089,
        longitude: 106.8457,
        address: 'Jl. Sudirman No. 123, Jakarta Pusat'
      },
      duration: '08:30:00',
      status: 'completed',
      deviceInfo: {
        browser: 'Chrome 122.0',
        os: 'Windows 11',
        ip: '192.168.1.100'
      }
    }
  ];

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="bg-[#3b82f6] text-white p-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-semibold">Riwayat Absensi</h1>
            <p className="text-sm text-white/80">{user.name}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
          <h2 className="font-semibold mb-2">Ringkasan Bulan Ini</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">22</div>
              <div className="text-xs text-gray-600">Hari Hadir</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">176</div>
              <div className="text-xs text-gray-600">Total Jam</div>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">2</div>
              <div className="text-xs text-gray-600">Terlambat</div>
            </div>
          </div>
        </div>

        {/* Records List */}
        <div className="space-y-3">
          {attendanceRecords.map((record) => (
            <div key={record.id} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-semibold text-gray-800">
                    {formatDate(record.date)}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                    record.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {record.status === 'completed' ? 'Selesai' : 'Sedang Berlangsung'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Durasi</div>
                  <div className="font-semibold text-gray-800">{record.duration}</div>
                </div>
              </div>

              <div className="space-y-2 border-t pt-3">
                {/* Check In */}
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-700">
                      Check-in: {record.checkInTime}
                    </div>
                    <div className="flex items-start gap-1 text-xs text-gray-500 mt-0.5">
                      <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span className="break-words">{record.checkInLocation.address}</span>
                    </div>
                  </div>
                </div>

                {/* Check Out */}
                {record.checkOutTime && record.checkOutLocation && (
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-700">
                        Check-out: {record.checkOutTime}
                      </div>
                      <div className="flex items-start gap-1 text-xs text-gray-500 mt-0.5">
                        <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <span className="break-words">{record.checkOutLocation.address}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Device Info */}
                <div className="flex items-start gap-2 pt-2 border-t">
                  <Smartphone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-gray-500">
                    <div>{record.deviceInfo.browser} • {record.deviceInfo.os}</div>
                    <div>IP: {record.deviceInfo.ip}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
