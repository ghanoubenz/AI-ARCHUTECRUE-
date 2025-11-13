import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  // StrictMode is disabled because react-konva has some lifecycle methods that
  // are not fully compatible with it, causing double rendering issues with Transformer.
  // This is a known trade-off when using this library with StrictMode.
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);
