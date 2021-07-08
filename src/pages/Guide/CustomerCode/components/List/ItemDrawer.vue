<template>
  <div class='item-content'>
    <div class='item-wrapper'>
      <div class='item-header'>
        <div class='master-close' @click="handleClose">
          <i class="el-icon-close"></i>
        </div>
        <div class='icon-list'>
          <div class='icon-item' @click="handlePreview" v-if='data.status!==1'>
            <el-popover
              popper-class="dwaer-popper"
              placement="top-start"
              trigger="hover"
              title='活动效果'>
              <img :src='nsPreviewIcon'  slot="reference"/>
            </el-popover>
          </div>
          <div class='icon-item' @click="handleDelect" v-if='[1,2].includes(data.status)'>
            <el-popover
              popper-class="dwaer-popper"
              placement="top-start"
              trigger="hover"
              title='结束活动'>
              <img :src='closeIcon' slot="reference" />
            </el-popover>
          </div>
          <div class='icon-item'  @click="handleEdit" v-if='[1,2].includes(data.status)'>
            <el-popover
              popper-class="dwaer-popper"
              placement="top-start"
              title='编辑'
              trigger="hover">
              <img :src='nsEditIcon' slot="reference" />
            </el-popover>
          </div>
        </div>
      </div>
      <div class='content'>
        <div class='content-header'>
          <h1>
            <el-tag :type="data.statusColor" class='scope-name_tag'>{{data.statusText}}</el-tag>
            <h3>{{data.name}}</h3>
          </h1>
          <p>有效时间 {{data.validTimeStart}} 至 {{data.validTimeEnd}}</p>
        </div>
        <div class='content-detail'>
          <h4>活动介绍（快捷话术）</h4>
          <div class='content'>
            <EmojiText :text='data.activityIntroductionHtml' pre='EMOJI_'/>
          </div>
          <h4>专属活动海报</h4>
          <div class='poster'>
            <img :src='data.activityPlacard'>
          </div>
        </div>
      </div>
      <div class='footer'>
        <div class='pagecontent-left'>
          <div class='content-item' @click='handlePrev'><i class="el-icon-arrow-left"></i>上一个</div>
          <div class='content-item' @click='handleNext'>下一个<i class="el-icon-arrow-right"></i></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import closeIcon from '../../Images/close.png'
import nsEditIcon from '../../Images/ns-edit.png'
import nsPreviewIcon from '../../Images/ns-preview.png'
import EmojiText from '@/components/NewUi/EmojiText'
export default {
  data () {
    return {
      closeIcon,
      nsEditIcon,
      nsPreviewIcon
    }
  },
  components: { EmojiText },
  props: {
    data: {
      default () {}
    }
  },
  methods: {
    handleClose () {
      this.$emit('onClose')
    },
    handlePreview () {
      this.$emit('onPreview', this.data.guestCodeId)
    },
    handleDelect () {
      this.$emit('onDelect', this.data.guestCodeId)
    },
    handleEdit () {
      this.$emit('onEdit', { guestCodeId: this.data.guestCodeId })
    },
    handleNext () {
      this.$emit('onNext')
    },
    handlePrev () {
      this.$emit('onPrev')
    }
  }
}
</script>
<style lang="scss" scoped>
.item-content {
  height: 100vh;
  overflow-y: auto;
}
.item-wrapper {
  position: relative;
  padding: 12px 16px;
  min-height: 100vh;
  padding-bottom: 50px;
  .item-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
    margin-bottom:8px;
    .master-close {
      font-size: 16px;
    }
    .icon-item {
      height: 24px;
      width: 24px;
      border: 1px solid #D9D9D9;
      border-radius: 2px;
      border-radius: 2px;
      text-align: center;
      line-height: 24px;
      float: left;
      margin-left: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        height: 12px;
        width: 12px;
      }
    }
  }
  .content-header {
    h1 {
      display: flex;
      h3 {
        font-size: 16px;
        color: #262626;
        margin-left: 8px;
        margin-bottom: 16px;
        line-height: 24px;
      }
    }
    p {
      font-size: 14px;
      color: #8C8C8C;
      line-height: 22px;
    }
  }
  .content-detail {
    h4 {
      font-size: 14px;
      color: #262626;
      line-height: 22px;
      margin-top: 21px;
      margin-bottom: 16px;
    }
    .poster {
      background: #F5F5F5;
      border-radius: 4px;
      border-radius: 4px;
      padding: 32px 0;
      text-align: center;
      img {
        width: 188px;
      }
    }
    .content {
      font-size: 14px;
      color: #595959;
      text-align: justify;
      line-height: 28px;
    }
  }
  .el-tag--success {
    border-radius: 2px;
    background: #F7FFF0;
    border: 1px solid #53BF1D;
    color: #262626;
  }
  .el-tag--info {
    border-radius: 2px;
    background: #F5F5F5;
    border: 1px solid #D9D9D9;
    color: #262626;
  }
  .el-tag--warning {
    border-radius: 2px;
    background: #FFFBE6;
    border: 1px solid #FFAE0D;
    color: #262626;
  }
  .footer {
    position: absolute;
    right: 16px;
    bottom: 12px;
  }
  .pagecontent-left {
    width: 223px;
    height: 32px;
    border: 1px solid #D9D9D9;
    border-radius: 2px;
    border-radius: 2px;
    display: flex;
    position: relative;
    user-select:none;
    cursor: pointer;
    &:after {
      content: ' ';
      position: absolute;
      left: 50%;
      top: 4px;
      bottom: 4px;
      width: 1px;
      background-color: #E8E8E8;
    }
    .content-item {
      width: 50%;
      font-size: 14px;
      color: #595959;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
.dwaer-popper {
  min-width: 0 !important;
}
</style>
<style lang="css">
.dwaer-popper {
  min-width: 0 !important;
}
</style>
