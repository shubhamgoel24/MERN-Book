const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req,res){
    try{
        //populate the user of each post
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path:'comments',
            populate:{
                path: 'user'
            },
            populate:{
                path: 'likes'
            }
        }).populate('likes');
        let users = await User.find({});
        if(req.isAuthenticated()){
            let friends = await User.findById(req.user.id).populate('friendList', 'name');
            return res.render('home', {
                posts : posts,
                all_users : users,
                friends : friends.friendList
            });
        }else{
            return res.render('home', {
                posts : posts,
                all_users : users
            });
        }
    }catch(err){
        console.log("Error:", err);
        return;
    }     
}