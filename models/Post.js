const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  text: {
    type: String,
    required: true,
  },

  // We want the person's name and avatar
  // On veut le séparer pour éviter que si la personne supprime son compte,
  // Ca ne supprime pas son post
  name: {
    type: String,
  },
  avatar: {
    type: String,
  },
  
  // Nous voulons lier le like au user 
  // pour éviter qu'un user puisse liker plus d'une fois !
  // L'idée est que le user ID s'ajouter à cet array
  // S'ils dislike, l'ID se remove
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
      },
    },
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
      },
      text: {
        type: String,
        required: true,
      },
      name: {
        type: String,
      },
      avatar: {
        type: String,
      },

      // Date du commentaire 
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  // Date pour le post
  date: {
    type: Date,
    default: Date.now,
  }
});

module.exports = Post = mongoose.model('post', PostSchema);