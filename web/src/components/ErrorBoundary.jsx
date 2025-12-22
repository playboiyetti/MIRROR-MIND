import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="clay-card p-12 max-w-md text-center space-y-6"
          >
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-accentDanger/10 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-accentDanger" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
              <p className="text-textSecondary text-sm font-light">
                We encountered an unexpected error. Please refresh the page to continue your reflection journey.
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 rounded-xl clay-button text-sm font-medium text-accentPrimary"
            >
              Refresh Page
            </button>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
