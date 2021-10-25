const express = require('express');
const cookieParser = require('cookie-parser');
var cors = require('cors')
const app = express();
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

//setup chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log("Chat server is listening on port 5000")

app.use(cors());

app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: false,
    outputStyle: 'extended',
    prefix: '/css'
}));

app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use(express.static('./assets'));
//make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(expressLayouts);

//extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//set up view engine
app.set('view engine', 'ejs');
app.set('views', './views');

//mongo store is used to store the session cookies in the db
app.use(session({
    name: 'codial',
    //todo change secret before deploy
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017',
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