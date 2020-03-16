var mongoose = require('../common/db');

//定义项目类型数据模式
var projectType = new mongoose.Schema({
    "typename": String,
    "projectstatelist":Array,
});

projectType.statics.findById = function(id,callBack){
    this.findOne({_id:id},callBack);
};
projectType.statics.findAll = function(callBack){
    this.find({},callBack);
};
projectType.statics.findBytypename = function(name,callBack){
    this.find({typename:name},callBack);
};


var projectTypeModel = mongoose.model('projectType',projectType);
module.exports = projectTypeModel;