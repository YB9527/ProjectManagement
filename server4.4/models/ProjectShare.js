var mongoose = require('../common/db');

//定义项目模型
var projectshare = new mongoose.Schema({

   'projectid':String,
    //文件大小
    "filelist":Array,
    "documentsize": String,
    "snnumber": String,
});

projectshare.statics.select = function(project,callBack){
    var query={};
    if(projectshare.name) {
        query['name']=new RegExp(projectshare.name);//模糊查询参数
    }
    if( projectshare.snnumber) {
        query['snnumber']=new RegExp( projectshare.snnumber);//模糊查询参数
    }
    if( projectshare.departmentid) {
        query['departmentid']=new RegExp( projectshare.departmentid);//模糊查询参数
    }
    if( projectshare.typeid) {
        query['typeid']=new RegExp( projectshare.typeid);//模糊查询参数
    }
    this.find(query,callBack);
};
projectshare.statics.findBySnnumber = function(snnumber,callBack){
    this.find({snnumber:snnumber},callBack);
};

projectshare.statics.findById = function(id,callBack){
    this.findOne({_id:id},callBack);
};

//用分类找项目
projectshare.statics.findBytypeid = function(id,callBack){
    this.findOne({typeid:id},callBack);
};
//用部门找项目
projectshare.statics.findBydepartmentid = function(id,callBack){
    this.findOne({departmentid:id},callBack);
};
//找到全部
projectshare.statics.findAll = function(callBack){
    this.find({},callBack);
};
//YB
projectshare.statics.deletePrj = function(_id){
    var wherestr = {'_id' : _id};
    ProjectShare.remove(wherestr, function(err, res){
        if (err) {
            console.log("Error:" + err);
        }
        else {
            console.log("Res:" + res);
        }
    })
};

var projectshareModel= mongoose.model('projectshare',projectshare);
module.exports = projectshareModel;
