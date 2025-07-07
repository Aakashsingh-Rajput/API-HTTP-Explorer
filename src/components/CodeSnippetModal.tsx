
import { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { RequestData } from '../pages/Index';

interface CodeSnippetModalProps {
  request: RequestData;
  onClose: () => void;
}

const CodeSnippetModal = ({ request, onClose }: CodeSnippetModalProps) => {
  const [activeLanguage, setActiveLanguage] = useState<'fetch' | 'axios' | 'curl'>('fetch');
  const [copied, setCopied] = useState(false);

  const generateFetchCode = () => {
    const url = new URL(request.url);
    request.queryParams.forEach(param => {
      if (param.key && param.value) {
        url.searchParams.append(param.key, param.value);
      }
    });

    const headers: Record<string, string> = {};
    request.headers.forEach(header => {
      if (header.key && header.value) {
        headers[header.key] = header.value;
      }
    });

    let code = `fetch('${url.toString()}', {\n  method: '${request.method}'`;
    
    if (Object.keys(headers).length > 0) {
      code += `,\n  headers: ${JSON.stringify(headers, null, 4).replace(/^/gm, '  ')}`;
    }
    
    if (request.method !== 'GET' && request.body) {
      code += `,\n  body: ${JSON.stringify(request.body)}`;
    }
    
    code += '\n})\n.then(response => response.json())\n.then(data => console.log(data))\n.catch(error => console.error(error));';
    
    return code;
  };

  const generateAxiosCode = () => {
    const url = new URL(request.url);
    request.queryParams.forEach(param => {
      if (param.key && param.value) {
        url.searchParams.append(param.key, param.value);
      }
    });

    const headers: Record<string, string> = {};
    request.headers.forEach(header => {
      if (header.key && header.value) {
        headers[header.key] = header.value;
      }
    });

    let code = `axios({\n  method: '${request.method.toLowerCase()}',\n  url: '${url.toString()}'`;
    
    if (Object.keys(headers).length > 0) {
      code += `,\n  headers: ${JSON.stringify(headers, null, 4).replace(/^/gm, '  ')}`;
    }
    
    if (request.method !== 'GET' && request.body) {
      code += `,\n  data: ${request.body}`;
    }
    
    code += '\n})\n.then(response => console.log(response.data))\n.catch(error => console.error(error));';
    
    return code;
  };

  const generateCurlCode = () => {
    const url = new URL(request.url);
    request.queryParams.forEach(param => {
      if (param.key && param.value) {
        url.searchParams.append(param.key, param.value);
      }
    });

    let code = `curl -X ${request.method} '${url.toString()}'`;
    
    request.headers.forEach(header => {
      if (header.key && header.value) {
        code += ` \\\n  -H '${header.key}: ${header.value}'`;
      }
    });
    
    if (request.method !== 'GET' && request.body) {
      code += ` \\\n  -d '${request.body}'`;
    }
    
    return code;
  };

  const getCode = () => {
    switch (activeLanguage) {
      case 'fetch': return generateFetchCode();
      case 'axios': return generateAxiosCode();
      case 'curl': return generateCurlCode();
      default: return '';
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(getCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold">Generate Code Snippet</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Language Tabs */}
          <div className="flex space-x-1 bg-gray-900 p-1 rounded-lg">
            {[
              { key: 'fetch', label: 'Fetch API' },
              { key: 'axios', label: 'Axios' },
              { key: 'curl', label: 'cURL' }
            ].map(lang => (
              <button
                key={lang.key}
                onClick={() => setActiveLanguage(lang.key as any)}
                className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-colors ${
                  activeLanguage === lang.key
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* Code Display */}
          <div className="relative">
            <pre className="bg-gray-900 rounded-lg p-4 text-sm overflow-x-auto max-h-96 overflow-y-auto">
              <code className="text-gray-300">{getCode()}</code>
            </pre>
            
            <button
              onClick={copyCode}
              className="absolute top-3 right-3 flex items-center space-x-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-400" />
                  <span className="text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Instructions */}
          <div className="text-sm text-gray-400 space-y-2">
            {activeLanguage === 'axios' && (
              <p>💡 Don't forget to install axios: <code className="bg-gray-700 px-1 rounded">npm install axios</code></p>
            )}
            <p>This code snippet represents your current request configuration.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeSnippetModal;
