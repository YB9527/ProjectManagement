var express = require("express");
var router = express.Router();
var multer = require("multer");
var crypto = require("crypto");
var user = require("../models/user");
const init_token = "TKL02o";
var Mongoose = require("mongoose");

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

/* GET users listing. */
router.post("/login2", function(req, res, next) {
  res.send("用户API");
});

//用户登录接口
router.post("/login", upload.single(), function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  user.findUserLogin(req.body.username, req.body.password, function(
    err,
    userSave
  ) {
    console.log(userSave);
    if (userSave.length != 0) {
      var token_after = getMD5Password(userSave[0]._id);
      res.json({
        status: 0,
        authority: userSave[0].authority,
        data: { token: token_after, user: userSave },
        message: "用户登录1成功"
      });
      console.log("登陆成功");
    } else {
      res.json({ status: 1, message: "用户名或者密码错误" });
      console.log("登陆失败");
    }
  });
});
//测试接口
router.post("/test1", upload.single(), function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.send(req.body.username);
  user.findByUsername(req.body.username, function(err, userSave) {
    console.log(req.body.username);
    res.json({ status: req.body.username, message: req.body.password });
    console.log("登陆失败");
  });
});

//用户注册接口
router.post("/register", upload.single(), function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  if (!req.body.username) {
    res.json({ status: 1, message: "用户名为空" });
  }
  if (!req.body.password) {
    res.json({ status: 1, message: "密码为空" });
  }

  user.findByUsername(req.body.username, function(err, userSave) {
    console.log(req.body.username);
    if (userSave.length != 0) {
      // res.json(userSave)
      res.json({ status: 1, message: "用户已注册" });
    } else {
      if (!req.body.authority) {
        var registerUser = new user({
          username: req.body.username,
          password: req.body.password,
          authority: 3
        });
        registerUser.save(function() {
          res.json({ status: 0, message: "注册成功" });
        });
      } else {
        var registerUser = new user({
          username: req.body.username,
          password: req.body.password,
          authority: req.body.authority
        });
        registerUser.save(function() {
          res.json({ status: 0, message: "注册成功" });
        });
      }
    }
  });
});
//编辑用户
router.post("/edituser", upload.single(), function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  console.log(req.body);
  if (!req.body.ID) {
    res.json({ status: 1, message: "类型id为空" });
  }
  if (!req.body.username) {
    res.json({ status: 1, message: "用户名为空" });
  }
  if (!req.body.password) {
    res.json({ status: 1, message: "密码为空" });
  }
  user.findByUsername(req.body.username, function(err, userSave) {
    console.log("usersave:");
    console.log(userSave);
    console.log(userSave[0]._id);
    let id = req.body.ID;
     // console.log(id);
      let _id = Mongoose.Types.ObjectId(id);
    //console.log(_id);
    console.log("req.body:");
    console.log(req.body.ID);
    if (userSave.length != 0 && userSave[0]._id !=id) {
      // res.json(userSave)
      res.json({ status: 1, message: "用户已存在" });
    } else {
      
      //res.json({ status: 0, message: "更新成功" });
      user.update(
        { _id: _id },
        {
          $set: {
            username: req.body.username,
            password: req.body.password,
            authority: req.body.authority
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
    }
  });
});
//删除用户
router.post("/deleteuser", upload.single(), function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  console.log(req.body);
  if (!req.body.ID) {
    res.json({ status: 1, message: "类型id为空" });
  }
  user.findById(req.body.ID, function(err, dp) {
    if (err) {
      console.error(err);
      res.json({ status: 1, message: "删除失败" });
    }
    dp.remove(function(err, dp1) {
      console.log("after remove: " + dp1);
      if (err) {
        console.error(err);
      } else {
        console.log(dp1); //doc1是内存中的数据，如果误删了数据库中的数据，可以用这个找回来
        res.json({ status: 0, message: "删除成功" });
      }
    });
  });
});
//查找所有的用户
router.get("/findAll" ,function(req, res, next) {
  user.findAll(function(err, users) {
    //console.log(allproject);
    res.json({ status: 0, message: "获取成功", data: users });
  });
});
//获取md5值
function getMD5Password(id) {
  var md5 = crypto.createHash("md5");
  var token_before = id + init_token;
  // res.json(userSave[0]._id)
  return md5.update(token_before).digest("hex");
}
module.exports = router;
