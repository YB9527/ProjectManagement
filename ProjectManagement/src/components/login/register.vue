<template>
<div class="background">
  <div class="app">
    <h2 class="title">注册</h2>
    <div class="inner">
      <input type="text" placeholder="用户名" v-model="userName">
      <br>
      <input type="text" placeholder="输入密码" v-model="password">
      <br>
      <input type="text" placeholder="重复输入密码" v-model="password2">
      <br>
    </div>
    <!-- <a href="#">没有账号？点击注册</a><br> -->
    <button id="login_btn" class="login_btn" type="button" @click="login">注册</button>
  </div>
</div>
</template>  
<script>
import axios from "axios";
export default {
  data() {
    return {
      userName: "",
      password: "",
      password2: ""
    };
  },
  // created() {
  //   if (
  //     JSON.parse(localStorage.getItem("user")) &&
  //     JSON.parse(localStorage.getItem("user")).userName
  //   ) {
  //     this.userName = JSON.parse(localStorage.getItem("user")).userName;
  //     this.password = JSON.parse(localStorage.getItem("user")).password;
  //   }
  // },
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
      if (!this.password2) {
        this.$message.error("请输入第二次密码");
        return;
      }
      if ((this.password != this.password2)) {
          this.$message.error("密码不相同");
          return;
        }
        let self = this;
        // console.log(this.userName);
        // console.log(this.password);
        let userLoginData = new FormData();
        userLoginData.append("username", self.userName);
        userLoginData.append("password", self.password);
         userLoginData.append("password2", self.password2);
        console.log(userLoginData.get("username"));
        console.log(userLoginData.get("password"));
        console.log(userLoginData.get("password2"));
        axios({
        url: "http://localhost:3000/users/register",
        method: "POST",
        data: userLoginData
      })
        .then(result => {
          console.log(result.data);
          if (result.data.status == 0) {
                alert('注册成功') 
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
}
</script>

<style scoped>
.background{
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgb(89, 190, 89);
}
.app {
  width: 400px;
  height: 360px;
  margin: 230px auto;
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
.inner {
  margin-top: 40px;
}

button {
  width: 200px;
  height: 45px;
  border-radius: 5px;
  background: rgb(184, 185, 182);
  border: 1px solid silver;
  color: white;
  font-size: 18px;
  margin-top: 0px;
  cursor: pointer;
}
</style>
