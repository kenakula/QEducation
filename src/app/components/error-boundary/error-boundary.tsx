import React, { ReactNode } from 'react';

interface StateProps {
  error: null | any;
  errorInfo: null | any;
}

class ErrorBoundary extends React.Component<any, StateProps> {
  constructor(props: any) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error: any, errorInfo: any): void {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error,
      errorInfo,
    });
    // You can also log error messages to an error reporting service here
  }

  render(): JSX.Element | ReactNode {
    if (this.state.errorInfo) {
      // Error path
      return (
        <div style={{ padding: '0 20px' }}>
          <h2>Что-то не так</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}

export default ErrorBoundary;
