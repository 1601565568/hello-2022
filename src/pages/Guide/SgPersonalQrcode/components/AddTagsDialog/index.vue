<template>
  <el-dialog title="选择标签" width="758px" :visible="visible" @close="$emit('hide')">
    <el-form class="add-tags" label-width="100px" label-position="left">
      <el-form-item label="运营视角" required>
        <el-select v-model="selectedValue" filterable placeholder="请选择">
          <el-option
            v-for="item in operateViewList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择标签">
        <el-form-grid class="checkboxs-tags">
          <el-form-item label="消费行为" label-width="60px">
            <el-checkbox-group v-model="checkList">
              <el-checkbox label="复选框 A"></el-checkbox>
              <el-checkbox label="复选框 B"></el-checkbox>
              <el-checkbox label="复选框 C"></el-checkbox>
              <el-checkbox label="复选框 C"></el-checkbox>
              <el-checkbox label="复选框 C"></el-checkbox>
              <el-checkbox label="复选框 C"></el-checkbox>
              <el-checkbox label="复选框 C"></el-checkbox>
              <el-checkbox label="复选框 C"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="消费行为" label-width="60px">
            <el-checkbox-group v-model="checkList">
              <el-checkbox label="复选框 A"></el-checkbox>
              <el-checkbox label="复选框 B"></el-checkbox>
              <el-checkbox label="复选框 C"></el-checkbox>
              <el-checkbox label="复选框 C"></el-checkbox>
              <el-checkbox label="复选框 C"></el-checkbox>
              <el-checkbox label="复选框 C"></el-checkbox>
              <el-checkbox label="复选框 C"></el-checkbox>
              <el-checkbox label="复选框 C"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form-grid>
      </el-form-item>
    </el-form>
    <!-- footer -->
    <span slot="footer" class="dialog-footer">
      <ns-button @click="$emit('hide')">取 消</ns-button>
      <ns-button type="primary" @click="chooseTags">确 定</ns-button>
    </span>
  </el-dialog>
</template>

<script>
/**
 * 打标签模态框
 */
export default {
  name: 'AddTags',
  props: [ 'visible' ],
  data () {
    return {
      selectedValue: '',
      operateViewList: [
        {
          id: 1,
          name: '吃饭'
        },
        {
          id: 2,
          name: '睡觉'
        }
      ],
      checkList: []
    }
  },
  methods: {
    chooseTags () {
      window.console.log('打标签')
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
