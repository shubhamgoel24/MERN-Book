const User = require('../models/user');
const fs = require('fs');
const path = require('path');

module.exports.profile = async function(req, res){
    try{
        let user = await User.findById(req.params.id);
        if(user){
            return res.render('user_profile', {
                // title: 'User Profile'
                profile_user : user
            });
        }
    }catch(err){
        if(err){
            console.log(err);
        }
        req.flash('error', 'Invalid Link');
        return res.redirect('/');
    }
}

module.exports.update = async function(req, res){
    // if(req.user.id == req.params.id){
    //     User.findByIdAndUpdate(req.params.id, req.body, function(err,user){
    //         return res.redirect('back');
    //     });
    // }
    // else{
    //     return res.status(401).send('Unauthorized');
    // }
    if(req.user.id == req.params.id){
        try{
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if(err){
                    console.log("***Multer Error:" , err);
                }
                user.name = req.body.name;
                user.email = req.body.email;
                if(req.file){
                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }
                    //this is saving the path of uploaded file to the avatar field in the user 
                    user.avatar = User.avatarPath + "/" + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });
        }catch(err){
            req.flash('error', err);
            return res.redirect('back');    
        }
    }else{
        req.flash('error', 'Unauthorized');
        return res.status(401).send('Unauthorized');
    }
}

//render sign up page
module.exports.signUp = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    return res.render('user_sign_up', {
        // title: 'Sign Up'
    })
}
//render sign in page 
module.exports.signIn = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    return res.render('user_sign_in', {
        // title: 'Sign In'
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
            req.flash('error', 'User already exists !');
            return res.redirect('back');
        }
    });
}
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in Sucessfully');
    return res.redirect('/');
}
module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success', 'Logged out Sucessfully');
    return res.redirect('/');
}
