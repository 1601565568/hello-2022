<template>
  <el-dialog
    title="重复群成员筛选"
    :visible.sync="sVisible"
    width="1000px" class="dialog-chat"
    @closed="onClose">
    <ns-page-table>
      <template slot="buttons">
        <ns-table-operate-button :buttons="_data._table.operate_buttons">
        </ns-table-operate-button>
      </template>
      <template slot="table">
        <el-table ref="table" :data="_data._table.data" class="template-table__main"
                  stripe
                  resizable v-loading.lock="_data._table.loadingtable"
                  :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$"
                  row-key="id"
                  @selection-change="$selectionChange">
          <el-table-column type="selection" align="right" :width="50"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" type="default" prop="title"
                           label="头像" width='80px' :sortable="false">
            <template slot-scope="scope">
              <div class="avatar-name clearfix">
                <div class="avatar-name__avatar"><img
                  :src='scope.row.isOwner == "1" ? (scope.row.ownerHead || NoImg) : (scope.row.head || NoImg)' alt="会员头像"></div>
                <div class="avatar-name__name"></div>
              </div>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" type="default" prop="nick"
                           label="微信昵称" :sortable="false" width='200px'>
            <template slot-scope='scope'>
              {{scope.row.isOwner == "1" ? (scope.row.ownerNick || '-') : (scope.row.nick || '-')}}
            </template>
          </el-table-column>
          <!--            todo-zsf 暂无以下数据-->
          <el-table-column :show-overflow-tooltip="true" type="default" prop=""
                           label="性别" :sortable="false" width='80px' align='center'>
            <template slot-scope='scope'>
              -
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" type="default" prop=""
                           label="地区" :sortable="false" width='80px'>
            <template slot-scope='scope'>
              -
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" type="default" prop="displayname"
                           label="所属微信群" :sortable="false">
            <template slot-scope='scope'>
              <el-row>
                <span>{{scope.row.displayname}}</span>
              </el-row>
              <el-row>
                <span>{{scope.row.chatroomnotice || '-'}}</span>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" type="default" prop=""
                           label="是否好友" :sortable="false" width='80px' align='center'>
            <template slot-scope='scope'>
              {{scope.row.rId || scope.row.isOwner == "1" ? '是' : '否' }}
            </template>
          </el-table-column>
<!--          todo-zsf 暂无移出-->
<!--          <el-table-column :show-overflow-tooltip="true" label="操作" align="center"-->
<!--                           width="160px">-->
<!--            <template slot-scope="scope">-->
<!--              <ns-table-column-operate-button :buttons="_data._table.table_buttons"-->
<!--                                              :prop="scope">-->
<!--              </ns-table-column-operate-button>-->
<!--            </template>-->
<!--          </el-table-column>-->
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
  </el-dialog>
</template>
<script>
import Index from './src/duplicateTable'

export default Index
</script>
<style scoped>
  @import "@/style/small/variables.pcss";

  @import "../src/style.pcss";
</style>
