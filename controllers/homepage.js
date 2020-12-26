// importing the OAuth Config file
const CONFIG = require('../config/config');
const google = require('googleapis').google;
// Google's OAuth2 client
const OAuth2 = google.auth.OAuth2;
const UserData = require('../models/users');

// Main home Controller function
module.exports.home = function (req, res){

    if(req.session && req.session.sid){
        UserData.findById(req.session.sid, function(err, user){
            if(err){console.log('Error establishing the session',err); return;}
            if(user){
                // req.user = user;
                return res.redirect('/profile');
            }else{
                // Create an OAuth2 client object from the credentials in our config file
                const oauth2Client = new OAuth2(CONFIG.oauth2Credentials.client_id, CONFIG.oauth2Credentials.client_secret, CONFIG.oauth2Credentials.redirect_uris[0]);
                // Obtain the google login link to which we'll send our users to give us access
                const loginLink = oauth2Client.generateAuthUrl({
                    access_type: 'offline', // Indicates that we need to be able to access data continously without the user constantly giving us consent
                    scope: CONFIG.oauth2Credentials.scopes // Using the access scopes from our config file
                });
                return res.render("index", { loginLink: loginLink });
            }
        })
    }else{
        // Create an OAuth2 client object from the credentials in our config file
        const oauth2Client = new OAuth2(CONFIG.oauth2Credentials.client_id, CONFIG.oauth2Credentials.client_secret, CONFIG.oauth2Credentials.redirect_uris[0]);
        // Obtain the google login link to which we'll send our users to give us access
        const loginLink = oauth2Client.generateAuthUrl({
            access_type: 'offline', // Indicates that we need to be able to access data continously without the user constantly giving us consent
            scope: CONFIG.oauth2Credentials.scopes // Using the access scopes from our config file
        });
        return res.render("index", { loginLink: loginLink });
    }
}