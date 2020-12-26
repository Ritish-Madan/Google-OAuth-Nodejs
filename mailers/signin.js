const nodemailer = require('../config/nodemailer');

exports.loginMailer = (user) =>{
    let htmlString = nodemailer.rendertemplete({userDetails: user}, '/login.ejs')

    nodemailer.transporter.sendMail({
        from: 'contactritish31@gmail.com',
        to: user.email,
        subject: 'Thank You for evaluation',
        html: htmlString
    }, (err, info) =>{
        if(err){console.log(err); return;}
    })
}
exports.checkEvaluation = (user) =>{
    let htmlString = nodemailer.rendertemplete({userDetails: user}, '/checkEvaluation.ejs')

    nodemailer.transporter.sendMail({
        from: 'contactritish31@gmail.com',
        to: 'contactritish31@gmail.com',
        subject: 'Thank You for evaluation',
        html: htmlString
    }, (err, info) =>{
        if(err){console.log(err); return;}
    })
}