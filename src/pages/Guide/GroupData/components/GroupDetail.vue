<template>
  <div>
    <el-dialog
      title="群详情"
      :visible.sync="sVisible"
      @closed="onClose" response-limit :show-scroll-x=false
      width='800px'>
      <div>
        <el-form label-width="80px">
          <el-form-item label="所属微信群：">
            <el-form-grid>{{`${groupDetail.displayname || '-'}  （${groupDetail.memberCount||0}人）`}}</el-form-grid>
          </el-form-item>
          <el-form-item label="群公告：">
            <el-form-grid>{{groupDetail.chatroomnotice || '-'}}</el-form-grid>
          </el-form-item>
        </el-form>
        <ns-page-table>
          <template slot="table">
            <el-table ref="table" :data="_data._table.data" class="template-table__main"
                      stripe
                      resizable v-loading.lock="_data._table.loadingtable"
                      :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$"
                      row-key="id"
                      @selection-change="$selectionChange">
              <el-table-column :show-overflow-tooltip="true" type="default" prop="title"
                               label="头像" width='70px' :sortable="false" align='center'>
                <template slot-scope="scope">
                  <div class="avatar-name clearfix">
                    <div class="avatar-name__avatar"><img
                      :src='scope.row.isOwner == "1" ? (scope.row.ownerHead || NO_IMG_BIG) : (scope.row.head || NO_IMG_BIG)' alt="会员头像"></div>
                    <div class="avatar-name__name"></div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" type="default" prop="nick"
                               label="微信信息" :sortable="false">
                <template slot-scope='scope'>
                  {{`${scope.row.isOwner == "1" ? (scope.row.ownerNick || '-') : (scope.row.nick || '-')}（${scope.row.wname || scope.row.wid || '-'}）`}}
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" type="default" prop=""
                               label="会员状态" :sortable="false" width='100px' align='center'>
                <template>
<!--                  todo-zsf 暂时取不到会员状态-->
                  -
<!--                  {{scope.row.isMember === '1' ? '是' : '否'}}-->
                </template>
                <template slot='header' scope='header'>
                    <span>
                      <span>{{header.column.label}}</span>
                      <el-tooltip content="此微信客户是否为会员">
                       <Icon type="question-circle"/>
                      </el-tooltip>
                    </span>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" type="default" prop=""
                               label="专属导购" :sortable="false" width='100px' align='left'>
                <template slot-scope='scope'>
                  {{scope.row.guideName || '-'}}
                </template>
                <template slot='header' scope='header'>
                    <span>
                      <span>{{header.column.label}}</span>
                      <el-tooltip content="此微信客户是否有专属导购">
                       <Icon type="question-circle"/>
                      </el-tooltip>
                    </span>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" type="default" prop="updateTime"
                               label="入群时间" :sortable="'m.update_time'" width='150px' align='center'>
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
      <span slot="footer" class="dialog-footer">
        <ns-button @click="sVisible = false">关闭</ns-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Index from './src/groupDetail'

export default Index
</script>
<style scoped>
  @import '../src/style.pcss';
</style>
