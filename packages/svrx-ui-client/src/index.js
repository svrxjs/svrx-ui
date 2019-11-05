import React from 'react';
import ReactDOM from 'react-dom';
import { StoreContext } from 'redux-react-hook';

import './index.css';
import App from './App';
import { makeStore } from './Store';

const store = makeStore();

ReactDOM.render(
  <StoreContext.Provider value={store}>
    <App />
  </StoreContext.Provider>,
  document.getElementById('root'),
);
