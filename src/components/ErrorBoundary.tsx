
import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full text-center">
            <div className="bg-red-600 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8" />
            </div>
            
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <p className="text-gray-400 mb-6">
              The application encountered an unexpected error. Please try refreshing the page.
            </p>
            
            {this.state.error && (
              <div className="bg-gray-700 rounded p-3 mb-6 text-left">
                <p className="text-xs text-red-300 font-mono">
                  {this.state.error.message}
                </p>
              </div>
            )}
            
            <button
              onClick={this.handleReset}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors mx-auto"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
