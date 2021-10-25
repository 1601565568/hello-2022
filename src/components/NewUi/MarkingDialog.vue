<template>
  <el-dialog
    title="批量打标"
    :visible.sync="visible"
    height='600px'
    response-limit :show-scroll-x=false
  >
    <div v-for="item in tagGroupList" v-bind:key="item.tagId" class="dialog-tag">
      <h3 class="dialog-tag__title padding-base">{{item.tagName}}</h3>
      <el-checkbox-group v-model="ckeckList" class="padding-base">
          <span v-for="item1 in tagList" v-bind:key="item1.tagId">
            <el-checkbox v-if="item1.parentTagId === item.tagId" :key="item1.tagId" :value="item1.tagId" :label="item1.tagId">{{item1.tagName}}</el-checkbox>
          </span>
      </el-checkbox-group>
    </div>
    <span slot="footer">
      <ns-button @click="handleChangeVisible(false)" :loading='loading'>取消</ns-button>
      <ns-button type="primary" @click="saveBatchMarking" :loading='loading'>保存</ns-button>
    </span>
  </el-dialog>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      visible: false,
      loading: false,
      ckeckList: [...this.checkedTagList]
    }
  },
  props: {
    checkedTagList: {
      default () {
        return []
      }
    }
  },
  computed: mapState({
    tagGroupList: state => state.marking.tagGroupList,
    tagList: state => state.marking.tagList
  }),
  methods: {
    handleChangeVisible (visible) {
      this.visible = visible
    },
    saveBatchMarking () {
      if (this.ckeckList.length) {
        this.loading = true
        this.$emit('onChangeCheckedTagList', this.ckeckList)
      }
    }
  },
  watch: {
    visible () {
      this.ckeckList = []
      this.loading = false
    }
  }
}
</script>
<style lang='scss' scoped>
.template-search__box {
  width: 182px;
  height: 28px;
  background: #ffffff;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  border-radius: 3px;
  display: flex;
}
.template-search__box span {
  width: 141px;
  height: 27px;
  margin-left: 10px;
  border-right: 1px solid #dcdfe6;
}
.template-search__box > div + span {
  margin-left: var(--default-margin-small);
}
.dialog-tag__title {
  background-color: #f3f4f4;
}

</style>
