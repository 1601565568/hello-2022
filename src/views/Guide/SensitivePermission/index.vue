<template>
  <div>
    <ns-page-table>
      <template slot="buttons">
        <ns-table-operate-button :buttons="_data._table.operate_buttons">
        </ns-table-operate-button>
      </template>
      <template slot="advancedSearch" v-if="_data._queryConfig.expand">
        <el-form ref="table_filter_form" label-width="80px" @keyup.enter.native="searchAction"
                 class="surround-btn"
                 :model="model" :rules="rules" :inline="true">
          <el-form-item label="时间：" class='el-block'>
            <el-form-grid width="350">
              <ns-datetime type="datetime" width="160" v-model="model.times">
              </ns-datetime>
            </el-form-grid>
            <el-form-grid>
              <ns-button @click="todayTime(0)" :type="defButton === 0 ? 'primary' : 'default'" :plain='defButton === 0'>今日</ns-button>
            </el-form-grid>
            <el-form-grid>
              <ns-button @click="todayTime(1)" :type="defButton === 1 ? 'primary' : 'default'" :plain='defButton === 1'>昨日</ns-button>
            </el-form-grid>
            <el-form-grid>
              <ns-button @click="todayTime(7)" :type="defButton === 7 ? 'primary' : 'default'" :plain='defButton === 7'>近7天</ns-button>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="个人号：" class='el-block'>
            <el-select v-model="model.ownerId">
              <el-option value='' label='全部'/>
              <el-option v-for='item in privateAccountSelect' :key='item.wid' :value="item.wid" :label="item.nick"/>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="template-table__more-btn">
          <ns-button type="primary" @click="$searchAction$">{{$t('operating.search')}}</ns-button>
          <ns-button @click="$resetInputAction$">{{$t('operating.reset')}}</ns-button>
        </div>
      </template>
      <template slot="table">
        <el-table ref="table" :data="_data._table.data" class="template-table__main"
                  stripe
                  resizable v-loading.lock="_data._table.loadingtable"
                  :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$"
                  row-key="id"
                  @selection-change="$selectionChange">
          <el-table-column :show-overflow-tooltip="true" type="default" prop="nick"
                           label="微信昵称" :sortable="false">
            <template slot-scope='scope'>
              {{`${scope.row.nick}（${scope.row.wid}）`}}
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" type="default" prop="delFriendQuantity"
                           label="删除好友" sortable="del_friend_quantity" align='right' width='100px'>
            <template slot-scope='scope'>
              {{scope.row.delFriendQuantity || 0}}
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" type="default" prop="blockFriendQuantity"
                           label="拉黑好友" sortable="block_friend_quantity" align='right' width='100px'>
            <template slot-scope='scope'>
              {{scope.row.blockFriendQuantity || 0}}
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" type="default" prop="shareCardQuantity"
                           label="分享名片" sortable="share_card_quantity" align='right' width='100px'>
            <template slot-scope='scope'>
              {{scope.row.shareCardQuantity || 0}}
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" type="default" prop="installAppQuantity"
                           label="安装应用" sortable="install_app_quantity" align='right' width='100px'>
            <template slot-scope='scope'>
              {{scope.row.installAppQuantity || 0}}
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" type="default" prop="quitGroupQuantity"
                           label="退群" sortable="quit_group_quantity" align='right' width='100px'>
            <template slot-scope='scope'>
              {{scope.row.quitGroupQuantity || 0}}
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" type="default" prop="redPacketQuantity"
                           label="发红包" sortable="red_packet_quantity" align='right' width='100px'>
            <template slot-scope='scope'>
              {{scope.row.redPacketQuantity || 0}}
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" type="default" prop="sensitiveWordQuantity"
                           label="敏感词" sortable="sensitive_word_quantity" align='right' width='100px'>
            <template slot-scope='scope'>
              {{scope.row.sensitiveWordQuantity || 0}}
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template slot="pagination">
        <el-pagination v-if="_data._pagination.enable" class="template-table__pagination"
                       :page-sizes="_data._pagination.sizeOpts" :total="_data._pagination.total"
                       :current-page="_data._pagination.page" :page-size="_data._pagination.size"
                       layout="total, sizes, prev, pager, next, jumper" @size-change="$sizeChange$"
                       @current-change="$pageChange$">
        </el-pagination>
      </template>
    </ns-page-table>
  </div>
</template>
<script>
import Index from './src/index'

export default Index
</script>
<style scoped>
  @import "@/style/small/variables.pcss";
</style>
