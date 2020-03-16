// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'


import './assets/icon/iconfont.css';


import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'


Vue.use(ElementUI);


Vue.config.productionTip = false;

import VueResource from 'vue-resource'

Vue.use(VueResource);
//Vue.http.options.root = 'http://localhost:3000';//请求的地址
/* eslint-disable no-new */

import axios from 'axios'

Vue.use(axios);
axios.defaults.baseURL = "http://localhost:3000";

import moment from 'moment'
import VuePreview from 'vue-preview'

Vue.use(VuePreview);

import uploader from 'vue-simple-uploader'

Vue.use(uploader);

import Vuex from 'vuex'
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    uploadEdit: "",
    handlistEdit: "",
    project: "",
    projecttypes: [],
    projectstates: [],
    users: [],
    departments: "",
    searchProject: [],
    searchPo: {
      name: "",
      snnumber: "",
      typeid: "",
      departmentid: "",
      submitter: "",
      recipient: "",
      projectleader: "",
      remark: "",
      startingtime: '',
      uploadtime: '',
      state: false,
      checks: [],
    },
    canEdit: false,
    user: {
      username: "", _id: "", authority: ""
    },
    recipients: [],
  },
  getters: {
    projectstates:function (state){
      return state.projectstates;
    },
    searchProject:function (state){
      return state.searchProject;
    },
    recipients: function (state) {
      return state.recipients;
    },

    currentProjects: function (state) {
      return state.searchProject;
    },
    users: function (state) {
      return state.users;
    },
    user: function (state) {
      return state.user;
    },
    Authority: function (state) {
      if (state.user.authority === 3) {
        return false;
      } else {
        return true;
      }
    },
    checks: function (state) {
      return state.checks;
    },
    canEdit: function (state) {
      if (state.user.authority === "1" || state.user.authority === "2")
        return true;
    }

  },

  mutations: {

    canEdit(state) {

      if (state.uploadEdit.checkid == 1) {
        Vue.prototype.$notify.error({
          type: "error",
          message: "数据已经通过审核，无法修改"
        });

        state.canEdit = false;

      } else {
        state.canEdit = true;
      }
    },
    checkAuthority(state) {
      if (state.user.authority === 3) {

        Vue.prototype.$notify.error({
          type: "error",
          message: "身份为游客，无法使用"
        });
        return false;
      } else {
        return true;
      }
    },

    setUserEmpty(state) {
      this.state.user = {username: "", authority: ""};
    },
    setSearhPoEmpty(state) {
      state.searchPo.name = "";
      state.searchPo.snnumber = "";
      state.searchPo.typeid = [];
      state.searchPo.departmentid = [];
      state.searchPo.submitter = [];
      state.searchPo.recipient = [];
      state.searchPo.projectleader = "";
      state.searchPo.remark = "";
      state.searchPo.startingtime = '';
      state.searchPo.uploadtime = '';
      state.searchPo.state = false;
    },
    //设置文件的大小
    setProjectSize(state, projects) {
      if (projects) {
        for (let project of projects) {
          let size = 0;
          for (let file of project.filelist) {
            //console.log(file);
            size += file.file.size;
          }
          size = size / 1048576;
          if (size == 0) {
            project.documentsize = "没有文件";
          } else if (size < 1024) {
            project.documentsize = size.toFixed(2) + "M";
          } else {
            project.documentsize = (size / 1024).toFixed(2) + "G";
          }

        }
      }
    },
    setProjectstate(state, projects) {
      //console.log(projects);
      //console.log( state.projectstates);
      for (let projetct of projects) {

        for (let obj of state.projectstates) {
          if (projetct.projectstateid === obj._id) {

            projetct.projectstateName = obj.projectstate;
            break;
          }
        }
      }
    },
    setUser(state, user) {
      state.user = user;

    },

    setProjectAttribute(state, projects) {

      this.commit("setProjecttype", projects);
      this.commit("setDepartment", projects);
      this.commit("setProjectstate", projects);

    },
    //设置查询结果
    setSearchProject(state, projects) {
      state.searchProject.splice(0, state.searchProject.length);
      this.commit("setProjectAttribute", projects);
      for (let projetct of projects) {
        state.searchProject.push(projetct);
      }
      this.commit("setProjectSize", projects);
    },
    setProjecttype(state, projects) {
      for (let projetct of projects) {
        for (let projecttype of state.projecttypes) {
          if (projetct.typeid === projecttype._id) {
            projetct.typename = projecttype.typename;
            break;
          }
        }
      }
    },
    setDepartment(state, projects) {

      for (let projetct of projects) {
        for (let department of state.departments) {
          if (projetct.departmentid === department._id) {
            projetct.departmentname = department.departmentname;
            break;
          }
        }

      }
    },
    setUploadEdit(state, upload) {
      state.uploadEdit = upload;
    },
    setHandlistEdit(state) {
      //state.handlistEdit = handlist;
    },
    //查询项目
    findProjectById(store, _id) {
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
              store.project = result.data.data;

            }
          })
          .catch((err) => {
          })
      }
    },
    //查询项目类型
    findProjecttypes(store) {

      if (store.projecttypes.length != 0) {

        return;
      }
      let myFormDatas = new FormData();
      axios({
        url: 'http://localhost:3000/projecttypes/findAll',
        method: 'POST',
        data: myFormDatas
      })
        .then((result) => {
          if (result.data.status === 0) {
            store.projecttypes = result.data.data;

          }
        })
        .catch((err) => {
        })
    },
    //查询部门
    findDepartment(store) {
      let myFormDatas = new FormData();
      axios({
        url: 'http://localhost:3000/departments/findAll',
        method: 'POST',
        data: myFormDatas
      })
        .then((result) => {
          if (result.data.status === 0) {
            store.departments = result.data.data;
          }
        })
        .catch((err) => {
        })
    },

    searchProjectAll(state,callBack)
    {
      let myFormDatas = new FormData();
      axios({
        url: 'http://localhost:3000/files/project',
        method: 'POST',
        data: myFormDatas
      })
        .then((result) => {
     
          if (result.data.status == 0) {
            this.commit("setProjectSize", result.data.data);
            this.commit("setSearchProject", result.data.data)
            callBack(result.data.data);
          }
        })
    },

    //根据用户的级别查询
    searchProjectAllCallback(state, callBack) {

      let self = this;
      let myFormDatas = new FormData();

      if (state.user.authority == "1") {
        //查询所有
        axios({
          url: 'http://localhost:3000/files/project',
          method: 'POST',
          data: myFormDatas
        })
          .then((result) => {

            if (result.data.status == 0) {
              this.commit("setProjectSize", result.data.data);
              this.commit("setSearchProject", result.data.data)
              callBack(result.data.data);
            }
          })
      } else if (state.user.authority == "2") {

        //只查询自己上传的
        let userId = state.user._id;
        let po = {"submitter": userId};
        let array = [];
        array[0] = po;
        array[1] = callBack;
        this.commit("searchProject", array);

      }
    },
    searchProject(state, po) {

      let myFormDatas = new FormData();
      let isArray = false;
      if (po instanceof Array) {
        isArray = true;
      }

      if (isArray) {

        if (state.user.authority != "1") {

          //只查询自己上传的
          po[0].submitter = state.user._id;
        }
        myFormDatas.append("info", JSON.stringify(po[0]));
      } else {

        if (state.user.authority != "1") {

          //只查询自己上传的
          po.submitter = state.user._id;
        }
        myFormDatas.append("info", JSON.stringify(po));
      }


      axios({
        url: 'http://localhost:3000/files/findByPo',
        method: 'POST',
        data: myFormDatas
      })
        .then((result) => {

          this.commit("setSearchProject", result.data.data);

          if (isArray) {
            po[1](result.data.data);
          }
        })
    },
    uploadEdit(state, project) {

      let myFormDatas = new FormData();
      myFormDatas.append("info", JSON.stringify(project));
      axios({
        url: 'http://localhost:3000/files/editPrj',
        method: 'POST',
        data: myFormDatas
      })
        .then((result) => {
          if (result.data.status === 0) {

          }
        })
        .catch((err) => {
        })
    },
  }
});
export default store


Vue.filter('dataFormat', (dataStr, pattern = "YYYY-MM-DD HH:mm:ss") => {
  return moment(dataStr).format(pattern);

});
/*
Vue.filter('typenameFormat', (_id) => {
  console.log("gogogo！！！",this.$store);

});

Vue.filter('departmentnameFormat', (_id) => {


});
*/

new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>',


});

