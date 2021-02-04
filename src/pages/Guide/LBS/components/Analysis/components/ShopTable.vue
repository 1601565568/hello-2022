<template>
  <div>
    <page-table class='no-padding'>
      <template slot='table'>
        <el-table
          :data="data"
          class="new-table_border"
          :row-style="tableRowClassName"
          style="width: 100%">
          <el-table-column
            prop="shopName"
            label="参与门店">
          </el-table-column>
          <el-table-column
            prop="groupNum"
            label="群聚合码">
            <template slot-scope="scope">
              <div class="scope-title">
                <div class="scope-title_text">
                  已聚合{{scope.row.groupNum}}个群
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="employeeNum"
            label="新增群成员数">
          </el-table-column>
          <el-table-column
            prop="address"
            width='250px'
            label="操作">
            <template slot-scope="scope">
              <div class='btn-context'>
                <ns-button type="text" class='detail-btn'>查看详情</ns-button>
                <NsChatRoomDialog btnTitle="添加群聊" @getChatRoomData="(list)=>{getChatRoomData(list,scope.row)}" :showIcon='false'></NsChatRoomDialog>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </page-table>
  </div>
</template>
<script>
import PageTable from '@/components/NewUi/PageTable'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import NsChatRoomDialog from '@/components/NsChatRoomDialog/index'
export default {
  data () {
    return {
      url: this.$api.guide.lbs.findGroupList,
      data: [{
        shopName: '参与门店',
        groupNum: 12,
        employeeNum: 11,
        id: 1
      }]
    }
  },
  components: {
    PageTable, NsChatRoomDialog
  },
  mixins: [tableMixin],
  methods: {
    getChatRoomData (list, item) {
      console.log(list, item)
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "@components/NewUi/styles/reset.css";
  .template-table.no-padding {
    padding: 0;
  }
  .btn-context {
    display: flex;
    .detail-btn {
      margin-right: 10px;
    }
  }
</style>
