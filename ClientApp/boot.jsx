import './resources/css/site.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import * as Routes from './routes';
import { createStore } from 'redux';
import reducer from './reducers';

// const store = createStore(reducer);

let routes = Routes.routes;

function renderApp() {
    // This code starts up the React app when it runs in a browser. It sets up the routing configuration
    // and injects the app into a DOM element.

    const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');

    ReactDOM.render(
        <AppContainer>
            <BrowserRouter children={routes} basename={baseUrl}/>
        </AppContainer>,
        document.getElementById('react-app')
    );
}

renderApp();

// Allow Hot Module Replacement
if (module.hot) {
    module.hot.accept('./routes', () => {
        routes = require('./routes').routes;
        renderApp();
    });
}
