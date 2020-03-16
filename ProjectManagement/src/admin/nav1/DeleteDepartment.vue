<template>
  <div>
    <h1>编辑部门</h1>
    <h5 v-show="false">{{Listfilter}}</h5>
    <el-table  
      :data="showList.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      
      style="width: 100%"
    >
      <el-table-column :label="key" v-for="(value,key) in tableList[0]" :key="key">
        <template slot-scope="scope" >
          <span>{{scope.row[key]}}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" >
        <template slot="header" slot-scope="scope" >
          <el-input v-model="search"  size="mini" placeholder="输入关键字搜索"/>
        </template>
        <template slot-scope="scope" >
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
                            :total="showList.length">    //这是显示总共有多少数据，
   </el-pagination>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      currentPage:1, //初始页
      pagesize:12,
      tableList: [],
      showList: [],
      search: "",
     // editvalue:""
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
    handleSizeChange(){

    },
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
     mydelete(index, row) {
      //传输到服务器
      let deleteData = new FormData();
      deleteData.append("ID", row.ID);
      axios({
        url: "http://localhost:3000/admin/deletedepartmentname",
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

    getdepartment() {
      axios({
        url: "http://localhost:3000/departmentlist",
        method: "POST"
      })
        .then(result => {
          for (var kk in result.data.data) {
            let temp = {
              ID: "",
              Name: ""
            };
            temp.ID = result.data.data[kk]._id;
            temp.Name = result.data.data[kk].departmentname;
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
      //this.editvalue=row.Name,
      this.$prompt("请输入部门名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        value:"hello",
        // inputPattern: /^[\u4E00-\u9FA5A-Za-z0-9]/g,
        // inputErrorMessage: '部门名称不能为空或符号' 
      })
        .then(({ value }) => {
          //this.updataname = value;
          let userLoginData = new FormData();
          userLoginData.append("ID", row.ID);
          userLoginData.append("departmentname", value);
          axios({
            url: "http://localhost:3000/admin/editdepartmentname",
            method: "POST",
            data: userLoginData
          })
            .then(result => {
              console.log(result.data);
              if (result.data.status == 0) {
                //更新本地
                this.tableList[index].Name=value
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
          // this.$message({
          //   type: 'success',
          //   message: '你的邮箱是: ' + value
          //});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    handleCurrentChange: function(currentPage){
                this.currentPage = currentPage;
                console.log(this.currentPage)  //点击第几页
        },
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
