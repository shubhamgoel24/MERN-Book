const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log',{
    interval: '1d',
    path: logDirectory
});


const production = {
    name: 'production',
    asset_path: process.env.MERNBOOK_ASSET_PATH,
    session_cookie_key: process.env.MERNBOOK_SESSION_COOKIE_KEY,
    db: process.env.MERNBOOK_DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth:{
            user: process.env.MERNBOOK_GMAIL_USERNAME,
            pass: process.env.MERNBOOK_GMAIL_PASSWORD
        }
    },
    google_clientID: process.env.MERNBOOK_GOOGLE_CLIENT_ID,
    google_clientSecret: process.env.MERNBOOK_GOOGLE_CLIENT_SECRET,
    google_callbackURL: process.env.MERNBOOK_GOOGLE_CALLBACK_RURL,
    jwt_secret: process.env.MERNBOOK_JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }
}

module.exports = production;