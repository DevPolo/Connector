const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load validation
const validateProfileInput = require('../../validation/profile');

// Load Profile and User Models
const Profile = require('../../models/Profile');
const User = require('../../models/User');


// @route   GET api/profile
// @desc    Get current user profile
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const errors = {};

  Profile.findOne({ user: req.user.id })

    // permet de récupérer quelqeus infos de la table user : name et avatar
    .populate('user', ['name', 'avatar'])
    .then(profile => {

      if(!profile) {

        errors.noprofile = 'There is no profile for this user!';
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err))
});

// @route   POST api/profile
// @desc    Create or edit user profile
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {

  const { errors, isValid } = validateProfileInput(req.body);

  // Check validation
  if(!isValid) {
    // Return any errors with 400 status
    return res.status(400).json(errors);
  }

  // Get fields dans une variable vide
  const profileFields = {};

  // Ici, on récupère le name, l'email et le gravatar
  profileFields.user = req.user.id;

  // Si le handle est envoyé depuis le form alors, on l'envoie dans profileFields
  if(req.body.handle) profileFields.handle = req.body.handle;
  if(req.body.company) profileFields.company = req.body.company;
  if(req.body.website) profileFields.website = req.body.website;
  if(req.body.location) profileFields.location = req.body.location;
  if(req.body.bio) profileFields.bio = req.body.bio;
  if(req.body.status) profileFields.status = req.body.status;
  if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;

  // Skills - split into array
  if(typeof req.body.skills !== 'undefined') {

    // On récupère les skills et on va les séparer par une virgule 
    // Et mettre chacune des valeurs dans l'array
    profileFields.skills = req.body.skills.split(',');
  }

  // Social
  // On doit initialiser ceci pour éviter l'erreur : "doesn't exists"
  profileFields.social = {};

  // Si req.body exists, on l'intègre dans l'objet
  if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if(req.body.instagram) profileFields.social.instagram = req.body.instagram;

  // Look for the user 
  Profile.findOne({ user: req.user.id })
    .then(profile => {

      if(profile) {

        // Update
        // 1 - On dit qui on veut update (le user.id)
        // 2 - The $set operator replaces the value of a field with the specified value.
        // 3 - new: When true, returns the updated document instead of the original document.
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        )

        // On revoie le profil
        .then(profile => res.json(profile));

      } else {

        // Create
        
        // Check if the handle (l'adresse du profile) exists
        Profile.findOne({handle: profileFields.handle })
          .then(profile => {

            if(profile) {
              errors.handle = 'That handle already exists!';
              res.status(400).json(errors);
            }

            // Sinon, on save le profile et on le retourne en json
            new Profile(profileFields)
              .save()
              .then(profile => res.json(profile));
          });
      }
    });

  // Experiences et Educations seront sur une autre route !
});


module.exports = router;

