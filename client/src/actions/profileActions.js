import axios from 'axios';
import { GET_PROFILE, PROFILE_LOADING, CLEAR_CURRENT_PROFILE } from './types'

// 1- action GET_CURRENT_PROFILE wich hit the API /profile


// Get current profile
export const getCurrentProfile = () => dispatch => {

  // On veut dispacther une fonction 
  dispatch(setProfileLoading());

  // start the request
  axios.get('/api/profile')
    .then(res => {
      console.log('res :', res);
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      })}
    )
    .catch(err => {
      console.log('err :', err);
      dispatch({
        type: GET_PROFILE,
        
        // if you don't have a profile,
        // you need to create a profile 
        // push to createprofile
        payload: {},
      })
    });
}

// Profile loading
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  }
}

// Cleat profile
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  }
}