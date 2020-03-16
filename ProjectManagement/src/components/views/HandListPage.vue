<template>
  <div style="margin: 100px 100px 100px 100px">
    <el-form :inline="true"  :model="dynamicValidateForm" class="demo-form-inline"    >
      <div class="list-group-item" v-for="(item, i) in list" :key="item.id">
        <el-form-item   >
          --第{{i+1}}条--
        </el-form-item>

        <el-form-item label="名称"  prop="email"  >
          <el-input v-model="item.name"  ></el-input>
        </el-form-item>

        <el-form-item label="数量">
          <el-input v-model="item.quantity" ></el-input>
        </el-form-item>
        <el-form-item label="规格">
          <el-input v-model="item.specification"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="item.remak" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" plain icon="el-icon-delete" circle @click="deleteItem(i)" ></el-button>
        </el-form-item>
      </div>
      <div>
        <el-button type="success" plain @click="addItem" >添加条数</el-button>
        <el-button type="success" plain @click="onSubmit" >下一步</el-button>
      </div>

    </el-form>
  </div>
</template>

<script>
  export default {
    props: ["next"],
    data() {
      return {
        dynamicValidateForm: {
        },
        name1:'556',
        list: [],
        formInline: {
          user: '',
          region: '',
        },
        rules: {
          name: [
            {required: true, message: '请输入项目名称', trigger: 'blur'}
          ]
        }
      }
    },
    created: function () {
      //查找数据库
     this.addItem();
    },
    methods: {
      onSubmit() {
        this.next(this.list);
      },
      deleteItem(index){
        //this.list.splice(index, 1);
        this.list.splice(index,1);
        //console.log(this.list);
      },
      addItem(){
        this.list.push({id :'',name: '',quantity:'',specification:'',remak:''});
        //console.log(this.list);
        //this.$http.get("api/getimgcategory").then(result => {});

      }
    }
  }
</script>

<style scoped>
  #addBtu{
    position: absolute;
    left: 1370px;
    top: 76px;

  }

</style>
