require('dotenv').config();
const express = require('express');
const path = require('path');
const env = require('./config/environment');
const logger = require('morgan')
const cookieParser = require('cookie-parser');
var cors = require('cors')
const app = express();
require('./config/view-helper')(app);
const port = 8000;
const expressLayouts = require('express-ejs-layouts'); 
const db = require('./config/mongoose');
//used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy')
const { Store } = require('express-session');
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');
const development = require('./config/environment');

const fs = require('fs');
// const https = require('https');

//setup chat server to be used with socket.io
const chatServer = require('https').createServer({
    key:fs.readFileSync('./privkey.pem'),
    cert:fs.readFileSync('./fullchain.pem'),
},app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log("Chat server is listening on port 5000")
app.use(cors());

if(env.name == 'development'){
    app.use(sassMiddleware({
        src: path.join(__dirname, env.asset_path, 'scss'),
        dest: path.join(__dirname, env.asset_path, 'css'),
        debug: true,
        outputStyle: 'extended',
        prefix: '/css'
    }));
}
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use(express.static(env.asset_path));
//make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(logger(env.morgan.mode, env.morgan.options));

app.use(expressLayouts);

//extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//set up view engine
app.set('view engine', 'ejs');
app.set('views', './views');

//mongo store is used to store the session cookies in the db
app.use(session({
    name: 'mernbook',
    //todo change secret before deploy
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create({
        mongoUrl: process.env.MERNBOOK_DB,
        mongooseConnection: db,
        autoRemove: 'disabled'
    },
    function(err){
        console.log(err || "connect-mongodb setup ok");
    }
    )
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
//flash after session cookies because it uses session cookies.
app.use(flash());
app.use(customMware.setFlash);
//use express router
app.use('/', require('./routes'));



app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server: ${err}`);
        return;
    }
    console.log(`Server up on ${port}`);
});