<template>
  <span v-html='html' class='emoji-text'></span>
</template>
<script>
export default {
  data () {
    return {
      html: ''
    }
  },
  props: {
    text: {
      default: ''
    },
    pre: {
      default: ''
    },
    // detail 详情页预览  list 列表预览
    type: {
      default: 'detail'
    },
    emptySpecial: {
      type: Boolean,
      default: false
    },
    emojiList: {
      type: Array,
      default () {
        return ['微笑', '撇嘴', '色', '发呆', '得意', '流泪', '害羞', '闭嘴', '睡', '大哭', '尴尬', '发怒', '调皮', '呲牙', '惊讶', '难过', '囧', '抓狂', '吐', '偷笑', '愉快', '白眼', '傲慢', '困', '惊恐', '流汗', '憨笑', '悠闲', '奋斗', '咒骂', '疑问', '嘘', '晕', '衰', '骷髅', '敲打', '再见', '擦汗', '抠鼻', '鼓掌', '坏笑', '左哼哼', '右哼哼', '哈欠', '鄙视', '委屈', '快哭了', '阴险', '亲亲', '可怜', '菜刀', '西瓜', '啤酒', '咖啡', '猪头', '玫瑰', '凋谢', '嘴唇', '爱心', '心碎', '蛋糕', '炸弹', '便便', '月亮', '太阳', '拥抱', '强', '弱', '握手', '胜利', '抱拳', '勾引', '拳头', 'OK', '跳跳', '发抖', '怄火', '转圈', '笑脸', '生病', '破涕为笑', '吐舌', '脸红', '恐惧', '失望', '无语', '嘿哈', '捂脸', '奸笑', '机智', '皱眉', '耶', '吃瓜', '加油', '汗', '天啊', 'Emm', '社会社会', '旺柴', '好的', '打脸', '加油加油', '哇', '翻白眼', '666', '让我看看', '叹气', '苦涩', '裂开', '鬼魂', '合十', '强壮', '庆祝', '礼物', '红包', '發', 'Blessing']
      }
    }
  },
  watch: {
    text: {
      handler (newVal) {
        const preRegexp = this.type === 'list' ? new RegExp('\\[', 'g') : new RegExp('\\{' + this.pre + '\\[', 'g')
        const afterRegexp = this.type === 'list' ? new RegExp(']', 'g') : new RegExp(']}', 'g')
        this.html = newVal.replace(preRegexp, '<img src="https://kedaocdn.oss-cn-zhangjiakou.aliyuncs.com/ecrm/wxemoji/v1/').replace(afterRegexp, '.png" />')
        if (this.emptySpecial && !newVal) {
          this.html = '-'
        }
      },
      immediate: true
    }
  }
}
</script>
<style scoped>
.emoji-text {
  font-size: 1em;
  word-break: break-all;
  >>> img {
    height: 1.3em;
    position: relative;
    top:-0.11em;
  }
}
</style>
