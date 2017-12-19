var {Todo} = require("../models/todos");

module.exports = {
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "You must be signed in to do that!");
        res.redirect("/login");
    },
    checkUserTodo: function(req, res, next){

        if(req.isAuthenticated()){
            Todo.findById(req.params.id, function(err, todo){
              if(err || !todo) {
                  req.flash("error", "You don't have permission to do that!");
                  res.redirect("/");
              }
              else{
               if(todo.author.id.equals(req.user._id)){
                   next();
               }
               else{
                 req.flash("error", "You don't have permission to do that!");
                 res.redirect("/");
               }
             }
            });
        } else {
            req.flash("error", "You need to be signed in to do that!");
            res.redirect("/login");
        }
    }
}
