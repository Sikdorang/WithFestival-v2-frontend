import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import ErrorView from './exceptions/ErrorView';

export default function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return <ErrorView />;
  }

  return <ErrorView />;
}
