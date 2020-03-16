<<template>
<el-form   label-width="80px">
    <el-form-item>
        <h1 >增加部门</h1>
    </el-form-item>
  <el-form-item >
    <span>部门名：<el-input v-model="departmentname"></el-input></span>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="creatdepartmentname">立即创建</el-button>
    <el-button @click="clear">取消</el-button>
  </el-form-item>
</el-form>
</template>
<script>
import axios from "axios";
export default {

  data() {
    return {
      departmentname: "",
    };
  },

  methods: {
    clear(){
        this.departmentname=""
    },
    creatdepartmentname() {
      if (!this.departmentname) {
        this.$message.error("请输入部门名");
        return;
      }
      let self = this;
      // console.log(this.userName);
      // console.log(this.password);
      let userLoginData = new FormData();
      userLoginData.append("departmentname", self.departmentname);
      axios({
        url: "http://localhost:3000/admin/adddepartmentname",
        method: "POST",
        data: userLoginData
      })
        .then(result => {
          console.log(result.data);
          if (result.data.status == 0) {
             this.$message({
            type: 'success',
            message: result.data.message
          }); 
          }
          else{
            this.$message({
            type: 'error',
            message: result.data.message
          }); 
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

