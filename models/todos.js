const mongoose = require('mongoose');
var todoSchema = new mongoose.Schema(
  {
    title : {
      type : String,
      required : true,
      minlength :1,
    },
    body :{
      type : String,
      required : true,
      minlength :1,
    },
    createdAt :{
      type : Date,
      default : Date.now
    },
    dueDate :{
      type : Date,
      default : Date.now
    },
  author: {
   id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
   },
   username: String,
   name : String
},
  label: {
    type : String,
    required : true,
    default : "Personal"
  },
  status: {
    type : String,
    required : true,
  }
});
var Todo = mongoose.model('Todo',todoSchema);

module.exports = {Todo};
