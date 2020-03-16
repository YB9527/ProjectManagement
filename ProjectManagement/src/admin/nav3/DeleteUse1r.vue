<template>
<div>
<el-button type="text" @click="dialogFormVisible = true">打开嵌套表单的 Dialog</el-button>

<el-dialog title="用户信息" :visible.sync="dialogFormVisible" width="35%">
  <el-form :model="form" >
    <el-form-item label="用户名" :label-width="formLabelWidth">
      <el-input v-model="form.name" ></el-input>
    </el-form-item>
    <el-form-item label="密码" :label-width="formLabelWidth">
      <el-input v-model="form.password" ></el-input>
    </el-form-item>
    <el-form-item label="活动区域" :label-width="formLabelWidth">
      <el-select v-model="form.Authority" placeholder="请选择管理员权限">
        <el-option label="管理员" value="1"></el-option>
        <el-option label="用户" value="2"></el-option>
        <el-option label="游客" value="3"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
  </div>
</el-dialog>
</div>
</template>
<script>
export default {
    data() {
      return {
        dialogFormVisible: false,
        form: {
          name: '',
          password:"",
          Authority: '',
        },
        formLabelWidth: '120px'
      };
    }
}
</script>

