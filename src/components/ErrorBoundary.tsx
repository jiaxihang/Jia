import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * 错误边界组件
 * 捕获子组件树中的 JavaScript 错误，避免整个应用崩溃
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6">
          <span className="text-6xl mb-6">😵</span>
          <h2 className="font-serif text-xl text-cyan-900 mb-2">
            出了点小问题
          </h2>
          <p className="text-slate-500 font-sans text-sm text-center max-w-md mb-8">
            页面加载时遇到了错误，请刷新重试。如果问题持续，欢迎反馈。
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-full font-sans text-sm hover:opacity-90 transition-opacity"
          >
            刷新页面
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
