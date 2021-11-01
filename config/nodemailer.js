const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const Mail = require('nodemailer/lib/mailer');
const env = require('./environment');


let transporter = nodemailer.createTransport(env.smtp);

let renderTemplate = (data,relativePath) => {
    let mainHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function(err,template){
            if(err){console.log("Error in rendering mailer template ",err ); return;}
            mainHTML = template;
        }
    )
    return mainHTML;
}

module.exports = {
    transporter : transporter,
    renderTemplate : renderTemplate
}