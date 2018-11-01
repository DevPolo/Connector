const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res, next) => {
  res.json({msg:'users OK'})
})

// Load User model
const User = require('../../models/User')

// @route   GET api/users/register
// @desc    Register a user
// @access  Public
router.post('/register', (req, res, next) => {
  
  // L'utilisateur existe-t-il ?
  User.findOne({ email: req.body.email })

  // Après que Mongo renvoie un résultat il le stock dans la var user 
  .then(user => {

    // S'il y a déjà un email, il renvoie une erreur 400 et le json suivant
    if(user) {
      return res.status(400).json({email: 'email already exists'})
    } else {

      // Pour Gravatar
      const avatar = gravatar.url(req.body.email, {
        s: '200', // Size
        r: 'pg', // Rating
        d: 'mm', // Default
      });

      // Création d'un user
      const newUser = new User ({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
      });

      // Crypter le password 
      // On crée d'abord le salt (méthode de cryptage)
      // On appelle un callback qui rend une erreur s'il y en a ou le salt
      bcrypt.genSalt(10, (err, salt ) => {

        // On hash le password du nouveau user que nous venons de créer 
        // On lui passe le plain password puis le salt, puis un callback
        bcrypt.hash(newUser.password, salt, (err, hash) =>{

          // Le callback nous renvoie soit une err..
          if(err) throw err;

          // ..Soit le password hashé avec le salt dans la var hash
          // On remplace le plain pw par le hash et on save
          newUser.password = hash;

          newUser
            // On save le newUser avec 4 éléments du model
            .save()
            // Il nous renvoie le user en JSON
            .then(user => res.json(user))
            .catch(err => console.log('error dans la sauvegarde du user :', err))
        });
      });

    }
  }); 
})

module.exports = router;