<template>

  <div class="content">

<!--    <div class="welcome" v-show="welcomeShow">
      <Welcome></Welcome>
    </div>

    <div class="uploadPage" v-show="uploadPageShow">
      <UploadPage></UploadPage>
    </div>

    <div class="HandListPage" v-show="handListPageShow">
     <HandListPage></HandListPage>
    </div>-->

    <transition model="out-in">
       <router-view></router-view>
    </transition>

  </div>


</template>

<script>
  import UploadPage from '@/components/views/UploadPage'
  import HandListPage from '@/components/views/HandListPage'
  import Welcome from "../views/AllProject";

  export default {
    name: "Content",
    components: {
      Welcome,
      UploadPage,
      HandListPage
    },
    mounted(){

    },

    data() {
      return {
       /* handListPageShow:0,
        welcomeShow: 1,
        uploadPageShow:0*/

      }
    },
    methods: {
      switcher: function (val) {
        let self = this;

        self.welcomeShow = 0;
        self.uploadPageShow =0;
        self.handListPageShow =0;

        if (val === 'uploadPageShow'){
          self.uploadPageShow =1
        }else if(val === 'welcomeShow'){
          self.welcomeShow =1
        }else if(val === 'handListPageShow'){
          self.handListPageShow =1
        }else {
          return 0;
        }
      }
    }
  }

</script>
<style>
  .v-enter{
    opacity: 0;
    transform: translateX(100%);

  }
  .v-leave-to{
    opacity: 0;
    transform: translateX(-100%);
    position: absolute;
  }
  .v-enter-active,
  .v-leave-active{
    transition: all 0.5s ease;
  }
  .content{
    text-align:center
  }
</style>

