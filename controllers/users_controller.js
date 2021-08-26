const User = require('../models/user');

module.exports.profile = function(req, res){
    if(req.cookies.user_id){
        User.findById(req.cookies.user_id, function(err,user){
            if(err){
                console.log("Error in finding id for cookie");
                return;
            }
            if(user){
                return res.render('user_profile', {
                    title: 'User Profile',
                    user : user
                });
            }
            return res.redirect('/users/sign-in');
        });
    }
    else{
        return res.redirect('/users/sign-in');
    }
}

//render sign up page
module.exports.signUp = function(req, res){
    return res.render('user_sign_up', {
        title: 'Sign Up'
    })
}
//render sign in page 
module.exports.signIn = function(req, res){
    return res.render('user_sign_in', {
        title: 'Sign In'
    })
}

//get sign up data
module.exports.create = function(req, res){
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }
    User.findOne({email: req.body.email}, function(err,user){
        if(err){
            console.log("Error in finding user in sign up");
            return;
        }
        if(!user){
            User.create(req.body, function(err,user){
                if(err){
                    console.log("Error in creating user");
                    return;
                }
                return res.redirect('/users/sign-in');
            });
        }
        else{
            return res.redirect('back');
        }
    });
}
module.exports.createSession = function(req, res){
    //find user
    User.findOne({email: req.body.email}, function(err,user){
        if(err){
            console.log("Error in finding user in sign up");
            return;
        }
        //user found
        if(user){
            if(user.password != req.body.password){
            //password dont match
                return res.redirect('back');
            }
            //handle session creation
            res.cookie('user_id',user.id);
            return res.redirect('/users/profile');
        }
        //user not found   
        else{
            return res.redirect('back');
        }
    });
}