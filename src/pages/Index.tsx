
import { useState } from 'react';
import RequestBuilder from '../components/RequestBuilder';
import ResponseViewer from '../components/ResponseViewer';
import RequestHistory from '../components/RequestHistory';
import Footer from '../components/Footer';
import EnvironmentSelector from '../components/EnvironmentSelector';
import ErrorBoundary from '../components/ErrorBoundary';
import { Send, History, Code, Zap, X } from 'lucide-react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { validateUrl, validateJson, validateHeaders, sanitizeInput } from '../utils/requestValidator';
import { makeApiRequest } from '../utils/apiClient';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  
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
    // Validate URL
    const urlValidation = validateUrl(request.url);
    if (!urlValidation.isValid) {
      toast({
        title: "Invalid URL",
        description: urlValidation.error,
        variant: "destructive"
      });
      return;
    }

    // Validate headers
    const headersValidation = validateHeaders(request.headers);
    if (!headersValidation.isValid) {
      toast({
        title: "Invalid Headers",
        description: headersValidation.error,
        variant: "destructive"
      });
      return;
    }

    // Validate JSON body for non-GET requests
    if (request.method !== 'GET' && request.body) {
      const bodyValidation = validateJson(request.body);
      if (!bodyValidation.isValid) {
        toast({
          title: "Invalid JSON Body",
          description: bodyValidation.error,
          variant: "destructive"
        });
        return;
      }
    }

    setLoading(true);
    setResponse(null);

    try {
      console.log('Executing request:', request);

      // Sanitize request data
      const sanitizedRequest: RequestData = {
        ...request,
        url: sanitizeInput(request.url),
        headers: request.headers.map(h => ({
          key: sanitizeInput(h.key),
          value: sanitizeInput(h.value)
        })),
        queryParams: request.queryParams.map(p => ({
          key: sanitizeInput(p.key),
          value: sanitizeInput(p.value)
        })),
        body: request.body
      };

      const responseData = await makeApiRequest(sanitizedRequest, {
        timeout: 30000,
        retries: 1
      });

      setResponse(responseData);

      // Show success/error toast
      if (responseData.error) {
        toast({
          title: "Request Failed",
          description: responseData.error,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Request Successful",
          description: `${responseData.status} ${responseData.statusText} (${responseData.time}ms)`
        });
      }

      // Add to history
      const historyItem: HistoryItem = {
        ...sanitizedRequest,
        id: Date.now().toString(),
        timestamp: Date.now(),
        response: responseData
      };
      
      setHistory(prev => [historyItem, ...prev.slice(0, 9)]); // Keep last 10 requests

    } catch (error) {
      console.error('Unexpected error during request execution:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      toast({
        title: "Unexpected Error",
        description: errorMessage,
        variant: "destructive"
      });

      setResponse({
        status: 0,
        statusText: 'Error',
        headers: {},
        data: null,
        time: 0,
        error: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistory = (historyItem: HistoryItem) => {
    try {
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
      
      toast({
        title: "Request Loaded",
        description: "Request loaded from history"
      });
    } catch (error) {
      console.error('Error loading from history:', error);
      toast({
        title: "Error",
        description: "Failed to load request from history",
        variant: "destructive"
      });
    }
  };

  const updateRequest = (updates: Partial<RequestData>) => {
    try {
      setRequest(prev => ({ ...prev, ...updates }));
    } catch (error) {
      console.error('Error updating request:', error);
      toast({
        title: "Error",
        description: "Failed to update request",
        variant: "destructive"
      });
    }
  };

  return (
    <ErrorBoundary>
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
                    
                    <RequestBuilder request={request} onChange={updateRequest} />
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
                        
                        <RequestBuilder request={request} onChange={updateRequest} />
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
    </ErrorBoundary>
  );
};

export default Index;
