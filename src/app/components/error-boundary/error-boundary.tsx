import React, { ReactNode } from 'react';
import { TechnicalIssues } from '../technical-issues';

interface StateProps {
  error: null | any;
  errorInfo: null | any;
}

export class ErrorBoundary extends React.Component<any, StateProps> {
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
        <TechnicalIssues
          header="Что-то пошло не так"
          message={this.state.error && this.state.error.toString()}
        />
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}
