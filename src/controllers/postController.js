const {cloudinary} = require("../cloudinaryConfig/configuration"); 
const User = require("../models/userModel");
const Post = require("../models/postModel");

/**
 * upload .
 * @param {req, res}} express, request and response
 * @returns mediaURL & message on succssful Upload
 */
// Upload posts
exports.upload = async(req, res) => {
    try{
        const fileStr = req.body.data;
        const uploadMedia = await cloudinary.uploader.upload(fileStr, {
            upload_preset: `mediaFiles`,
        }); 

        if(uploadMedia.public_id){
            const mediaFile = {};
            mediaFile["mediaURL"] = uploadMedia.public_id;
            const postId = await new Post(mediaFile).save() ;

            await User.findByIdAndUpdate({_id: req.params.userid},{ $push: { "posts": {post: postId._id} }});
            res.status(200).send({message: "Image Uploaded Successful", MediaURL: uploadMedia.public_id });
        }else{
            throw Error();
        }
    } catch(error) {
        console.log(error);
        res.status(500).send({error: "Something Went Wrong"});
    }
}

/**
 * reactOnPost .
 * @param {req, res}} express, request and response
 * @returns message on successful like and comment
 */
// like ad comments 
exports.reactOnPost = async(req, res) => {
    try{
        if(req.body.like){
            await Post.findByIdAndUpdate({_id: req.params.postid},{ $push: {"likes": {like: req.body.user } }});
        }
        if(req.body.comment){
            await Post.findByIdAndUpdate({_id: req.params.postid},{ $push: {"comments": {comment: req.body.comment, commentedBy: req.body.user} }});
        }
        res.status(200).send({message: "Update Successful"});
    } catch(error) {
        console.log(error);
        res.status(500).send({error: "Something Went Wrong"});
    }
}

/**
 * readPost .
 * @param {req, res}} express, request and response
 * @returns read post from friends ;
 */
// latest posts should display first ;
exports.readPost = async(req, res) => {
    try{
        const friendslatestPosts = await User.find({_id: req.params.userid}).populate("friends.friend").select("friends.friend").exec();
        const Posts = [];
        let postLength = 0;
        friendslatestPosts[0].friends && friendslatestPosts[0].friends.map(async(postData) => {
            const data = await Post.find({_id: postData.friend.posts[0].post});
            data && Posts.push(data[0]);
            postLength++ ;
            console.log(postLength);
            console.log(friendslatestPosts[0].friends.length);
            postLength == (friendslatestPosts[0].friends.length) ? res.status(200).send(Posts.reverse()) : null ;
        });
    } catch(error) {
        console.log(error);
        res.status(500).send({error: "Something Went Wrong"});
    }
}
