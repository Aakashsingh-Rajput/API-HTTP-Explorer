
import { Plus, X } from 'lucide-react';

interface QueryParam {
  key: string;
  value: string;
}

interface QueryParamsEditorProps {
  params: QueryParam[];
  onChange: (params: QueryParam[]) => void;
}

const QueryParamsEditor = ({ params, onChange }: QueryParamsEditorProps) => {
  const addParam = () => {
    onChange([...params, { key: '', value: '' }]);
  };

  const updateParam = (index: number, field: 'key' | 'value', value: string) => {
    const newParams = params.map((param, i) => 
      i === index ? { ...param, [field]: value } : param
    );
    onChange(newParams);
  };

  const removeParam = (index: number) => {
    onChange(params.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
        <h3 className="text-sm font-medium text-gray-300">Query Parameters</h3>
        <button
          onClick={addParam}
          className="flex items-center justify-center space-x-1 text-sm px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded transition-colors w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Parameter</span>
        </button>
      </div>

      {params.length === 0 && (
        <div className="text-center py-6 lg:py-8 text-gray-500">
          <p className="text-sm lg:text-base">No query parameters added yet.</p>
          <p className="text-xs lg:text-sm mt-1">Parameters will be added to your URL like: ?key=value&key2=value2</p>
        </div>
      )}

      <div className="space-y-3">
        {params.map((param, index) => (
          <div key={index} className="flex items-start space-x-3 group">
            <div className="flex-1 space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-3">
              <input
                type="text"
                value={param.key}
                onChange={(e) => updateParam(index, 'key', e.target.value)}
                placeholder="Parameter name"
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                value={param.value}
                onChange={(e) => updateParam(index, 'value', e.target.value)}
                placeholder="Parameter value"
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              onClick={() => removeParam(index)}
              className="p-2 text-gray-400 hover:text-red-400 sm:opacity-0 sm:group-hover:opacity-100 transition-all mt-0.5 sm:mt-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {params.some(p => p.key) && (
        <div className="bg-gray-800 rounded p-3 border border-gray-600">
          <p className="text-xs text-gray-400 mb-1">Preview URL:</p>
          <code className="text-xs lg:text-sm text-purple-300 break-all">
            {params.filter(p => p.key).map((p, i) => 
              `${i === 0 ? '?' : '&'}${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`
            ).join('')}
          </code>
        </div>
      )}
    </div>
  );
};

export default QueryParamsEditor;
