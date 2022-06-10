import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'core-js/stable/symbol'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App/>
);
