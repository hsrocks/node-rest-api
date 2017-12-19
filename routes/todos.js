var express = require("express");
var router  = express.Router();
var Campground = require("../models/todos");
var middleware = require("../middleware");
var request = require("request");
const moment = require('moment');
var User = require("../models/user");
var {Todo} = require('../models/todos');
// NEW ROUTE
router.get("/", middleware.isLoggedIn,function(req, res){
    res.render("new");
});

router.post('/',middleware.isLoggedIn,(req,res)=>{
    var d = req.body.todo.dueDate;
    // need to handle it
    if(moment(d).diff(moment(),'days')<0){
      req.flash("error", "Due Date should be greater than equal to Today's Date");
      return res.redirect("/todos/")
    }
    var name = req.body.todo.title;
   var body = req.body.todo.body;
   var dueDate = req.body.todo.dueDate;
   var label = req.body.todo.label;
   var status = req.body.todo.status;
   var author = {
       id: req.user._id,
       username: req.user.username,
       name : req.user.name
   }
   var newTodo = {title: name, body: body, dueDate: dueDate, author:author,label : label , status : status}
    Todo.create(newTodo, function(err, newTodo){
        if(err){
            res.render("new");
        } else {
            //then, redirect to the index
            res.redirect("/");
        }
    });
})

// SHOW - shows more info about one todo
router.get("/:id", function(req, res){
    //find the todo with provided ID
    Todo.findById(req.params.id,(err, foundTodo)=>{
        if(err){
            res.redirect("/");
        } else {
            //render show template with that todo
            res.render("show", {todo: foundTodo});
        }
    });
});

router.get("/:id/edit", middleware.checkUserTodo, function(req, res){
    console.log("IN EDIT!");
    //find the todo with provided ID
    Todo.findById(req.params.id, function(err, foundTodo){
        if(err){
            console.log(err);
        } else {
            //render show template with that Todo
            var newDate = moment(foundTodo.dueDate).utc().format("YYYY-MM-DD");
            res.render("edit", {todo: foundTodo,newDate:newDate});
        }
    });
});

router.put("/:id", function(req, res){
    var newData = {title: req.body.todo.title, body: req.body.todo.body, dueDate: req.body.todo.dueDate,label : req.body.todo.label , status : req.body.todo.status};
    Todo.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, todo){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/");
        }
    });
});

router.delete("/:id",middleware.checkUserTodo, function(req, res){
   //destroy blog
   Todo.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/");
       } else {
           res.redirect("/");
       }
   })
});

module.exports = router;
