var mongoose = require('../common/db');
//定义审核状态数据模式
var check = new mongoose.Schema({
    "checkid":String,
    "checkname":String
});
 
check.statics.findById = function(id,callBack){
    this.findOne({_id:id},callBack);
};
check.statics.findAll = function(callBack){
    this.find({},callBack);
};
check.statics.findBycheckname = function(name,callBack){
    this.find({checkname:name},callBack);
};
var checkModel = mongoose.model('check',check);
module.exports = checkModel;