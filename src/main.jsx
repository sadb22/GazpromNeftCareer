import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AppProvider }  from '../context/AppContext';
import { ModeProvider } from '../context/ModeContext';
import '../styles/styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ModeProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </ModeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
