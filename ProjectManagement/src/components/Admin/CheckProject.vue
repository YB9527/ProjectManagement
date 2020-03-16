<template>
  <div>
    <projectShowPage :findProject="findProject"></projectShowPage>
  </div>

</template>

<script>
  import axios from 'axios'
  import projectShowPage from '@/components/views/ProjectShowPage'

  export default {
    name: "CheckProject",
    components: {
      projectShowPage,
    },
    created() {


    },
    methods: {
      findProject(callback){
        let po = {"checkid": "0", "state": false};
        this.$store.commit("searchProject",[po,(data)=>{
          callback(data);
        }]);
      },
    }
  }
</script>

<style scoped>

</style>
