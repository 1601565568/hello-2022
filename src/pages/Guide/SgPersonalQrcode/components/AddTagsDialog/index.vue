<template>
  <el-dialog title="选择标签" width="758px" :visible="visible" @close="cancel" @open="open">
    <el-form class="add-tags" label-width="100px" label-position="left">
      <!-- <el-form-item label="运营体系" required>
        <el-select v-model="selectedValue" filterable placeholder="请选择">
          <el-option
            v-for="item in operateViewList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="选择标签">
        <el-form-grid class="checkboxs-tags" v-if="tagList.length">
          <el-form-item
            label-width="60px"
            v-for="tagGroupItem in tagList"
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
        </el-form-grid>
        <span class="no-tag" v-else>暂无标签数据</span>
      </el-form-item>
    </el-form>
    <!-- footer -->
    <span slot="footer" class="dialog-footer">
      <ns-button @click="cancel">取 消</ns-button>
      <ns-button type="primary" @click="confirm">确 定</ns-button>
    </span>
  </el-dialog>
</template>

<script>
/**
 * 打标签模态框
 */
export default {
  name: 'AddTags',
  props: [ 'visible', 'tagList', 'selectedTags' ],
  data () {
    return {
      checkList: [],
      selectedTagGroupIds: [],
      tagId2TagGroupId: {}
    }
  },
  methods: {
    chooseTag (tagGroupId, tagId) {
      if (this.checkList.indexOf(tagId) > -1) {
        this.tagId2TagGroupId[tagId] = tagGroupId
      } else {
        delete this.tagId2TagGroupId[tagId]
      }
    },
    open () {
      if (this.selectedTags && typeof this.selectedTags === 'string') {
        this.checkList = this.selectedTags.split(',')
      }

      for (const tagGroupItem of this.tagList) {
        const tagGroupId = tagGroupItem.tagGroupId
        for (const tagValItem of tagGroupItem.tagValueList) {
          const tagId = tagValItem.tagId
          if (this.checkList.indexOf(tagId) > -1) {
            this.tagId2TagGroupId[tagId] = tagGroupId
          }
        }
      }
    },
    confirm () {
      this.$emit('confirm', {
        checkList: this.checkList.join(','),
        tagId2TagGroupId: this.tagId2TagGroupId
      })
      this.$emit('hide')
    },
    cancel () {
      this.checkList = []
      this.tagId2TagGroupId = {}
      this.$emit('hide')
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
    border: 1px solid #D9D9D9;
    padding: 16px;
    width: 99%;
  }

  .no-tag {
    color: #8c8c8c;
    font-size: 14px;
  }
}
</style>
