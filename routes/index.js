const express = require('express');
const router = express.Router();
const UserData = require('../models/users');

const checkAuthentication = (req, res, next) =>{
    if(req.session && req.session.sid){
        UserData.findById(req.session.sid, function(err, user){
            if(err){
                console.log('Error restoring user sesstion',err)
                return
            }
            if(user){
                req.user = user;
                return next();
            }else if(!user){
                return res.redirect('/');
            }
        })
    }else{
        return res.redirect('/');
    }
}

// Homepage Controller
const homecontroller = require('../controllers/homepage');
const callback = require('../controllers/OAuthCallback');
const userManagament = require('../controllers/manageUser');

// Routes w.r.t controllers
router.get('/', homecontroller.home);
// Google Callback route where user's token will be recieved
router.get('/auth_callback', callback.googleCallback);
// Database handle route
router.get('/userdata', userManagament.googleUser);
router.get('/profile',checkAuthentication, (req, res) => {
    return res.render('newData', {user: req.user});
})
router.get('/logout', (req, res) =>{
    res.clearCookie("auth");
    return res.redirect('/');
})
module.exports = router;