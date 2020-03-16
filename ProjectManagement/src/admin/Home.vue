<template>
<div>
  <div v-show="this.$store.getters.user.username !== '' ">
  <el-container>
    <el-header style="text-align: right;background-color:#545c64">
      <img src="./images/indextoplogo.png" height="60px" style="float:left;">
     <!-- <div width="200px">
        <img src="./images/indextoplogo.png" height="60px" style="float:left;">
 <h1 style="color:#409EFF;font-size:30px;margin-left:30px">项目档案管理系统后台</h1> -->
<!--</div> -->

      <el-col style="margin-top:-30px">
        <el-dropdown trigger="hover">
          <!-- <span style="color:#F00">
            <img style="max-width: 30px;transform:scale(1)" src="./images/yb.png">
          </span> -->
          <span class="usespan"><i class="iconfont icon-webduanmobancaozuo_renyuanxinxi"></i> {{usename}} (管理员)</span>
          <!-- <span><i class="iconfont icon-webduanmobancaozuo_renyuanxinxi"></i> {{this.$store.state.username.useName}}(管理员)</span> -->
             <!-- <i class="iconfont"></i> -->
           <!-- <i prefix-icon="iconfont icon-webduanmobancaozuo_renyuanxinxi"></i> -->

           <!-- <span  style="color: #fff;display:table-cell;vertical-align: middle;text-align: center;line-height:40px"> <img src="./images/yb.png" style="width:35px;transform:scale(1);margin-top:-20px"/>{{useName}}(管理员)</span>
           -->
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="indexfc()"><i class="el-icon-bell"></i>主页</el-dropdown-item>
            <el-dropdown-item  @click.native="indexfc()"><i class="el-icon-setting"></i>设置</el-dropdown-item>
            <el-dropdown-item  @click.native="indexout()"><i class="el-icon-delete"></i>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-header>
    <el-container>
      <el-aside id="elaside" :style="{'height':asheight}">
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          router :default-active="$route.path"

        >
        <el-menu-item  index="/admin/adminHome/adminmain/adminindex">
            <i class="el-icon-bell"></i>
            <span slot="title">主页</span>
          </el-menu-item>
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>类别管理</span>
            </template>
            <el-submenu index="1-1">
              <template slot="title" >部门</template>
              <el-menu-item index="/admin/adminHome/adminmain/adddepartment">新增部门</el-menu-item>
              <el-menu-item index="/admin/adminHome/adminmain/deletedepartment">编辑部门</el-menu-item>
            </el-submenu>
            <el-submenu index="1-2">
              <template slot="title" >项目类别</template>
              <el-menu-item index="/admin/adminHome/adminmain/addprojecttype">新增类别</el-menu-item>
              <el-menu-item index="/admin/adminHome/adminmain/deleteprojecttype">编辑类别</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-menu-item >
            <i class="el-icon-document"></i>
            <span slot="title">档案管理</span>
          </el-menu-item>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/admin/adminHome/adminmain/adduser">新增用户</el-menu-item>
            <el-menu-item index="/admin/adminHome/adminmain/deleteuser">编辑用户</el-menu-item>
          </el-submenu>
          <el-menu-item >
            <i class="el-icon-menu"></i>
            <span slot="title">人员管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main >
        <!-- 内容界面 -->
        <adminmain></adminmain>
      </el-main>
    </el-container>
  </el-container>
   </div>
  </div>
</template>

<style>
/* span{

} */
.el-header {
  color: rgb(255, 255, 255);
  line-height: 20px;
  position: relative;
  align-items: center;
}
.usespan{
color: rgb(255, 255, 255)
}
/* .elmenu {
  background-color: #545c64;
} */
.l-menu-item {
  margin-right: 10%;
}

.el-aside {
  /* height:1000px; */
  /* position: fixed; */
  /* height: 100%;
  width: 100%;
  margin-right: 10px; */
  /* z-index: 10; */
  background-color: #545c64;
}
</style>

<script>
// import { mapGetters } from 'vuex';
//import {mapState} from "vuex";
import adminmain from "@/admin/main";

export default {
  data() {
    return {
      asheight:"",
      islogin:false,
      item:{
        adminindexshow:1,
        oneshow:0,
      }
    };
  },
  created(){
    this.usename = this.$store.state.user.username;
  },
  components: {
    adminmain,
  },
  methods: {
     changeaside:function(){
       var orderHight = (window.innerHeight-60)+"px";
       this.asheight= orderHight;
     },
     changepage:function(pagename){
      for(var i in this.item){
        if(i==pagename){
          i=1
        }
        else{
          i=0
        }
      }
     },
     indexfc:function(value){
        this.$router.push({ path: "/admin/adminHome/adminmain/adminindex" });
     },
     indexout:function(value){
        this.$router.push({ path: "/" });
     },
  },

   mounted(){
      this.changeaside()
  },

};
</script>
