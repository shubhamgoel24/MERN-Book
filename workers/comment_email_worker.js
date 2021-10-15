const queue = require('../config/kue');

const commentsMailer = require('../mialers/comments_mailer');

queue.process('emails', function(job, done){
    // console.log("Emails worker started", job.data);
    commentsMailer.newComment(job.data);
    done();
});