var mongoose = require('mongoose');

mongoose.Promise =global.Promise;

mongoose.connect('mongodb://localhost/node_todo_clevero',{
  useMongoClient :true
});

module.exports={
  mongoose
};
