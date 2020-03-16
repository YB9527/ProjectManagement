<template>
  <div>
    <h1>{{msg}}项目：{{project.name}}</h1>
    <div>
      <div v-show="isShowBtu">
        <el-button style="float: left" type="success" @click="openOrCloseUpload">{{uploadOnOff}}</el-button>

        <el-button
          v-show="(this.share_id !== '' && this.$store.getters.user.authority === 1) ||  this.share_id == '' "
          style="float: left" type="success" @click="deleteOnOffFun">{{deleteOnOff}}
        </el-button>
      </div>
      <div v-if="!uploadShow">
        <el-button style="float: left;margin-left: 10px" type="success" @click="searchFile(key)">
          文件查询器
        </el-button>
        <el-input v-model="key"></el-input>
      </div>

      <UploadData v-if="uploadShow" :addFile="addFile"></UploadData>
      <el-button v-show="false">{{a}}</el-button>
    </div>
    <div style="margin-top: 50px">
      <el-table
        :data="fileShowList"
        style="width: 100%"
        max-height="500">
        <el-table-column
          fixed
          type="index"
          label="文件序号"
          width="100">

        </el-table-column>
        <el-table-column
          prop="file.name"
          label="文件名字"
          width="200">
        </el-table-column>
        <el-table-column
          prop="file.name"
          :formatter="fileTypeFormat"
          label="文件类型"
          width="120">
        </el-table-column>
        <el-table-column
          :formatter="sizeFormat"
          prop="file.size"
          label="文件大小"
          width="100">
        </el-table-column>

        <el-table-column
          :formatter="timeFormat"
          prop="uploadTime"
          label="上传时间"
          width="96">
        </el-table-column>
        <el-table-column
          prop="path"
          label="保存地址"
          width="500">
        </el-table-column>


        <el-table-column

          label="操作"
          width="200">
          <template slot-scope="scope">
            <!--<el-button
              @click.native.prevent="downloadFile(scope.$index, scope.row.path)"
              type="success"
              size="small">
              下载
            </el-button>-->
            <a v-show="authority"
               :href="'http://localhost:3000/files/downloadFile?path='+scope.row.path+'&filename='+scope.row.file.name">下载</a>
            <el-button v-show="deleteShow"
                       @click.native.prevent="deleteFile(scope.$index, scope.row)"
                       style="margin-left: 5px"
                       type="danger"
                       size="small">
              删除
            </el-button>

          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import moment from 'moment';
  import UploadData from '@/components/Upload/UploadDataElement'
  import axios from 'axios';

  export default {
    name: "DownloadPage",
    components: {
      UploadData,
    },
    data() {
      return {
        msg: "",
        project_id: "",
        share_id: "",
        key: "",
        authority: this.$store.getters.Authority,
        uploadShow: false,
        deleteShow: false,
        uploadOnOff: "打开上传器",
        deleteOnOff: "文件管理按钮",
        filelist: [],
        fileShowList: [],
        project: "",
        href: "http://localhost:3000/files/downloadFile",
      }
    },

    computed: {
      a: function () {

      },

      isShowBtu: function () {
        if (this.share_id) {
          return true;
        } else if (this.project.checkid == 1) {
          return false;
        } else {
          return true;
        }
      }
    },
    created() {




      let _id = this.$route.query._id;
      this.project_id = _id;
      if (_id) {
        this.msg = "";
        let promise = this.load();
        promise.then((data) => {
          this.project = data.data;
          this.filelist = this.project.filelist;
          this.searchFile("");
        }, function (err) {

          console.log(err)
        })
      } else {
        //共享文件下载
        _id = this.$route.query._gongxiangid;
        this.share_id = _id;
        //查找共享文件
        this.findShareProject(_id, (share) => {
          this.filelist = share.filelist;

          this.$store.commit("searchProject", [{snnumber: share.snnumber}, (data) => {
            this.project = share;
            this.msg="共享";
            this.project.name = data[0].name;
            this.searchFile("");
          }]);
        });
      }
      console.log(this.$store.getters.user.authority );
      console.log(this.share_id !== '' , this.$store.getters.user.authority === 1);

    },
    methods: {
      addFile(file) {
        //console.log("我来了",file);
        //this.fileShowList.push(file);
        this.filelist.push(file);
        this.fileShowList.push(file);
        this.saveProject();


      },
      saveProject() {
        let myFormDatas = new FormData();
        myFormDatas.append("info", JSON.stringify(this.project));
        if (this.project_id) {
          axios({
            url: 'http://localhost:3000/files/editPrj',
            method: 'POST',
            data: myFormDatas
          })
        } else if (this.share_id) {
          axios({
            url: 'http://localhost:3000/editProjectShare',
            method: 'POST',
            data: myFormDatas
          })
        }
      },
      //查询项目
      findProjectById(_id, callback) {

        let myFormDatas = new FormData();
        myFormDatas.append("_id", _id);
        axios({
          url: 'http://localhost:3000/files/findById',
          method: 'POST',
          data: myFormDatas
        })
          .then((result) => {
            if (result.data.status === 0) {
              callback(result.data.data);
            }
          })
      },

      findShareProject(_id, callback) {
        let myFormDatas = new FormData();
        myFormDatas.append("_id", _id);
        axios({
          url: 'http://localhost:3000/projectshareById',
          method: 'POST',
          data: myFormDatas
        })
          .then((result) => {
            if (result.data.status === 0) {
              callback(result.data.data);
            }
          })
      },
      deleteOnOffFun() {
        this.deleteShow = !this.deleteShow;

      },
      searchFile(key) {

        this.fileShowList.splice(0, this.fileShowList.length);
        if (key) {

          for (let file of this.filelist) {

            let fileName = file.file.name;
            if (fileName.indexOf(key) !== -1) {
              this.fileShowList.push(file);
            }

          }
        } else {
          for (let obj of this.filelist) {
            this.fileShowList.push(obj);
          }
        }
      },


      load() {
        let pro = new Promise((resolve, reject) => {

          let _id = this.$route.query._id;
          let myFormDatas = new FormData();
          myFormDatas.append("_id", _id);
          axios({
            url: 'http://localhost:3000/files/findById',
            method: 'POST',
            data: myFormDatas
          })
            .then((result) => {
              resolve(result.data);
            });

        });
        return pro;
      },
      load1() {
        let _id = this.$route.query._id;
        let myFormDatas = new FormData();
        myFormDatas.append("_id", _id);
        axios({
          url: 'http://localhost:3000/files/findById',
          method: 'POST',
          data: myFormDatas
        })
          .then((result) => {
            if (result.data.status === 0) {
              this.project = result.data.data;
              this.filelist = this.project.filelist;
              console.log(2)
            }
          });

      },
      openOrCloseUpload() {

        this.uploadShow = !this.uploadShow;
        if (this.uploadShow) {
          //显示打开
          this.uploadOnOff = "关闭上传器";
          this.searchFile("");
        } else {
          //显示关闭
          this.uploadOnOff = "打开上传器";

        }
      },
      timeFormat(row, column, cellValue, index) {
        const daterc = row[column.property]
        //console.log(daterc);
        if (daterc != null) {
          return moment(daterc).format("YYYY-MM-DD HH:mm:ss");
        }
      },
      sizeFormat(row, column, cellValue, index) {
        if (cellValue != null) {
          let m = cellValue / 1048576;
          if (m < 1024) {
            return m.toFixed(2) + "M";
          } else {
            return (m / 1024).toFixed(2) + "G";
          }
        }

      },
      fileTypeFormat(row, column, cellValue, index) {
        if (cellValue != null) {
          return cellValue.slice(cellValue.lastIndexOf("."));
        }
      },

      downloadFile(index, path) {

        this.$http.get('http://localhost:3000/files/downloadFile').then((result) => {
          this.$notify({
            type: "success",
            title: "文件下载成功",
            message: '文件：'
          });
        })
      },// 下载文件
      download(data) {
        if (!data) {
          return
        }
        let url = window.URL.createObjectURL(new Blob([data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', 'excel.xlsx')
        document.body.appendChild(link)
        link.click()
      },
      deleteFile(index, data) {
        let path = data.path;
        let name = data.file.name;
        if (!window.confirm('你确定要删除文件：' + name + '，吗？')) {
          return;
        }
        //console.log(data);
        this.fileShowList.splice(index, 1);
        let tep = this.filelist.indexOf(data);
        if (tep > -1) {
          this.filelist.splice(tep, 1);
        }

        this.saveProject();

        let myFormDatas = new FormData();
        myFormDatas.append("path", path);
        myFormDatas.append("project", JSON.stringify(this.project));
        axios({
          url: 'http://localhost:3000/files/deleteFile',
          method: 'POST',
          data: myFormDatas
        })
          .then((result) => {
            this.$notify({
              type: "success",
              title: "文件删除成功",
              message: '文件：' + name
            });
          })
          .catch((err) => {
          })
      }
    }
  }
</script>

<style scoped>
  h1 {
    margin: 1px;
  }
</style>
