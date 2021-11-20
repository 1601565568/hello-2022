<template>
  <el-dialog
    title="选择标签"
    width="758px"
    :visible="visible"
    @close="close"
    @open="open"
  >
    <div>
      <el-input style="width:180px" v-model="searchTagGroupName" placeholder="请输入标签名" clearable></el-input>
      <el-form class="add-tags" label-position="left">
        <el-form-item>
          <div
            v-if="showList.length"
            class="checkboxs-tags"
            v-infinite-scroll="loadMore"
          >
            <el-form-item
              label-width="60px"
              v-for="tagGroupItem in showList"
              :key="tagGroupItem.tagGroupId"
              :label="tagGroupItem.tagGroupName"
            >
              <el-checkbox-group v-model="checkList">
                <el-checkbox
                  v-for="tagValueItem in tagGroupItem.tagValueList"
                  :key="tagValueItem.tagId"
                  :label="tagValueItem.tagId"
                  @change="chooseTag(tagGroupItem.tagGroupId, tagValueItem.tagId)"
                >
                  {{tagValueItem.tagName}}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <!-- <span class="no-tag" v-if="showList.length === tagList.length">没有更多了~</span> -->
          </div>
          <!-- <span class="no-tag" v-else>暂无标签数据</span> -->
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <ns-button @click="close">取 消</ns-button>
      <ns-button type="primary" @click="confirm">确 定</ns-button>
    </span>
  </el-dialog>
</template>

<script>
/**
 * 打标签模态框
 */
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    // tagList: {
    //   type: Array,
    //   default: function () {
    //     return []
    //   }
    // },
    tagListUrl: { // 打标列表接口
      type: Object,
      default: function () {
        return this.$api.guide.sgPersonalQrcode.findWeWorkTagList
      }
    },
    selectedTags: {
      type: [Array, String],
      default: function () {
        return []
      }
    }
  },
  watch: {
    searchTagGroupName (val) {
      this.searchList = this.tagList.filter(item => item.tagGroupName.indexOf(val) > -1)
      this.showList = this.searchList.slice(0, 10)
    }
  },
  data () {
    return {
      searchTagGroupName: '',
      tagList: [],
      showList: [],
      searchList: [],
      checkList: [],
      tagId2TagGroupId: {} // tagId映射tagGroupId Map
    }
  },
  methods: {
    loadMore () {
      // 从搜索结果searchList中loadMore
      const len = this.showList.length
      const slice = this.searchList.slice(len, len + 10)
      if (slice.length) this.showList.push(...slice)
    },
    chooseTag (tagGroupId, tagId) {
      if (this.checkList.indexOf(tagId) > -1) {
        this.tagId2TagGroupId[tagId] = tagGroupId
      } else {
        delete this.tagId2TagGroupId[tagId]
      }
    },
    async open () {
      await this.getTagList()
      if (this.selectedTags) {
        // 初始化已选中标签
        if (typeof this.selectedTags === 'string') {
          this.checkList = this.selectedTags.split(',')
        } else if (Array.isArray(this.selectedTags)) {
          this.checkList = [...this.selectedTags]
        }
        this.oldTags = [...this.checkList]
      }
      // 生成tagId到tagGroupId的映射
      for (const tagGroupItem of this.tagList) {
        const tagGroupId = tagGroupItem.tagGroupId
        for (const tagValItem of tagGroupItem.tagValueList) {
          const tagId = tagValItem.tagId
          if (this.checkList.indexOf(tagId) > -1) {
            this.tagId2TagGroupId[tagId] = tagGroupId
          }
        }
      }

      this.searchList = this.tagList
      this.showList = this.tagList.slice(0, 10)
    },
    confirm () {
      this.$emit('confirm', {
        tagIds: this.checkList, // 已选标签id数组
        tagGroupIds: Array.from(new Set(Object.values(this.tagId2TagGroupId))), // 已选标签组id数组
        tagId2TagGroupIdMap: this.tagId2TagGroupId // 已选标签id映射标签组id
      })
      this.close()
    },
    close () {
      this.showList = []
      this.searchList = []
      this.checkList = []
      this.tagId2TagGroupId = {}
      this.$emit('update:visible', false)
    },
    // API 获取标签列表
    async getTagList () {
      try {
        const res = await this.$http.fetch(this.tagListUrl)
        if (res.success) {
          this.tagList = res.result
        } else {
          this.$notify.error('获取标签失败')
        }
      } catch (error) {
        this.$notify.error('获取标签失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./reset.css";

.add-tags {
  margin-left: 6px;
  margin-top: 28px;
  .checkboxs-tags {
    overflow: auto;
    max-height: 500px;
    border: 1px solid #D9D9D9;
    padding: 16px;
    width: 99%;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .no-tag {
    color: #8c8c8c;
    font-size: 14px;
  }
}
</style>
