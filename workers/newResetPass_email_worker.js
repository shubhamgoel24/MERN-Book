const queue = require('../config/kue');

const resetPassMailer = require('../mialers/resetpass_mailer');

queue.process('passResetMails', function(job, done){
    // console.log("Emails worker started", job.data);
    resetPassMailer.passReset(job.data);
    done();
});