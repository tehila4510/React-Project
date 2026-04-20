import { StrictMode } from 'react'
import './index.css'
import GlottieApp from './app/GlottieApp.jsx'
import { Provider } from 'react-redux';
import { store } from './app/store';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { useSelector } from 'react-redux';
import AuthPage   from './auth/AuthPage.jsx';

export function Root() {
  const { isLoggedIn, currentUser } = useSelector((state) => state.user);

  if (!isLoggedIn) {
    return <AuthPage />;
  }

  if (!currentUser?.currentLevel) {
    return <AuthPage />;
  }

  return <GlottieApp />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <Root />
    </Provider>
  </React.StrictMode>
);