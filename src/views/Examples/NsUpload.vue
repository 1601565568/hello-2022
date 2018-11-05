<template>
  <div>
    上传路径：{{$api.core.uploadFile('test')}}<br/>
    获取路径：{{$api.core.downloadFile('1')}}
    <el-upload
      class="upload-demo"
      :action="uploadUrl"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      multiple
      :limit="5"
      :on-exceed="handleExceed"
      :file-list="fileList">
      <ns-button size="small" type="primary">点击上传</ns-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    <br/>
   <a :href="$api.core.downloadFile('1')" target="_blank">文件下载</a><br/>
    <span>显示图片：</span><br/>
    <img :src="$api.core.downloadFile('1')" style="width:200px;heidht:100px;" />

    <div style="margin-top: 80px;border-top:solid 2px #000;font-size: 25px;padding-top: 20px;">【导购应用专用】：</div>
      上传路径：{{$api.core.sgUploadFile('test')}}<br/>
      获取路径：{{$api.core.sgDownloadFile('test/201808/1/9ef62aef-38ab-4fda-a41d-2f7e017b64a1.jpg')}}
      <el-upload  class="upload-demo" :action="this.$api.core.sgUploadFile('test')">
        <ns-button size="small" type="primary">点击上传</ns-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
      <br/>
      <a :href="$api.core.sgDownloadFile('test/201808/1/9ef62aef-38ab-4fda-a41d-2f7e017b64a1.jpg')" target="_blank">文件下载举例</a><br/><br/><br/>
      <span>显示图片举例：</span><br/>
      <img src="http://ecrm.oss-cn-hangzhou.aliyuncs.com/test/201808/1/9ef62aef-38ab-4fda-a41d-2f7e017b64a1.jpg" style="width:200px;heidht:100px;" />
  </div>
</template>
<script>
  export default {
    data () {
      return {
        uploadUrl: this.$api.core.uploadFile('test'),
        fileList: [{name: 'bd_logo.png', url: 'https://www.baidu.com/img/bd_logo1.png'}]
      }
    },
    methods: {
      handleRemove (file, fileList) {
        console.log(file, fileList)
      },
      handlePreview (file) {
        console.log(file)
      },
      handleExceed (files, fileList) {
        this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
      },
      beforeRemove (file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`)
      }
    },
    mounted () {
    }
  }
</script>
