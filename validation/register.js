const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
  let errors = {};

  // data.name ne sera pas un string empty (comme nous l'avons créé)
  // Ici, il passe par notre isEmpty fct (contrairement à celle de Vailidator)
  data.name = !isEmpty(data.name) ? data.name : '';

  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.passwordConfirmation = !isEmpty(data.passwordConfirmation) ? data.passwordConfirmation : '';

  if(!Validator.isLength(data.name, { min: 2, max: 50 })){
    errors.name = 'Name must be between 2 and 50 caracthers';
  }

  if(Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  if(!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if(Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  if(!Validator.isLength(data.password, {min: 6, max: undefined})) {
    errors.password = 'Password must be at least 6 caracters';
  }
  
  if(Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  if(!Validator.equals(data.password, data.passwordConfirmation)) {
    errors.passwordConfirmation = 'Password do not match';
  }

  if(Validator.isEmpty(data.passwordConfirmation)) {
    errors.passwordConfirmation = 'Confirm password field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  }
}

