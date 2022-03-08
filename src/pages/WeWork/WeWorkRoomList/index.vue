<template>
  <div>
    <div class="template-page__row">
      <div class="template-page__row-left">
        <el-input ref="quickText" v-model="shopTreePage.shopName" placeholder="输入线下门店名称/导购姓名" clearable
                  @keyup.enter.native="initShopList(1)">
          <Icon type="search" className="el-input__icon" style="padding: 5px;" slot="suffix" name="name" @click="initShopList(1)"/>
        </el-input>
        <div style="display: flex;padding-left: 8px" class="changeShopStatus">
          <p style="margin-right: 5px">状态:</p>
          <el-checkbox-group @change="changeShopStatus" v-model="checkStatusList" :class="[chooesQA==='QA'?checkQA:checks]">
            <el-checkbox label =  '1' >正常</el-checkbox>
            <el-checkbox label = '-1' >暂停</el-checkbox>
            <el-checkbox label = '-2' >关店</el-checkbox>
          </el-checkbox-group>
        </div>
        <el-scrollbar ref='shopTreeDiv' wrapStyle="overflow-x:hidden;" style="padding-bottom: 10px" >
          <el-tree class="filter-tree" ref="guideTree" :data="shopFindList" highlight-current
                   node-key="id" :default-expand-all="false" :expand-on-click-node="false" :default-checked-keys="[0]"
                   :filter-node-method="onFilterNode" @node-click="onClickNode">
            <div class="subdivision-tree-node" :class="[chooesQA==='QA'?fuscousQA:fuscousIcon]" slot-scope="{ node }" >
              <span>{{node.label}}</span>
              <span v-if="node.label === '全部'"></span>
              <!-- 后端返回的是组件，不建议增加status字段 -->
              <!-- <span class="text-error">{{node.status === 2 ? '(员工已离职)':''}}</span> -->
            </div>
          </el-tree>
        </el-scrollbar>
        <el-pagination style='text-align: center' small
                       :total="shopTreePage.total"
                       :page-size="shopTreePage.size"
                       layout="prev, slot, next, jumper"
                       :current-page.sync="shopTreePage.page"
                       @current-change="initShopList">
          <span>{{shopTreePage.page + '/' + (Math.ceil(shopTreePage.total/ shopTreePage.size) || 1)}}</span>
        </el-pagination>
      </div>
      <div class="template-page__row-right">
        <ns-table-we-chat-rooms ref="table" :guideIds="guideIds" :url="$api.weWork.weWorkRooms.queryWeWorkRoomsTable"></ns-table-we-chat-rooms>
      </div>
    </div>
  </div>
</template>

<script>
import NsTableWeChatRooms from './NsTableEnterpriseWeChatRooms'
import index from './src/index'
// import NsTreeExt from '@/components/NsTreeExt'
// import NsEmployeeSearchButton from '@/components/NsEmployeeSearchButton'

index.components = {
  NsTableWeChatRooms
}
export default index
</script>
<style scoped>
  @import "@theme/variables.pcss";
  >>> .el-tag {
    margin: 0 var(--default-margin-small) var(--default-margin-small) 0;
  }
</style>

<style scoped>
.changeShopStatus >>> .el-checkbox__input.is-checked+.el-checkbox__label {
  color: #606266!important;
}
.el-checkbox__inner .is-checked >>> .el-checkbox__inner{
  background-color:#41a2e8;
  border-color:#41a2e8;
}
.el-checkbox__innerQA .is-checked >>> .el-checkbox__inner{
  background-color:#2153D4 ;
  border-color:#2153D4 ;
}
.fuscousQA:hover{
  color: #2153D4;
}
.fuscousIcon:hover{
  color: #1a9cfb;
}
</style>
