<template>
  <div>
    <el-table
      :data="projects"
      border
    >
      <el-table-column
        type="index"
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="name"
        label="项目名称"
        width="190">
      </el-table-column>
     <!-- <el-table-column
        prop="snnumber"
        label="项目编号"
        width="100">
      </el-table-column>-->
      <el-table-column
        prop="typename"
        label="项目类别"
        width="100">
      </el-table-column>
      <el-table-column
        prop="departmentname"
        label="部门"
        width="120">
      </el-table-column>
      <el-table-column
        prop="submitter"
        :formatter="submitterFormat"
        label="提交人"
        width="70">
      </el-table-column>
      <el-table-column
        prop="recipient"
        :formatter="submitterFormat"
        label="接收人"
        width="70">
      </el-table-column>
      <el-table-column
        prop="projectleader"
        label="项目负责人"
        width="95">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        width="120">
      </el-table-column>
      <el-table-column
        prop="startingtime"
        label="项目启动时间"
        :formatter="dateFormat"
        width="110">
      </el-table-column>
      <el-table-column
        prop="documentsize"
        label="文件大小"
        width="100">
      </el-table-column>
      <el-table-column
        prop="uploadtime"
        label="上传时间"
        :formatter="timeFormat"
        width="96">
      </el-table-column>
      <el-table-column
        :formatter="timeFormat"
        prop="delteTime"
        label="删除日期"
        width="96">

      </el-table-column>
      <el-table-column

        label="项目操作"
        width="150">
        <template slot-scope="scope">
          <div class="opreation">
            <el-button type="success"  size="mini" @click="recoverPrj(scope.$index, scope.row)">恢复</el-button>
              <el-button type="danger"  size="mini" @click="deletePrj(scope.$index, scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import  axios from 'axios'
  import  moment from 'moment';
  export default {
    name: "RecycleBin",
    data(){
      return{
        projects:[],
      }
    },
    created() {
      //查询被删除的项目

      this.$store.commit("searchProject",[{state:true},(data)=>{
        this.projects = data;
      }]);


    },

    methods:{
      submitterFormat(row, column, cellValue, index) {
        for (let user of this.$store.getters.users) {
          if (cellValue === user._id) {
            return user.username;
          }
        }
      },
      recoverPrj(index, row){
        this.$store.commit("checkAuthority");

        if(this.$store.getters.Authority && window.confirm('你是否要将项目恢复：'+row.name+'，吗？')) {
          let myFormDatas = new FormData();
          console.log(row);
          row.state =false;
          myFormDatas.append("info",JSON.stringify(row));
          this.projects.splice(index,1);
          axios({
            url: 'http://localhost:3000/files/editPrj',
            method: 'POST',
            data: myFormDatas
          })
            .then((result) => {
              this.$notify({
                type:"success",
                title:"项目："+row.name,
                message: '恢复成功'
              });
            })
            .catch((err) => {
            })
        }
      },

      //删除项目
      deletePrj(index, row){
        this.$store.commit("checkAuthority");
        if(this.$store.getters.Authority && window.confirm('你确定要删除项目'+row.name+'吗？')) {
          let myFormDatas = new FormData();
          myFormDatas.append("info",JSON.stringify(row));
          this.projects.splice(index,1);
          axios({
            url: 'http://localhost:3000/files/deltePrj',
            method: 'POST',
            data: myFormDatas
          })
            .then((result) => {
              this.$notify({
                type:"success",
                title:"项目："+row.name,
                message: '删除成功'
              });
            })
            .catch((err) => {
            })
        }
      },
      //日期格式化
      dateFormat(row, column, cellValue, index){
        const daterc = row[column.property]
        if(daterc!=null){
          return moment(daterc).format("YYYY-MM-DD");
        }

      },
      timeFormat(row, column, cellValue, index){
        const daterc = row[column.property]
        if(daterc!=null){
          return moment(daterc).format("YYYY-MM-DD HH:mm:ss");
        }
      },
      handleClick(row) {
        console.log(row);
      },
    }
  }
</script>


<style scoped>
  .opreation{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
