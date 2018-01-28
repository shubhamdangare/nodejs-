module.exports=function(passport,facebookStr,config,mongoose){

var chatuser =  new mongoose.Schema({

    profileID: String ,
    fullname  :String ,
    profilePic : String

});

var userModel = mongoose.model('chatuser',chatuser);


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  userModel.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new facebookStr({

clientID : config.fb.appID,
clientSecret: config.fb.appSecret,
callbackURL: config.fb.callbackURL,
profileFields:['id','displayName','photos']
 
},function(accessToken,refreshToken,profile,done) {
    userModel.findOne({'profileID':profile.id},function(err,result){

        if(result){
            done(null, result);

        }else{

            var newChatUser = new userModel({
              profileID:profile.id,
              fullname:profile.displayName,
              profilePic:profile.photos[0].value || '' 
              
              

            });

            newChatUser.save(function(err){
                done(null,newChatUser);
            })
        }
    })


}) )

}