var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var {Todo} = require("../models/todos");
const moment = require('moment');
var middleware = require("../middleware");
//root route
router.get('/',(req,res)=>{
  Todo.find({}).sort('dueDate').exec(function(err, todos){
       if(err){
           console.log("ERROR!");
       } else {
         var todoL =[];
         for(var i=0;i<todos.length;i++){
           if(moment(todos[i].dueDate).diff(moment(),'days')>=0){
             todoL.push(todos[i])
           }
         }
          res.render("index", {todos: todoL});
       }
   });
});

router.get('/author',(req,res)=>{
  res.render('author');
})
// show register form
router.get("/register", function(req, res){
   res.render("user/register");
});

//handle sign up logic
router.post("/register", function(req, res){

    var newUser = new User({username: req.body.username,name : req.body.name,age : req.body.age,gender: req.body.gender});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.name);
           res.redirect("/");
        });
    });
});


//show login form
router.get("/login", function(req, res){
   res.render("user/login");
});

//handling login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/",
        failureRedirect: "user/login",
        failureFlash : true
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Bye !! See You Again");
   res.redirect("/");
});

router.get("/user/:id",middleware.isLoggedIn, function(req, res){
   res.render('user_profile',{id: req.params.id})
});

router.get("/user/:id/todo",middleware.isLoggedIn, function(req, res){
  User.findById(req.params.id, function(err, foundUser){
      if(err){
          console.log(err);
      } else {
        var user={
          id : foundUser._id,
          username : foundUser.username,
          name : foundUser.name
                }
        Todo.find({author : user}).sort('dueDate').exec(function(err, todos){
             if(err){
                 console.log("ERROR!");
             } else {
                res.render("index", {todos: todos});
             }
         })
      }
  });
});

router.get("/user/:id/profile", middleware.isLoggedIn,function(req, res){
  User.findById(req.params.id, function(err, foundUser){
      if(err){
          console.log(err);
      } else {
      }
      res.render("user/profile",{user : foundUser})
  });
});

module.exports = router;
