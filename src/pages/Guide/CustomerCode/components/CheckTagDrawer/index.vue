<template>
  <ElDrawer
    size="720px"
    class="drawer"
    :modal="false"
    :visible="visible"
    direction="rtl"
    append-to-body
    @close="$emit('update:visible', false)"
    @open="open"
  >
    <template slot="title">
      <h3 class="title">已选择标签预览</h3>
    </template>
    <div class="drawer_content" ref="DrawerContent">
      <div
        v-if="tagList.length"
        class="checkboxs-tags"
        v-loading="loading"
      >
        <div
          class="tag-item"
          v-for="tagGroupItem in tagList"
          :key="tagGroupItem.tagGroupId"
        >
          <div class="tag-item-name">{{tagGroupItem.tagGroupName}}</div>
          <el-checkbox-group class="tags" v-model="checkList" disabled>
            <el-checkbox
              v-for="tagValueItem in tagGroupItem.tagValueList"
              :key="tagValueItem.tagId"
              :label="tagValueItem.tagId"
            >
              {{tagValueItem.tagName}}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </div>
  </ElDrawer>
</template>

<script>
import ElDrawer from '@nascent/nui/lib/drawer'

export default {
  components: {
    ElDrawer
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    checkList: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      loading: false,
      showList: [],
      searchList: [],
      tagList: []
    }
  },
  methods: {
    open () {
      this.getTagList()
    },
    getActivityDetailById (id) {
      this.loading = true
      this.$http.fetch(this.$api.weWork.sop.findById, { id })
        .then(resp => {
          this.activity = resp.result
          this.loading = false
          this.resetScroll()
        }).catch(() => {
          this.$notify.error('获取活动详情失败')
        })
    },
    // API 获取标签列表
    async getTagList () {
      this.loading = true
      try {
        const res = await this.$http.fetch(this.$api.guide.sgPersonalQrcode.findWeWorkTagList)
        if (res.success) {
          const showList = res.result.filter(tagGroupItem => {
            if (Array.isArray(tagGroupItem.tagValueList)) {
              for (const tagValueItem of tagGroupItem.tagValueList) {
                if (this.checkList.indexOf(tagValueItem.tagId) >= 0) {
                  return true
                }
              }
            }
          })
          this.tagList = showList
        } else {
          this.$notify.error('获取标签失败')
        }
        this.loading = false
        this.resetScroll()
      } catch (error) {
        this.$notify.error('获取标签失败')
      }
    },
    resetScroll () {
      this.$refs.DrawerContent.parentElement.scrollTop = 0
    }
  }
}
</script>

<style lang="scss" scoped>
/* @import "./drawer-reset.css"; */
@import "./reset.css";

.drawer {
  .title {
    font-size: 16px;
    color: #262626;
    line-height: 24px;
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #9093994d;
  }

  .drawer_content {
    padding: 0 16px;
    .checkboxs-tags {
      .tag-item {
        &:first-child {
          margin-top: 23px;
        }
        &:nth-child(n + 2) {
          margin-top: 32px;
        }
        .tag-item-name {
          font-size: 14px;
          font-weight: bold;
        }
        .tags {
          padding-top: 16px;
        }
      }
    }
  }
}
</style>
