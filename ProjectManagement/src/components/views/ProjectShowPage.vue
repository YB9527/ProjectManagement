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
        prop="projectstateid"
        :formatter="projectstateidFormat"
        label="阶段"
        width="70">
      </el-table-column>


      <el-table-column
        prop="departmentname"
        label="部门"
        width="90">
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
        width="85">
      </el-table-column>
      <el-table-column
        prop="uploadtime"
        label="项目创建时间"
        :formatter="timeFormat"
        width="96">
      </el-table-column>
    <!--  v-if="checkShow"-->
      <el-table-column

        prop="checkid"
        label="状态"
        :formatter="projectstateFormat"
        width="96">
      </el-table-column>

      <el-table-column
        label="操作"
        width="130">
        <template slot-scope="scope">
          <div >
            <el-tooltip content="审核" placement="top">
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

    <div v-if="dialogFormVisible">
      <el-dialog title="项目审核" :visible.sync="dialogFormVisible">
        <el-form :model="form">


          <el-form-item label="审核结果" :label-width="formLabelWidth">
            <el-select v-model="form.checkid" placeholder="请选择意见">
              <el-option v-for="(op ,index ) in checkList" v-bind:value="op.checkid" :label="op.result"
                         :key="index">
                {{ op.result }}
              </el-option>
            </el-select>

          </el-form-item>
          <el-form-item label="审核意见" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="form.message" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="checkOk">确 定</el-button>
        </div>
      </el-dialog>
    </div>


  </div>
</template>

<script>
  import axios from 'axios'
  import moment from 'moment';

  export default {
    name: "ProjectShowPage",
    props: ["findProject","searchProject"],
    data() {
      return {
        currentIndex: "",
        currentRow: "",
        checkList: [{checkid: "1", result: "通过"}, {checkid: "2", result: "驳回"}],
        projects: [],
        dialogFormVisible: false,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
          checkid: '',
          result: '',
          message: '',
        },
        formLabelWidth: '120px'
      }

    },
    computed: {
      checkShow: function () {
        if (this.$store.getters.user.authority == 1) {
          return true;
        } else {
          return false;
        }
      }
    },
    created() {
      //this.$store.commit("searchProjectAll");

      if (this.findProject) {

        this.findProject((data =>{
         // console.log("parent", data);
          this.projects = data;
        }));

      } else if(this.searchProject)
      {
        this.projects =this.$store.getters.searchProject;
      }else
      {
        this.$store.commit("searchProjectAllCallback",(projects)=> {

           this.projects = projects;

          }
        );
      }


    },
    methods: {
      projectstateidFormat(row, column, cellValue, index) {
        for(let projecttyp of this.$store.state.projecttypes)
        {
            for(let state of projecttyp.projectstatelist )
            {
              if(state.id === row.projectstateid)
              {
                return state.projectstate;
              }

            }
        }
        return "无级别";

      },
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
          }
        }
      },
      //下载文件
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
        if (row.checkid == 1 ) {
          //是否重新提交
          this.$confirm('是否重新提交项目?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$notify.success({
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
        } if (row.checkid == 0 )
        {
          this.currentIndex = index;
          this.currentRow = row;
          this.form.message =row.checkmessage;
          this.form.checkid = "";
          this.dialogFormVisible = true;
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
          //设置审核人
          this.currentRow.recipient = this.$store.getters.user._id;
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
          console.log(row);
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
  .opreation {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
