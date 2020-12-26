const nodemailer = require('nodemailer');
const ejs = require('ejs')
const path = require('path');
// Importing enviroment for production mode

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
 });
 let rendertemplete = (data, relativePath) =>{
     let mailHTML;
     ejs.renderFile(
         path.join(__dirname, '../views/mailers', relativePath),
         data,
         function(err, template){
            if(err){return console.log('Error in rendering Template');}
            mailHTML = template;
         }
     )
     return mailHTML;
 }

module.exports = {
    transporter: transporter,
    rendertemplete: rendertemplete
}