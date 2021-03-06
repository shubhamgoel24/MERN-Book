const express = require('express');
const router = express.Router();
const passport = require('passport');

const usercontroller = require('../controllers/users_controller');

router.get('/profile/:id', passport.checkAuthentication, usercontroller.profile);
router.post('/update/:id', passport.checkAuthentication, usercontroller.update);
router.get('/sign-in', usercontroller.signIn);
router.get('/sign-up', usercontroller.signUp);
router.post('/create', usercontroller.create);
//use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'}
), usercontroller.createSession);

router.get('/sign-out', usercontroller.destroySession);

router.get('/auth/google', passport.authenticate('google', {scope:['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate(
    'google',{
        // successRedirect: '/',
        failureRedirect: '/users/sign-in'
    }
), usercontroller.createSession );

router.get('/delete/:id', passport.checkAuthentication, usercontroller.delete);

module.exports = router;