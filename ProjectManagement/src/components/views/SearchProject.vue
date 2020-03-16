<template>
  <div>
    <div style="width: 1200px">

      <el-form :model="project" :rules="rules" ref="ruleForm">
        <div>
          <el-form-item label="名称" label-width="100px" style="float: left; " prop="name">
            <el-input v-model="project.name" style="width: 200px;"></el-input>
          </el-form-item>
          <el-form-item label="项目编号" label-width="80px" style="float: left" prop="snnumber">
            <el-input v-model="project.snnumber" style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item label="项目类别" label-width="90px" style="float: left" prop="typeid">
            <el-select v-model="project.typeid" multiple placeholder1="请选择类别" clearable
                       style="width: 200px;float: left">
              <el-option v-for="(op ,index ) in projecttypes" v-bind:value="op._id" :label="op.typename" :key="index">
                {{ op.typename }}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="部门" label-width="80px" style="float: left" prop="departmentid">
            <el-select v-model="project.departmentid" multiple placeholder="请选择部门" clearable
                       style="width: 200px;float: left">
              <el-option v-for="(op ,index ) in departments" v-bind:value="op._id" :label="op.departmentname"
                         :key="index">
                {{ op.departmentname }}
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>

          <el-form-item label="提交人" label-width="80px" style="float: left" prop="submitter"
                        v-if="this.$store.getters.user.authority == '1'">
            <el-select filterable v-model="project.submitter" multiple clearable style="width: 200px;float: left">
              <el-option v-for="(op ,index ) in this.$store.getters.users" v-bind:value="op._id" :label="op.username"
                         :key="index">
                {{ op.username }}
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="接收人" label-width="80px" style="float: left" prop="recipient">
            <el-select filterable v-model="project.recipient" multiple clearable style="width: 200px;float: left">
              <el-option v-for="(op ,index ) in this.$store.getters.recipients" v-bind:value="op._id"
                         :label="op.username"
                         :key="index">
                {{ op.username }}
              </el-option>
            </el-select>
          </el-form-item>


          <el-form-item label="项目负责人" label-width="90px" style="float: left" prop="projectleader">
            <el-input v-model="project.projectleader" style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item label="备注" label-width="80px" style="float: left" prop="remark">
            <el-input v-model="project.remark" style="width: 200px;float: left"></el-input>

          </el-form-item>
        </div>
        <div>
          <el-form-item label="项目启动时间" label-width="100px" style="float: left" prop="startingtime">
            <el-date-picker
              v-model="project.startingtime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="上传时间" label-width="80px" style="float: left;margin-left: 150px" prop="uploadtime">
            <el-date-picker
              v-model="project.uploadtime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item style="float: left;">
            <el-tooltip content="项目查询" placement="top">
              <el-button type="success" size="medium" icon="el-icon-search" circle style="margin-left: 150px"
                         @click="submitForm()"></el-button>
            </el-tooltip>

            <el-tooltip content="查询重置" placement="top">
              <el-button type="danger" size="medium" icon="el-icon-refresh" circle
                         @click="resetForm('ruleForm')"></el-button>
            </el-tooltip>

          </el-form-item>
        </div>

      </el-form>

    </div>
    <div class="dataTable" style="float: left;">

      <div style="float: left; " >
        <el-checkbox v-model="pass" @change="submitForm">通过审核</el-checkbox>
        <el-checkbox v-model="wait" @change="submitForm">未审核</el-checkbox>
        <el-checkbox v-model="back" @change="submitForm">审核驳回</el-checkbox>
      </div>
      <transition model="out-in">
        <projectShowPage v-if="resultShow" :searchProject="true"></projectShowPage>
      </transition>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import projectShowPage from '@/components/views/ProjectShowPage'

  export default {
    components: {
      projectShowPage,
    },

    data() {
      return {
        pass: true,
        wait: true,
        back: true,

        ruleForm: "",
        resultShow: true,
        departments: [],
        projecttypes: [],
        project: [],
        rules: {}
      }
    },
    created() {
      //查部门
      this.departments = this.$store.state.departments;
      //查项目
      this.projecttypes = this.$store.state.projecttypes;
      this.project = this.$store.state.searchPo;
      this.submitForm();
    },
    methods: {

      resetForm(ruleForm) {


        this.$refs[ruleForm].resetFields();
        this.$store.commit("setSearhPoEmpty");
        //this.project = this.$store.state.searchPo;

        this.$notify({
          type: "success",
          message: '查询重置成功'
        });
      },

      getCheckids() {
        let checkids = [];
        //添加审核条件
        if (this.pass) {
          checkids.push(1);
        }
        if (this.wait) {
          checkids.push(0);
        }
        if (this.back) {
          checkids.push(2);
        }
      return checkids;
      },

      submitForm() {


        if (this.$store.state.user.authority != "1") {

          //只查询自己上传的
          this.project.submitter = this.$store.state.user._id;
        }

        this.project.checkids = this.getCheckids();
        if (this.project.startingtime) {
          this.project.startingtime[1].setDate(this.project.startingtime[1].getDate() + 1);
        }
        if (this.project.uploadtime) {
          this.project.uploadtime[1].setDate(this.project.uploadtime[1].getDate() + 1);
        }
        this.resultShow = false;
        //提交至数据库查找
        let myFormDatas = new FormData();

        myFormDatas.append("info", JSON.stringify(this.project));
        axios({
          url: 'http://localhost:3000/files/findByPo',
          method: 'POST',
          data: myFormDatas
        })
          .then((result) => {
            this.$notify({
              type: "success",
              message: '查询成功'
            });
            this.$store.commit("setSearchProject", result.data.data);
            //console.log( result.data.data);
            this.resultShow = true;
            this.$store.state.searchPo = this.project;
          })
          .catch((err) => {
            this.$notify({
              type: "error",
              message: '查询失败：' + err
            });
          })
      },
    }
  }
</script>

<style scoped>

  .div {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  el-form-item {
    float: left;
  }

  div {
    margin: 1px;
    padding: 1px;
  }

  .v-enter, .v-leave-to {
    opacity: 0;
    transform: translateX(100%);
  }

  .v-enter-active,
  .v-leave-active {
    transition: all 0.5s ease;
  }

</style>
