//档案路由
var express = require("express");
var router = express.Router();
var department = require("../models/Department");
var multer = require("multer");
var upload = multer({dest: 'upload_tmp/'});
//YB 用id获取项目列表
router.post("/findAll",upload.single(),  function (req, res, next) {

    department.findAll( function(err, project) {
        res.json({status: 0, data: project});
    })

});
module.exports = router;
