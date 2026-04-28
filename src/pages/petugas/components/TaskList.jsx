import { useState, useEffect } from 'react';

export default function TaskList({ user, onNavigate, onSelectTask }) {
  const [activeTab, setActiveTab] = useState('new');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('sla');
  const [userLocation, setUserLocation] = useState(null);

  // Mock data - dalam implementasi nyata akan dari API
  const mockTasks = [
    {
      id: 'TGS001',
      title: 'Perbaikan Jalan Berlubang',
      category: 'Jalan',
      priority: 'critical',
      status: 'new',
      slaDeadline: '2026-04-28T15:00:00',
      location: {
        address: 'Jl. Merdeka No. 45, Kec. Semarang Tengah',
        latitude: -6.9667,
        longitude: 110.4167,
        distance: 0.8
      },
      reportDate: '2026-04-27T08:30:00',
      reporterName: 'Budi Santoso',
      description: 'Lubang besar di tengah jalan, berbahaya untuk kendaraan'
    },
    {
      id: 'TGS002',
      title: 'Lampu Jalan Mati',
      category: 'Penerangan',
      priority: 'high',
      status: 'new',
      slaDeadline: '2026-04-29T12:00:00',
      location: {
        address: 'Jl. Pemuda No. 120, Kec. Semarang Selatan',
        latitude: -6.9833,
        longitude: 110.4083,
        distance: 2.3
      },
      reportDate: '2026-04-27T14:20:00',
      reporterName: 'Siti Aminah',
      description: 'Lampu jalan sudah mati sejak 3 hari yang lalu'
    },
    {
      id: 'TGS003',
      title: 'Gorong-gorong Tersumbat',
      category: 'Drainase',
      priority: 'medium',
      status: 'new',
      slaDeadline: '2026-05-01T10:00:00',
      location: {
        address: 'Jl. Pandanaran No. 78, Kec. Semarang Barat',
        latitude: -6.9750,
        longitude: 110.4000,
        distance: 3.5
      },
      reportDate: '2026-04-26T16:45:00',
      reporterName: 'Ahmad Fauzi',
      description: 'Air menggenang karena gorong-gorong tersumbat sampah'
    },
    {
      id: 'TGS004',
      title: 'Trotoar Rusak',
      category: 'Trotoar',
      priority: 'critical',
      status: 'in_progress',
      slaDeadline: '2026-04-28T16:00:00',
      location: {
        address: 'Jl. Gajah Mada No. 32, Kec. Semarang Utara',
        latitude: -6.9500,
        longitude: 110.4250,
        distance: 1.2
      },
      reportDate: '2026-04-26T09:15:00',
      reporterName: 'Dewi Lestari',
      description: 'Trotoar retak dan berlubang, berbahaya untuk pejalan kaki',
      startedAt: '2026-04-28T08:30:00'
    },
    {
      id: 'TGS005',
      title: 'Taman Kumuh',
      category: 'Taman',
      priority: 'high',
      status: 'in_progress',
      slaDeadline: '2026-04-29T14:00:00',
      location: {
        address: 'Taman KB, Jl. KB No. 5, Kec. Semarang Tengah',
        latitude: -6.9700,
        longitude: 110.4100,
        distance: 1.8
      },
      reportDate: '2026-04-27T11:00:00',
      reporterName: 'Rini Wahyuni',
      description: 'Taman tidak terawat, banyak sampah dan rumput liar',
      startedAt: '2026-04-28T07:00:00'
    },
    {
      id: 'TGS006',
      title: 'Papan Reklame Miring',
      category: 'Lainnya',
      priority: 'medium',
      status: 'pending',
      slaDeadline: '2026-04-30T10:00:00',
      location: {
        address: 'Jl. Ahmad Yani No. 150, Kec. Semarang Timur',
        latitude: -6.9900,
        longitude: 110.4300,
        distance: 4.1
      },
      reportDate: '2026-04-25T13:30:00',
      reporterName: 'Eko Prasetyo',
      description: 'Papan reklame miring, perlu koordinasi dengan pemilik',
      pendingReason: 'Menunggu izin dari pemilik reklame',
      pendingSince: '2026-04-27T10:00:00'
    }
  ];

  // Filter tasks berdasarkan tab aktif
  const getFilteredTasks = () => {
    let filtered = mockTasks.filter(task => {
      // Filter by tab
      if (activeTab === 'new' && task.status !== 'new') return false;
      if (activeTab === 'in_progress' && task.status !== 'in_progress') return false;
      if (activeTab === 'pending' && task.status !== 'pending') return false;

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          task.id.toLowerCase().includes(query) ||
          task.title.toLowerCase().includes(query) ||
          task.location.address.toLowerCase().includes(query) ||
          task.reporterName.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Filter by category
      if (filterCategory !== 'all' && task.category !== filterCategory) return false;

      return true;
    });

    // Sort tasks
    if (sortBy === 'sla') {
      filtered.sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    } else if (sortBy === 'distance' && userLocation) {
      filtered.sort((a, b) => a.location.distance - b.location.distance);
    } else if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(a.reportDate) - new Date(b.reportDate));
    }

    return filtered;
  };

  const tasks = getFilteredTasks();

  // Get user location for distance calculation
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        () => {
          console.log('Could not get location');
        }
      );
    }
  }, []);

  const getPriorityBadge = (priority) => {
    const badges = {
      critical: { text: 'Kritis', color: 'bg-red-100 text-red-800 border-red-200' },
      high: { text: 'Tinggi', color: 'bg-orange-100 text-orange-800 border-orange-200' },
      medium: { text: 'Sedang', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      low: { text: 'Rendah', color: 'bg-green-100 text-green-800 border-green-200' }
    };
    return badges[priority] || badges.low;
  };

  const getSLAStatus = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const hoursLeft = (deadlineDate - now) / (1000 * 60 * 60);

    if (hoursLeft < 0) {
      return { text: 'Terlambat', color: 'text-red-600' };
    } else if (hoursLeft < 4) {
      return { text: `${Math.floor(hoursLeft)}j lagi`, color: 'text-red-600' };
    } else if (hoursLeft < 24) {
      return { text: `${Math.floor(hoursLeft)}j lagi`, color: 'text-orange-600' };
    } else {
      const daysLeft = Math.floor(hoursLeft / 24);
      return { text: `${daysLeft} hari`, color: 'text-gray-600' };
    }
  };

  const getTabCount = (status) => {
    return mockTasks.filter(task => task.status === status).length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('dashboard')}
              className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold">Daftar Tugas</h1>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari tugas, lokasi, atau pelapor..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <svg className="w-5 h-5 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Filter & Sort */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex gap-2 overflow-x-auto">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua Kategori</option>
            <option value="Jalan">Jalan</option>
            <option value="Penerangan">Penerangan</option>
            <option value="Drainase">Drainase</option>
            <option value="Trotoar">Trotoar</option>
            <option value="Taman">Taman</option>
            <option value="Lainnya">Lainnya</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="sla">Prioritas SLA</option>
            <option value="distance">Jarak Terdekat</option>
            <option value="date">Tanggal Laporan</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('new')}
            className={`flex-1 py-3 px-4 font-medium text-sm relative ${
              activeTab === 'new'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600'
            }`}
          >
            Tugas Baru
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              activeTab === 'new' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
            }`}>
              {getTabCount('new')}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('in_progress')}
            className={`flex-1 py-3 px-4 font-medium text-sm relative ${
              activeTab === 'in_progress'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600'
            }`}
          >
            Sedang Dikerjakan
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              activeTab === 'in_progress' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
            }`}>
              {getTabCount('in_progress')}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-3 px-4 font-medium text-sm relative ${
              activeTab === 'pending'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600'
            }`}
          >
            Tertunda
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              activeTab === 'pending' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
            }`}>
              {getTabCount('pending')}
            </span>
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="p-4 space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500">Tidak ada tugas ditemukan</p>
          </div>
        ) : (
          tasks.map((task) => {
            const priorityBadge = getPriorityBadge(task.priority);
            const slaStatus = getSLAStatus(task.slaDeadline);

            return (
              <div
                key={task.id}
                onClick={() => onSelectTask(task)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-500">{task.id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${priorityBadge.color}`}>
                        {priorityBadge.text}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-1">{task.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 mt-3">
                  {/* Location */}
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">{task.location.address}</p>
                      <p className="text-xs text-blue-600 font-medium mt-0.5">
                        📍 {task.location.distance} km dari lokasi Anda
                      </p>
                    </div>
                  </div>

                  {/* Reporter & Date */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{task.reporterName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{new Date(task.reportDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  {/* SLA & Status */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500">Deadline SLA:</span>
                      <span className={`text-xs font-semibold ${slaStatus.color}`}>
                        {slaStatus.text}
                      </span>
                    </div>
                    <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded">
                      {task.category}
                    </span>
                  </div>

                  {/* Pending Info */}
                  {task.status === 'pending' && task.pendingReason && (
                    <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded p-2 mt-2">
                      <svg className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-xs text-yellow-800">{task.pendingReason}</p>
                    </div>
                  )}

                  {/* In Progress Info */}
                  {task.status === 'in_progress' && task.startedAt && (
                    <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded p-2 mt-2">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <p className="text-xs text-blue-800">
                        Dimulai: {new Date(task.startedAt).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
