import React from 'react';
import PropTypes from 'prop-types';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-16 text-center">
          <div className="bg-white p-32 rounded-xl shadow-soft max-w-lg w-full">
            <h2 className="text-2xl font-bold text-red-600 mb-8">Oops! Something went wrong.</h2>
            <p className="text-gray-600 mb-24">We're sorry, but an unexpected error occurred.</p>
            <button
              onClick={() => { globalThis.location.href = '/'; }}
              className="px-16 py-8 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Return Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};
