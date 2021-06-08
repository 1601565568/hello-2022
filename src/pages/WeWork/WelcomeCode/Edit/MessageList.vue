<template>
  <ul class="message-list">
    <li
      class="message-list-item"
      v-for="({ type, content }, key) in list"
      :key="key"
    >
      <div class="message-detail">
        <Icon :type="WelcomeMessageTypeTip[type].icon" class="icon" />
        <span>{{content | msgText(type)}}</span>
      </div>
      <div class="message-order" :class="{ 'first-line': key === 0 }">
        <ns-button v-show="key !== 0" type="text" @click="sortMessage(key, 'top')">
          <Icon type="zhiding" />
        </ns-button>
        <ns-button v-show="key !== 0" type="text" @click="sortMessage(key, 'up')">
          <Icon type="top-arr" />
        </ns-button>
        <ns-button v-show="key !== list.length - 1" type="text" @click="sortMessage(key, 'down')">
          <Icon type="down-arr" />
        </ns-button>
        <ns-button v-show="key !== list.length - 1" type="text" @click="sortMessage(key, 'bottom')">
          <Icon type="zhidi" />
        </ns-button>
      </div>
      <div class="message-operate">
        <ns-button type="text" size="small" @click="editMessage({ type, content }, key)">编辑</ns-button>
        <ns-button type="text" size="small" @click="deleteMessage(key)">删除</ns-button>
      </div>
    </li>
  </ul>
</template>

<script>
import { WelcomeMessageType, WelcomeMessageTypeTip } from '../types'

export default {
  props: {
    list: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  filters: {
    msgText (content, type) {
      switch (type) {
        case WelcomeMessageType.Image:
          return content.image.slice(content.image.lastIndexOf('/') + 1)
        case WelcomeMessageType.Video:
          return content.video.slice(content.video.lastIndexOf('/') + 1)
        case WelcomeMessageType.Link:
        case WelcomeMessageType.MiniProgram:
        case WelcomeMessageType.Poster:
          return content.title
        default:
          return ''
      }
    }
  },
  data () {
    return {
      WelcomeMessageType: WelcomeMessageType,
      WelcomeMessageTypeTip: WelcomeMessageTypeTip
    }
  },
  methods: {
    /**
     * 改变消息顺序
     * @param index 当前消息位置
     * @param direction 改变方向 top up down bottom
     */
    sortMessage (index, direction) {
      const list = [ ...this.list ]

      const [ delItem ] = list.splice(index, 1)
      if (direction === 'top') {
        list.unshift(delItem)
      } else if (direction === 'bottom') {
        list.push(delItem)
      } else if (direction === 'up') {
        list.splice(index - 1, 0, delItem)
      } else if (direction === 'down') {
        list.splice(index + 1, 0, delItem)
      }
      this.$emit('update:list', list)
    },
    deleteMessage (index) {
      const list = [ ...this.list ]
      list.splice(index, 1)
      this.$emit('update:list', list)
    },
    editMessage (data, index) {
      this.$emit('edit', { ...data, index })
    }
  }
}
</script>

<style lang="scss" scoped>
.message-list {
  width: 626px;
  list-style: none;
  padding: 0;
  .message-list-item {
    display: flex;
    align-items: center;
    height: 52px;
    border-bottom: 1px solid #e8e8e8;

    .message-detail {
      width: 212px;
      display: flex;
      align-items: center;
      .icon {
        font-size: 16px;
        margin-left: 9px;
      }
      span {
        margin-left: 5px;
        line-height: 20px;
        display: inline-block;
        width: 180px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }

    .message-order {
      margin-left: 69px;
      width: 156px;
      padding: 0 20px;
      .el-button + .el-button {
        margin-left: 16px;
      }
    }

    .first-line {
      display: flex;
      justify-content: flex-end;
    }

    .message-operate {
      margin-left: 69px;
      width: 128px;
    }
  }
}
</style>
