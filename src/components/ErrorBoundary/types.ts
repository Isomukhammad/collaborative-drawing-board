import { ReactNode } from "react";

export type ErrorBoundaryProps = {
  renderFallback: (error: Error) => ReactNode;
  children: ReactNode;
};

export type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};
