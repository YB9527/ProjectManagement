<template>
  <div class="body">
    <el-row :gutter="30">
      <el-col :span="6"><div class="grid-content bg-purple">名称</div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple">数量</div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple">规格</div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple">备注</div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple">操作</div></el-col>
    </el-row>
    <el-form  :inline="true" :model="formInline" class="demo-form-inline"    >
      <el-input ></el-input>
      <el-input ></el-input>
      <el-input ></el-input>
      <el-input ></el-input>
      <el-button type="primary"  >删除</el-button>
    </el-form>
  </div>


</template>

<script>
  export default {
    data(){
      return{
        formInline: {
          user: '',
          region: ''
        }
      }

    }
  }

</script>
<style>
  .el-row {
    margin-bottom: 20px;

  }
  .el-col {
    border-radius: 4px;
    width: 20%;
    padding-left: 2px;
    padding-right: 2px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {

    background-color: #f9fafc;
  }
  .body{
    width: 700px;
  }
</style>
