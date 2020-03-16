<template>
  <div>
    <h1>欢迎  <span style="color: red">{{this.$store.state.user.username}}  </span> 登录</h1>
    <img src="../Public/Image/1.jpg" style="height: 500px">
  </div>
</template>

<script>
  export default {
    name: "Welcome",
    data() {
      return {
      }
    }
  }
</script>
<style>

</style>
