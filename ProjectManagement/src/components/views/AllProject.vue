<template>
    <div>
      <projectShowPage :findProject="findProject"></projectShowPage>
    </div>
</template>

<script>
  import axios from 'axios'
  import projectShowPage from '@/components/views/ProjectShowPage'
    export default {
        name: "Welcome",
      data(){
          return {

          }
      },

      components:{
        projectShowPage,
      },
        data(){
         return {
            res:''
         }
        },

      mounted(){


      },
      methods :{
        findProject(callback){
          let po = {"checkid":"1","state":false};
          this.$store.commit("searchProject",[po,(data)=>{
            callback(data);

          }]);
        },

        searchProject(po) {
          let myFormDatas = new FormData();
          myFormDatas.append("info", JSON.stringify(po));
          axios({
            url: 'http://localhost:3000/files/findByPo',
            method: 'POST',
            data: myFormDatas

          })
            .then((result) => {
                this.$store.commit("",result.data.data);
            })
        }
      }
    }
</script>

<style scoped>

</style>
