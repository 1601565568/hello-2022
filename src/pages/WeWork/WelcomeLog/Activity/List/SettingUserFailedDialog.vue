<template>
  <el-dialog
    width="505px"
    append-to-body
    :visible="visible"
    @close="cancel"
  >
    <template slot="title">
      <h3 class="title">错误提示</h3>
    </template>
    <div class="content">
      <div class="guide-info">
        <Icon type="nsinfocricle" class="icon" />
        <div class="tip">
          <span>{{info.guideNames.slice(0 , 3).join('、')}}</span>
          <span v-if="info.guideNames.length > 3">
            等共
            <el-popover
            placement="top-start"
            width="200"
            trigger="hover"
            :content="info.guideNames.join('、')">
              <span slot="reference" class="popover-tip">{{info.guideNames.length}}</span>
            </el-popover>
            人
          </span>已在待执行的发送任务中，不可被修改
        </div>
      </div>
      <div class="task-name">
        <span>涉及任务名称：</span>
        <span v-for="(taskname, index) in info.taskNames.slice(0, 3)" :key="index">{{taskname}}</span>
        <div v-if="info.taskNames.length > 3">等共
          <el-popover
          placement="top-start"
          width="200"
          trigger="hover"
          :content="info.taskNames.join('、')">
            <span slot="reference" class="popover-tip">{{info.taskNames.length}}</span>
          </el-popover>
        项任务</div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <NsButton @click="cancel" size="medium" :loading="loading">取 消</NsButton>
      <NsButton type="primary" size="medium" @click="confirm" :loading="loading">确 定</NsButton>
    </span>
  </el-dialog>
</template>

<script>
import { SOPAuthRangeType } from '../../types'

export default {
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: function () {
        return {
          taskNames: [],
          guideNames: []
        }
      }
    }
  },
  data () {
    return {
      loading: false,
      taskNames: [],
      guideNames: []
    }
  },
  methods: {
    cancel () {
      this.$emit('update:visible', false)
    },
    confirm () {
      // 测试弹框
      this.cancel()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./styles/reset.css";
.title {
  font-size: 16px;
}

.content {
  font-size: 14px;
  line-height: 22px;
  margin-right: 28px;
  .guide-info {
    margin-left: 6px;
    display: flex;
    .icon {
      margin-top: 4px;
      margin-right: 8px;
      color: #e6a23c;
      font-size: 16px;
      flex-shrink: 0;
    }
    .tip {
      span {
        display: inline-block;
      }
    }
  }
  .task-name {
    display: flex;
    margin-left: 30px;
    flex-direction: column;
  }

  .popover-tip {
    color: #0094FC;
  }
}
</style>
