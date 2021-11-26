<template>
  <el-dialog
    title="选择标签"
    width="758px"
    :visible="visible"
    @close="close"
    @open="open"
  >
    <div>
      <el-input style="width:180px;margin-left: 7px" v-model="searchTagGroupName" placeholder="请输入标签名" clearable></el-input>
      <el-form class="add-tags" label-position="left">
        <el-form-item v-loading="loading">
          <div
            class="checkboxs-tags"
            :class="{ center: !loading && !showList.length }"
            v-infinite-scroll="loadMore"
          >
            <el-form-item
              v-show="showList.length"
              label-width="60px"
              v-for="tagGroupItem in showList"
              :key="tagGroupItem.tagGroupId"
              :label="tagGroupItem.tagGroupName"
            >
              <el-checkbox-group :value="checkList">
                <el-checkbox
                  v-for="tagValueItem in tagGroupItem.tagValueList"
                  :key="tagValueItem.tagId"
                  :label="tagValueItem.tagId"
                  @change="(flag) => chooseTag(tagGroupItem.tagGroupId, tagValueItem.tagId, flag)"
                >
                  <!-- :disabled="tagGroupIds.length >= max && tagGroupIds.indexOf(tagGroupItem.tagGroupId) < 0" -->
                  {{tagValueItem.tagName}}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <div class="no-data" v-show="!loading && !showList.length && !closing">
              <img v-show="tagList.length && !showList.length" :src="searchPng" />
              <span v-show="tagList.length && !showList.length" class="no-tag">没有搜索到数据哦~</span>
              <img v-show="!tagList.length" :src="noDataPng" />
              <span v-show="!tagList.length" class="no-tag">没有数据哦~</span>
            </div>
          </div>
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
import searchPng from './no-data.png'
import noDataPng from './no-data2.png'

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
    },
    max: { // 最多选择多少个标签组
      type: Number,
      default: 50
    }
  },
  computed: {
    tagGroupIds () {
      return Array.from(new Set(Object.values(this.tagId2TagGroupId)))
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
      searchPng: searchPng,
      noDataPng: noDataPng,
      loading: false,
      closing: false,
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
    chooseTag (tagGroupId, tagId, flag) {
      const index = this.checkList.indexOf(tagId)
      if (flag || (!flag && index < 0)) {
        // 选中
        if (this.tagGroupIds.length < this.max || this.tagGroupIds.indexOf(tagGroupId) > -1) {
          this.checkList.push(tagId)
          this.$set(this.tagId2TagGroupId, tagId, tagGroupId)
        } else {
          this.$notify.error(`最多选择${this.max}个标签`)
        }
      } else if (index > -1) {
        // 取消选中
        this.checkList.splice(index, 1)
        this.$delete(this.tagId2TagGroupId, tagId)
      }
    },
    async open () {
      this.loading = true
      this.closing = false
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
      this.loading = false
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
      this.closing = true
      this.searchTagGroupName = ''
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
    height: 500px;
    border: 1px solid #D9D9D9;
    padding: 16px;
    width: 99%;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .no-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      width: 220px;
      height: 220px;
    }
    .no-tag {
      color: #8c8c8c;
      font-size: 14px;
    }
  }
}
</style>
