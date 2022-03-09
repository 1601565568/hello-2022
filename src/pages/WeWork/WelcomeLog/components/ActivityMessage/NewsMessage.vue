<template>
  <div class="link-message">
    <div class="link-wrapper">
      <div class="link-title">
        {{content.link.title}}
      </div>
      <div class="link-content">
        <span>{{content.link.desc}}</span>
        <img :src="content.link.imgUrl" />
      </div>
      <div class="link-footer">
        <!-- <img src="" alt="">
        <span>链接</span> -->
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    content: {
      type: Object,
      default: function () {
        return {
          type: 'news',
          link: '',
          title: '',
          desc: '',
          imgUrl: ''
        }
      }
    }
  },
  data () {
    return {}
  },
  mounted () { },
  methods: {
    showPreview () {
      this.$refs.NsPreview.toggleShow(1, this.srcList, 'img')
    }
  }
}
</script>

<style lang="scss" scoped>
.link-message {
  width: 100%;
  max-height: 127px;
  max-width: 242px;
  background: #ffffff;
  border-radius: 2px;
  .link-wrapper {
    margin: 0 auto;
    padding: 7px 0 3px;
    width: calc(100% - 20px);
    .link-title {
      width: 100%;
      max-height: 36px;
      overflow: hidden;
      font-size: 14px;
      font-weight: bold;
      line-height: 20px;
      color: #262626;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .link-content {
      width: 100%;
      height: 55px;
      margin-top: 5px;
      display: flex;
      justify-content: space-between;
      padding-bottom: 5px;
      // border-bottom: 1px solid #EEEEEE;
      span {
        line-height: 17px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      img {
        margin-left: 10px;
        margin-top: 2px;
        width: 45px;
        height: 45px;
      }
    }

    .link-footer {
      margin-top: 3px;
      width: 100%;
      height: 16px;
      display: flex;
      align-items: center;

      img {
        border-radius: 50%;
        width: 12px;
        height: 12px;
      }

      span {
        margin-left: 3px;
        display: inline-block;
      }
    }
  }
}
</style>
