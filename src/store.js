/* eslint-disable import/no-unresolved, global-require */
import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';

import createReducer from './reducers';
import rootSaga from './sagas';

const bindMiddleware = (middleware) => {
  if (process.env.NODE_ENV !== 'production') {
    const { composeWithDevTools } = require('redux-devtools-extension');
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

function configureStore(initialState = {}) {
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [sagaMiddleware];
  if (process.env.NODE_ENV !== 'production') {
    middleware.push(logger);
  }
  const store = createStore(
    createReducer(),
    initialState,
    bindMiddleware(middleware)
  );

  store.sagaTask = sagaMiddleware.run(rootSaga);

  return store;
}

export default configureStore;
