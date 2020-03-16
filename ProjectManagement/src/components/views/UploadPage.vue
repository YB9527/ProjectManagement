<template>
  <div>

    <div class="uploadPageDiv">
      <div style="float: left">
        <el-form :model="upload" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

          <el-form-item label="项目名称" prop="name">
            <el-input v-model="upload.name" @blur="change"></el-input>
          </el-form-item>

          <el-form-item label="项目编号" prop="snnumber">
            <el-input v-model="upload.snnumber"></el-input>
          </el-form-item>

          <el-form-item label="启动日期" prop="startingtime">
            <el-date-picker
              v-model="upload.startingtime"
              type="date"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="项目类别" prop="typeid">
            <el-select v-model="upload.typeid" placeholder1="请选择类别" @change="setProjectstate">
              <el-option v-for="(op ,index ) in projecttype" v-bind:value="op._id" :label="op.typename" :key="index">
                {{ op.typename }}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择阶段" prop="projectstateid" >
            <el-select v-model="upload.projectstateid" placeholder="请先选择项目类型">
              <el-option v-for="(op ,index ) in stateList" v-bind:value="op.id" :label="op.projectstate"
                         :key="index">
                {{ op.projectstate }}
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="选择部门" prop="departmentid" name="departmentid">
            <el-select v-model="upload.departmentid" placeholder="请选择部门">
              <el-option v-for="(op ,index ) in department" v-bind:value="op._id" :label="op.departmentname"
                         :key="index">
                {{ op.departmentname }}
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="项目负责人" prop="projectleader">
            <el-input v-model="upload.projectleader" name="projectleader"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="upload.remark" name="remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div v-show="show" class="btu">

        <el-button type="danger" @click="resetForm('ruleForm')">重置填写</el-button>
        <el-button type="success" @click="submitForm('ruleForm')">下一步</el-button>

      </div>
      <span v-show="false">{{aa}}</span>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    props: ["next", "project"],

    data() {
      return {
        projecttype: [],
        department: [],
        projectstate:[],
        stateList:[],
        show: 1,
        upload: {
          filelist: [],
          handlist: [],
          typeid: '',
          departmentid: '',
          name: '',
          snnumber: '',
          submitter: this.$store.getters.user._id,
          recipient: "",
          projectleader: '',
          remark: '',
          startingtime: '',
          satae: false,
          delteTime: '',
          projectstateid:'',
        },
        rules: {

          name: [
            {required: true, message: '请输入项目名称', trigger: 'blur'},
            {min: 3, message: '长度在 3 到 5 个字符', trigger: 'blur'}
          ],
          snnumber: [
            {required: true, message: '请输入项目编号', trigger: 'blur'},
            {min: 3, message: '长度在 3 到 5 个字符', trigger: 'blur'}
          ],
          typeid: [
            {required: true, message: '请选择活动区域', trigger: 'change'}
          ],
          departmentid: [
            {required: true, message: '请选择部门', trigger: 'change'}
          ],
          projectstateid: [
            {required: true, message: '请选择阶段', trigger: 'change'}
          ],
          submitter: [
            {required: true, message: '请填写提交人', trigger: 'blur'},
            {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
          ],

          recipient: [
            {required: true, message: '请填写接收人', trigger: 'blur'},
            {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
          ],
          projectleader: [
            {required: true, message: '请填写名字', trigger: 'blur'},
            {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
          ],
          startingtime: [
            {required: true, message: '请选择日期', trigger: 'change'}
          ],
        }
      };
    },
    computed:{
     aa: function(){

      }
    },
    created() {
      this.getProjecttype();
      this.departmentlist();

      let myFormDatas = new FormData();
      this.findById(this.$route.query._id);

    },

    methods: {
      setProjectstate(value){

        this.upload.projectstateid ="";
        this.$store.state.projecttypes.find(item =>{
          if(this.upload.typeid === item._id)
          {
            this.stateList = item.projectstatelist;
            return item;
          }
        });

/*
        this.upload.projectstateid ="";


        this.stateList.splice(0);
        for(let item of this.projectstate)
        {
          if(item.typename === value)
          {
            this.stateList.push(item);
          }
        }
*/

      },
      findById(_id) {
        if (_id) {
          let myFormDatas = new FormData();
          myFormDatas.append("_id", _id);
          axios({
            url: 'http://localhost:3000/files/findById',
            method: 'POST',
            data: myFormDatas
          })
            .then((result) => {
              if (result.data.status === 0) {
                this.upload = result.data.data;

                this.$store.state.uploadEdit = this.upload;
                this.findProjectstateAll();

                for(let item of this.projectstate)
                {
                  if(item.typename === this.upload.typeid)
                  {
                    this.stateList.push(item);
                  }
                }
                this.show = 0;
              }
            })
            .catch((err) => {
            })
        }
      },
      ArrayContains(array, value) {

        for (let op of array) {

          if (op.typename === value) {
            return true;
          }
        }
        return false;
      },

      findProjectstateAll: function () {


        this.$store.state.projecttypes.find(item =>{
          if(this.upload.typeid === item._id)
          {
            this.stateList = item.projectstatelist;
            return item;
          }
        });

      },

      departmentlist: function () {
        this.$http.post('http://localhost:3000/departmentlist', {}, {
          emulateJSON: true
        }).then(function (result) {
          let res = result.data.data;
          this.department = res;
        }).catch(function () {
          console.log("服务器异常");
        });
      },

      getProjecttype() {
        this.$http.post('http://localhost:3000/projecttype', {}, {
          emulateJSON: true
        }).then(function (result) {

          let res = result.data.data;
          this.projecttype = res;





        }).catch(function () {
          console.log("服务器异常");
        });
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {

            this.next(this.upload);
          } else {

            return false;
          }
        });
      },
      resetForm(formName) {

        this.$refs[formName].resetFields();
      },
      checkContent(value) {
        //let self = this

        alert(value)
      },
      change(index, e) {
        //console.log(index)
      },
      test() {
        alert(123)
      },
      arrayIsContins() {

      },
      addLeiBie() {


      },
    }
  }
</script>

<style scoped>
  .btu {
    float: left;
    width: 500px;
    margin: 50px 50px 50px 50px;
  }

  el-input {
    text-align: right;
    height: 50px;
    margin: 0;
    padding: 0;
  }

  .el-form-item {
    margin-bottom: 20px;
  }
</style>
