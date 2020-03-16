<template>
    <div>

      <el-button   style="float: left" type="success" @click="deleteOnOffFun" v-show="this.$store.getters.user.authority === 1 ">{{deleteOnOff}}</el-button>
      <el-button style="float: left" type="success" @click="searchPrj(searchkey)">项目名称查找</el-button>
      <el-input v-model="searchkey"></el-input>
      <div>
        <el-table
          :data="projects"
          border
        >
          <el-table-column
            type="index"
            label="序号"
            width="50">
          </el-table-column>
          <el-table-column
            prop="project.name"
            label="项目名称"
            width="190">
          </el-table-column>
          <el-table-column
            prop="project.snnumber"
            label="项目编号"
            width="100">
          </el-table-column>
          <el-table-column
            prop="project.typename"
            label="项目类别"
            width="100">
          </el-table-column>
          <el-table-column
            prop="project.departmentname"
            label="部门"
            width="120">
          </el-table-column>
          <el-table-column
            prop="documentsize"
            label="文件大小"
            width="100">
          </el-table-column>
          <el-table-column

            label="操作"
            width="130">
            <template slot-scope="scope">
              <div class="opreation">

                <el-tooltip content="上传文件管理" placement="top">
                  <el-button size="mini" type="info" icon="el-icon-upload" circle @click="downloadPrj(scope.$index, scope.row)"></el-button>
                </el-tooltip>
              <!--  <el-tooltip content="项目删除" placement="top">
                  <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="deletePrj(scope.$index, scope.row)"></el-button>
                </el-tooltip>-->
                <el-tooltip content="项目删除" placement="top" v-show="deleteShow">
                  <el-button type="danger" icon="el-icon-delete" circle size="mini"
                             @click="deletePrj(scope.$index, scope.row)"></el-button>
                </el-tooltip>

              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
</template>

<script>
  import axios from 'axios';
    export default {
        name: "ProjectShare",
      data(){
          return {
            searchkey:"",
            projects:[],
            deleteOnOff:"打开删除",
            deleteShow :false,
          }
      },
      created(){
          //查找shares
        this.searchPrj("");

      },
      methods:{
        searchPrj(searchkey){


          this.projects.splice(0,this.projects.length);
          this.findAll((data)=>{
            //console.log(1,data.data);
            let shares = data.data;
            if(shares.length === 0)
            {
              return ;
            }

            //查找所有项目
            this.$store.commit("searchProjectAll",(projects)=>{

              this.findShareInProject(shares,projects,(data)=>{

                  for (let prj of data)
                  {
                    if(prj.project.name.indexOf(searchkey) !== -1)
                    {
                      //确定是此人上传
                      if(this.$store.getters.user.authority == "1")
                      {
                        this.projects.push(prj);
                      }else {
                          if(prj.project.submitter ===  this.$store.getters.user._id)
                          {
                            this.projects.push(prj);
                          }
                      }
                    }
                  }

              } );
            });
          });


        },
        deleteOnOffFun(){
          this.deleteShow = !this.deleteShow;

          if(this.deleteShow)
          {
            this.deleteOnOff = "关闭删除";

          }else {
            this.deleteOnOff ="打开删除";

          }
        },
        deletePrj(index, row){
          //删除项目
          //1 如果有工程文件，就不能删除

          let snnumber = row.snnumber;
          if(snnumber){
            this.$store.commit("searchProject",[{"snnumber":snnumber},(data)=>{

              if(data.length !== 0){
                this.$notify({
                  type:"error",
                  message: '还有关联的项目不能删除'
                });

              }else{

                this.$notify({
                  type:"success",
                  message: '删除成功'
                });
                this.projects.splice(index,1);
                //数据库保存
                this.delete(row);
              }
            }]);
          }
        },
        delete(share){

          let myFormDatas = new FormData();
          myFormDatas.append("info",JSON.stringify(share));
          axios({
            url: 'http://localhost:3000/delteprojectshare',
            method: 'POST',
            data: myFormDatas
          })
            .then((result) => {
              if (result.data.status === 0) {
                callback(result.data);
              }
            })

        },


        downloadPrj(index, row){
          //跳转下载页面
          this.$router.push({path: '/home/Content/DownloadPage?_gongxiangid='+row._id})
        },
        findAll(callback)
        {
          axios({
            url: 'http://localhost:3000/projectshare',
            method: 'POST',
          })
            .then((result) => {
              if (result.data.status === 0) {
               callback(result.data);
              }
            })
            .catch((err) => {
            })
        },
        findShareInProject(shares,projects,callback){
          let pros = [];

          for (let share of shares) {
            let len = projects.length;
            for(let item of projects) {

              if (item.snnumber === share.snnumber) {
                share.project = item;
                pros.push(share);
                //修改共享文件中的大小
                this.setFileSize(share);
                break;
              }
              if(--len === 0)
              {
                share.project = {name:"关联项目已经不存在！！！"};
                pros.push(share);
                //修改共享文件中的大小
                this.setFileSize(share);
              }
            }

          }
          callback(pros);
        },
        //计算文件大小
        setFileSize(share){
          let filelist = share.filelist;
          if(filelist.length === 0)
          {
            share.documentsize ="没有文件";
          }else{
            let size = 0;
            for (let file of filelist)
            {
              //console.log(file);
              size += file.file.size;
            }
            share.documentsize = (size/1048576).toFixed(2) + "M";
          }
        },

      }
    }
</script>

<style scoped>

</style>
