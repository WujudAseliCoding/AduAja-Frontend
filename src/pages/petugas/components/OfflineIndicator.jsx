import { useState, useEffect } from 'react';
import { WifiOff, Wifi, AlertCircle, CheckCircle, X } from 'lucide-react';

export default function OfflineIndicator({ onRetrySync }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showDetails, setShowDetails] = useState(false);
  const [queuedActions, setQueuedActions] = useState([
    {
      id: '1',
      type: 'check-in',
      description: 'Check-in pukul 08:00',
      timestamp: new Date().toISOString(),
      status: 'pending'
    }
  ]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Attempt to sync queued actions
      syncQueuedActions();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncQueuedActions = async () => {
    // Simulate syncing process
    for (let i = 0; i < queuedActions.length; i++) {
      if (queuedActions[i].status === 'pending') {
        setQueuedActions(prev =>
          prev.map((action, index) =>
            index === i ? { ...action, status: 'syncing' } : action
          )
        );

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        setQueuedActions(prev =>
          prev.map((action, index) =>
            index === i ? { ...action, status: 'synced' } : action
          )
        );
      }
    }
  };

  const handleRetry = () => {
    if (isOnline) {
      syncQueuedActions();
    }
    if (onRetrySync) {
      onRetrySync();
    }
  };

  const pendingCount = queuedActions.filter(a => a.status === 'pending' || a.status === 'syncing').length;

  if (isOnline && pendingCount === 0) {
    return null; // Hide when online and no pending actions
  }

  return (
    <>
      {/* Compact Indicator */}
      <div
        onClick={() => setShowDetails(true)}
        className={`fixed top-4 right-4 z-40 px-3 py-2 rounded-lg shadow-lg cursor-pointer transition-all ${
          isOnline
            ? 'bg-green-600 text-white'
            : 'bg-red-600 text-white animate-pulse'
        }`}
      >
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="w-4 h-4" />
          ) : (
            <WifiOff className="w-4 h-4" />
          )}
          <div className="text-sm font-medium">
            {isOnline ? (
              pendingCount > 0 ? `Menyinkronkan (${pendingCount})` : 'Online'
            ) : (
              'Mode Offline'
            )}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <Wifi className="w-5 h-5 text-green-600" />
                ) : (
                  <WifiOff className="w-5 h-5 text-red-600" />
                )}
                <h2 className="font-semibold text-lg">
                  Status Koneksi
                </h2>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Connection Status */}
              <div className={`rounded-lg p-4 mb-4 ${
                isOnline ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-start gap-2">
                  {isOnline ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <div className={`font-medium text-sm ${
                      isOnline ? 'text-green-900' : 'text-red-900'
                    }`}>
                      {isOnline ? 'Terhubung ke Internet' : 'Tidak Ada Koneksi Internet'}
                    </div>
                    <div className={`text-xs mt-1 ${
                      isOnline ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {isOnline
                        ? 'Semua fitur dapat digunakan dengan normal'
                        : 'Data akan disimpan secara lokal dan dikirim otomatis ketika koneksi kembali'
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* Queued Actions */}
              {queuedActions.length > 0 && (
                <div>
                  <h3 className="font-medium text-sm text-gray-700 mb-2">
                    Antrian Sinkronisasi ({queuedActions.length})
                  </h3>
                  <div className="space-y-2">
                    {queuedActions.map((action) => (
                      <div
                        key={action.id}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-3"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-800">
                              {action.description}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(action.timestamp).toLocaleString('id-ID')}
                            </div>
                          </div>
                          <div>
                            {action.status === 'pending' && (
                              <div className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                                Menunggu
                              </div>
                            )}
                            {action.status === 'syncing' && (
                              <div className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                Mengirim...
                              </div>
                            )}
                            {action.status === 'synced' && (
                              <div className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Selesai
                              </div>
                            )}
                            {action.status === 'error' && (
                              <div className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">
                                Gagal
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Offline Mode Info */}
              {!isOnline && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-blue-800">
                      <strong>Mode Offline Aktif:</strong>
                      <ul className="mt-2 space-y-1 list-disc list-inside">
                        <li>GPS akan menggunakan lokasi terakhir yang tersimpan</li>
                        <li>Foto akan disimpan lokal terlebih dahulu</li>
                        <li>Data akan otomatis tersinkronisasi saat koneksi kembali</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              {isOnline && pendingCount > 0 && (
                <button
                  onClick={handleRetry}
                  className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sinkronkan Sekarang
                </button>
              )}

              <button
                onClick={() => setShowDetails(false)}
                className="w-full mt-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
