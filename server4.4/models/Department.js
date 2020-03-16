var mongoose = require('../common/db');
//定义部门数据模式
var department = new mongoose.Schema({
    "departmentname":String
});
 
department.statics.findById = function(id,callBack){
    this.findOne({_id:id},callBack);
};
department.statics.findAll = function(callBack){
    this.find({},callBack);
};
department.statics.findBydepartmentname = function(name,callBack){
    this.find({departmentname:name},callBack);
};
var departmentModel = mongoose.model('department',department);
module.exports = departmentModel;