<template>
  <page-table class='no-padding' :tableBarShow='false'>
    <template slot='table'>
      <el-table
        :data="_data._table.data"
        class="new-table_border"
        @sort-change="handleSort"
        style="width: 100%">
        <el-table-column
          prop="avatar"
          width='60px'
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
          <template slot-scope="scope">
            {{scope.row.name || '-'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="成员类型">
          <template slot-scope="scope">
            {{scope.row.type === 1 ? '企业成员':'外部联系人'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="ownerBind"
          label="是否为群主好友">
          <template slot-scope="scope">
            {{scope.row.ownerBind === 1 ? '是':'否'}}
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
          <template slot-scope="scope">
            {{scope.row.workNumber || '-'}}
          </template>
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
            {{statusList[scope.row.joinScene] ? statusList[scope.row.joinScene].value : '-'}}
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 页面 start -->
    <template slot='pagination'>
      <el-pagination v-if="_data._pagination.enable"
                      class="template-table__pagination"
                      :page-sizes="_data._pagination.sizeOpts"
                      :total="_data._pagination.total"
                      :current-page="_data._pagination.page"
                      :page-size="_data._pagination.size"
                      layout="total, sizes, prev, pager, next, jumper"
                      @size-change="$sizeChange$"
                      @current-change="$pageChange$">
        </el-pagination>
    </template>
    <!-- 页面 end -->
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
          value: '由成员邀请入群',
          color: 'info'
        },
        2: {
          value: '由成员邀请入群',
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
      this.$emit('onSort', { sortType: order === 'ascending' ? 1 : 0, sortName: prop })
    }
  },
  watch: {
    propsModel: {
      handler (newVal) {
        this.model = { ...newVal, sortName: 'joinTime' }
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
    img{
      width: 100%;
      height: 100%;
    }
  }
</style>
