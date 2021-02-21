import React from 'react';
import { Provider } from 'react-redux';

import { HashRouter as Router, Switch, Route } from 'react-router-dom';
// import icon from '../assets/icon.svg';
import './App.global.css';

import configureStore from './store';

// import { getArticles } from './actions/new';

import routes, { renderRoutes } from './routes';

const store = configureStore();

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        {/* <Switch> */}
        {/* <Route path="/" component={Hello} /> */}
        {renderRoutes(routes)}
        {/* </Switch> */}
      </Router>
    </Provider>
  );
}
