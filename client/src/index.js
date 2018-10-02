import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Router } from 'react-router-dom';
import history from './history';
import registerServiceWorker from './registerServiceWorker';

/*
Entry point for React to render our application.
It renders the App component, which renders our entire application.
*/
ReactDOM.render(
    <Router history={history}>
        <App />
    </Router>, 
    document.getElementById('root'));
registerServiceWorker();
