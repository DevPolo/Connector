const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/key')
const passport = require('passport');

// Load User model
const User = require('../../models/User')


// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res, next) => {
  res.json({msg:'users OK'})
})

// @route   POST api/users/register
// @desc    Register a user
// @access  Public
router.post('/register', (req, res, next) => {
    User
      .findOne({ email: req.body.email })
      .then(user => {

    if(user) {
      return res.status(400).json({email: 'email already exists'})
    } else {
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

      bcrypt.genSalt(10, (err, salt ) => {
        bcrypt.hash(newUser.password, salt, (err, hash) =>{
          if(err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log('error dans la sauvegarde du user :', err))
        });
      });
    }
  }); 
});

// @route   POST api/users/login
// @desc    Login user / Returning JWT
// @access  Public
router.post('/login', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  // Find user by Email
  User
    .findOne({ email })
    .then(user => {
      
      // Check s'il y a un user 
      if(!user) {
        return res.status(404).json({email: 'email not found'});
      } 

      // Check le password 
      // On passe le plain password et on le compare avec le hash pw du findOne
      bcrypt.compare(password, user.password)

      // .compare nous renvoie un true or false que nous stockons dans isMatch
      .then(isMatch => {
          
          // Si c'est vrai, alors le user passe et nous générons le token
          if(isMatch) {
            // User Matched, créer le JWT payload
            const payload = { id: user.id, name: user.name, avatar: user.avatar }

            // Sign Token, pour faire plusieurs choses :
            // le payload : ce que nous mettons dans le token, en l'occurrence, le user
            // Send a secret or key :
            // Puis une option (une expiration après 1h. plutot mettre "1d" pour un jour !
            // Puis le callback qui renvoie le token !
            jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
              res.json({sucess: true, token: 'Bearer ' + token})
            });
            
          } else {
            // Sinon, on revoie une erreur
            return res.status(400).json({password: 'password incorrect'});
          }
        });
    });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private

// en second paramètre = passport 
// nous passons jwt comme stratégie 
// nous n'utilisons pas les sessions 
// fini par le callback qui donne la réponse
// on ne peut y acceder sans token
// Nous obtenons le retour du jwt_playload qui se trouve dans passport.js
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    avatar: req.user.avatar,
  });
});

module.exports = router;


