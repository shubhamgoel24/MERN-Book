const User = require('../models/user');
const Friendship = require('../models/friendship');

module.exports.newrequest = async function(req,res){
    try{
        let already = await Friendship.findOne({ $or: [ {from_user:req.user._id, to_user: req.params.reqfor}, {from_user:req.params.reqfor, to_user: req.user._id} ]});
        if(already){
            req.flash('error', 'Already Friends');
            return res.status(400).json({
                message: "Already Friends"
            });
        }
    
        let newfriend = await Friendship.create({
            from_user: req.user._id, 
            to_user: req.params.reqfor
        });
        let fornew = await User.findById(req.params.reqfor);
        req.user.friendships.push(newfriend);
        req.user.friendList.push(fornew);
        req.user.save();

        fornew.friendships.push(newfriend);
        fornew.friendList.push(req.user);
        fornew.save();
        
        return res.status(200).json({
            data: {
                delete: false,
                id : req.params.reqfor
            },
            message: "Friend Added Sucessfully !"
        }); 
    }catch(err){
        if(err){
            console.log(err);
            return;
        }
    }
}

module.exports.deletefre = async function(req,res){
    try{
        let link = await Friendship.findOne({ $or: [ {from_user:req.user._id, to_user: req.params.reqfor}, {from_user:req.params.reqfor, to_user: req.user._id} ]});
        if(!link){
            return res.status(400).json({
                message: "Not Friends"
            });
        }else{
            let fornew = await User.findById(req.params.reqfor);
            req.user.friendships.pull(link);
            req.user.friendList.pull(fornew);
            req.user.save();
            fornew.friendships.pull(link);
            fornew.friendList.pull(req.user);
            fornew.save();
            link.remove();

            return res.status(200).json({
                data: {
                    delete: true,
                    id : req.params.reqfor
                },
                message: "Friend Removed Sucessfully !"
            });
        }

        
    }catch(err){
        if(err){
            console.log(err);
            return;
        }
    }
}
