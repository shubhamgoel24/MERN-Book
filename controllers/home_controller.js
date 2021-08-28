const { Cookie } = require("express-session");
const passport = require("passport");

module.exports.home = function(req,res){
    return res.render('home', {
        // title : 'home'
    });
}

module.exports.createPost = function(req,res){
    console.log(Cookie.codial);
}