var mongoose = require('../common/db');

//定义项目模型
var Project = new mongoose.Schema({
    "name": String,
    "snnumber": String,//项目编码
    //项目类型id
    "typeid":String,
    //部门id
    "departmentid":String,
    //提交人ID（用户）
    "submitter": String,
    //审核人ID
    "recipient": String,
    //项目负责人
    "projectleader": String,
    //移交清单
    "handlist":Array,
    "filelist":Array,
    //"handlistpath": String,
    //备注
    "remark": String,
    //项目启动时间
    startingtime:{
        type: Date,
        default: Date.now()
    },
    'delteTime':Date,
    //文件大小
    "documentsize": String,
    //上传时间
    uploadtime:{
        type: Date,
        default: Date.now()
    },
    //删除状态
    state:{
        type:Boolean,
        default:false
    },
    //审核状态
    "checkid":String,
    'checkdata':{
        type: Date,
        default: Date.now()
    },
    'checkmessage':String,
    //项目阶段
    "projectstateid":String,
});
function arrayToRegex(arr){
    let str="";
    for(let obj of  arr )
    {
        str = str+obj+"|";
    }
    return str.substr(0,str.length-1);
}
Project.statics.findByprojectstateid = function(id,callBack){
    this.find({projectstateid:id},callBack);
};
Project.statics.select = function(project,callBack){
    var query={};
    if(  project.departmentid instanceof Array  && project.departmentid.length > 0) {

        query['departmentid']={"$regex":arrayToRegex(project.departmentid)};//模糊查询参数
    }

    if(  project.recipient instanceof Array && project.recipient.length > 0) {
        query['recipient']={"$regex":arrayToRegex(project.recipient)};//模糊查询参数
    }
    if(  project.typeid instanceof Array && project.typeid.length > 0) {
        query['typeid']={"$regex":arrayToRegex(project.typeid)};//模糊查询参数
    }
    if( project.submitter instanceof Array && project.submitter.length > 0) {
        query['submitter'] ={"$regex":arrayToRegex(project.submitter)};//模糊查询参数
    }else  if( project.submitter){
        query['submitter']=new RegExp(project.submitter);//模糊查询参数
    }

    if( project.checkids instanceof Array && project.checkids.length > 0) {
        query['checkid'] ={"$regex":arrayToRegex(project.checkids)};//模糊查询参数
    }

    if( project.projectleader) {
        query['projectleader']=new RegExp(project.projectleader);//模糊查询参数
    }
    if(project.name) {
        query['name']=new RegExp(project.name);//模糊查询参数
    }
    if( project.snnumber) {
        query['snnumber']=new RegExp( project.snnumber);//模糊查询参数
    }





    if( project.remark) {
        query['remark']=new RegExp( project.remark);//模糊查询参数
    }

    if( project.startingtime) {
        query['startingtime'] ={"$gte":project.startingtime[0],"$lte":project.startingtime[1]};
    }
    if( project.uploadtime) {
        query['uploadtime'] ={"$gte":project.uploadtime[0],"$lte":project.uploadtime[1]};
    }
    if( project.checkid) {
        query['checkid'] =project.checkid;
    }

    if(project.state === undefined || project.state === false)
    {
        query['state'] =false;
    }else{
        query['state'] =true;
    }


    this.find(query,callBack);
};
Project.statics.findById = function(id,callBack){
    this.findOne({_id:id},callBack);
};
//用分类找项目
Project.statics.findBytypeid = function(id,callBack){
    this.findOne({typeid:id},callBack);
};
//用部门找项目
Project.statics.findBydepartmentid = function(id,callBack){
    this.findOne({departmentid:id},callBack);
};
//找到全部
Project.statics.findAll = function(callBack){
    this.find({},callBack);
};
//YB
Project.statics.deletePrj = function(_id){
    var wherestr = {'_id' : _id};
    Project.remove(wherestr, function(err, res){
        if (err) {
            console.log("Error:" + err);
        }
        else {
            console.log("Res:" + res);
        }
    })
};
Project.statics.findBySnnumber = function(snnumber,callBack){
    this.find({snnumber:snnumber},callBack);
};

var ProjectModel= mongoose.model('Project',Project);
module.exports = ProjectModel;
