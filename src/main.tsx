import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/index.css';

import {
  Chart as ChartJS,
  registerables
} from 'chart.js';

// Register all Chart.js controllers, scales, and elements safely
ChartJS.register(...registerables);

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Attn UI Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, fontFamily: 'Inter, sans-serif', background: '#0a0a0a', color: '#e5e5e5', minHeight: '100vh' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#f87171' }}>Attn Error</h2>
          <pre style={{ marginTop: 12, padding: 16, background: '#111111', border: '1px solid #1a1a1a', borderRadius: 8, fontSize: 11, overflow: 'auto', color: '#a3a3a3' }}>
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: 16, padding: '8px 16px', background: '#a78bfa', color: '#0a0a0a', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 12 }}
          >
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
