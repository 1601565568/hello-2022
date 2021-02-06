<template>
  <page-table class='no-padding'>
    <template slot='table'>
      <el-table
        :data="_data._table.data"
        class="new-table_border"
        @sort-change="handleSort"
        style="width: 100%">
        <el-table-column
          prop="avatar"
          label="头像">
          <template slot-scope="scope">
            <div class='avatar-img'>
              <img :src='scope.row.avatar'/>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="昵称">
        </el-table-column>
        <el-table-column
          prop="type"
          label="成员类型">
          <template slot-scope="scope">
            {{scope.row.type === 1 ? '表示该外部联系人是微信用户':'表示该外部联系人是企业微信用户'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="ownerBind"
          label="是否为群主好友">
          <template slot-scope="scope">
            {{scope.row.ownerBind === 1 ? '是':'不是'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="shopName"
          label="所属门店">
        </el-table-column>
        <el-table-column
          prop="chatroomName"
          label="所属企微群">
        </el-table-column>
        <el-table-column
          prop="guideName"
          label="群主">
        </el-table-column>
        <el-table-column
          prop="workNumber"
          label="群主工号">
        </el-table-column>
        <el-table-column
          prop="joinTime"
          sortable="custom"
          label="入群时间">
        </el-table-column>
        <el-table-column
          prop="joinScene"
          label="入群方式">
          <template slot-scope="scope">
            {{statusList[scope.row.joinScene]}}
          </template>
        </el-table-column>
      </el-table>
    </template>
  </page-table>
</template>
<script>
import PageTable from '@/components/NewUi/PageTable'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
export default {
  data () {
    return {
      url: this.$api.guide.lbs.getGroupFriends,
      statusList: {
        1: {
          value: ' 由成员邀请入群（直接邀请入群）',
          color: 'info'
        },
        2: {
          value: '由成员邀请入群（通过邀请链接入群）',
          color: 'warning'
        },
        3: {
          value: '扫码入群',
          color: 'success'
        }
      },
      model: {}
    }
  },
  components: {
    PageTable
  },
  props: {
    propsModel: {
      default () {
        return {}
      }
    }
  },
  mixins: [tableMixin],
  methods: {
    handleSort (val) {
      const { order, prop } = val
      this.$emit('onSort', { orderType: order === 'ascending' ? 1 : 0, sortName: prop })
    }
  },
  watch: {
    propsModel: {
      handler (newVal) {
        this.model = { ...newVal }
        this.$searchAction$()
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "@components/NewUi/styles/reset.css";
  .template-table.no-padding {
    padding: 0;
  }
  .avatar-img {
    height: 32px;
    width: 32px;
  }
</style>
