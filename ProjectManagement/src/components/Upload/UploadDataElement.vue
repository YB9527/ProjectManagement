<template>
  <div>
    <el-upload
      class="upload-demo"
      drag
      action='http://localhost:3000/files/uploadElement'
      :data="myData"
      :on-success="uploadSuccess"
      multiple>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>

  </div>
</template>
<script>
  import axios from 'axios'
  import SparkMD5 from 'spark-md5';

  export default {
    props: ["upload","filelist","addFile"],

    data() {
      return {}

    },
    computed: {
      myData() {
        return {

         // projectName: this.upload.name,
        }
      }
    },
    create(){

    },
    methods: {
      // 上传成功后的回调
      uploadSuccess (response, file, fileList) {
        this.addFile({path:response.saveName,file:file,uploadTime: Date.now()});
        //console.log("11111",this.filelist);
        /*
        if(this.filelist)
        {
          console.log(this.filelist);
          this.filelist.push({path:response.saveName,file:file,uploadTime: Date.now()});
          this.$notify({
            type:"success",
            title:"上传成功",
            message: '文件：'+file.name
          });
        }else{
          let myFormDatas = new FormData();
          myFormDatas.append("file",JSON.stringify(file));
          this.upload.filelist.push({path:response.saveName,file:file,uploadTime: Date.now()});
          myFormDatas.append("info",JSON.stringify(this.upload));
          axios({
            url: 'http://localhost:3000/files/editPrj',
            method: 'POST',
            data:myFormDatas
          }).then((result=>{
            this.$notify({
              type:"success",
              title:"上传成功",
              message: '文件：'+file.name
            });
          }));
        }

*/

      },
    }
  }
</script>

<style scoped>
  .uploader-example {
    padding: 15px;
    margin: 40px auto 0;
    font-size: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, .4);
  }

  .uploader-example .uploader-btn {
    margin-right: 4px;
  }

  .uploader-example .uploader-list {
    max-height: 440px;
    overflow: auto;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
