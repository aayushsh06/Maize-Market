import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import AppProviders from './components/AppProviders';


ReactDOM.createRoot(document.getElementById('root')).render(
    <AppProviders>
      <BrowserRouter>
        <App/> 
      </BrowserRouter>
    </AppProviders>
);
