const User = require('../models/user');
const Reset = require('../models/resetpass');
const crypto = require('crypto');
// const queue = require('../config/kue');
const resetPassEmailWorker = require('../workers/newResetPass_email_worker');
const resetPassMailer = require('../mialers/resetpass_mailer');


module.exports.home = async function(req,res){
    try{
        return res.render('resetpass_home');
    }catch(err){
        console.log("Error:", err);
        return;
    }
}

module.exports.passmail= async function(req,res){
    try{
        let user = await User.findOne({email:req.body.email});
        if(user){
            let resetpass;
            resetpass = await Reset.findOne({user:user});
            if(resetpass){
                // console.log("Already ",resetpass);
            }
            else{
                resetpass = await Reset.create({
                    user:user,
                    accessToken:crypto.randomBytes(30).toString('hex'),
                    isValid: true
                });
                resetpass.save();
                // console.log(resetpass);
            }
            resetpass = await resetpass.populate('user', 'name email');
            
            // let job = queue.create('passResetMails', resetpass).save(function(err){
            //     if(err){
            //         console.log("Error in creating queue", err);
            //         return;
            //     }
            //     // console.log(job.id);
            // });
            resetPassMailer.passReset(resetpass);


            req.flash('success', 'Password Reset Mail Sent');
            
            res.redirect('/users/sign-in');
        }
        else{
            req.flash('success', 'No User Found');
            res.redirect('back');
        }
    }catch(err){
        console.log("Error:", err);
        return;
    }
}

module.exports.resetForm = async function(req,res){
    try{
        let data = await Reset.findOne({accessToken:req.params.token});
        if(data){
            data = await data.populate('user', 'name');
            return res.render('newPassForm', {
                data : data
            });
        }else{
            req.flash('error', 'Invalid Reset Link');
            res.redirect('/users/sign-in');
        }
    }catch{
        console.log("Error:", err);
        return;
    }
}

module.exports.submit = async function(req,res){
    try{
        if(req.body.password != req.body.confirm_password){
            req.flash('error', 'Password Mismatch');
            return res.redirect('back');
        }
        let data = await Reset.findOne({accessToken: req.body.token});
        if(data){
            let user = await User.findById(data.user);
            if(user){
                user.password = req.body.password;
                user.save();
                data.remove();
                req.flash('success', 'Password Updated Sucessfully');
                res.redirect('/users/sign-in');
            }
            else{
                req.flash('error', 'User Not Found');
                res.redirect('/users/sign-up');
            }
        }
        else{
            req.flash('error', 'Invalid AccessToken');
            res.redirect('/users/sign-in');
        }

    }catch{
        console.log("Error:", err);
        return;
    }
}