
import { Plus, X } from 'lucide-react';

interface Header {
  key: string;
  value: string;
}

interface HeaderEditorProps {
  headers: Header[];
  onChange: (headers: Header[]) => void;
}

const HeaderEditor = ({ headers, onChange }: HeaderEditorProps) => {
  const addHeader = () => {
    onChange([...headers, { key: '', value: '' }]);
  };

  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = headers.map((header, i) => 
      i === index ? { ...header, [field]: value } : header
    );
    onChange(newHeaders);
  };

  const removeHeader = (index: number) => {
    onChange(headers.filter((_, i) => i !== index));
  };

  const commonHeaders = [
    'Content-Type',
    'Authorization',
    'Accept',
    'User-Agent',
    'X-API-Key',
    'Cache-Control'
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
        <h3 className="text-sm font-medium text-gray-300">HTTP Headers</h3>
        <button
          onClick={addHeader}
          className="flex items-center justify-center space-x-1 text-sm px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded transition-colors w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Header</span>
        </button>
      </div>

      {headers.length === 0 && (
        <div className="text-center py-6 lg:py-8 text-gray-500">
          <p className="text-sm lg:text-base">No headers added yet.</p>
          <p className="text-xs lg:text-sm mt-1">Click "Add Header" to get started.</p>
        </div>
      )}

      <div className="space-y-3">
        {headers.map((header, index) => (
          <div key={index} className="flex items-start space-x-3 group">
            <div className="flex-1 space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-3">
              <div>
                <input
                  type="text"
                  value={header.key}
                  onChange={(e) => updateHeader(index, 'key', e.target.value)}
                  placeholder="Header name"
                  list={`headers-${index}`}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <datalist id={`headers-${index}`}>
                  {commonHeaders.map(name => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
              </div>
              <input
                type="text"
                value={header.value}
                onChange={(e) => updateHeader(index, 'value', e.target.value)}
                placeholder="Header value"
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              onClick={() => removeHeader(index)}
              className="p-2 text-gray-400 hover:text-red-400 sm:opacity-0 sm:group-hover:opacity-100 transition-all mt-0.5 sm:mt-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {headers.length > 0 && (
        <div className="text-xs text-gray-500 mt-4">
          <p>Common headers like Content-Type will auto-suggest as you type.</p>
        </div>
      )}
    </div>
  );
};

export default HeaderEditor;
