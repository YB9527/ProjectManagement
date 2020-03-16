<template>
  <div >
    <div style="float: left; margin: 20px 20px 20px 50px" >
    <el-button  type="warning" plain @click="last"  v-show="active == 1">上一步</el-button>
      <el-button type="success"  @click="ok" v-show="active == 2 ? 1:0">完成</el-button>
    </div>
    <div >
    <el-steps :active="active" align-center>
      <el-step title="步骤1" description="项目基本填写"></el-step>
      <el-step title="步骤2" description="数据清单录入"></el-step>
      <el-step title="步骤3" description="选择上传数据"></el-step>
    </el-steps>
    </div>
<!--   <el-button type="primary" @click="next" v-show="active == 3 ? 0:1">下一步</el-button>-->

    <div class="dataDiv">
        <uploadPage v-show="uploadPageShow" :next="next" ></uploadPage>
    </div>
        <handListPage v-show="handListPageShow" :next="next"></handListPage>
        <uploadData v-show="uploadDataShow" :addFile="addFile" :upload="upload"></uploadData>
       <!-- <uploadTest v-show="uploadTestShow" :next="next"></uploadTest>-->
        <notification  :notifiMessage="notifiMessage" v-if="notificationShow"></notification>
  </div>
</template>


<script>
  import uploadPage from '@/components/views/UploadPage'
  import handListPage from '@/components/views/HandListPage'
  import uploadData from '@/components/Upload/UploadDataElement'
  import  notification from '@/components/Public/Notification'
  import axios from  'axios'
  import moment from 'moment'

  export default {
    name: "Step",
    components: {
      uploadPage,
      handListPage,
      uploadData,
      notification,

    },
    data() {
      return {
        active: 0,
        uploadPageShow:1,
        handListPageShow:0,
        uploadDataShow:0,
        notificationShow:0,
        notifiMessage :0,
        uploadTestShow:0,
        upload:"",
        filelist:[],
      };
    },
    methods:{
      next(childValue){

        if (this.active++ > 2) this.active = 0;
        if(this.active === 1)
        {
          this.upload = childValue;
        }else if(this.active === 2){
          this.upload.handlist = childValue;
        }

        this.switcher(this.active);
      },
      last(){
        //if (this.active-- < 4) this.active = 0;
        this.switcher(--this.active);

      },
      addFile(file,result){
        let descSize = 0;
        if(this.upload.documentsize)
        {
          descSize= this.upload.documentsize ;
        }
        if(file)
        {
            this.upload.documentsize =descSize +file.size;
            //文件信息的保存
            //console.log(this.upload.filelist);
            this.upload.filelist.push({path:result.data.saveName,file:result.data.file,uploadTime: Date.now()});
            console.log(this.upload);
            console.log(file);
        }
      },
      switcher (val) {
        let self = this;
        self.uploadPageShow = 0;
        self.handListPageShow =0;
        self.uploadDataShow=0;
        if (val === 0){
          self.uploadPageShow =1
        }else if(val === 1){
          self.handListPageShow =1
        }else if(val === 2){
          self.uploadDataShow =1
        }else {
          return 0;
        }

      },
      ok(){

        let self =  this;
        let myFormDatas = new FormData();
        //this.upload.uploadtime = new Date();
        //console.log("保存数据库");
        this.upload.checkid="0";
        //console.log(this.upload);
        myFormDatas.append("info",JSON.stringify(this.upload));
        axios({
          url: 'http://localhost:3000/files/createproject',
          method: 'POST',
          data: myFormDatas
        })
          .then((result) => {
            this.$notify({
              type:"success",
              message: '项目创建成功'
            });
            let  id = result.data._id;
            //查询是否有了文件归档区

              myFormDatas =new FormData();
              myFormDatas.append("snnumber",this.upload.snnumber);
              axios({
                url: 'http://localhost:3000/projectshareBySnnumber',
                method: 'POST',
                data: myFormDatas
              })
                .then((result) => {
                  let projectShare = result.data.data;
                  //大于现在已经创建了的

                  if(projectShare.length  === 0)
                  {
                    //没有共享区域
                    let share = {
                      "snnumber":this.upload.snnumber,
                      "filelist":[],
                      "documentsize":""
                    };
                    this.createShare(share);
                  }
                });
            let _id = result.data._id;
            this.$router.push({path: '/home/Content/ProjectWaitPass'})
          })
          .catch((err) => {
            alert(err );
            self.submitting = false
          })
      },
      //创建共享区域
      createShare(share)
      {
        let myFormDatas = new FormData();
        myFormDatas.append("info",JSON.stringify(share));
        axios({
          url: 'http://localhost:3000/createprojectshare',
          method: 'POST',
          data: myFormDatas
        })
          .then((result) => {
            this.$notify({
              type:"success",
              message: '共享区域创建成功'
            });
          })
      },
    }

}
</script>

<style scoped>
.dataDiv{
  width: 1000px;
  padding-left: 5%;
}
</style>
