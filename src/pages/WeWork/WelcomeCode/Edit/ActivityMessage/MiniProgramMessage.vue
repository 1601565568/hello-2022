<template>
  <div class="miniprogram-message">
    <div class="miniprogram-wrapper">
      <div class="miniprogram-header">
        <span class="avatar"></span>
        <span>小程序名称</span>
      </div>
      <div class="miniprogram-title">
        {{content.title}}
      </div>
      <div class="miniprogram-content">
       <img :src="content.image" alt="">
      </div>
      <div class="miniprogram-footer">
        <Icon type="xiaochengxushouquan" className="icon"/>
        <span>小程序</span>
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
          title: '',
          image: ''
        }
      }
    }
  },
  data () {
    return {}
  },
  mounted () {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.miniprogram-message {
  height: 100%;
  width: 100%;
  max-width: 140px;
  max-height: 161px;
  background: #ffffff;
  border-radius: 2px;
  .miniprogram-wrapper {
    margin: 0 auto;
    padding: 6px 0 2px;
    width: calc(100% - 12px);

    .miniprogram-header {
      height: 12px;
      display: flex;
      align-items: center;
      .avatar {
        display: block;
        width: 12px;
        height: 12px;
        background: #D9D9D9;
        border-radius: 50%;
      }
      span {
        display: inline-block;
        margin-left: 4px;
        font-size: 12px;
        color:#909399;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }

    .miniprogram-title {
      width: 100%;
      overflow: hidden;
      font-size: 12px;
      font-weight: bold;
      color: #262626;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .miniprogram-content {
      width: 100%;
      height: 100%;
      display: flex;
      padding-bottom: 5px;
      border-bottom: 1px solid #EEEEEE;

      img {
        max-width: 100%;
        max-height: 90px;
      }
    }

    .miniprogram-footer {
      margin-top: 3px;
      margin-bottom: 3px;
      width: 100%;
      height: 16px;
      display: flex;
      align-items: center;

      .icon {
        font-size: 12px;
        color:#7586DB
      }

      span {
        color:#909399;
        margin-left: 3px;
        display: inline-block;
      }
    }
  }
}
</style>
