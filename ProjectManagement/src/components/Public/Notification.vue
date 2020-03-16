<template>
<div>
  <!--    <el-button
    plain
    @click="open">
    可自动关闭
  </el-button>
 <el-button
    plain
    @click="open2">
    不会自动关闭
  </el-button>-->
    </div>
</template>

<script>
  export default {
    data(){

    },
    created: function () {
      this.open();
    }
    ,
    props: ["notifiMessage"]
    ,
    methods: {

      open() {
        const h = this.$createElement;

        this.$notify({
          //title: '标题名称',
          message: h('i', { style: 'color: teal'},this.notifiMessage)
        });
      },

    }
  }
</script>

<style scoped>

</style>
