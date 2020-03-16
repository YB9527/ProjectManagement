<template>
    <div>
      未通过的项目
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

          <el-table-column
            prop="snnumber"
            label="项目编号"
            width="100">
          </el-table-column>
          <el-table-column
            prop="typename"
            label="类别"
            width="100">
          </el-table-column>
          <el-table-column
            prop="projectstateName"
            label="阶段"
            width="70">
          </el-table-column>

          <el-table-column
            prop="departmentname"
            label="部门"
            width="120">
          </el-table-column>

          <el-table-column
            prop="recipient"
            :formatter="submitterFormat"
            label="审核人"
            width="70">
          </el-table-column>

          <el-table-column
            prop="projectleader"
            v-if="false"
            label="项目负责人"
            width="95">
          </el-table-column>
          <el-table-column
            prop="checkmessage"
            label="审核意见"
            width="120">
          </el-table-column>
          <el-table-column
            prop="checkid"
            label="审核状态"
            :formatter="projectstateFormat"
            width="96">
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
            width="120">
          </el-table-column>
          <el-table-column
            label="操作"
            width="50"
            v-if="checkShow"
          >
            <template slot-scope="scope">
              <el-tooltip content="审核项目" placement="top">
                <el-button type="success" icon="el-icon-info" circle size="mini"
                           @click="checkPrj(scope.$index, scope.row)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>


          <el-table-column
            label="操作"
            width="130">
            <template slot-scope="scope">
              <div class="opreation">
                <el-tooltip content="再次提交" placement="top">
                  <el-button size="mini" type="warning" icon="el-icon-success" circle
                             @click="checkPrj(scope.$index, scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip content="项目信息编辑" placement="top">
                  <el-button size="mini" type="primary" icon="el-icon-edit" circle
                             @click="editPrj(scope.$index, scope.row)"></el-button>
                </el-tooltip>
                </div>
              <div style="margin-top: 5px">
                <el-tooltip content="上传文件管理" placement="top">
                  <el-button  size="mini" type="info" icon="el-icon-upload" circle
                             @click="downloadPrj(scope.$index, scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip content="项目删除" placement="top">
                  <el-button type="danger" icon="el-icon-delete" circle size="mini"
                             @click="deletePrj(scope.$index, scope.row)"></el-button>
                </el-tooltip>

              </div>
            </template>
          </el-table-column>
        </el-table>

      </div>
    </div>

</template>

<script>
  import axios from 'axios'
  import projectShowPage from '@/components/views/ProjectShowPage'
    export default {
        name: "ProjectWaitPass",
      data(){
          return {
            projects:[],
            checkShow:false,

          }

      },
      components:{
        projectShowPage,
      },
      created(){

        this.$store.commit("searchProjectAllCallback",(projects)=> {

            for (let project of projects)
            {
              if(project.checkid != 1)
              {
                this.projects.push(project);
              }
            }
           //console.log("运用结果",this.projects.length);
        }
        );
      },
      methods :{

        submitterFormat(row, column, cellValue, index) {
          for (let user of this.$store.getters.users) {
            if (cellValue === user._id) {
              return user.username;
            }
          }
        },

        projectstateFormat(row, column, cellValue, index) {
          //console.log(1,this.$store.getters.checks);
          for (let check of this.$store.getters.checks) {
            if (cellValue == check.checkid) {
              return check.checkname;
              break;
            }
          }
        },
        downloadPrj(index, row) {
          //跳转下载页面

          this.$router.push({path: '/home/Content/DownloadPage?_id=' + row._id})
        },
        //编辑项目
        editPrj(index, row) {
          //1、展示页面
          this.$router.push({path: '/home/Content/ProjectEdit?_id=' + row._id})
        },
        checkPrj(index, row) {
          console.log(row);
          if (row.checkid == 1 ) {
            //是否重新提交
            this.$confirm('是否重新提交项目?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$message({
                type: 'success',
                message: '重新提交成功!'
              });
              row.checkid =0;
              this.$store.commit("uploadEdit",row);
              this.projects.splice(index,1);
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消提交'
              });
            });
          } if (row.checkid == 2 ) {
            this.$confirm('是否重新提交项目?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$message({
                type: 'success',
                message: '重新提交成功!'
              });
              row.checkid =0;
              this.$store.commit("uploadEdit",row);

            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消提交'
              });
            });
          }else if (row.checkid == 0 ) {
            this.$notify.error({
              message: '等待审核中......'
            })
          }
        },
        checkOk(index, row) {
          if (this.form.checkid === "") {
            this.$message('你还没有选择意见！！！');
          } else {

            //console.log(this.form.checkid, this.form.message, this.currentRow);
            this.dialogFormVisible = false;
            //console.log(this.form.checkid);
            this.currentRow.checkid = this.form.checkid;
            this.currentRow.checkmessage = this.form.message;
            this.projects.splice(this.currentIndex, 1);
            //修改数据库
            this.$store.commit("uploadEdit", this.currentRow);
            this.$notify({
              type: "success",
              message: '数据审核成功'
            });


          }

        },
        //删除项目
        deletePrj(index, row) {

          //检查是否已经提交，提交的话不能删除
          if (row.checkid == 1 ) {
            //是否重新提交
            this.$notify({
              type: 'error',
              message: '项目已经提交无法删除！！！'
            });
            return ;
          }

          if (window.confirm('你是否要将项目移到回收站：' + row.name + '，吗？')) {

            let myFormDatas = new FormData();
            row.state = true;
            row.delteTime = new Date();
            myFormDatas.append("info", JSON.stringify(row));
            this.projects.splice(index, 1);
            axios({
              url: 'http://localhost:3000/files/editPrj',
              method: 'POST',
              data: myFormDatas
            })
              .then((result) => {
                this.$notify({
                  type: "success",
                  title: "项目：" + row.name,
                  message: '已放入回去站'
                });
              })
              .catch((err) => {
              })
          }
        },
        //日期格式化
        dateFormat(row, column, cellValue, index) {
          const daterc = row[column.property];
          if (daterc != null) {

            return moment(daterc).format("YYYY-MM-DD");
          }

        },
        timeFormat(row, column, cellValue, index) {
          const daterc = row[column.property];
          if (daterc != null) {

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

</style>
