<template>
  <div>
    <h1>我是主页</h1>
    <div class="login_form">
      <input type="text" class="qxs-ic_user qxs-icon" placeholder="用户名" v-model="userName">
      <input type="text" class="qxs-ic_password qxs-icon" placeholder="密码" v-model="password">
      <button
        id="login_btn"
        class="login_btn"
        type="button"
        @click="login"
      >登陆</button>
    </div>
  </div>
</template>  
<script>
import axios from 'axios'
export default {
  data() {
    return {
      userName: "",
      password: ""
    };
  },
  created () {
    if(JSON.parse( localStorage.getItem('user')) && JSON.parse( localStorage.getItem('user')).userName){
      this.userName = JSON.parse( localStorage.getItem('user')).userName;
      this.password = JSON.parse( localStorage.getItem('user')).password;
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
      let self =this
      //console.log(this.userName);
      let userLoginData = new FormData()
      userLoginData.append('username',self.userName)
      userLoginData.append('password',self.password)

      
      axios({
          url: 'http://localhost:3000/users/login',
          method: 'POST',
          data: userLoginData
        })
          .then((result) => {
            console.log(result);
            if(result.data.status==0){
              console.log('进入主页面');
            }
            else{
              this.$message.error("用户名或者密码错误！");
            }
          })
          .catch((err) => {
            console.log(err );
          })
    }
  }
  
};
function sleep(numberMillis){
        var now = new Date(); 
        var exitTime = now.getTime() + numberMillis; 
        while (true) { 
            now = new Date(); 
            if (now.getTime() > exitTime) 
            return;
        }
    }
</script>