import { GET_ERRORS } from '../actions/types';

const initialStates = {};

export default function(state = initialStates, action) {
  switch(action.type) {
    case GET_ERRORS:
      return action.payload;
    default:
      return state;
  }
};