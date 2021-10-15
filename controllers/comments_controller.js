const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');
const commentEmailWorker = require('../workers/comment_email_worker');
const commentMailer = require('../mialers/comments_mailer'); 
const queue = require('../config/kue');
const { Job } = require('kue');

module.exports.create= async function(req,res){
    try{
        let post = await Post.findById(req.body.post);
        if(post){
            let comment = await Comment.create({
                content:req.body.content,
                post:req.body.post,
                user: req.user._id
            });
            post.comments.unshift(comment);
            post.save();
            comment = await comment.populate('user', 'name email');
            // commentMailer.newComment(comment);
            let job = queue.create('emails', comment).save(function(err){
                if(err){
                    console.log("Error in creating queue", err);
                    return;
                }
                // console.log(job.id);
            })
            if(req.xhr){
                return res.status(200).json({
                    data: {
                        comment : comment
                    },
                    message: "Comment Created!"
                }); 
            }
            req.flash('success', 'Comment published!');
            
            res.redirect('/');
        }
    }catch(err){
        console.log("Error:", err);
        return;
    }
    
}

module.exports.destroy = async function(req,res){
    try{
        let comment = await Comment.findById(req.params.id);
        if(comment.user == req.user.id){
            let postId = comment.post;
            comment.remove();
            let post = await Post.findByIdAndUpdate(postId, {$pull: {comment: req.params.id}});
            if(req.xhr){
                return res.status(200).json({
                    data:{
                        comment_id:req.params.id
                    },
                    message: "Comment deleted sucessfully"
                })
            }
            return res.redirect(`back`);
        }
        else{
            return res.redirect(`back`);
        }
    }catch{
        console.log("Error:", err);
        return;
    }
}