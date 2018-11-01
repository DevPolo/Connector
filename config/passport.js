// Ces deux lignes servent à extraire le payload créé avec la route login
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const mongoose = require('mongoose');
const User = mongoose.model('users');
const keys = require('../config/key');

const opts = {};

// Nous spécifions qu'on utilise un BearerToken
// Ce qui veut dire qu'il y a une String 'Bearer ' avant le token
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

// On doit ajouter notre secretOrKey depuis key.js pour décoder
opts.secretOrKey = keys.secretOrKey;

module.exports = (passport) => {

  // On passe une nouvelle stratégie avec nos options 
  // suivi d'un callback qui renverra le payload 
  // Le payload comprendra nos users datas
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then(user => {
          if(user){
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => console.log('err :', err)); 
    })
  );
}

// Cf. documentation or Section 3 / Passport JWT Auth Strategy


