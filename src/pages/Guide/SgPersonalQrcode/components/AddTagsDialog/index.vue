<template>
  <el-dialog title="选择标签" width="758px" :visible="visible" @close="cancel">
    <el-form class="add-tags" label-width="100px" label-position="left">
      <!-- <el-form-item label="运营视角" required>
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
        <el-form-grid class="checkboxs-tags">
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
              >
                {{tagValueItem.tagName}}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form-grid>
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
  props: [ 'visible', 'selectedTags' ],
  data () {
    return {
      checkList: [],
      tagList: []
    }
  },
  watch: {
    visible (val) {
      if (val) {
        if (this.selectedTags && typeof this.selectedTags === 'string') {
          this.checkList = this.selectedTags.split(',')
        }
      }
    }
  },
  async created () {
    await this.getWeWorkTagList()

    if (this.selectedTags && typeof this.selectedTags === 'string') {
      this.checkList = this.selectedTags.split(',')
    }
  },
  methods: {
    async getWeWorkTagList () {
      try {
        const res = await this.$http.fetch(this.$api.guide.sgPersonalQrcode.findWeWorkTagList)
        if (res.success) {
          this.tagList = res.result
        } else {
          this.$notify.error('获取企微标签失败')
        }
      } catch (error) {
        this.$notify.error('获取企微标签失败')
      }
    },
    confirm () {
      this.$emit('confirm', this.checkList.join(','))
      this.$emit('hide')
    },
    cancel () {
      this.checkList = []
      this.$emit('hide')
    }
  }
}
</script>

<style lang="scss" scoped>
// @import "./reset.css";

.add-tags {
  margin-left: 6px;
  margin-top: 28px;
  .checkboxs-tags {
    border: 1px solid #D9D9D9;
    padding: 16px;
    width: 99%;
  }
}
</style>
