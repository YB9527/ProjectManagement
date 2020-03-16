<<template>
<el-form   label-width="80px">
    <el-form-item>
        <h1 >增加用户</h1>
    </el-form-item>
  <el-form-item >
    <span>用户名：<el-input v-model="userName"></el-input></span>
  </el-form-item>
  <el-form-item >
      <span>输入密码：<el-input  v-model="password" show-password></el-input></span>
  </el-form-item>
  <el-form-item>
    <span>重新输入密码：<el-input  v-model="password2" show-password></el-input></span>
  </el-form-item>
  <el-form-item >
      <span>权限：
    <el-select v-model="authority" placeholder="请选择权限">
      <el-option label="管理员" value="1" ></el-option>
      <el-option label="用户" value="2"></el-option>
      <el-option label="访客" value="3"></el-option>
    </el-select>
    </span>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="login">立即创建</el-button>
    <el-button @click="clear">取消</el-button>
  </el-form-item>
</el-form>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      userName: "",
      password: "",
      password2: "",
      authority: ""
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
    clear() {
      this.userName = "";
      this.password = "";
      this.password2 = "";
      this.authority = "";
    },
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
      if (!this.authority) {
        this.$message.error("请输入权限");
        return;
      }
      if (this.password != this.password2) {
        this.$message.error("密码不相同");
        return;
      }
      let self = this;
      // console.log(this.userName);
      // console.log(this.password);
      let userLoginData = new FormData();
      userLoginData.append("username", self.userName);
      userLoginData.append("password", self.password);
      userLoginData.append("authority", self.authority);
      console.log(userLoginData.get("username"));
      console.log(userLoginData.get("password"));
      console.log(userLoginData.get("authority"));
      axios({
        url: "http://localhost:3000/users/register",
        method: "POST",
        data: userLoginData
      })
        .then(result => {
          console.log(result.data);
          if (result.data.status == 0) {
            this.$message.success(result.data.message);
          } else {
            this.$message.error(result.data.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style scoped>
h1 {
  color: aqua;
  font-size: 40px;
  text-align: center;
}
.el-input {
  width: 100%;
}
.el-form {
  width: 600px;
  text-align: left;
  margin-left: 30%;
}
</style>

