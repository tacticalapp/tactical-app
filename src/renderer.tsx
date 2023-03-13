import React from 'react';
import ReactDOM from 'react-dom/client';
import { Boot } from './boot';
import './renderer.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Boot />
  </React.StrictMode>,
);