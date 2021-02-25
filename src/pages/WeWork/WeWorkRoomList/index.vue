<template>
  <div>
    <div class="template-page__row">
<!--      <div class="template-page__row-left" style="min-width: 270px;">-->
<!--        <div style="color: #909399;margin-bottom: 5px;">-->
<!--          提示：搜索员工即查询员工所在微信群-->
<!--        </div>-->
<!--        <el-row>-->
<!--          <el-col :span="18">-->
<!--            <el-input ref="quickText" v-model.trim="model.name" placeholder="请输入员工姓名" @keyup.enter.native="getTreeData(1)" style="margin-bottom: 10px;">-->
<!--              <Icon type="search" className="el-input__icon" style="padding: 5px;" slot="suffix" name="name" @click="getTreeData(1)"/>-->
<!--            </el-input>-->
<!--          </el-col>-->
<!--          <el-col :span="6">-->
<!--            <ns-employee-search-button v-model="searchModel" @reset="resetTree" @input="getTreeData(1)"></ns-employee-search-button>-->
<!--          </el-col>-->
<!--        </el-row>-->
<!--        <el-scrollbar>-->
<!--          <ns-tree-ext ref="tree" :data="treeData" :highlight-current="true" :expand-on-click-node="false"-->
<!--                       :label-max-length="labelMaxLength"-->
<!--                       :empty-text="emptyText"-->
<!--                       :default-expanded-keys="[0]"-->
<!--                       node-key="id"-->
<!--                       show-icon-->
<!--                       :filter-node-method="filterNode"-->
<!--                       v-loading="loading" :element-loading-text="$t('prompt.loading')"-->
<!--                       @node-click="onClick">-->
<!--          </ns-tree-ext>-->
<!--          <el-pagination class="template-table__pagination"-->
<!--            style="text-align: center" small-->
<!--            @current-change="handleCurrentChange"-->
<!--            :page-size="pageSize"-->
<!--            layout="prev, slot, next, jumper"-->
<!--            :total="total">-->
<!--            <span :title="pageNo/totalPage">{{pageNo}}/{{totalPage}}</span>-->
<!--          </el-pagination>-->
<!--        </el-scrollbar>-->
<!--      </div>-->
      <div class="template-page__row-left">
        <el-input ref="quickText" v-model="shopTreePage.shopName" placeholder="输入线下门店名称/导购姓名" clearable
                  @keyup.enter.native="initShopList(1)">
          <Icon type="search" className="el-input__icon" style="padding: 5px;" slot="suffix" name="name" @click="initShopList(1)"/>
        </el-input>
        <div style="display: flex;padding-left: 8px" class="changeShopStatus">
          <p style="margin-right: 5px">状态:</p>
          <el-checkbox-group @change="changeShopStatus" v-model="checkStatusList">
            <el-checkbox label =  '1' >正常</el-checkbox>
            <el-checkbox label = '-1' >暂停</el-checkbox>
            <el-checkbox label = '-2' >关店</el-checkbox>
          </el-checkbox-group>
        </div>
        <el-scrollbar ref='shopTreeDiv' wrapStyle="overflow-x:hidden;" style="padding-bottom: 10px" >
          <el-tree class="filter-tree" ref="guideTree" :data="shopFindList" highlight-current
                   node-key="id" :default-expand-all="false" :expand-on-click-node="false" :default-checked-keys="[0]"
                   :filter-node-method="onFilterNode" @node-click="onClickNode">
            <div class="subdivision-tree-node" slot-scope="{ node }" >
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
        <ns-table-we-chat-rooms ref="table" :url="$api.weWork.weWorkRooms.queryWeWorkRoomsTable"></ns-table-we-chat-rooms>
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
</style>
