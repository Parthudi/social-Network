const express = require('express')
const route = new express.Router()
const {signupUser, loginUser, logoutUser, findUserId, userListingAccordToLocation, remove, addFriends} = require('../controllers/userControllers')


//Routes
/**
 * Signup Route.
 */
route.post('/signup' , signupUser)

/**
 * Login Route.
 */
route.post('/login', loginUser)

/**
 *  Get Suggestion According To GeoLocation.
 */
route.get('/user/:userid', userListingAccordToLocation)

/**
 * delete a user.
 */
route.delete('/delete/:userid',remove)

/**
 *  add friends.
 */
route.patch('/addfriend/:userid', addFriends)


module.exports = route