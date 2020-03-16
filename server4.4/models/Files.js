var mongoose = require('../common/db');
//定义文件数据模式
var files=new mongoose.Schema({
    "filename":String,
    "filepath":String,
    // projectid:{
    //     type:Schema.Types.ObjectId,
    //     ref:'Projects'
    // }
});
files.statics.findById = function(id,callBack){
    this.findOne({_id:id},callBack);
};
files.statics.findAll = function(callBack){
    this.find({},callBack);
};
var filesModel= mongoose.model('files',files);
module.exports = filesModel;