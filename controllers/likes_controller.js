const Like = require("../models/likes");
const Comment = require("../models/comment");
const Post = require('../models/post');

module.exports.toggleLike = async function(req,res){
    try{
        let likeable;
        let deleted = false;

        if(req.query.type == 'Post'){
            likeable = await Post.findById(req.query.id).populate('likes');
        }else{
            likeable = await Comment.findById(req.query.id).populate('likes');
        }

        //check if a like already exists
        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        });

        //if like exists delete it
        if(existingLike){
            likeable.likes.pull(existingLike._id);
            likeable.save();

            existingLike.remove();
            deleted = true;
        }else{
            //else delete the like
            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type
            });

            likeable.likes.push(newLike._id);
            likeable.save();
        }

        return res.status(200).json({
            message: "Request Sucessfull",
            data:{
                deleted: deleted
            }
        })
         

    }catch(err){
        if(err){
            console.log("Error in toggleLike ",err);
        }
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}
