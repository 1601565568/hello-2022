<template>
  <div>
    <page-table :searchCol='24'>
      <template slot='search'>
        <div class='title'>{{name}}客户（总计：{{_data._pagination.total}}人）</div>
      </template>
      <template slot='button'>
        <ns-button type="primary" size='large' :disabled='disabled' @click='handleBatch'>批量打标</ns-button>
      </template>
      <template slot='table'>
        <template>
          <el-table
            :data="_data._table.data"
            v-loading.lock="_data._table.loadingtable"
            @selection-change='handleSelectionChange'
            class="new-table_border"
            style="width: 100%">
            <el-table-column type="selection" align="center">
            </el-table-column>
            <el-table-column align="left" label="昵称">
              <template slot-scope="scope">
                <div class='td-detail'>
                  <img :src="scope.row.pic" class='td-img'>
                  <span class='td-name'>{{scope.row.name}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="sendTime" :label="`${name}时间`" :sortable="false" align="left">
          </el-table-column>
          </el-table>
        </template>
      </template>
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
    </page-table>
    <el-dialog
      title="批量打标"
      :visible.sync="showBatchMarkingVisible"
      response-limit :show-scroll-x=false
    >
      <div v-for="item in tagGroupList" v-bind:key="item.tagId" class="dialog-tag">
        <h3 class="dialog-tag__title padding-base">{{item.tagName}}</h3>
        <el-checkbox-group v-model="checkedTagList" class="padding-base">
            <span v-for="item1 in tagList" v-bind:key="item1.tagId">
              <el-checkbox v-if="item1.parentTagId === item.tagId" :key="item1.tagId" :value="item1.tagId" :label="item1.tagId">{{item1.tagName}}</el-checkbox>
            </span>
        </el-checkbox-group>
      </div>
      <span slot="footer">
        <ns-button @click="BatchMarkingClose">取消</ns-button>
        <ns-button type="primary" @click="saveBatchMarking">保存</ns-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import PageTable from '@/components/NewUi/PageTable'
export default {
  data () {
    return {
      model: {
        type: 0,
        momentId: null,
        userId: null
      },
      url: this.$api.guide.momentList.getLikeOrComment,
      // 批量打标弹窗
      showBatchMarkingVisible: false,
      // 标签组列表
      tagGroupList: [],
      // 标签列表
      tagList: [],
      checkedCustomerList: [],
      // 选中的标签列表
      checkedTagList: []
    }
  },
  mixins: [tableMixin],
  computed: {
    disabled () {
      return !this.checkedCustomerList.length
    },
    name () {
      return {
        0: '评论',
        1: '点赞'
      }[this.type]
    }
  },
  props: {
    type: {}
  },
  components: { PageTable },
  methods: {
    handleSelectionChange (selection) {
      const selectList = selection.filter(item => !item.self)
      this.checkedCustomerList = selectList
    },
    handleBatch () {
      if (this.checkedCustomerList && this.checkedCustomerList.length > 0) {
        this.queryTagList()
        this.showBatchMarkingVisible = true
      } else {
        this.$notify.warning('请先选择要打标的客户')
      }
    },
    // 查询企业标签列表
    queryTagList: function () {
      let that = this
      that.$http.fetch(that.$api.weWork.externalContact.queryCorpTagList)
        .then((resp) => {
          let corpTagList = resp.result
          if (corpTagList) {
            // 标签组列表
            let tagGroupList = []
            // 标签列表
            let tagList = []
            for (let corpTag of corpTagList) {
              if (corpTag.is_tag_group === 1) {
                tagGroupList.push({
                  tagId: corpTag.tag_id,
                  tagName: corpTag.tag_name
                })
              } else {
                tagList.push({
                  tagId: corpTag.tag_id,
                  tagName: corpTag.tag_name,
                  parentTagId: corpTag.parent_tag_id
                })
              }
            }
            that.tagGroupList = tagGroupList
            that.tagList = tagList
          }
        }).catch((resp) => {
          that.$notify.error(getErrorMsg('获取企业标签失败,请稍后重试', resp))
        }).finally(() => {})
    },
    // 批量打标关闭
    BatchMarkingClose: function () {
      this.showBatchMarkingVisible = false
      this.checkedTagList = []
    },

    // 批量打标保存
    saveBatchMarking: function () {
      let that = this
      if (that.checkedTagList && that.checkedTagList.length > 0) {
        that.$http.fetch(that.$api.weWork.externalContact.saveBatchMarking, { checkedCustomerList: that.checkedCustomerList, checkedTagList: that.checkedTagList }).then((resp) => {
          this.showBatchMarkingVisible = false
          this.checkedTagList = []
          this.$notify.success('批量打标成功')
        }).catch((resp) => {
          this.$notify.error(getErrorMsg('批量打标失败', resp))
        })
      } else {
        this.$notify.warning('请先选择标签')
      }
    }
  },
  mounted () {
    const { momentId, userId = null } = this.$route.query
    this.model = { ...this.model, momentId, userId, type: this.type }
    this.$searchAction$()
  }
}
</script>
<style scoped lang='scss'>
@import "@components/NewUi/styles/reset.css";
.title {
  font-size: 16px;
  color: #262626;
  line-height: 24px;
  font-weight: 500;
}
.td-detail {
  display: flex;
  align-items: center;
  .td-img {
    width: 40px;
    height: 40px;
    margin-right: 8px;
    border-radius: 50%;
  }
  .td-name {
    font-size: 14px;
    color: #303133;
    line-height: 22px;
  }
}

.dialog-tag__title {
  background-color: #f3f4f4;
}
</style>
