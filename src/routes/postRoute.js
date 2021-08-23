const express = require('express')
const route = new express.Router()
const { upload ,reactOnPost, readPost} = require('../controllers/postController');


//Routes

/**
 *  upload media files to cloudinary
 */
route.post('/upload/:userid', upload)

/**
 *  likes & comment on post
 */
route.get('/upload/react/:postid', reactOnPost)

/**
 *  fetch post in descending order
 */
route.get('/read/:userid', readPost)

module.exports = route