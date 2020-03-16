var mongoose = require('../common/db');

//定义移交清单数据模型
var handList= new mongoose.Schema({
    "info": String,
});

handList.statics.findById = function(id,callBack){
    this.findOne({_id:id},callBack);
};
var handListModel= mongoose.model('handList',handList);
module.exports = handListModel;