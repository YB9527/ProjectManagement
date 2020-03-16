<template>
  <div>
    <el-menu :default-active="this.$route.path" router mode="horizontal"
             background-color="#545c64"
             text-color="#fff"
             active-text-color="#ffd04b"
             class="el-menu-demo">
      <el-menu-item v-for="(item,i) in navList" :key="i" :index="item.name">
        {{ item.navItem }}
      </el-menu-item>

      <el-submenu index="6" style="float: right">
        <template slot="title">当前用户：{{this.$store.getters.user.username}}</template>
        <el-menu-item index="6-1" @click="changeUser">切换帐号</el-menu-item>
        <el-menu-item index="6-2" @click="GoToBackend" v-show="this.$store.getters.user.authority ==1" >进入后台</el-menu-item>
        <el-menu-item index="6-3" @click="Exit">退出</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>

</template>

<script>
    export default {
        name: "Top",
      data(){
        return {

          navList:[

          ]
        }
      },
      created() {
          this.addItem();
      },
      methods:{
        GoToBackend(){
          this.$router.push({ path: "/admin/adminHome/adminmain/adminindex" });
        },
          //
        changeUser(){
          this.$router.push({path:"/"});
        }
        ,Exit(){
          this.$store.commit("setUserEmpty");
          this.$router.push("/Exit");
        },
        addItem(){
          let user = this.$store.getters.user;
          let authority =this.$store.state.user.authority;
          if(!authority)
          {
            this.$notify.error({
              title: '',
              message: '请登录'
            });
            this.$router.push({path:"/"});

          }else
          {

            this.navList.push({name:'/home/Content/Welcome',navItem:'主页'});

            if(this.$store.state.user.authority == 2)
            {
              this.navList.push({name: '/home/Content/UploadPageStep',navItem:'创建项目'});
              this.navList.push({name:'/home/Content/AllProject',navItem:'已通过项目'});
              this.navList.push({name:'/home/Content/ProjectWaitPass',navItem:'未通过项目'});
              this.navList.push({name:'/home/Content/SearchProject',navItem:'查询项目'});
              this.navList.push({name:'/home/Content/ProjectShare',navItem:'项目文件归档区'});
              this.navList.push({name:'/home/Content/RecycleBin',navItem:'项目回收站'});
            }else if(this.$store.state.user.authority == 1){
            this.navList.push({name: '/home/Content/UploadPageStep',navItem:'创建项目'});
            this.navList.push({name:'/home/Content/AllProject',navItem:'已通过项目'});
            this.navList.push({name:'/home/Content/SearchProject',navItem:'查询项目'});
            //this.navList.push({name:'/home/Content/ProjectWaitPass',navItem:'未通过项目'});
            this.navList.push({name:'/home/Content/ProjectShare',navItem:'项目文件归档区'});
            this.navList.push({name:'/home/Content/CheckProject',navItem:'需要审批项目'});
            this.navList.push({name:'/home/Content/RecycleBin',navItem:'项目回收站'});
            }
          }
        },

      }
    }
</script>

<style >
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 0px;
  }
</style>
