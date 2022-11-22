import React from "react";

export default class ForceGarphErrorBoundary extends React.Component {
    constructor(props:any) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error:any) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }
  
    componentDidCatch(error:any, errorInfo:any) {
      // You can also log the error to an error reporting service
      console.log(error, errorInfo);
    }
  
    render() {
      if ((this.state as any).hasError) {
        // You can render any custom fallback UI
        return <h1>Something went wrong in the forcegraph</h1>;
      }
  
      return (this.props as any).children; 
    }
  }