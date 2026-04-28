import { useState } from 'react';

export default function Reports({ user, onNavigate }) {
  const [selectedPeriod, setSelectedPeriod] = useState('month'); // week, month, year

  // Mock data - dalam implementasi nyata akan dari API
  const statsData = {
    week: {
      totalTasks: 12,
      completedTasks: 10,
      pendingTasks: 2,
      avgDuration: '2j 15m',
      totalHours: 28,
      categories: [
        { name: 'Jalan', count: 4, percentage: 33 },
        { name: 'Penerangan', count: 3, percentage: 25 },
        { name: 'Drainase', count: 2, percentage: 17 },
        { name: 'Trotoar', count: 2, percentage: 17 },
        { name: 'Taman', count: 1, percentage: 8 }
      ],
      dailyProgress: [
        { day: 'Sen', completed: 2 },
        { day: 'Sel', completed: 1 },
        { day: 'Rab', completed: 3 },
        { day: 'Kam', completed: 2 },
        { day: 'Jum', completed: 2 },
        { day: 'Sab', completed: 0 },
        { day: 'Min', completed: 0 }
      ]
    },
    month: {
      totalTasks: 45,
      completedTasks: 42,
      pendingTasks: 3,
      avgDuration: '2j 30m',
      totalHours: 110,
      categories: [
        { name: 'Jalan', count: 15, percentage: 33 },
        { name: 'Penerangan', count: 12, percentage: 27 },
        { name: 'Drainase', count: 8, percentage: 18 },
        { name: 'Trotoar', count: 6, percentage: 13 },
        { name: 'Taman', count: 4, percentage: 9 }
      ],
      weeklyProgress: [
        { week: 'Mg 1', completed: 12 },
        { week: 'Mg 2', completed: 10 },
        { week: 'Mg 3', completed: 11 },
        { week: 'Mg 4', completed: 9 }
      ]
    },
    year: {
      totalTasks: 520,
      completedTasks: 495,
      pendingTasks: 25,
      avgDuration: '2j 20m',
      totalHours: 1250,
      categories: [
        { name: 'Jalan', count: 180, percentage: 35 },
        { name: 'Penerangan', count: 140, percentage: 27 },
        { name: 'Drainase', count: 90, percentage: 17 },
        { name: 'Trotoar', count: 70, percentage: 13 },
        { name: 'Taman', count: 40, percentage: 8 }
      ],
      monthlyProgress: [
        { month: 'Jan', completed: 42 },
        { month: 'Feb', completed: 38 },
        { month: 'Mar', completed: 45 },
        { month: 'Apr', completed: 41 }
      ]
    }
  };

  const currentStats = statsData[selectedPeriod];
  const completionRate = ((currentStats.completedTasks / currentStats.totalTasks) * 100).toFixed(1);

  const getCategoryColor = (index) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-orange-500',
      'bg-purple-500'
    ];
    return colors[index % colors.length];
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
            <div>
              <h1 className="text-xl font-semibold">Laporan Performa</h1>
              <p className="text-sm text-blue-100">{user.name}</p>
            </div>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
              selectedPeriod === 'week'
                ? 'bg-white text-blue-600'
                : 'bg-blue-700 text-white hover:bg-blue-800'
            }`}
          >
            7 Hari
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
              selectedPeriod === 'month'
                ? 'bg-white text-blue-600'
                : 'bg-blue-700 text-white hover:bg-blue-800'
            }`}
          >
            30 Hari
          </button>
          <button
            onClick={() => setSelectedPeriod('year')}
            className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
              selectedPeriod === 'year'
                ? 'bg-white text-blue-600'
                : 'bg-blue-700 text-white hover:bg-blue-800'
            }`}
          >
            1 Tahun
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Tugas</p>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{currentStats.totalTasks}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Selesai</p>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{currentStats.completedTasks}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Jam</p>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{currentStats.totalHours}j</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Rata-rata</p>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <p className="text-lg font-bold text-gray-800">{currentStats.avgDuration}</p>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Tingkat Penyelesaian</h3>
            <span className="text-2xl font-bold text-green-600">{completionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {currentStats.completedTasks} dari {currentStats.totalTasks} tugas selesai
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-800 mb-4">Kategori Pekerjaan</h3>
          <div className="space-y-3">
            {currentStats.categories.map((category, index) => (
              <div key={category.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                  <span className="text-sm text-gray-600">{category.count} tugas ({category.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${getCategoryColor(index)} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-800 mb-4">
            {selectedPeriod === 'week' && 'Progress Harian'}
            {selectedPeriod === 'month' && 'Progress Mingguan'}
            {selectedPeriod === 'year' && 'Progress Bulanan'}
          </h3>
          <div className="flex items-end justify-between gap-2 h-48">
            {selectedPeriod === 'week' && currentStats.dailyProgress.map((day) => (
              <div key={day.day} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gray-200 rounded-t-lg relative" style={{ height: '100%' }}>
                  <div
                    className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-500"
                    style={{ height: `${(day.completed / 4) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-gray-600 mt-2">{day.day}</span>
                <span className="text-xs text-gray-500">{day.completed}</span>
              </div>
            ))}
            {selectedPeriod === 'month' && currentStats.weeklyProgress.map((week) => (
              <div key={week.week} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gray-200 rounded-t-lg relative" style={{ height: '100%' }}>
                  <div
                    className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-500"
                    style={{ height: `${(week.completed / 15) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-gray-600 mt-2">{week.week}</span>
                <span className="text-xs text-gray-500">{week.completed}</span>
              </div>
            ))}
            {selectedPeriod === 'year' && currentStats.monthlyProgress.map((month) => (
              <div key={month.month} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gray-200 rounded-t-lg relative" style={{ height: '100%' }}>
                  <div
                    className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-500"
                    style={{ height: `${(month.completed / 50) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-gray-600 mt-2">{month.month}</span>
                <span className="text-xs text-gray-500">{month.completed}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-md p-4 text-white">
          <h3 className="font-semibold mb-3">Ringkasan Performa</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-blue-100">Tingkat penyelesaian:</span>
              <span className="font-semibold">{completionRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-100">Total jam kerja:</span>
              <span className="font-semibold">{currentStats.totalHours} jam</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-100">Durasi rata-rata:</span>
              <span className="font-semibold">{currentStats.avgDuration}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-100">Tugas tertunda:</span>
              <span className="font-semibold">{currentStats.pendingTasks} tugas</span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Informasi Laporan</p>
              <p>Data laporan ini diperbarui secara real-time berdasarkan tugas yang telah Anda selesaikan.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
