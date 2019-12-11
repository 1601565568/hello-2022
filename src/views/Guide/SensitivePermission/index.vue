<template>
  <div>
    <Detail :visible.sync='detailDialog.visible' :detail-item.sync='detailDialog.detailItem' :times='model.times'/>
    <ns-page-table>
      <template slot="buttons">
        <ns-table-operate-button :buttons="_data._table.operate_buttons">
        </ns-table-operate-button>
      </template>
      <template slot="searchSearch" v-if="_data._queryConfig.expand">
        <el-form ref="table_filter_form" label-width="80px" @keyup.enter.native="searchAction"
                 class="surround-btn"
                 :model="model" :rules="rules" :inline="true">

          <el-form-item label="时间：">
            <el-form-grid>
              <ns-datetime type="datetime" width="160" v-model="model.times" format='yyyy-MM-dd' value-format='yyyyMMdd'>
              </ns-datetime>
            </el-form-grid>
          </el-form-item>

          <el-form-item>
            <el-form-grid style="width: 32px;">
            </el-form-grid>
            <el-form-grid>
              <ns-button @click="todayTime(0)" :type="defButton === 0 ? 'primary' : 'default'" >今日</ns-button>
            </el-form-grid>
            <el-form-grid>
             <ns-button @click="todayTime(1)" :type="defButton === 1 ? 'primary' : 'default'">昨日</ns-button>
            </el-form-grid>
            <el-form-grid>
              <ns-button @click="todayTime(7)" :type="defButton === 7 ? 'primary' : 'default'">近7天</ns-button>
            </el-form-grid>
          </el-form-item>

          <el-form-item label="个人号：">
            <el-select v-model="model.ownerId">
              <el-option value='' label='全部'/>
              <el-option v-for='item in privateAccountSelect' :key='item.wid' :value="item.wid" :label="item.nick"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <ns-button type="primary" @click="$searchAction$" class="ml5">{{$t('operating.search')}}</ns-button>
            <ns-button @click="$resetInputAction$" class="ml9">{{$t('operating.reset')}}</ns-button>
          </el-form-item>
        </el-form>
      </template>
      <template slot="table">
        <el-table ref="table" :data="_data._table.data" class="template-table__main"
                  stripe
                  resizable v-loading.lock="_data._table.loadingtable"
                  :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$"
                  row-key="id"
                  @selection-change="$selectionChange">
          <el-table-column :show-overflow-tooltip="true" type="default" prop="nick"
                           label="个人号（ ID ）" :sortable="false">
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
<!--          <el-table-column :show-overflow-tooltip="true" type="default" prop="blockFriendQuantity"-->
<!--                           label="拉黑好友" sortable="block_friend_quantity" align='right' width='100px'>-->
<!--            <template slot-scope='scope'>-->
<!--              {{scope.row.blockFriendQuantity || 0}}-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column :show-overflow-tooltip="true" type="default" prop="shareCardQuantity"
                           label="分享名片" sortable="share_card_quantity" align='right' width='100px'>
            <template slot-scope='scope'>
              {{scope.row.shareCardQuantity || 0}}
            </template>
          </el-table-column>
<!--          <el-table-column :show-overflow-tooltip="true" type="default" prop="installAppQuantity"-->
<!--                           label="安装应用" sortable="install_app_quantity" align='right' width='100px'>-->
<!--            <template slot-scope='scope'>-->
<!--              {{scope.row.installAppQuantity || 0}}-->
<!--            </template>-->
<!--          </el-table-column>-->
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
          <el-table-column :show-overflow-tooltip="true" type="default" prop="recallMessageQuantity"
                           label="撤回消息" sortable="recall_message_quantity" align='right' width='100px'>
            <template slot-scope='scope'>
              {{scope.row.recallMessageQuantity || 0}}
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" type="default" prop="deleteMessageQuantity"
                           label="删除消息" sortable="delete_message_quantity" align='right' width='100px'>
            <template slot-scope='scope'>
              {{scope.row.deleteMessageQuantity || 0}}
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="操作" align="center"
                           width="160px">
            <template slot-scope="scope">
              <ns-table-column-operate-button :buttons="_data._table.table_buttons"
                                              :prop="scope">
              </ns-table-column-operate-button>
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
