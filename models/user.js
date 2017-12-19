var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: {
    type : String,
    require : true,
    minlength : 6,
    unique : true
  },
    password: {
    type : String,
    require : true,
    minlength : 6,
  },
    name : {
      type : String,
      require : true,
      minlength : 1
    },
    age : {
      type : Number,
      require : true,
    },
    gender : {
      type : String,
      require : true,
    }
});

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema);
