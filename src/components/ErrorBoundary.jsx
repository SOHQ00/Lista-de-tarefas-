import React from 'react';
import { AlertCircle, RefreshCw, Trash2 } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary capturou erro:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.warn('Erro ao limpar storage:', e);
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <AlertCircle size={28} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Ops! Algo deu errado</h2>
            <p className="text-sm text-slate-500 mb-6">
              Ocorreu um erro inesperado ao carregar a interface da aplicação.
            </p>
            {this.state.error?.message && (
              <div className="p-3 mb-6 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-left text-slate-700 overflow-x-auto">
                {this.state.error.message}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <button
                onClick={this.handleReload}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw size={16} />
                <span>Recarregar Página</span>
              </button>
              <button
                onClick={this.handleReset}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-all flex items-center justify-center gap-2"
              >
                <Trash2 size={14} />
                <span>Limpar Cache e Reiniciar</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
