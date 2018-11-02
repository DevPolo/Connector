const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/key');
const passport = require('passport');

// Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load User model
const User = require('../../models/User');


// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res, next) => {
  res.json({msg:'users OK'});
})

// @route   POST api/users/register
// @desc    Register a user
// @access  Public
router.post('/register', (req, res, next) => {

  // Are inputs valid?
  const { errors, isValid } = validateRegisterInput(req.body);
  if(!isValid) {
    return res.status(400).json(errors);
  }

  // Is user exists?
  User
    .findOne({ email: req.body.email })
    .then(user => {

    if(user) {
      errors.email = 'Email already exists';
      return res.status(400).json(errors);

    } else {

      // Adding user into DB
      const avatar = gravatar.url(req.body.email, {
        s: '200', // Size
        r: 'pg', // Rating
        d: 'mm', // Default
      });
      const newUser = new User ({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
      });

      // Bcrypt process
      bcrypt.genSalt(10, (err, salt ) => {
        bcrypt.hash(newUser.password, salt, (err, hash) =>{
          if(err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log('error dans la sauvegarde du user :', err));
        });
      });
    }
  }); 
});

// @route   POST api/users/login
// @desc    Login user / Returning JWT
// @access  Public
router.post('/login', (req, res, next) => {
  
  // Are inputs valid?
  const { errors, isValid } = validateLoginInput(req.body);
  if(!isValid) {
    return res.status(400).json(errors);
  }
    
  const email = req.body.email;
  const password = req.body.password;

  // Is user exists in DB?
  User
    .findOne({ email })
    .then(user => {
      
      if(!user) {
        errors.email = 'email not found'
        return res.status(404).json(errors);
      } 

      bcrypt.compare(password, user.password)
        .then(isMatch => {
          
          if(isMatch) {
            const payload = { id: user.id, name: user.name, avatar: user.avatar }
            jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
              res.json({sucess: true, token: 'Bearer ' + token});
            });

          } else {
            errors.password = 'Wrong password';
            return res.status(400).json(errors);
          }
        });
    });
});

// @route   GET api/users/current
// @desc    Return current user due to JWT & Passport module
// @access  Private
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    avatar: req.user.avatar,
  });
});

module.exports = router;


