//档案路由
var express = require("express");
var router = express.Router();
var multer = require("multer");
var department = require("../models/Department");
var handlist = require("../models/HandList");
var project = require("../models/Project");
var fs = require('fs');
let  join = require('path').join;
let uploadDir = "./upload";
var mongoose = require('mongoose');

// 通过 filename 属性定制
let storage = multer.diskStorage({
  destination:async function (req, file, cb) {
    let dir = uploadDir+"/"+req.body.projectName;
    await mkdir.makeDir(dir);
    cb(null, dir);    // 保存的路径，备注：需要自己创建
  },
  filename: function (req, file, cb) {
    let body =req.body;
    // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
    let saveDir = uploadDir+"/"+req.body.projectName;
    let saveName= file.originalname + '-' + Date.now();
    file.fieldname = saveDir+"/"+saveName;
    cb(null, saveName);
  }
});

var upload = multer({ storage: storage });


router.post('/uploadElement', upload.any(), function(req, res, next) {
  res.json({status: 0,saveName:req.files[0].fieldname });
});
router.get('/upload', upload.any(), function(req, res, next) {
  let query = req.query;
  //得到项目名称
  //let descFile = new File( "d:/123.txt");
  let project = JSON.parse(query.project);
  let filelist = project.filelist;
  let md5 = query.identifier;
  if(filelist)
  {
    //查询数据库中的md5对应的上传文件
    for (let desc of filelist)
    {
      if(desc.file.uniqueIdentifier === md5)
      {
        res.json({status: 0, skipUpload: true});
        /*let size = query.totalSize;
        let name =  uploadDir+"/"+project.name+"/"+query.identifier;
        fs.stat(name,(err,stats)=>{

            if (stats.size == size ){
                res.json({status: 0, skipUpload: true});
            } else
            {
                //查看已经上传了多少
                //检查以前的数据里面，有没有上传了块了
                //chunks = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
                chunks=[];
                res.json({status: 0, skipUpload: false,uploaded:chunks});
            }
        });
        //得到这个文件的大小，比对看否已经上传了*/
      }
    }
  }

  res.json({status: 0, skipUpload: false,uploaded:[]});

});

/*文件合并*/
router.post('/combinefiles', upload.any(), function(req, res, next) {
  let data =JSON.parse(req.body.info);
});


let list = [];
let dic = new Array(); //定义一个字典
/* GET home page. */
router.post('/upload', upload.any(), function(req, res, next) {
  // 上传的文件信息
  let obj = dic[req.body.identifier];
  if(!obj)
  {
    dic[req.body.identifier] = [req.files[0].path];
  }else
  {
    obj.push(req.files[0].path);
  }

  var des_file = "./upload/" + req.files[0].originalname;



  fs.readFile( req.files[0].path, function (err, data) {
    fs.writeFile(des_file, data, function (err) {
      if( err ){
        console.log( err );
      }else{
        response = {
          message:'File uploaded successfully',
          filename:req.files[0].originalname
        };
        //console.log( response );
        res.end( JSON.stringify( response ) );
      }
    });

  });

  res.json({status: 0, needMerge: true});
});
// 合并分片
router.post('/merge_chunks',upload.any(),async function (req, res, next) {
  //

  let file =JSON.parse(req.body.file);
  let project = JSON.parse(req.body.project);
  result = dic[file.uniqueIdentifier];
  if(!result)
  {
    //本地移动
    return
  }
  let dir = uploadDir+"/"+ project.name;
  await mkdir.makeDir(dir);
  let saveName =dir+"/"+ file.uniqueIdentifier;
  while(result.length >0 )
  {
    fs.appendFileSync(saveName , fs.readFileSync(result[0]));
    fs.unlinkSync(result[0]);
    result.splice(0,1);
  }
  res.json({status: 0,saveName:saveName,file:file});
  /*
  for (let i = 0; i < result.length; i++) {
      // 追加写入到文件中

      // 删除本次使用的chunk
     fs.unlinkSync(result[i]);
  }*/
});

/* GET home page. */
//获取项目列表
router.post("/project", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  project.findAll(function(err, allproject) {
    //console.log(allproject);
    res.json({ status: 0, message: "获取成功", data: allproject });
  });
});

//YB 查询项目
router.post("/findByPo",upload.single(),function (req, res, next) {

  let start = new Date().getTime();
  for(let a =0; a < 2000000000;a++)
  {
    for (let b = 0; b < 10; b++)
    {

    }
  }
  let end = new Date().getTime();
  console.log("运行时间："+(end-start));

  let data =JSON.parse(req.body.info);
  //data.startingtime[0].setDate(data.startingtime[0].getDate() + 1);
  project.select(data, function (err, comment) {
    res.json({status: 0, data: comment});
  })

});

//YB 用id获取项目列表
router.post("/findById",upload.single(), function (req, res, next) {

  let id = req.body._id;
  project.findById(id, function(err, project) {

    res.json({status: 0, data: project});
  })

});
//YB 用path下载文件
router.get("/downloadFile", function (req, res, next) {

  //res.setHeader('Content-Type', 'application/octet-stream;charset=utf8');
  var path=req.query.path;
  //检查文件是否存在
  fs.stat(path, (err, stats) => {
    if (err) {
      res.json({status: 1, Message: "数据库已经不存在此文件"});
    } else {
      var f = fs.createReadStream(path);
      let fileName = req.query.filename;
      res.writeHead(200, {
        'Content-Type': 'application/force-download',
        // 'Content-Disposition': 'attachment; filename=一.docx',
        'Content-Disposition': 'attachment; filename=' + new Buffer(fileName).toString('binary')
      });
      f.pipe(res);
    }
  })
});

//YB 用path 删除文件
router.post("/deleteFile",upload.any(), function (req, res, next) {
  let path =req.body .path;
  try{
    fs.exists(path,(isExit)=>{
      if(isExit)
      {
        fs.unlinkSync(path);
      }
    });
  }finally {
    let project =JSON.parse(req.body.project);
    //editPrj(project);
    res.json({status: 0, data: project});

  }



});

//YB 删除项目
router.post("/deltePrj", upload.single(), function(req, res, next) {

  let data =JSON.parse(req.body.info);
  project.findById(data._id, function(err, doc) {
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
function editPrj(data){

  project.update(
      { _id: data._id },
      {
        $set: {
          name:data.name,
          snnumber: data.snnumber, //项目编码
          //项目类型id
          typeid: data.typeid,
          //部门id
          departmentid: data.departmentid,
          //提交人
          submitter: data.submitter,
          //接收人
          recipient: data.recipient,
          //项目负责人
          projectleader: data.projectleader,
          //移交清单
          handlist: data.handlist,
          //备注
          remark: data.remark,
          //项目启动时间
          startingtime: data.startingtime,
          //文件大小
          documentsize: data.documentsize,
          //文件集合
          filelist: data.filelist,
          state:data.state,
          delteTime:data.delteTime,
          projectstateid:data.projectstateid,
          checkid:data.checkid,
          checkmessage:data.checkmessage,
        }
      },
      { multi: true },
      function(err, data) {
        if (err) {
          console.error(err);
        } else {
          // res.json({ status: 0, message: "更新成功" });
        }
      }
  );
}
//YB 编辑项目
router.post("/editPrj", upload.single(), function(req, res, next) {

  let data = JSON.parse(req.body.info);
  editPrj(data);
  res.json({status: 0, message: "project数据编辑成功"});
});

//创建项目列表
router.post("/createproject",upload.single(), function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");

  let data =JSON.parse(req.body.info);
  let id = mongoose.Types.ObjectId;

  // console.log(data);
  var createproject = new project({

    name:data.name,
    snnumber: data.snnumber, //项目编码
    //项目类型id
    typeid: data.typeid,
    //部门id
    departmentid: data.departmentid,
    //提交人
    submitter: data.submitter,
    //接收人
    recipient: data.recipient,
    //项目负责人
    projectleader: data.projectleader,
    //移交清单
    handlist: data.handlist,
    //备注
    remark: data.remark,
    //项目启动时间
    startingtime: data.startingtime,
    //文件大小
    documentsize: data.documentsize,
    //上传时间
    uploadtime:data.uploadtime,
    //文件集合
    filelist: data.filelist,
    state:data.state,
    projectstateid:data.projectstateid,
    checkid:data.checkid,
    checkmessage:data.checkmessage,
  });
  createproject.save(function () {
    res.json({status: 0,_id:createproject._id, message: "project数据库保存成功"});
  });


});
//YB 编辑项目
router.post("/findProjectBySnnumber", upload.single(), function(req, res, next) {

  let snnumber = req.body.snnumber;
  project.findBySnnumber(snnumber,function (err,prjectShare) {
    res.json({status: 0, message: '获取成功', data: prjectShare})
  });
});

let  mkdir =require('../public/javascripts/mkdir');

module.exports = router;
