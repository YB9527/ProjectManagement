var mongoose = require('mongoose');
var url = 'mongodb://localhost/doc'
mongoose.connect(url, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.on('disconnected',()=>{  
    console.log("mongoDB断开连接");  
  });
db.once('open', function (callback) {
    console.log("数据库成功连接");
});
module.exports = mongoose;