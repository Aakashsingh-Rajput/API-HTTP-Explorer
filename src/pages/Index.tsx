import { useState } from 'react';
import RequestBuilder from '../components/RequestBuilder';
import ResponseViewer from '../components/ResponseViewer';
import RequestHistory from '../components/RequestHistory';
import Footer from '../components/Footer';
import EnvironmentSelector from '../components/EnvironmentSelector';
import { Send, History, Code, Zap, X } from 'lucide-react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

export interface RequestData {
  method: string;
  url: string;
  headers: { key: string; value: string }[];
  queryParams: { key: string; value: string }[];
  body: string;
}

export interface ResponseData {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  time: number;
  error?: string;
}

export interface HistoryItem extends RequestData {
  id: string;
  timestamp: number;
  response?: ResponseData;
}

const Index = () => {
  const [request, setRequest] = useState<RequestData>({
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    headers: [{ key: 'Content-Type', value: 'application/json' }],
    queryParams: [],
    body: ''
  });
  
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [environment, setEnvironment] = useState('dev');

  const executeRequest = async () => {
    setLoading(true);
    const startTime = Date.now();
    
    try {
      // Build URL with query params
      const url = new URL(request.url);
      request.queryParams.forEach(param => {
        if (param.key && param.value) {
          url.searchParams.append(param.key, param.value);
        }
      });

      // Build headers
      const headers: Record<string, string> = {};
      request.headers.forEach(header => {
        if (header.key && header.value) {
          headers[header.key] = header.value;
        }
      });

      const requestOptions: RequestInit = {
        method: request.method,
        headers
      };

      if (request.method !== 'GET' && request.body) {
        requestOptions.body = request.body;
      }

      const fetchResponse = await fetch(url.toString(), requestOptions);
      const responseData = await fetchResponse.text();
      const time = Date.now() - startTime;

      let parsedData;
      try {
        parsedData = JSON.parse(responseData);
      } catch {
        parsedData = responseData;
      }

      const responseHeaders: Record<string, string> = {};
      fetchResponse.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      const newResponse: ResponseData = {
        status: fetchResponse.status,
        statusText: fetchResponse.statusText,
        headers: responseHeaders,
        data: parsedData,
        time
      };

      setResponse(newResponse);

      // Add to history
      const historyItem: HistoryItem = {
        ...request,
        id: Date.now().toString(),
        timestamp: Date.now(),
        response: newResponse
      };
      setHistory(prev => [historyItem, ...prev.slice(0, 9)]); // Keep last 10 requests

    } catch (error) {
      const time = Date.now() - startTime;
      const errorResponse: ResponseData = {
        status: 0,
        statusText: 'Network Error',
        headers: {},
        data: null,
        time,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
      setResponse(errorResponse);
    }
    
    setLoading(false);
  };

  const loadFromHistory = (historyItem: HistoryItem) => {
    setRequest({
      method: historyItem.method,
      url: historyItem.url,
      headers: historyItem.headers,
      queryParams: historyItem.queryParams,
      body: historyItem.body
    });
    if (historyItem.response) {
      setResponse(historyItem.response);
    }
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 lg:px-6 py-3 lg:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 lg:space-x-3">
            <div className="bg-purple-600 p-1.5 lg:p-2 rounded-lg">
              <Zap className="h-4 w-4 lg:h-6 lg:w-6" />
            </div>
            <div>
              <h1 className="text-lg lg:text-xl font-bold">API HTTP Explorer</h1>
              <p className="text-gray-400 text-xs lg:text-sm">Test, visualize, and learn about HTTP APIs</p>
            </div>
          </div>
          
          {/* Header Controls */}
          <div className="flex items-center space-x-2 lg:space-x-3">
            {/* Environment Selector */}
            <EnvironmentSelector 
              currentEnvironment={environment}
              onEnvironmentChange={setEnvironment}
            />
            
            {/* History Button */}
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center space-x-1 lg:space-x-2 px-3 lg:px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm lg:text-base"
            >
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">History</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col">
        <div className="flex flex-col lg:flex-row flex-1 h-[calc(100vh-64px)] lg:h-[calc(100vh-80px)]">
          {/* History Sidebar - Mobile: Full screen overlay, Desktop: Sidebar */}
          {showHistory && (
            <>
              {/* Mobile backdrop */}
              <div 
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setShowHistory(false)}
              />
              
              <div className="fixed inset-y-0 left-0 w-full sm:w-80 bg-gray-800 border-r border-gray-700 z-50 lg:relative lg:w-80 lg:z-auto">
                <RequestHistory 
                  history={history} 
                  onLoadRequest={loadFromHistory}
                  onClose={() => setShowHistory(false)}
                />
              </div>
            </>
          )}

          {/* Main Content - Stack vertically on mobile, resizable panels on desktop */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Mobile: Stack vertically */}
            <div className="flex flex-col lg:hidden h-full">
              {/* Request Builder */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto border-b border-gray-700">
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-3 sm:space-y-0">
                    <h2 className="text-base font-semibold flex items-center space-x-2">
                      <Code className="h-4 w-4 text-purple-400" />
                      <span>Request Builder</span>
                      {environment !== 'dev' && (
                        <span className="text-xs px-2 py-1 bg-purple-600 rounded-full">
                          {environment.toUpperCase()}
                        </span>
                      )}
                    </h2>
                    <button
                      onClick={executeRequest}
                      disabled={loading || !request.url}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors text-sm w-full sm:w-auto"
                    >
                      <Send className="h-4 w-4" />
                      <span>{loading ? 'Sending...' : 'Send Request'}</span>
                    </button>
                  </div>
                  
                  <RequestBuilder request={request} onChange={setRequest} />
                </div>
              </div>

              {/* Response Viewer */}
              <div className="flex-1 p-4 overflow-y-auto">
                <ResponseViewer response={response} loading={loading} request={request} />
              </div>
            </div>

            {/* Desktop: Resizable panels */}
            <div className="hidden lg:flex flex-1 overflow-hidden">
              <ResizablePanelGroup direction="horizontal" className="w-full">
                {/* Request Builder Panel */}
                <ResizablePanel defaultSize={50} minSize={30}>
                  <div className="h-full p-6 space-y-6 overflow-y-auto">
                    <div className="bg-gray-800 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold flex items-center space-x-2">
                          <Code className="h-5 w-5 text-purple-400" />
                          <span>Request Builder</span>
                          {environment !== 'dev' && (
                            <span className="text-xs px-2 py-1 bg-purple-600 rounded-full">
                              {environment.toUpperCase()}
                            </span>
                          )}
                        </h2>
                        <button
                          onClick={executeRequest}
                          disabled={loading || !request.url}
                          className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
                        >
                          <Send className="h-4 w-4" />
                          <span>{loading ? 'Sending...' : 'Send Request'}</span>
                        </button>
                      </div>
                      
                      <RequestBuilder request={request} onChange={setRequest} />
                    </div>
                  </div>
                </ResizablePanel>

                {/* Resizable Handle */}
                <ResizableHandle withHandle />

                {/* Response Viewer Panel */}
                <ResizablePanel defaultSize={50} minSize={30}>
                  <div className="h-full p-6 overflow-y-auto">
                    <ResponseViewer response={response} loading={loading} request={request} />
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
