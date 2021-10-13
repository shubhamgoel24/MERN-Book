const passport = require('passport');
const googleSTrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

passport.use(new googleSTrategy({
        clientID: "802700631842-km300q8sruld4r46suiusttquo3diga5.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:8000/users/auth/google/callback"
    },

    function(accessToken, refreshToken, profile, done){
        User.findOne({email: profile.emails[0].value}).exec(function(err,user){
            if(err){console.log('error in google strategy ',err); return;}
            

            if(user){
                return done(null,user);
            }else{
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }),function(err,user){
                    if(err){console.log('error in creating user in google strategy ',err); return;}

                    return done(null,user);                    
                };
            }
        });
    }
));

module.exports = passport;