<template>
  <div class="text-message">
    <EmojiText :text='htmlContent' />
  </div>
</template>

<script>
import Emotion from '@nascent/ecrp-ecrm/src/components/Emotion/index'
import EmojiText from '@/components/NewUi/EmojiText'

export default {
  components: { EmojiText },
  props: {
    content: {
      type: Object,
      default: function () {
        return {
          type: 'text',
          content: '',
          htmlContent: '',
          textContent: ''
        }
      }
    }
  },
  watch: {
    'content.textContent' (newVal, oldVal) {
      this.text2Emoji()
      this.tag2Html()
      this.n2br()
    }
  },
  data () {
    return {
      htmlContent: '',
      ENV: process.env.VUE_APP_THEME
    }
  },
  mounted () {
    this.text2Emoji()
    this.tag2Html()
    this.n2br()
  },
  methods: {
    text2Emoji () {
      // const strRegex = /{\[(.+?)\]}/g
      // this.htmlContent = this.content.textContent.replace(strRegex, (item, index) => {
      //   // const imgDom = document.createElement('img')
      //   // imgDom.src = `https://kedaocdn.oss-cn-zhangjiakou.aliyuncs.com/ecrm/wxemoji/v1/${index}.png`
      //   // return imgDom.outerHTML
      //   const imgDom = document.createElement('span')
      //   imgDom.innerText = item
      //   return imgDom.outerHTML
      // })
      this.htmlContent = this.content.textContent
    },
    tag2Html () {
      const strRegex = /{(?!\[)(.+?)(?!\])}/g
      this.htmlContent = this.htmlContent.replace(strRegex, (item, index) => {
        const tagDom = document.createElement('span')
        tagDom.innerText = index
        tagDom.className = this.ENV === 'QA' ? 'colorQA' : 'colorNormal'
        return tagDom.outerHTML
      })
    },
    n2br () {
      const strRegex = /\n/g
      this.htmlContent = this.htmlContent.replace(strRegex, '<br>')
    }
  }
}
</script>
<style>

.colorQA, .colorNormal {
color:#26a2ff;
  cursor: default;
  margin: 0 1px;
}
.colorQA{
color: #2153D4;
}
.colorNormal{
     color:#26a2ff;
}
</style>

<style lang="scss" scoped>
.text-message {
  color: #383838;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
</style>
