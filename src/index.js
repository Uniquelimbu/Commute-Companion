import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import for createRoot
import App from './App';

const rootElement = document.getElementById('root');

// Initialize the root with createRoot and render the App component
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
