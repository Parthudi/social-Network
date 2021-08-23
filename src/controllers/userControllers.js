const User = require('../models/userModel')
const request = require('postman-request');

/**
 * signup User.
 * @param {req, res}} express, request and response
 * @returns confirmation of user signup
 */
exports.signupUser = async (req, res) => {
    try{     
        const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' +encodeURIComponent(req.body.city)+ '.json?access_token=pk.eyJ1IjoicGFydGhwYXJtYXJodW1hbiIsImEiOiJja2FjMDd6YjgwaG83MnRvOHEzM213ZGpxIn0.tQ4hOMqBQMqVskIXAl6pGQ&limit=1';
        request({ url, json: true}, async(error, georesponse) => {
            req.body.latitude = georesponse.body.features[0].center[1] ,
            req.body.longitude = georesponse.body.features[0].center[0]

            const user = new User(req.body);
            await user.save()
            res.status(201).json({'user ' : user})
        });
      }catch(error){   
          console.log(error);
        if(!req.body.name) {
            res.status(401).json({error: 'Please enter Name'})
        }
        if( 4>req.body.name.length || req.body.name.length>20) {
            res.status(401).json({error: "Name must be 5 to 20 Characters"})
        }
        if(!req.body.email) {
            res.status(401).json({error: 'Please enter Email'})
        }
        else{
            res.status(401).json({error: "Fill the details Correctly"})
        }
      }
    } 

/**
 * login User.
 * @param {req, res}} express, request and response
 * @returns users information on successful login 
 */
exports.loginUser = async (req, res) => {
    try {
        const user = await User.findUserCredientials(req.body.email)
        return res.status(200).json({user})
    }catch(error){
        if(!req.body.email) {
            res.status(401).json({error: 'Please enter Email'})
        }
        else{
            res.status(401).json({error: error.message})
        }
    }
}

/**
 * logout User.
 * @param {req, res}} express, request and response
 * @returns signout message on successful logout 
 */
exports.logoutUser = async (req, res) => {
    try{      
        await req.user.save() 
        res.status(200).json({message: 'SignOut Sucessfull' })
    }catch(error){
        res.status(401).send({error : error.message})
    }
}

/**
 * logout User.
 * @param {req, res}} express, request and response
 * @returns users in that location
 */
// show sugested Users According to same geoLocation
exports.userListingAccordToLocation = async(req, res) => {
    try{
        let latitude = 0;
        let longitude = 0;
        await User.findById(req.params.userid).then(user => {
            latitude = user.latitude;
            longitude = user.longitude;
        });

        const suggestedUsers = await User.find({ _id: {$ne: req.params.userid} , latitude , longitude });
        console.log(suggestedUsers);
        res.status(200).send(suggestedUsers);
    } catch(error) {
        res.status(401).send({error: error.message})
    }
}

/**
 * delete User.
 * @param {req, res}} express, request and response
 * @returns user on successful delete
 */
exports.remove = async(req, res) => {
    try{
        const user = await req.user.remove()
        await user.save()
        res.status(201).send(user)
    } catch(error) {
        res.status(401).send({error: error.message})
    }
}

/**
 * addFriends .
 * @param {req, res}} express, request and response
 * @returns message on successful addFriends
 */
exports.addFriends = async(req, res) => {
    try{
        // save friends Id inside logged in user Id ;
        const loggedInUserExists = await User.findOne({"friends.friend": req.body.friend});
        if(!loggedInUserExists){
            await User.findByIdAndUpdate({_id: req.params.userid},{ $push: { "friends": {friend: req.body.friend} }});
            await User.findByIdAndUpdate({_id: req.body.friend },{ $push: { "friends": {friend: req.params.userid} }});
        }else{
            res.status(401).send({message: "You Are Already Friends"});
        }
        res.status(201).send({message: "You Are Now Friends && Can See Each Other's TimeLine"});
    } catch(error) {
        res.status(401).send({error: error.message})
    }
}

