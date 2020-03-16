<template>
<div>
  <div style="width: 300px ;float : left">
    <h3>基本数据</h3>
    <uploadPage ></uploadPage>
  </div>
  <div id="handList">
  <h3>数据清单</h3>
    <handListEdit ></handListEdit>
  </div>
  <el-button type="danger"  style="margin-top: 50px;" @click="comeback">返回</el-button>
  <el-button type="success" icon="el-icon-check" style="margin-top: 50px;" @click="submit">提交数据</el-button>
</div>
</template>

<script>
  import uploadPage from '@/components/views/UploadPage'
  import handListEdit from '@/components/Upload/handListEdit'
  import axios from "axios"

    export default {
        data(){
          return{

          }
        },
        name: "ProjectEdit",
        components:{
          uploadPage,
          handListEdit,

        },
      created() {

      },
      methods:{
        comeback(){
          this.$router.go(-1);
        },
        //提交到数据库修改
        uploadEdit(project){

          let  myFormDatas = new FormData();
          myFormDatas.append("info",JSON.stringify(project));
          axios({
            url: 'http://localhost:3000/files/editPrj',
            method: 'POST',
            data: myFormDatas
          })
            .then((result) => {
              if(result.data.status === 0)
              {

              }
            })
            .catch((err) => {
            })
        },
        submit(){


          this.$store.commit("checkAuthority");
          if(!this.$store.getters.Authority) {
            return;
          }

          this.$store.commit("canEdit");
          let prject = this.$store.state.uploadEdit;

          if(prject.checkid == 1)
          {
            return ;
          }
          if(window.confirm('你确定要修改项目：'+prject.name+'，吗？')) {
            prject.handlist = this.$store.state.handlistEdit;
            this.uploadEdit(prject);
            this.$notify({
              type:"success",
              message: '数据提交成功'
            });
            //this.$router.push({path: '/'})
            this.$store.commit("searchProjectAll");
            this.$router.go(-1);
          }
        },

      }
    }
</script>

<style scoped>
#handList{
  border: 2px #2bffe7 solid;
  float:left;
  margin-left: 50px;
}
</style>
