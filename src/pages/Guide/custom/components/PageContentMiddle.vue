<template>
  <div class="PageContentMiddle">
    <div class="iphone" ref="iphone">
      <div class="iphone-status">
        <!-- <img
          class="image"
          src="https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-WEB/image/iphonexcx_status.png"
        /> -->
        <img class="image" src="../image/iphonexcx_status.png" crossorigin="anonymous" />
      </div>
      <div class="navigation">
        <img class="image" :src="navigationUrl" />
        <span>{{title}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import html2canvas from 'html2canvas'
import { networkImg2Base64 } from '@/utils/networkImg2Base64'
export default {
  data () {
    return {
      title: '工作台',
      navigationUrl:
        'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-WEB/image/iphonexcx_navigation.png'
    }
  },
  methods: {
    imgToBase64 () {
      networkImg2Base64(this.navigationUrl).then(res => {
        console.log(res)
      })
    },
    toImage () {
      this.imgToBase64()
      // html2canvas(this.$refs.iphone, {
      //   useCORS: true,
      //   logging: true
      // }).then(canvas => {
      //   let dataURL = canvas.toDataURL('image/png')
      //   console.log(dataURL)
      // })
    }
  }
}
</script>

<style scoped lang="scss">
.PageContentMiddle {
  min-height: calc(100vh - 172px);
}
@media screen and (max-width: 1625px) {
  .PageContentMiddle {
    min-height: calc(100vh - 152px);
  }
}
.PageContentMiddle {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fbfbfb;
  border-left: 1px solid #e8e8e8;
  border-right: 1px solid #e8e8e8;
  .iphone {
    margin: 40px 0;
    width: 375px;
    height: 667px;
    background: #f5f5f5;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.08);
    .image {
      width: 375px;
    }
    .navigation {
      position: relative;
      span {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}
</style>
