const nodeMialer = require('../config/nodemailer');

//this is another way of exporting a method
exports.passReset = (data) => {
    let htmlString = nodeMialer.renderTemplate({data: data}, '/passReset/newPassword_Reset.ejs');
    
    nodeMialer.transporter.sendMail({
        from: 'support@menbook.com',
        to: data.user.email,
        subject: "Password Reset",
        html: htmlString
    }, (err,info) => {
        if(err){
            console.log('Error in sending mail ',err);
            return;
        }

        // console.log('Mail sent ', info);
        return;
    } );
}