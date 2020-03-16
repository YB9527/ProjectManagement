<template>
  <div>
    <div id="myapp">
    <router-view name="Top"></router-view>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  import Top from '@/components/index/Top'
  import Left from '@/components/index/Left'
  import Content from '@/components/index/Content'
  import axios from 'axios'

  export default {
    name: 'App',
    data() {
      return {}
    },
    created() {
      this.$store.commit("findDepartment");
      this.$store.commit("findProjecttypes");

      this.findChecks();
      this.findProjectstate();
      this.findUsers();
    },
    methods: {
      findUsers() {
        this.$http.get('http://localhost:3000/users/findAll')
          .then(function (result) {
            let users = result.body.data;
            this.$store.state.users = users;
            //添加接收人
            this.$store.state.recipients.splice(0);
            for (let user of users) {

              if (user.authority == '1') {

                this.$store.state.recipients.push(user);
              }
            }

            //console.log("所有用户：", result.body.data);
          }).catch(function () {
          console.log("服务器异常");
        });
      },
      findChecks() {
        this.$http.post('http://localhost:3000/check', {}, {
          emulateJSON: true
        }).then(function (result) {
          // console.log(result.body.data);
          // console.log(result.body.data);
          this.$store.state.checks = result.body.data;
        }).catch(function () {
          console.log("服务器异常");
        });
      },

      findProjectstate() {
        this.$http.post('http://localhost:3000/projectstate', {}, {
          emulateJSON: true
        }).then(function (result) {
          // console.log(result.body.data);
          this.$store.state.projectstates = result.body.data;
        }).catch(function () {
          console.log("服务器异常");
        });
      },
      getGoodsList: function () {

        /*axios.get("/goods").then((result) => {
          let res = result.data;
          this.goodsList= res.data.result;
        });
  */
        this.get(1, function (data) {

        });
      },
      get(aa, callback) {
        if (aa) {
          callback(1);
        } else {

        }
      }
    }

  }
</script>

<style scoped>
  #myapp {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 0px;
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
