import { /* Action, */ createStore } from 'redux';
import reducer, { InitState } from './reducer';

// action
export function makeStore() {
  return createStore(reducer, InitState);
}

export default {};
