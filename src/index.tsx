import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './i18n';
import { rootStore } from './store';
import { Provider } from 'react-redux';
import { ErrorBoundary } from 'react-error-boundary';
import CatchError from './components/catchError/CatchError';
// import { BrowserRouter } from 'react-router-dom';
// import { history } from 'utils/history';

const container = document.getElementById('root');

// Sử dụng createRoot để render ứng dụng
const root = ReactDOM.createRoot(container!);

root.render(
  <React.StrictMode>
    <Provider store={rootStore}>
      {/* <BrowserRouter> */}
      <ErrorBoundary FallbackComponent={CatchError}>
        <App />
      </ErrorBoundary>
      {/* </BrowserRouter> */}
    </Provider>
  </React.StrictMode>,
);
