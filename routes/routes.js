module.exports=function(express,app,passport,config,room){
    
     var router = express.Router();

     router.get('/',function(req,res,next){

        res.render('index',{title:"welcome to my app"}); 
    })


    function securePages(req,res,next){

        if(req.isAuthenticated()){
            next();

        }else {
            res.redirect('/');
        }
    }

     router.get('/auth/facebook',passport.authenticate('facebook'));
     
     router.get('/auth/facebook/callback',passport.authenticate('facebook',{

        successRedirect:'/chatroom',
        failurRedirect:'/'
     }));    

     router.get('/chatroom',securePages,function(req,res,next){

        res.render('chatroom',{title:"welcome to my app",user:req.user,config:config}); 
    })



    router.get('/room/:id',securePages, function(req, res, next){
        
    var room_name = findTitle(req.params.id); 
     res.render('room', {
      title: 'Chatroom',
      user:req.user,
      room_number:req.params.id,
      room_name:room_name,
      config:config
    });
  });


   function findTitle(room_id){
    var n = 0;
    while(n < room.length){
      if(room[n].room_number == room_id){
        return room[n].room_name;
        break;
      } else {
        n++;
        continue;
      }
    }
    }
    router.get('/logout',function(req,res,next){

        req.logout();
        
        res.redirect('/');
    })
    /*
     router.get('/setcolor',function(req,res,next){
        req.session.favClour = "blue";
        res.send('favClour');
    })
    
     router.get('/getcolor',function(req,res,next){

        res.send('favClour' +req.session.favClour); 
    }) */

    app.use('/',router);      
}
