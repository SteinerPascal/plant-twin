import React, { ErrorInfo } from 'react';

class SparNaturalManagerBoundary extends React.Component {
  state = {
    errorMessage: '',
  };

  static getDerivedStateFromError(error:Error) {
    return { errorMessage: error.toString() };
  }

  componentDidCatch(error:Error, info:ErrorInfo) {
    this.logErrorToServices(error.toString(), info.componentStack);
  }

  // A fake logging service.
  logErrorToServices = console.error;

  render() {
    if (this.state.errorMessage) {
      return(
      <div>
            <p>Ouuuch this went wrong!</p>
            <p>{this.state.errorMessage}</p>)
      </div>
      )
    }
    return this.props.children;
  }
}

export default SparNaturalManagerBoundary;