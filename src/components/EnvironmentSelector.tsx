
import { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

interface Environment {
  name: string;
  value: string;
  color: string;
}

const environments: Environment[] = [
  { name: 'Development', value: 'dev', color: 'bg-green-500' },
  { name: 'Staging', value: 'staging', color: 'bg-yellow-500' },
  { name: 'Production', value: 'prod', color: 'bg-red-500' }
];

interface EnvironmentSelectorProps {
  currentEnvironment: string;
  onEnvironmentChange: (env: string) => void;
}

const EnvironmentSelector = ({ currentEnvironment, onEnvironmentChange }: EnvironmentSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedEnv = environments.find(env => env.value === currentEnvironment) || environments[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm"
      >
        <div className={`w-2 h-2 rounded-full ${selectedEnv.color}`} />
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{selectedEnv.name}</span>
        <ChevronDown className="h-3 w-3" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 w-40 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-20">
            {environments.map((env) => (
              <button
                key={env.value}
                onClick={() => {
                  onEnvironmentChange(env.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gray-600 transition-colors text-sm first:rounded-t-lg last:rounded-b-lg ${
                  env.value === currentEnvironment ? 'bg-gray-600' : ''
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${env.color}`} />
                <span>{env.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EnvironmentSelector;
