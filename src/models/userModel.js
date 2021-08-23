const mongoose = require('mongoose')
const validator = require('validator')
const {ObjectId} = mongoose.Schema

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        minlength: 4,
        maxlength: 20
       },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error({error: 'Email Invalid'})
              }
            }
          },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    posts: [{
        post: {
            type: ObjectId,
            ref: "posts"
        }
    }],
    friends: [{
        friend: {
            type: ObjectId,   
            ref: "users"
            }
        }],
    },
    {
        timestamps: true
       })


userSchema.statics.findUserCredientials = async(email, password) => {
    const user = await User.findOne({email})

    if(!user) {
        throw new Error ('Email Invalid')
     }
     return user
}

const User = mongoose.model('users', userSchema)

module.exports = User