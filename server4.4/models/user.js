var mongoose = require('../common/db');
//定义用户模型
var user = new mongoose.Schema({
    username: String,
    password: String,
    authority: Number,
})

user.statics.findById = function(id,callBack){
    this.findOne({_id:id},callBack);
};
user.statics.findAll = function(callBack){
    this.find({},callBack);
};
user.statics.findByUsername = function(name,callBack){
    this.find({username:name},callBack);
};
 
//登录匹配是不是拥有相同的用户名和密码
user.statics.findUserLogin = function(name,password,callBack){
    this.find({username:name,password:password},callBack);
};

//验证用户名找到用户
user.statics.findUserPassword = function(name,callBack){
    this.find({username:name},callBack);
};

var userModel= mongoose.model('user',user);
module.exports = userModel;