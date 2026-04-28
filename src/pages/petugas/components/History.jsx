import { useState } from 'react';

export default function History({ user, onNavigate, onViewDetail }) {
  const [filterPeriod, setFilterPeriod] = useState('today'); // today, week, month, all
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - dalam implementasi nyata akan dari API
  const mockCompletedTasks = [
    {
      id: 'TGS010',
      title: 'Perbaikan Trotoar Rusak',
      category: 'Trotoar',
      completedAt: '2026-04-28T14:30:00',
      duration: '02:15:30',
      location: 'Jl. Pemuda No. 45',
      photoBefore: 3,
      photoAfter: 3,
      materialUsed: 2,
      status: 'approved'
    },
    {
      id: 'TGS009',
      title: 'Lampu Jalan Mati',
      category: 'Penerangan',
      completedAt: '2026-04-28T10:20:00',
      duration: '01:45:00',
      location: 'Jl. Gajah Mada No. 12',
      photoBefore: 2,
      photoAfter: 2,
      materialUsed: 1,
      status: 'approved'
    },
    {
      id: 'TGS008',
      title: 'Gorong-gorong Tersumbat',
      category: 'Drainase',
      completedAt: '2026-04-27T16:45:00',
      duration: '03:20:15',
      location: 'Jl. Pandanaran No. 78',
      rating: 4,
      photoBefore: 4,
      photoAfter: 4,
      materialUsed: 0,
      status: 'approved'
    },
    {
      id: 'TGS007',
      title: 'Taman Kumuh',
      category: 'Taman',
      completedAt: '2026-04-26T15:10:00',
      duration: '04:30:00',
      location: 'Taman Kota KB',
      photoBefore: 5,
      photoAfter: 5,
      materialUsed: 3,
      status: 'approved'
    },
    {
      id: 'TGS006',
      title: 'Perbaikan Jalan Berlubang',
      category: 'Jalan',
      completedAt: '2026-04-25T13:20:00',
      duration: '05:15:45',
      location: 'Jl. Ahmad Yani No. 150',
      photoBefore: 4,
      photoAfter: 4,
      materialUsed: 4,
      status: 'approved'
    },
    {
      id: 'TGS005',
      title: 'Rambu Lalu Lintas Rusak',
      category: 'Lainnya',
      completedAt: '2026-04-24T11:30:00',
      duration: '01:20:00',
      location: 'Jl. Sriwijaya No. 22',
      photoBefore: 2,
      photoAfter: 2,
      materialUsed: 1,
      status: 'approved'
    }
  ];

  const getFilteredTasks = () => {
    const now = new Date();
    let filtered = mockCompletedTasks;

    // Filter by period
    if (filterPeriod === 'today') {
      filtered = filtered.filter(task => {
        const taskDate = new Date(task.completedAt);
        return taskDate.toDateString() === now.toDateString();
      });
    } else if (filterPeriod === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(task => {
        const taskDate = new Date(task.completedAt);
        return taskDate >= weekAgo;
      });
    } else if (filterPeriod === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(task => {
        const taskDate = new Date(task.completedAt);
        return taskDate >= monthAgo;
      });
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.id.toLowerCase().includes(query) ||
        task.title.toLowerCase().includes(query) ||
        task.location.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const tasks = getFilteredTasks();

  // Calculate statistics
  const calculateStats = () => {
    const totalTasks = tasks.length;
    const totalDuration = tasks.reduce((acc, task) => {
      const [hours, minutes, seconds] = task.duration.split(':').map(Number);
      return acc + (hours * 3600) + (minutes * 60) + seconds;
    }, 0);
    const avgDuration = totalTasks > 0 ? totalDuration / totalTasks : 0;

    const hours = Math.floor(avgDuration / 3600);
    const minutes = Math.floor((avgDuration % 3600) / 60);

    return {
      totalTasks,
      avgDuration: `${hours}j ${minutes}m`,
      totalHours: Math.floor(totalDuration / 3600)
    };
  };

  const stats = calculateStats();

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
            <h1 className="text-xl font-semibold">Riwayat Pekerjaan</h1>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari tugas, lokasi..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <svg className="w-5 h-5 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Period Filter */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setFilterPeriod('today')}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
              filterPeriod === 'today'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Hari Ini
          </button>
          <button
            onClick={() => setFilterPeriod('week')}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
              filterPeriod === 'week'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            7 Hari
          </button>
          <button
            onClick={() => setFilterPeriod('month')}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
              filterPeriod === 'month'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            30 Hari
          </button>
          <button
            onClick={() => setFilterPeriod('all')}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
              filterPeriod === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Semua
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <h2 className="text-white font-semibold mb-3">Performa Periode Ini</h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <p className="text-blue-100 text-sm mb-1">Total Tugas</p>
            <p className="text-2xl font-bold text-white">{stats.totalTasks}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <p className="text-blue-100 text-sm mb-1">Rata-rata Durasi</p>
            <p className="text-2xl font-bold text-white">{stats.avgDuration}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <p className="text-blue-100 text-sm mb-1">Total Jam Kerja</p>
            <p className="text-2xl font-bold text-white">{stats.totalHours}j</p>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="p-4 space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500">Tidak ada riwayat ditemukan</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onViewDetail && onViewDetail(task)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-500">{task.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      task.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {task.status === 'approved' ? 'Disetujui' : 'Menunggu Review'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">{task.title}</h3>
                </div>
                <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded">
                  {task.category}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-2">
                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{task.location}</span>
                </div>

                {/* Completion Info */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Durasi: {task.duration}</span>
                  </div>
                  <div className="text-gray-500">
                    {new Date(task.completedAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>

                {/* Documentation */}
                <div className="flex items-center gap-4 pt-2 border-t border-gray-100 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{task.photoBefore + task.photoAfter} foto</span>
                  </div>
                  {task.materialUsed > 0 && (
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <span>{task.materialUsed} material</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 ml-auto">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-green-600 font-medium">Selesai</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
