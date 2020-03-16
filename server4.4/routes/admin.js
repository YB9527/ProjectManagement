//后端路由
var express = require("express");
var router = express.Router();
var multer = require("multer");
var Mongoose = require('mongoose');
var department = require("../models/Department");
var projecttype = require("../models/ProjectType");
var project = require("../models/Project");
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public/images");
  },
  filename: function(req, file, cb) {
    let mydate = date.date();
    cb(null, mydate + file.originalname);
  }
});

var upload = multer({ storage: storage });
//添加部门
router.post("/adddepartmentname", upload.single(), function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  if (!req.body.departmentname) {
    res.json({ status: 1, message: "部门名为空" });
  }

  department.findBydepartmentname(req.body.departmentname, function(
    err,
    udepartmentSave
  ) {
    console.log(req.body.departmentname);
    if (udepartmentSave.length != 0) {
      // res.json(userSave)
      res.json({ status: 1, message: "部门已存在" });
    } else {
      var adddepartmentname = new department({
        departmentname: req.body.departmentname
      });
      console.log(adddepartmentname);
      adddepartmentname.save(function() {
        res.json({ status: 0, message: "添加成功" });
      });
    }
  });
});
//修改部门
router.post("/editdepartmentname", upload.single(), function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  console.log(req.body);
  if (!req.body.ID) {
    res.json({ status: 1, message: "部门id为空" });
  }
  let id = req.body.ID;
  console.log(id)
  let _id = Mongoose.Types.ObjectId(id);
  console.log(_id)
  //res.json({ status: 0, message: "更新成功" });

  department.update({"_id":_id},{$set:{departmentname:req.body.departmentname}},{multi: true},function(err,data){
    if(err){
      console.error(err);
  }else{
    res.json({ status: 0, message: "更新成功" });
  }
})
}),
//删除部门
router.post("/deletedepartmentname", upload.single(), function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  console.log(req.body);
  if (!req.body.ID) {
    res.json({ status: 1, message: "部门id为空" });
  }
  department.findById(req.body.ID, function(err, dp) {
    // console.log("dp: " +dp)
    // dp.remove(function(err, dp1) {
    //         if (err) {
    //           console.error(err);
    //         } else {
    //           console.log(dp1); //doc1是内存中的数据，如果误删了数据库中的数据，可以用这个找回来
    //           res.json({ status: 0, message: "删除成功" });
    //         }
    //       });
    //console.log("dp: " +dp)
    if (err) {
      console.error(err);
      res.json({ status: 1, message: "删除失败" });
    }
    project.findBydepartmentid(req.body.ID, function(err, typeSave) {
      if (typeSave != null) { 
        res.json({ status: 1, message: "部门已关联到项目" });
      } else {

        console.log('before remove' + dp)
        dp.remove(function(err, dp1) {
          console.log("after remove: " + dp1)
          if (err) {
            console.error(err);
          } else {
            console.log(dp1); //doc1是内存中的数据，如果误删了数据库中的数据，可以用这个找回来
            res.json({ status: 0, message: "删除成功" });
          }
        });
      }
    });
  });
}),
  //添加类别
router.post("/addtypename", upload.single(), function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    if (!req.body.typename ||!req.body) {
      res.json({ status: 1, message: "类别名为空" });
    }
    projecttype.findBytypename(req.body.typename, function(err, typeSave) {
      console.log(req.body.typename);
      if (typeSave.length != 0) {
        // res.json(userSave)
        res.json({ status: 1, message: "类别已存在" });
      } else {
        console.log(req.body.projectstatelist);
        var addtypename = new projecttype({
          typename: req.body.typename,
          projectstatelist:JSON.parse(req.body.projectstatelist),
        });
        addtypename.save(function() {
          res.json({ status: 0, message: "类别添加成功" });
        });
        
      }
    });
});
function GetDelectArr(dbarray,reqarray){ 
   console.log("进入函数");
  // console.log(dbarray);
  // console.log(reqarray);
      var arr = [];  
      for(var i=0;i<dbarray.length; i++){
          console.log(dbarray.length);
          var stra = dbarray [i].id;
         // arr.push(stra);
          var isfound=0;
          for(var j = 0; j <reqarray.length; j ++){
            //console.log(reqarray.length);
            var strb=reqarray[j].id;
            if(stra==strb){
              isfound=1;
            }
          }
          if(isfound==0){
            arr.push(stra);
          }
  }
  console.log("函数返回：");
  console.log(arr);
      return arr;
}

//修改类别
router.post("/edittypename", upload.single(), function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  console.log(req.body);
  if (!req.body.ID) {
    res.json({ status: 1, message: "类型id为空" });
  }
  let id = req.body.ID;
  //console.log(id)
  let _id = Mongoose.Types.ObjectId(id);
  //console.log(_id)
  //res.json({ status: 0, message: "更新成功" });
  console.log(req.body.projectstatelist);
  var deletearr;
  projecttype.findById(req.body.ID, function (err, mytype) {
    if (err) {
      console.error(err);
    }
    else {
      //console.log(req.body.projectstatelist);
      //console.log(mytype.projectstatelist);
      deletearr = GetDelectArr(mytype.projectstatelist, JSON.parse(req.body.projectstatelist));
      //console.log("deletearr:");
      console.log(deletearr);
      //console.log("判断是否删除了项");
      if (deletearr.length == 0) {
        //console.log("开始更新：等于0");
        //typename:req.body.typename,
       // console.log("11");
        projecttype.update({ "_id": _id }, { $set: {typename: req.body.typename, projectstatelist: JSON.parse(req.body.projectstatelist) } }, { multi: true }, function (err, data) {
          if (err) {
            console.error(err);
          } else {
            //判断id是否已经存在与项目中
            console.log("22");
            res.json({ status: 0, message: "修改成功" });
          }
        })
       // console.log("33");
      }
      else {
        console.log("开始更新：不等于0");
        var istrue = 0;
        for (var vk in deletearr) {
          //let id = deletearr[vk];
           console.log(deletearr[vk])
          project.findByprojectstateid(deletearr[vk], function (err, projectlist) {
            if (err) {
              console.error(err);
              res.json({ status: 1, message: "修改失败" });
            }
            else {
              console.log("projectlist:");
              console.log(projectlist);
              // if (projectlist.length != 0) {
              //   istrue++;
              // }
              if (projectlist.length !=0) {
                res.json({ status: 1, message: "修改失败，类型已经在项目中存在！" });
              }
              else {
                projecttype.updateOne({ "_id": _id }, { $set: {typename: req.body.typename, projectstatelist: JSON.parse(req.body.projectstatelist) } }, { multi: true }, function (err, data) {
                  if (err) {
                    console.error(err);
                  } else {
                    //判断id是否已经存在与项目中
                    res.json({ status: 0, message: "修改成功" });
                  }
                })
              }
            }
          })
        }
        
      }
    }
  })
}),




//删除类别
router.post("/deletetypename", upload.single(), function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  console.log(req.body);
  if (!req.body.ID) {
    res.json({ status: 1, message: "类型id为空" });
  }
  projecttype.findById(req.body.ID, function(err, dp) {
    if (err) {
      console.error(err);
      res.json({ status: 1, message: "删除失败" });
    }
    project.findBytypeid(req.body.ID, function(err, typeSave) {
      if (typeSave != null) { 
        res.json({ status: 1, message: "类型已关联到项目" });
      } else {
        console.log('before remove' + dp)
        dp.remove(function(err, dp1) {
          res.json({ status: 0, message: "删除成功" });
        });
      }
    });
  });
}),

module.exports = router;