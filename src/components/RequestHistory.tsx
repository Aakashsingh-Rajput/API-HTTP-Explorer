
import { Clock, X, Trash2 } from 'lucide-react';
import { HistoryItem } from '../pages/Index';

interface RequestHistoryProps {
  history: HistoryItem[];
  onLoadRequest: (item: HistoryItem) => void;
  onClose: () => void;
}

const RequestHistory = ({ history, onLoadRequest, onClose }: RequestHistoryProps) => {
  const getStatusColor = (status?: number) => {
    if (!status) return 'text-gray-400';
    if (status >= 200 && status < 300) return 'text-green-400';
    if (status >= 300 && status < 400) return 'text-yellow-400';
    if (status >= 400) return 'text-red-400';
    return 'text-gray-400';
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-600';
      case 'POST': return 'bg-blue-600';
      case 'PUT': return 'bg-yellow-600';
      case 'DELETE': return 'bg-red-600';
      case 'PATCH': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-gray-400" />
          <h3 className="font-semibold">Request History</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-700 rounded transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {history.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No requests yet</p>
            <p className="text-sm mt-1">Your request history will appear here</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => onLoadRequest(item)}
                className="w-full text-left p-3 hover:bg-gray-700 rounded-lg transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getMethodColor(item.method)} text-white`}>
                      {item.method}
                    </span>
                    {item.response && (
                      <span className={`text-sm font-medium ${getStatusColor(item.response.status)}`}>
                        {item.response.status}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatTime(item.timestamp)}
                  </span>
                </div>
                
                <div className="text-sm text-gray-300 truncate mb-1">
                  {item.url}
                </div>
                
                {item.response && (
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <span>{item.response.time}ms</span>
                    {item.response.error && (
                      <span className="text-red-400">Error</span>
                    )}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="p-4 border-t border-gray-700">
          <p className="text-xs text-gray-500 text-center">
            Showing last {history.length} request{history.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default RequestHistory;
