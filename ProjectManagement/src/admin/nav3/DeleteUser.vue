<template>
  <div>
    <h1>删除用户</h1>
     <h5 v-show="false">{{Listfilter}}</h5>
    <el-table
      :data="showList.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      style="width: 100%"
    >
      <el-table-column :label="key" v-for="(value,key) in tableList[0]" :key="key">
        <template slot-scope="scope">
          <span>{{scope.row[key]}}</span>
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template slot="header" slot-scope="scope">
          <el-input v-model="search" size="mini" placeholder="输入关键字搜索"/>
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
       <el-pagination
                           @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-size="pagesize"      
                            layout="total, prev, pager, next, jumper"
                            :total="tableList.length">    //这是显示总共有多少数据，
   </el-pagination>
    <!-- //弹出框 -->
    <el-dialog title="用户信息" :visible.sync="dialogFormVisible" width="35%">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="form.Authority" placeholder="请选择管理员权限">
            <el-option label="管理员" value="管理员"></el-option>
            <el-option label="用户" value="用户"></el-option>
            <el-option label="游客" value="游客"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSave()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      currentPage:1, //初始页
      pagesize:12,
      showList: [],
      tableList: [],
      search: "",
      dialogFormVisible: false,
      form: {
        name: "",
        password: "",
        Authority: ""
      },
      formLabelWidth: "120px",
      listindex: "",
      listrow: {
        name: "",
        password: "",
        Authority: ""
      },
    };
  },
   computed:{
   // 
   Listfilter(){
     var searchList=this.tableList
      return this.showList=searchList.filter(searchList => !this.search || searchList.Name.toLowerCase().includes(this.search.toLowerCase()))
      //return  this.search
    }
  },
  methods: {
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.mydelete(index, row);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //删除服务器列表
    mydelete(index, row) {
      //传输到服务器
      let deleteData = new FormData();
      deleteData.append("ID", row.ID);
      axios({
        url: "http://localhost:3000/users/deleteuser",
        method: "POST",
        data: deleteData
      })
        .then(result => {
          console.log(deleteData);
          console.log(result);
          if (result.data.status == 0) {
            console.log("删除");
            console.log(this.tableList[index]);
            this.tableList.splice(index, 1);
            this.$message({
              type: "success",
              message: result.data.message
            });
          } else {
            this.$message({
              type: "error",
              message: result.data.message
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取列表
    getdepartment() {
      axios({
        url: "http://localhost:3000/userlist",
        method: "POST"
      })
        .then(result => {
          for (var kk in result.data.data) {
            let temp = {
              ID: "",
              Name: "",
              Password: "",
              Authority: ""
            };
            temp.ID = result.data.data[kk]._id;
            temp.Name = result.data.data[kk].username;
            temp.Password = result.data.data[kk].password;
            if (result.data.data[kk].authority == 1) {
              temp.Authority = "管理员";
            } else if (result.data.data[kk].authority == 2) {
              temp.Authority = "用户";
            } else {
              temp.Authority = "游客";
            }
            //temp.Authority = result.data.data[kk].authority;
            this.tableList.push(temp);
            this.showList.push(temp);
          }
          console.log(this.tableList);
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleEdit(index, row) {
      console.log("row:")
      console.log(row)
      this.listrow.ID = row.ID;
      this.listrow.name = row.Name;
      this.listrow.password = row.Password;
      this.listrow.Authority = row.Authority;
      
      this.form.name = row.Name;
      this.form.password = row.Password;
      this.form.Authority = row.Authority;
      this.dialogFormVisible = true;
      this.listindex = index;
      console.log("listrow:")
      console.log(this.listrow);
      console.log("form:")
       console.log(this.form);

      
      
      //console.log(this.listrow);
    },
    handleSizeChange(){

    },
    handleCurrentChange: function(currentPage){
                this.currentPage = currentPage;
                console.log(this.currentPage)  //点击第几页
        },
    editSave() {
      // if(this.form.name==this.listrow.name){
      // if(this.form==this.listrow){
      //   this.$message({
      //         type: "info",
      //         message: "未修改"
      //       });
      //       this.dialogFormVisible = false;
      //       return
      // }
      console.log("listrow:")
      console.log(this.listrow);
      console.log("form:")
       console.log(this.form);
      let userLoginData = new FormData();
      userLoginData.append("ID", this.listrow.ID);
      userLoginData.append("username", this.form.name);
      userLoginData.append("password", this.form.password);
      if (this.form.Authority == "管理员") {
        userLoginData.append("authority", 1);
        //this.tableList[this.listindex].Authority =1;
      } else if (this.form.Authority == "用户") {
        userLoginData.append("authority", 2);
        //this.tableList[this.listindex].Authority = 2;
      } else {
        userLoginData.append("authority", 3);
        //this.tableList[this.listindex].Authority = 3;
      }
      //console.log("username:"+ this.form.name)

      axios({
        url: "http://localhost:3000/users/edituser",
        method: "POST",
        data: userLoginData
      })
        .then(result => {
          //console.log(result.data);
          if (result.data.status == 0) {
            //更新本地
            this.dialogFormVisible = false;
            this.tableList[this.listindex].Name = this.form.name;
            this.tableList[this.listindex].Password = this.form.password;
            this.tableList[this.listindex].Authority = this.form.Authority;
            //更新服务器
            this.$message({
              type: "success",
              message: result.data.message
            });
          } else {
            this.$message({
              type: "error",
              message: result.data.message
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {
    this.getdepartment();
    //this.getdata()
  }
};
</script>
<style>
h1 {
  color: aqua;
  font-size: 35px;
  text-align: center;
}
</style>
