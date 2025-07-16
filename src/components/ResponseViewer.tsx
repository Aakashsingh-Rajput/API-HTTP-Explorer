
import { useState } from 'react';
import { Copy, Download, Code, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { ResponseData, RequestData } from '../pages/Index';
import CodeSnippetModal from './CodeSnippetModal';

interface ResponseViewerProps {
  response: ResponseData | null;
  loading: boolean;
  request: RequestData;
}

const ResponseViewer = ({ response, loading, request }: ResponseViewerProps) => {
  const [activeTab, setActiveTab] = useState<'body' | 'headers'>('body');
  const [showCodeModal, setShowCodeModal] = useState(false);

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-400';
    if (status >= 300 && status < 400) return 'text-yellow-400';
    if (status >= 400) return 'text-red-400';
    return 'text-gray-400';
  };

  const getStatusIcon = (status: number) => {
    if (status >= 200 && status < 300) return <CheckCircle className="h-4 w-4" />;
    if (status >= 300 && status < 400) return <AlertCircle className="h-4 w-4" />;
    if (status >= 400) return <XCircle className="h-4 w-4" />;
    return null;
  };

  const copyResponse = () => {
    if (response?.data) {
      navigator.clipboard.writeText(
        typeof response.data === 'string' 
          ? response.data 
          : JSON.stringify(response.data, null, 2)
      );
    }
  };

  const formatJson = (data: any) => {
    if (typeof data === 'string') return data;
    return JSON.stringify(data, null, 2);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 lg:p-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 lg:mb-6 space-y-3 sm:space-y-0">
        <h2 className="text-base lg:text-lg font-semibold flex items-center space-x-2">
          <div className="bg-blue-600 p-1 rounded">
            <Code className="h-3 w-3 lg:h-4 lg:w-4" />
          </div>
          <span>Response</span>
        </h2>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowCodeModal(true)}
            className="flex items-center space-x-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs lg:text-sm transition-colors"
          >
            <Code className="h-3 w-3 lg:h-4 lg:w-4" />
            <span className="hidden sm:inline">Generate Code</span>
            <span className="sm:hidden">Code</span>
          </button>
          
          {response && (
            <button
              onClick={copyResponse}
              className="flex items-center space-x-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs lg:text-sm transition-colors"
            >
              <Copy className="h-3 w-3 lg:h-4 lg:w-4" />
              <span className="hidden sm:inline">Copy</span>
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-6 w-6 lg:h-8 lg:w-8 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-gray-400 text-sm lg:text-base">Sending request...</p>
          </div>
        </div>
      )}

      {!loading && !response && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Code className="h-8 w-8 lg:h-12 lg:w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm lg:text-base">No response yet</p>
            <p className="text-xs lg:text-sm mt-1">Send a request to see the response here</p>
          </div>
        </div>
      )}

      {!loading && response && (
        <div className="flex-1 flex flex-col space-y-4">
          {/* Status Info */}
          <div className="bg-gray-700 rounded-lg p-3 lg:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-3 lg:space-x-4">
                <div className={`flex items-center space-x-2 ${getStatusColor(response.status)}`}>
                  {getStatusIcon(response.status)}
                  <span className="font-semibold text-sm lg:text-base">
                    {response.status} {response.statusText}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1 text-gray-400">
                  <Clock className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="text-xs lg:text-sm">{response.time}ms</span>
                </div>
              </div>
            </div>
            
            {response.error && (
              <div className="mt-3 p-3 bg-red-900/20 border border-red-500/20 rounded text-red-300 text-xs lg:text-sm">
                <strong>Error:</strong> {response.error}
              </div>
            )}
          </div>

          {/* Tabs - Scrollable on mobile */}
          <div className="border-b border-gray-600 -mx-4 px-4 lg:mx-0 lg:px-0">
            <nav className="flex space-x-6 lg:space-x-8 overflow-x-auto scrollbar-hide">
              {[
                { key: 'body', label: 'Response Body' },
                { key: 'headers', label: 'Headers', count: Object.keys(response.headers).length }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[1.25rem] h-5 flex items-center justify-center">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'body' && (
              <div className="h-full overflow-y-auto">
                <pre className="bg-gray-900 rounded p-3 lg:p-4 text-xs lg:text-sm overflow-x-auto h-full">
                  <code className="text-gray-300">
                    {response.data ? formatJson(response.data) : 'No response body'}
                  </code>
                </pre>
              </div>
            )}
            
            {activeTab === 'headers' && (
              <div className="space-y-2 overflow-y-auto h-full">
                {Object.entries(response.headers).map(([key, value]) => (
                  <div key={key} className="flex flex-col sm:flex-row py-2 border-b border-gray-700 last:border-b-0 space-y-1 sm:space-y-0">
                    <div className="sm:w-1/3 text-xs lg:text-sm font-medium text-blue-300 sm:pr-4">
                      {key}
                    </div>
                    <div className="flex-1 text-xs lg:text-sm text-gray-300 break-words">
                      {value}
                    </div>
                  </div>
                ))}
                {Object.keys(response.headers).length === 0 && (
                  <p className="text-gray-500 py-4 text-sm">No response headers</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {showCodeModal && (
        <CodeSnippetModal
          request={request}
          onClose={() => setShowCodeModal(false)}
        />
      )}
    </div>
  );
};

export default ResponseViewer;
