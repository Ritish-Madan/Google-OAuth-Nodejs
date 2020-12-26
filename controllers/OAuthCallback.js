// Importing JWT for access Token ecryption in cookies
const jwt = require('jsonwebtoken');
// importing the OAuth Config file
const CONFIG = require('../config/config');
const google = require('googleapis').google;
// Google's OAuth2 client
const OAuth2 = google.auth.OAuth2;

module.exports.googleCallback = function (req, res) {
    // Create an OAuth2 client object from the credentials in our config file
    const oauth2Client = new OAuth2(CONFIG.oauth2Credentials.client_id, CONFIG.oauth2Credentials.client_secret, CONFIG.oauth2Credentials.redirect_uris[0]);
    if (req.query.error) {
        // The user did not give us permission.
        return res.redirect('/');
    } else {
        oauth2Client.getToken(req.query.code, function(err, token) {
        if (err)
            return res.redirect('/');
        
        // Store the credentials given by google into a jsonwebtoken in a cookie called 'jwt'
        res.cookie('jwt', jwt.sign(token, CONFIG.JWTsecret));
        return res.redirect('/userdata');
      });
    }
}