import React from 'react';
import PropTypes from 'prop-types';

class ErrorBoundaryClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded text-red-700">
          <h2 className="font-semibold mb-2">Oops! Something went wrong.</h2>
          <button
            className="underline"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
ErrorBoundaryClass.propTypes = { children: PropTypes.node };

export default ErrorBoundaryClass;