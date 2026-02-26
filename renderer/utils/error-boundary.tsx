import React from 'react';

class ErrorBoundary extends React.Component<{children: React.ReactNode}> {
  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);

    // This is needed to render errors correctly in development / production
    super.componentDidCatch(error, errorInfo);
  }

  render() {
    return this.props.children;
  }
}

export default ErrorBoundary;
