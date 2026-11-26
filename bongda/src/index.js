import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { NoticeProvider } from './context/NoticeContext';
import './index.css';

createRoot(document.getElementById('root')).render(
  <Provider store={store}><ThemeProvider><NoticeProvider><App /></NoticeProvider></ThemeProvider></Provider>,
);
