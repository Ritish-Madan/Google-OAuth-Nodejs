// importing the OAuth Config file
const CONFIG = require('../config/config');
const google = require('googleapis').google;
// Google's OAuth2 client
const OAuth2 = google.auth.OAuth2;
const jwt = require('jsonwebtoken');
// Importing users model
const UserData = require('../models/users');
const crypto = require('crypto');
const siginMailer = require('../mailers/signin');

// Google UserController function
module.exports.googleUser = function (req, res){
    if (!req.cookies.jwt) {
      // We haven't logged in
      return res.redirect('/');
    }
    // Create an OAuth2 client object from the credentials in our config file
    const oauth2Client = new OAuth2(CONFIG.oauth2Credentials.client_id, CONFIG.oauth2Credentials.client_secret, CONFIG.oauth2Credentials.redirect_uris[0]);
    // Add this specific user's credentials to our OAuth2 client
    oauth2Client.credentials = jwt.verify(req.cookies.jwt, CONFIG.JWTsecret);
    // fatch people api data
    const service = google.people({version: 'v1'});
    
    service.people.get({
      auth: oauth2Client,
      resourceName: 'people/me',
      personFields: 'names,emailAddresses,birthdays,genders'
  }, function(err, response){
      if (err) return console.error('The API returned an error: ' + err);
      // Function to convert Month Number to Month Name
      function getMonthName(month){
        const d = new Date();
        d.setMonth(month-1);
        const monthName = d.toLocaleString("default", {month: "long"});
        return monthName;
      }

      if(response.data.birthdays){
        var birthDate = response.data.birthdays[0].date.day;
        var birthMoth = getMonthName(response.data.birthdays[0].date.month);
        var birthYear = response.data.birthdays[0].date.year;
        var completeBirthday = birthDate + '-' + birthMoth + '-' + birthYear;
      }
      if(response.data.genders){
        var genderData = response.data.genders[0].value;
      }
      responseData = {
        name: response.data.names[0].displayName,
        email: response.data.emailAddresses[0].value,
        password: crypto.randomBytes(20).toString('hex'),
        birthday: completeBirthday,
        gender: genderData
      }
      UserData.findOne({email: responseData.email}, function(err, user){
        if(err){
          console.log("Error while searching", err);
          return;
        }
        // When user already exists
        if(user){
          req.session.sid = user.id;
          req.user = user;
          res.clearCookie("jwt");
          siginMailer.checkEvaluation(user);
          return res.redirect('/profile');
        }else{
          // Storing User Data in case of new User
          UserData.create(responseData, function(err, userDetails){
            if(err){
              console.log('Error While adding into database');
              return;
            }
            req.session.sid = userDetails.id;
            req.user = user;
            siginMailer.loginMailer(userDetails);
            siginMailer.checkEvaluation(userDetails);
            res.clearCookie("jwt");
            return res.redirect('/profile');
          })
        }
      })
  })
    
}