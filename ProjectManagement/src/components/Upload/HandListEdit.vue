<template>

  <div id="app">
    <el-table :data="tableData" class="tb-edit" style="width: 100%" highlight-current-row @row-click="handleCurrentChange">

      <el-table-column label="名称" width="170">
        <template slot-scope="scope">
          <el-input type="textarea" size="small" v-model="scope.row.name" placeholder="请输入内容" @change="handleEdit(scope.$index, scope.row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="数量" width="170">
        <template slot-scope="scope">
          <el-input type="textarea" size="small" v-model="scope.row.quantity" placeholder="请输入内容" @change="handleEdit(scope.$index, scope.row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column width="170" label="规格">
        <template  slot-scope="scope">
          <el-input type="textarea" size="small" v-model="scope.row.specification" placeholder="请输入内容" @change="handleEdit(scope.$index, scope.row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column width="170" label="备注">
        <template slot-scope="scope">
          <el-input type="textarea" size="small" v-model="scope.row.remak" placeholder="请输入内容" @change="handleEdit(scope.$index, scope.row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!--<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
          <el-button  icon="el-icon-delete" circle @click="handleDelete(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button  icon = "el-icon-circle-plus-outline" @click="addItem">添加条目</el-button>
    <notification :notifiMessage="notifiMessage" v-if="notifiShow"></notification>
    </div>

</template>

<script>
  import axios from 'axios'
  import  notification from '@/components/Public/Notification'
  export default {
    data() {
      return {
        tableData: [],
        notifiMessage:"",
        notifiShow:false,
      }
    },
    components:{
      notification,
    },

    created(){
      let project = this.findById(this.$route.query._id);
    },
    methods: {
      handleCurrentChange(row, event, column) {
        //console.log(row, event, column, event.currentTarget)
      },
      handleEdit(index, row) {
       // console.log(index, row);
      },
      //删除条目
      handleDelete(index, row) {
        if(window.confirm('你确定要删除条目：“'+row.name+'” 吗？')) {

          //this.tableData.remove(index);
          this.tableData.splice(index,1);
        }else
        {

        }
      },

      //查找项目
      findById(_id){
        if(_id){
          let  myFormDatas = new FormData();
          myFormDatas.append("_id",_id);
          axios({
            url: 'http://localhost:3000/files/findById',
            method: 'POST',
            data: myFormDatas
          })
            .then((result) => {
              if(result.data.status === 0)
              {
                //console.log();
               // console.log(result.data.data.handlist);
                this.tableData =  result.data.data.handlist;
                this.$store.state.handlistEdit = this.tableData;
              }
            })
            .catch((err) => {
            })
        }
      },
      //添加条目数据
      addItem(){
          this.tableData.push({id :'',name: '',quantity:'',specification:'',remak:''});
      },
    }
}

</script>
