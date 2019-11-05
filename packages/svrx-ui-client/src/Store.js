import { /* Action, */ createStore } from 'redux';
import reducer from './reducer';

// action

export const InitState = {
  builtins: [],
  plugins: [],
  directory: '',
};

export function makeStore() {
  return createStore(reducer, InitState);
}
