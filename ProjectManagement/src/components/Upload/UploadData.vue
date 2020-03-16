<template>
  <div>


    <div>
      <uploader
        ref="uploader"
        :options="options"
        class="uploader-example"
        :autoStart="false"
        @file-success="onFileSuccess"
        @file-added="onFileAdded"
        @file-progress="onFileProgress"
      >
        <uploader-unsupport></uploader-unsupport>
        <uploader-drop>
          <div style="text-align: left"><p>可以向这里拖动数据</p></div>
          <uploader-btn style="float: left;"> 选择多个文件</uploader-btn>
          <!--  <uploader-btn :attrs="attrs">选择图片</uploader-btn>
            <uploader-btn :directory="true">选择文件夹</uploader-btn>-->
         <!-- <el-button type="primary">全部开始上传</el-button>-->
        </uploader-drop>
        <uploader-list></uploader-list>
      </uploader>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import SparkMD5 from 'spark-md5';
  export default {
    props: ["upload"],

    data() {
      return {

        options: {
          target: 'http://localhost:3000/files/upload',
          chunkSize: '10485760',   //分块大小
          testChunks: true,
          // 服务器分片校验，断点续传基础
          checkChunkUploadedByResponse: function (chunk, res) {
            //检查数据是否已经上传

            //检查片断是否已经上传
            let objMessage = JSON.parse(res);
            if (objMessage.skipUpload) {
              //alert("文件已经上传");
              return true;
            }
            return (objMessage.uploaded || []).indexOf(chunk.offset + 1) >= 0
          },

        },
      }
    },
    computed: {
      //Uploader实例
      uploader() {
        return this.$refs.uploader.uploader;
      }
    },
    methods: {
      // 文件进度的回调
      onFileProgress(rootFile, file, chunk) {

      },
      onFileAdded(file) {
        // 计算MD5，下文会提到
        this.computeMD5(file);
      },
      onFileSuccess(rootFile, file, res, chunk) {

        //console.log(res)
        // 如果服务端返回需要合并
       let myFormDatas = new FormData();
        myFormDatas.append("file",JSON.stringify(file));
        myFormDatas.append("project",JSON.stringify(this.upload));
        axios({
          url: 'http://localhost:3000/files/merge_chunks',
          method: 'POST',
          data:myFormDatas
        })
          .then((result) => {
            this.upload.filelist.push({path:result.data.saveName,file:result.data.file,uploadTime: Date.now()});
            //this.addFile(file,result);
          })
          .catch((err) => {
          })
      },

      onFileError(rootFile, file, response, chunk) {
        console.log("上传失败");
      },/**
       * 计算md5，实现断点续传及秒传
       * @param file
       */
      computeMD5(file) {
        let fileReader = new FileReader();
        let time = new Date().getTime();
        let md5 = '';
        file.pause();
        fileReader.readAsArrayBuffer(file.file);
        fileReader.onload = (e => {
          if (file.size != e.target.result.byteLength) {
            this.error('Browser reported success but could not read the file until the end.');
            return
          }

          md5 = SparkMD5.ArrayBuffer.hash(e.target.result);

          // 添加额外的参数
          this.uploader.opts.query = {
            project:JSON.stringify(this.upload)
          };
          console.log(`MD5计算完毕：${file.id} ${file.name} MD5：${md5} 用时：${new Date().getTime() - time} ms`);

          file.uniqueIdentifier = md5;
          file.resume();
        });

        fileReader.onerror = function () {
          this.error('FileReader onerror was triggered, maybe the browser aborted due to high memory usage.');
        };
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
