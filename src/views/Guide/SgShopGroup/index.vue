<template>
  <div>
    <NsTableShopGroup ref="mainTable" :url=$api.guide.sgShopGroup.findList @add="onRedactFun" @scopeRowCount="scopeRowCount"
                    @shopEdit="shopEdit" @allDelete="allDelete" @dimission="dimission" @showShop="showShop"
                  @onDelsTipFun="onDelsTipFun" @onRedactFun="onRedactFun" @dimissionFun="dimissionFun" @handleSelectionChange="handleSelectionChange">
    </NsTableShopGroup>
  </div>
</template>

<script>
import List from './src/index'
import ElUpload from 'nui-v2/lib/upload'
import NsTableShopGroup from './NsTableShopGroup'
List.components = {
  NsTableShopGroup,
  ElUpload
}
export default List
</script>
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
  .scopeRowCountShow_footer{
    margin: 10px 0 10px 0;
  }
</style>
<style scoped>
  .resignFormVisible_title{
    height:40px;
    display:flex;
    justify-content: flex-start;
    align-items: center;
    background-color:#FFDEAD;
    font-size:14px;
    padding-left:10px;
    margin-bottom:10px
  }
  .resignFormVisible_way{
    line-height: 40px;
    display:flex;
    align-items: center;
    padding-left:10px;
    border-bottom:1px solid #aaaaaa;
  }
  .resignFormVisible_otherShoppers_01{
    display:flex;
    justify-content: space-between;
    align-items: center;
  }
  .resignFormVisible_otherShoppers_search{
    padding:10px 0 10px 0;
  }
  .resignFormVisible_otherShoppers_02{
    line-height: 40px;
    display:flex;
    justify-content: flex-start;
    align-items: center;
    font-size:14px;
    border-bottom:1px solid #aaaaaa;
    padding-left:10px;
  }
  .resignFormVisible_custom_title{
    display:flex;
    justify-content: space-between;
    align-items: center;
    padding:0 10px 0 10px;
    font-size:13px;
    line-height: 40px;
  }
  .transferCount{
    color:#FF0000;
  }
  .resignFormVisible_custom_01{
    display:flex;
    justify-content: space-between;
    align-items: center;
  }
  .resignFormVisible_custom_search{
    padding-top:5px;

  }
  .template-table__more-btns{
    padding-left:-3px !important;
  }
  .dialog-footer{
    display:flex;
    justify-content: flex-end;
    align-items: center;
  }
  .replaceTheShoppers{
    display:flex;
    justify-content: flex-end;
    align-items: center;
    margin:10px 10px 20px 0;
    position: relative;;
    float:right;
    bottom: 0
  }
  .el-scrollbar__bar.is-vertical {
    width: 0!important;
    top: 2px;
  }
  .el-scrollbar__bar.is-horizontal {
    height: 0 !important;
    left: 2px;
  }
  .user_style_text{
    font-size:14px;
    font-weight:600
  }
  .user_style{
    width:180px;
    margin-bottom:20px;
    color:#FF0000;
    font-size:12px;
    background:rgba(255,0,0,0.1);
    padding:3px 10px;
    margin-top:20px;
    border-radius:5px;
  }
  .bulkReplacementStores{
    display:flex;
    justify-content:flex-start;
    align-items:flex-start;
    padding-left:20px;
  }
  .bulkReplacementStores_logo{
    width:40px;
    height:40px;
    display:flex;
    justify-content:center;
    align-items:center;
    border-radius:100px;
    background-color:#FF0000;
    margin-right:20px;
  }
  .bulkReplacementStores_logo span{
    color:#fff;
    font-weight:600;
    font-size:20px
  }
  .Setupbulksalesguide{
    margin:0 20px !important;
  }
  .bulkReplacementStores_box div{
    padding:8px 2px;
    font-size:14px
  }
  .bulkReplacementStores_status{
    color:#333;
  }
  .bulkReplacementStores_status text{
    color:#000;
    font-weight:600 ;
  }
  .bulkReplacementStores_name{

    color:#ff0000;
  }
  .bulkReplacementStores_cause{
    color:#999;
    background:rgba(188,188,188,0.3);
    border-radius:5px;
    margin-bottom:20px
  }
  .bulkReplacementStores_box .bulkReplacementStores_transfer{
    font-weight:600;
  }
  .bulkReplacementStores_state span{
    padding:0 3px;
    font-weight:600
  }
</style>
