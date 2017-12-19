const express = require('express');
const app = express();
const ejs = require('ejs');
const moment = require('moment');
var validator = require('validator');
var {mongoose} =require('./db/mongoose'),
mongoose    = require("mongoose"),
passport    = require("passport"),
cookieParser = require("cookie-parser"),
LocalStrategy = require("passport-local"),
flash        = require("connect-flash"),
session = require("express-session"),
methodOverride = require("method-override"),
User = require("./models/user");
var {Todo} = require('./models/todos');
const bodyParser = require('body-parser');

//requiring routes
var indexRoutes = require("./routes/index"),
todosRoutes  = require("./routes/todos");
mongoose.connect("mongodb://localhost/node_todo_clevero");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Clevero Todo!",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});

app.use("/", indexRoutes);
app.use("/todos", todosRoutes);

var port = 3000 || process.env.PORT
app.listen(port,()=>{
  console.log(`App started on port ${port}`);
})
