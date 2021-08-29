const Post = require('../models/post');

module.exports.home = function(req,res){
    return res.render('home', {
        // title : 'home'
    });
}