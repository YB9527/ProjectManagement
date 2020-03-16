<template>
<div class="background">
<!-- 中间 -->
  <div class="app">
    <h2 class="title">登录</h2>
    <div class="inner">
      <input type="text" placeholder="用户名" v-model="userName">
      <br>
      <input type="password" placeholder="密码" v-model="password">
      <br>
    </div>
    <router-link :to="{path:'/register'}">没有账号？点击注册</router-link>
    <div class="login_btn">
      <button id="login_btn" style="background: green;" class="login_btn" type="button" @click="login">登陆</button>
    </div>
  </div>
  </div>
</template>
<script>
import {mapActions, mapState,mapGetters} from "vuex";
import axios from "axios";
export default {
  data() {
    return {
      userName: "",
      password: ""
    };
  },
  created() {
    if (
      JSON.parse(localStorage.getItem("user")) &&
      JSON.parse(localStorage.getItem("user")).userName
    ) {
      this.userName = JSON.parse(localStorage.getItem("user")).userName;
      this.password = JSON.parse(localStorage.getItem("user")).password;
    }
  },
  methods: {
    login() {
      if (!this.userName) {
        this.$message.error("请输入用户名");
        return;
      }
      if (!this.password) {
        this.$message.error("请输入密码");
        return;
      }
      let self = this;
      //console.log(this.userName);
      let userLoginData = new FormData();
      userLoginData.append("username", self.userName);
      userLoginData.append("password", self.password);

      axios({
        url: "http://localhost:3000/users/login",
        method: "POST",
        data: userLoginData
      })
        .then(result => {

          if (result.data.status == 0) {
            if (result.data.authority == 5) {


              console.log("进入管理员页面");
              //将用户名存入vuex中
              //this.$store.dispatch("username/changeName", self.userName)
              this.$store.state.username = self.userName;
              //changeName(self.userName);
              this.$router.push({ path: "/admin/adminHome/adminmain/adminindex" });
            }else
            {
              let user = {"_id":result.data.data.user[0]._id,"username":self.userName,"authority":result.data.authority};
              this.$store.commit("setUser",user);
              this.$router.push({ path: "/welcome" });
            }
          } else {
            this.$message.error("用户名或者密码错误！");
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
function sleep(numberMillis) {
  var now = new Date();
  var exitTime = now.getTime() + numberMillis;
  while (true) {
    now = new Date();
    if (now.getTime() > exitTime) return;
  }
};
function changeName(uname) {
   this.$store.dispatch("username/changeName", uname)
};
</script>

<style scoped>
/* body {
  font-family: "宋体";
  background: rgb(89, 190, 89);
  background-size: 100%;
} */
.background{

  position: fixed;
  width: 100%;
  height: 100%;
  /* background: rgb(89, 190, 89); */
  background:url('login.jpg');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}
.app {
  width: 400px;
  height: 300px;
  margin: 250px auto;
  text-align: center;
  background: rgba(50, 50, 50, 0.6);
  border-radius: 10px;
}
.title {
  line-height: 50px;
  color: white;
  border-bottom: 1px solid silver;
}
input {
  width: 300px;
  height: 40px;
  border-radius: 5px;
  margin-bottom: 20px;
  color: black;
}

a {
  text-decoration: none;
  font-size: 12px;
  color: red;
  float: right;
  margin: -15px 50px 0 0;
}
.inner {
  margin-top: 40px;
}
.login_btn {
  margin-top: 5px;
  text-align: center;

}
button {
  width: 200px;
  height: 45px;
  border-radius: 5px;
  background: rgb(184, 185, 182);
  border: 1px solid silver;
  color: white;
  font-size: 18px;
  cursor: pointer;
}
</style>
