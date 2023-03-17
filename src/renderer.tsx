import { Buffer } from 'buffer';
window.Buffer = Buffer;
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Boot } from './boot';
import './ui/styles.css';
import './renderer.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  <Boot />
  // </React.StrictMode>,
);