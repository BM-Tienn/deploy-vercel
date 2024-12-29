/**
 * index.tsx
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */
import './app.css';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

// Use consistent styling
import 'sanitize.css/sanitize.css';

// Import root app
import { App } from 'app';

import { HelmetProvider } from 'react-helmet-async';

import reportWebVitals from 'reportWebVitals';

// Initialize languages
import { store } from 'store/configureStore';

// axios request
import 'utils/axios';

import './locales/i18n';
import { THEME_CONFIG } from 'styles/StyleConstants';
import { ConfigProvider } from 'antd';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <Provider store={store}>
    <HelmetProvider>
      <ConfigProvider theme={THEME_CONFIG}>
        {/* <React.StrictMode> */}
        <App />
        {/* </React.StrictMode> */}
      </ConfigProvider>
    </HelmetProvider>
  </Provider>,
);

// Hot reloadable translation json files
if (import.meta.hot) {
  import.meta.hot.accept(['./locales/i18n'], () => {
    // No need to render the App again because i18next works with the hooks
  });
}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
