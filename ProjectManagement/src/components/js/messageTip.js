function success(message) {
  this.$notify({
    title: '成功',
    message: message,
    type: 'success'
  });
}
function warning(message) {
  this.$notify({
    title: '警告',
    message: message,
    type: 'warning'
  });
}

function open5(message) {
  this.$notify.info({
    title: '消息',
    message: message
  });
}

function error(message) {
  this.$notify.error({
    title: '错误',
    message: message
  });
}
module.exports = {
  success
};
