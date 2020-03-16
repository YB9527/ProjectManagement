import Vue from "vue/types/vue";

function checkAuthority() {
  if(this.$store.state.user.authority === 3)
  {
    Vue.prototype.$notify.error({
      type: "error",
      message: "身份为游客，无法使用"
    });
    return false;
  }else
  {
    return  true;
  }
}
module.exports = {
  checkAuthority
};
