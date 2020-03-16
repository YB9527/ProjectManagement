<<template>
<el-form   label-width="80px">
    <el-form-item>
        <h1 >增加项目类别</h1>
    </el-form-item>
  <el-form-item >
    <span>项目类别名：<el-input v-model="typename"></el-input></span>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="creatdetypename">立即创建</el-button>
    <el-button @click="clear">取消</el-button>
  </el-form-item>
</el-form>
</template>
<script>
import axios from "axios";
export default {

  data() {
    return {
      typename: "",
    };
  },

  methods: {
    clear(){
        this.typename=""
    },
    creatdetypename() {
      if (!this.typename) {
        this.$message.error("请输入项目类别名");
        return;
      }
      let self = this;
      let userLoginData = new FormData();
      userLoginData.append("typename", self.typename);
      axios({
        url: "http://localhost:3000/admin/addtypename",
        method: "POST",
        data: userLoginData
      })
        .then(result => {
          console.log(result.data);
          if (result.data.status == 0) {
          //    this.$message({
          //   type: 'info',
          //   message: result.data.message
          // }); 
          this.$message.success(result.data.message);
          }else{
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

