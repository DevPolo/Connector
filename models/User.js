const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema 
const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    // Il va le mettre automatiquement avec la date de l'inscription
    default: Date.now
  },
})

// On exporte le tout dans une variable User qui comprend le model
module.exports = User = mongoose.model('users', userSchema);





