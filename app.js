var express= require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var config= require('./config/config.js');
var ConnectMong = require('connect-mongo')(session);
var mongoose= require('mongoose').connect(config.dbURL);
var passport = require('passport');
var facebookStr = require('passport-facebook').Strategy;
var room=[];

app.set('views',path.join(__dirname,'views'));
app.engine('html',require('hogan-express'));
app.set('view engine','html');

app.use(express.static(path.join(__dirname,'public')));


app.use(cookieParser());

var env = process.env.NODE_ENV || 'development';

if(env === 'development'){
app.use(session({secret:config.sessionSecret}));

}else{
app.use(session({

    secret:config.sessionSecret,
    store  : new ConnectMong({
         mongooseConnection:mongoose.connections[0],
        url:config.dbURL,
        stringify:true

    })
}
    ));

}
/*

shu.save(function(err){
    console.log('done');
})
*/
app.use(passport.initialize());
app.use(passport.session()); 

require('./auth/passportAuth.js')(passport,facebookStr,config,mongoose);
require('./routes/routes.js')(express,app,passport,config,room);
/*
app.listen(3000,function(){

    console.log("cha cat working onport 3000");
    console.log("mode:"+env);
})
*/
app.set('port',process.env.PORT || 3000);
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
require('./socket/socket.js')(io,room);
server.listen(app.get('port'),function(){

    console.log('chat on port :'+app.get('port'));
})