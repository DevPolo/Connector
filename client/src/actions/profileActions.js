import axios from 'axios';
import { GET_PROFILE, PROFILE_LOADING, CLEAR_CURRENT_PROFILE, GET_ERRORS, SET_CURRENT_USER } from './types'

// 1- action GET_CURRENT_PROFILE wich hit the API /profile


// Get current profile
export const getCurrentProfile = () => dispatch => {

  // On veut dispacther une fonction 
  dispatch(setProfileLoading());

  // Start the request
  axios.get('/api/profile')
    .then(res => {
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      })}
    )
    .catch(err => {
      dispatch({
        type: GET_PROFILE,
        
        // if you don't have a profile,
        // you need to create a profile 
        // push to createprofile
        payload: {},
      })
    });
}

// Create Profile
export const createProfile = (profileData, history) => dispatch => {
  axios.post('/api/profile', profileData)
    .then(res => history.push('/dashboard'))
    .catch(err => 
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
}

// Delete Profile @ profile
export const deleteAccount = () => dispatch => {
  if(window.confirm('Are you sure? This can NOT be undone!')) {
    axios.delete('/api/profile')
      .then(res => 
        dispatch({
          type: SET_CURRENT_USER,
          payload: {},
        })
      )
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        })  
      );
  }
}


// Profile loading
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  }
}

// Clear profile
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  }
}