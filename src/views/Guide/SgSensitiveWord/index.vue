<template>
  <div>
    <ns-table-guide ref="table1" :url=$api.guide.sensitiveWord.findWordList @add="onRedactFun"
      @shopEdit="shopEdit" @onRedactFun="onRedactFun" @handleSelectionChange="handleSelectionChange">
    </ns-table-guide>
  </div>
</template>
<style scoped>
>>>.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
 .avatar-uploader .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 128px;
    height: 128px;
    line-height: 128px;
    text-align: center;
    display: inline-block;
  }
  .avatar {
    width: 128px;
    height: 128px;
    display: block;
  }
  .kehuBox-main {
    padding: 10px 20px 30px;
  }
  .kehuBox-main-top{
    display: flex;
    justify-content:space-between;
    height: 35px;
    line-height: 35px;
    font-size: 12px;
    color: #999;
  }
  .kehuBox-main-main{
    display: flex;
    align-items:flex-start;
  }
  .kehuBox-main-span {
    padding: 20px 0 0;
  }
  .kehuBox-main-span span{
    font-size: 12px;
    line-height: 2.3;
  }
  .man-img{
    width: 35px;
    height: 35px;
    border: 1px solid #999;
    border-radius: 50%;
    float: left;
  }
  .img-show{
    width: 35px;
    height: 35px;
    border: 1px solid #999;
    border-radius: 50%;
    float: left;
    background: url("../../../assets/default-user.png")no-repeat;
    background-size: 33px;
  }
  .man-name {
    font-size: 15px;
    color: #000000;
    padding-left: 10px;
  }
  .p-title {
    padding: 20px 0 5px;
    color: #000000;
    font-weight: 600;
  }
  .search{
    display: flex;
    justify-content: space-between;
    padding-right:20px
  }
  .el_form{
    display: flex;
    align-items: center
  }
  .template-table__more-btn{
    display: flex;
    align-items: center;
    padding:0;
    margin-bottom: 10px;
  }
</style>
<style>
.sensitiveManage .el-radio .el-radio__label{
  display: none !important
}
</style>
