//前端路由
var express = require('express');
var router = express.Router();
var multer = require('multer');
var department = require('../models/Department');
var projecttype = require('../models/ProjectType');
var check=require('../models/Check');
var projectshare=require('../models/ProjectShare')
var user = require('../models/user');
var storage = multer.diskStorage(
    {
      destination: function (req, file, cb) {
        cb(null, 'public/images')
      },
      filename: function (req, file, cb) {
        let mydate = date.date()
        cb(null, mydate + file.originalname)
      }
    })

var upload = multer(

    { storage: storage });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/admin/login', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.send('用户API');
});

router.post('/admin', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.send('用户API');
});

//获取部门列表
router.post('/departmentlist', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  var data=[];
  department.findAll(function (err, alldepartment) {
    console.log(alldepartment);
    res.json({status: 0, message: '获取成功', data: alldepartment})
  })
});

//获取用户列表
router.post('/userlist', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  var data=[];
  user.findAll(function (err, alluser) {
    console.log(alluser);
    res.json({status: 0, message: '获取成功', data: alluser})
  })
});

//请求项目类别
router.post('/projecttype', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  projecttype.findAll(function (err,allprojecttype){
    console.log(allprojecttype);
    res.json({status: 0, message: '获取成功', data: allprojecttype})
  })
});

//请求审核列表
router.post('/check', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  check.findAll(function (err,allcheck){
    console.log(allcheck);
    res.json({status: 0, message: '获取成功', data: allcheck})
  })
});

//请求项目公共空间
router.post('/projectshare', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  projectshare.findAll(function (err,allprojectshare){
    //console.log(allprojectshare);
    res.json({status: 0, message: '获取成功', data: allprojectshare})
  })
});


router.post("/projectshareByPO", upload.any(), function (req, res, next) {

  let po =JSON.parse(req.body.info);

  projectshare.select(po,function (err,allprojectshare) {
    res.json({status: 0, message: '获取成功', data: allprojectshare})
  })
});

router.post("/projectshareById", upload.any(), function (req, res, next) {
  let _id =req.body._id;
  projectshare.findById(_id,function (err,prjectShare) {
    res.json({status: 0, message: '获取成功', data: prjectShare})
  })
});

router.post("/projectshareBySnnumber", upload.any(), function (req, res, next) {

    let snnumber =req.body.snnumber;
    projectshare.findBySnnumber(snnumber,function (err,prjectShare) {
        res.json({status: 0, message: '获取成功', data: prjectShare})
    })
});

//请求项目状态列表
/*router.post('/projectstate', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  projectstate.findAll(function (err,allprojectstate){
    if(err)
    {
      console.log(err);
    }else{
      console.log(allprojectstate);
      res.json({status: 0, message: '获取成功', data: allprojectstate})
    }

  })
});*/

//创建项目列表
router.post("/createprojectshare",upload.single(), function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");

  let data =JSON.parse(req.body.info);
  var share = new projectshare({
    projectid:data.projectid,
    filelist:data.filelist,
    snnumber:data.snnumber,
    documentsize:data.documentsize,

  });

  share.save(function () {
    res.json({status: 0, message: "project数据库保存成功"});
  });
});
//YB 编辑项目
router.post("/editProjectShare", upload.single(), function(req, res, next) {

  let data = JSON.parse(req.body.info);
  projectshare.update(
      { _id: data._id },
      {
        $set: {
          filelist:data.filelist,
          documentsize:data.documentsize,
        }
      },
      { multi: true },
      function(err, data) {
        if (err) {
          console.error(err);
        } else {
           res.json({ status: 0, message: "更新成功" });
        }
      }
  );
});

//YB 删除项目
router.post("/delteprojectshare", upload.single(), function(req, res, next) {

  let data =JSON.parse(req.body.info);
  projectshare.findById(data._id, function(err, doc) {
    if (err) {
      console.error(err);
      res.json({ status: 1, message: "删除失败" });
    }
    try {
      doc.remove(function(err, dp) {
        console.log("after remove: " + dp);
        if (err) {
          console.error(err);
        } else {
          console.log(dp); //doc1是内存中的数据，如果误删了数据库中的数据，可以用这个找回来
          res.json({ status: 0, message: "删除成功" });
        }
      });
    }catch (e) {
      console.log(e);
    }

  });
});
module.exports = router;
