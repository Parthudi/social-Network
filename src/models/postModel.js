const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const postSchema = new mongoose.Schema({
    mediaURL: {
        type: String,
        required: true
       },
    likes: [{
        like : {
            type: ObjectId,
            ref: "users"
        }
    }],
    comments: [{
        comment: {
            type: String,
        },
        commentedBy: {
            type: ObjectId,
            ref: "users"
        }
    }]
  },
    {
        timestamps: true
       })

const Post = mongoose.model('posts', postSchema)

module.exports = Post