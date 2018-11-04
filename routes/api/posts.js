const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load input validation
const validatePostInput = require('../../validation/post');

// Load Post et Porfile models
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');


// @route   GET api/posts
// @desc    Get all posts
// @access  Public
router.get('/', (req, res, next) => {
  
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => {
      errors.nopostfound = 'No posts found';
      res.status(404).json(errors);
    });
});


// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Public
router.get('/:id', (req, res, next) => {
  const errors = {};

  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => {
      errors.nopostfound = 'No post found with this ID';
      res.status(404).json(errors);
    });
});


// @route   POST api/posts
// @desc    Create posts
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {

  // Are inputs valid?
  const { errors, isValid } = validatePostInput(req.body);
  if(!isValid) {
    return res.status(400).json(errors);
  }

  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id,
  });

  newPost.save()
    .then(post => res.json(post))
});


// @route   DELETE api/posts/:id
// @desc    Delete one post
// @access  Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const errors = {};

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {

          // Check for post owner
          if(post.user.toString() !== req.user.id) {
            errors.notauthorized = 'User not authorized'
            return res.status(401).json(errors);
          }

          // Delete
          post.remove()
            .then(() => res.json({ sucess: true }));
        })
        .catch(err => {
          errors.postnotfound = 'Post not found';
          res.status(404). json(errors);
        });
    });
});


// @route   POST api/posts/like/:id
// @desc    Like post
// @access  Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const errors = {};

  Profile.findOne({ user: req.user.id })
  .then(profile => {

    Post.findById(req.params.id)
      .then(post => {

        // Check si le user a déjà liké le post
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
          errors.alreadyliked = 'User already liked this post';
          return res.status(400).json({ errors })
        }

        // Add user id to likes array
        post.likes.unshift({ user: req.user.id });

        post.save().then(post => res.json(post));
      })
      .catch(err => {
        errors.postnotfound = 'Post not found';
        res.status(404). json(errors);
      });
  });
});


// @route   POST api/posts/like/:id
// @desc    Like post
// @access  Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const errors = {};

  Profile.findOne({ user: req.user.id })
  .then(profile => {

    Post.findById(req.params.id)
      .then(post => {

        // Check si le user a déjà liké le post
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
          errors.alreadyliked = 'User already liked this post';
          return res.status(400).json({ errors })
        }

        // Add user id to likes array
        post.likes.unshift({ user: req.user.id });

        post.save().then(post => res.json(post));
      })
      .catch(err => {
        errors.postnotfound = 'Post not found';
        res.status(404). json(errors);
      });
  });
});


// @route   POST api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const errors = {};

  Profile.findOne({ user: req.user.id })
  .then(profile => {

    Post.findById(req.params.id)
      .then(post => {

        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
          errors.notliked = 'User have not yet liked this post';
          return res.status(400).json({ errors })
        }

        // Get remove index
        const removeIndex = post.likes
          .map(item => item.user.toString())
          .indexOf(req.user.id);

        // Splice out of array
        post.likes.splice(removeIndex, 1);
        
        // Save 
        post.save()
          .then(post => res.json(post));
      })
      .catch(err => {
        errors.postnotfound = 'Post not found';
        res.status(404). json(errors);
      });
  });
});


// @route   POST api/posts/comment/:id
// @desc    Add a comment
// @access  Private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const { errors, isValid } = validatePostInput(req.body);

  // Check validation
  if(!isValid) {
    res.status(400).json(errors);
  }

  Post.findById(req.params.id)
    .then(post => {
      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id,
      }

      // Add to comments array
      post.comments.unshift(newComment);

      // Save
      post.save()
        .then(post => {
          res.json(post);
        });
    })
    .catch(err => {
      errors.postnotfound = 'No post found';
      res.status(404).json(errors);
    });
});


// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete a comment from post
// @access  Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const errors = {};

  Post.findById(req.params.id)
    .then(post => {

      // Check if the comment exists
      if(post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
        errors.commentnotexists = 'Comment does not exists';
        res.status(404).json(errors);
      }

      // Get remove index
      const removeIndex = post.comments
      .map(item => item._id.toString())
      .indexOf(req.params.comment_id);

      // Splice comment out of array
      post.comments.splice(removeIndex, 1);

      // Save
      post.save().then(post => res.json(post));
    })
    .catch(err => {
      errors.postnotfound = 'No post found';
      res.status(404).json(errors);
    });
});

module.exports = router;



