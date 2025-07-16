
import { useState } from 'react';
import { ChevronDown, Plus, X, Globe, Settings } from 'lucide-react';
import { RequestData } from '../pages/Index';
import HeaderEditor from './HeaderEditor';
import QueryParamsEditor from './QueryParamsEditor';

interface RequestBuilderProps {
  request: RequestData;
  onChange: (request: RequestData) => void;
}

const RequestBuilder = ({ request, onChange }: RequestBuilderProps) => {
  const [activeTab, setActiveTab] = useState<'headers' | 'params' | 'body'>('params');

  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

  const updateRequest = (updates: Partial<RequestData>) => {
    onChange({ ...request, ...updates });
  };

  const exampleUrls = [
    'https://jsonplaceholder.typicode.com/posts',
    'https://jsonplaceholder.typicode.com/users',
    'https://dummyjson.com/products',
    'https://reqres.in/api/users',
    'https://httpbin.org/get'
  ];

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* URL and Method */}
      <div className="space-y-3 lg:space-y-4">
        <div className="flex items-center space-x-2 lg:space-x-3">
          <Globe className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400" />
          <span className="text-sm font-medium text-gray-300">Request URL</span>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          {/* Method Selector */}
          <div className="relative sm:w-auto">
            <select
              value={request.method}
              onChange={(e) => updateRequest({ method: e.target.value })}
              className="w-full sm:w-auto appearance-none bg-gray-700 border border-gray-600 rounded-lg px-3 lg:px-4 py-3 pr-8 lg:pr-10 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm lg:text-base"
            >
              {methods.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 lg:right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
          
          {/* URL Input */}
          <input
            type="url"
            value={request.url}
            onChange={(e) => updateRequest({ url: e.target.value })}
            placeholder="Enter API endpoint URL..."
            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 lg:px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm lg:text-base"
          />
        </div>

        {/* Quick URL Examples - Better mobile layout */}
        <div className="space-y-2">
          <span className="text-xs text-gray-400">Quick examples:</span>
          <div className="flex flex-wrap gap-2">
            {exampleUrls.map((url) => (
              <button
                key={url}
                onClick={() => updateRequest({ url })}
                className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-purple-300 hover:text-purple-200 transition-colors whitespace-nowrap"
              >
                {url.split('/')[2]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs - Scrollable on mobile */}
      <div className="border-b border-gray-600 -mx-4 px-4 lg:mx-0 lg:px-0">
        <nav className="flex space-x-6 lg:space-x-8 overflow-x-auto scrollbar-hide">
          {[
            { key: 'params', label: 'Query Params', count: request.queryParams.filter(p => p.key).length },
            { key: 'headers', label: 'Headers', count: request.headers.filter(h => h.key).length },
            { key: 'body', label: 'Body' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className="bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[1.25rem] h-5 flex items-center justify-center">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[200px]">
        {activeTab === 'params' && (
          <QueryParamsEditor
            params={request.queryParams}
            onChange={(queryParams) => updateRequest({ queryParams })}
          />
        )}
        
        {activeTab === 'headers' && (
          <HeaderEditor
            headers={request.headers}
            onChange={(headers) => updateRequest({ headers })}
          />
        )}
        
        {activeTab === 'body' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
              <label className="text-sm font-medium text-gray-300">Request Body</label>
              {request.method === 'GET' && (
                <span className="text-xs text-gray-500">Body not available for GET requests</span>
              )}
            </div>
            
            <textarea
              value={request.body}
              onChange={(e) => updateRequest({ body: e.target.value })}
              disabled={request.method === 'GET'}
              placeholder={request.method === 'GET' ? 'Body not supported for GET requests' : 'Enter JSON body...\n\n{\n  "key": "value"\n}'}
              className="w-full h-32 sm:h-48 bg-gray-700 border border-gray-600 rounded-lg p-3 lg:p-4 font-mono text-xs lg:text-sm resize-y focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            
            {request.body && request.method !== 'GET' && (
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    try {
                      const formatted = JSON.stringify(JSON.parse(request.body), null, 2);
                      updateRequest({ body: formatted });
                    } catch (e) {
                      // Invalid JSON, ignore
                    }
                  }}
                  className="text-sm px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-gray-300 transition-colors"
                >
                  Format JSON
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestBuilder;
