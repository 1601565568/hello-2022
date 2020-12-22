<template>
  <div class="xcx-banner">
    <template v-if="editData.type === 1 && editData.image.length === 0">
      <img class="image nopic" :style="{ opacity: opacity }" :src="src" />
    </template>
    <template v-if="editData.type === 1 && editData.image.length > 0">
      <!-- <img class :src="item" :key="index" /> -->
      <el-image
        v-for="(item, index) in editData.image"
        :key="index"
        class="image"
        :style="{ opacity: opacity }"
        :src="item"
        fit="contain"
      ></el-image>
    </template>
    <template v-if="editData.type === 2">
      <!-- 图片未选择时显示 -->
      <swiper :options="swiperOption" v-if="editData.image.length === 0">
        <swiper-slide>
          <img :style="{ opacity: opacity }" class="image nopic" :src="src" />
        </swiper-slide>
        <swiper-slide>
          <img :style="{ opacity: opacity }" class="image nopic" :src="src" />
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
      <!-- 图片未选择时显示-结束 -->
      <swiper :options="swiperOption" ref="test" v-else>
        <swiper-slide
          v-for="(swiperList, index) of editData.image"
          :key="index"
          :data-swiper-autoplay="+interval === 0 ? 99999999 : interval"
        >
          <el-image
            class="image"
            :style="{ opacity: opacity }"
            :src="swiperList"
            fit="contain"
          ></el-image>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </template>
  </div>
</template>
<script>
import ElImage from '@nascent/nui/lib/image'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
export default {
  props: {
    editData: {
      type: Object
    }
  },
  data () {
    return {
      src:
        'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-APP-WEB/img/noPictures.png',
      swiperOption: {
        slidesPerView: 'auto',
        autoplay: {
          stopOnLastSlide: false,
          autoplayDisableOnInteraction: false,
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination'
        }
      }
    }
  },
  //   ElCarousel, ElCarouselItem
  components: { ElImage, swiper, swiperSlide },
  computed: {
    opacity: function () {
      return this.editData.transparency / 100
    },
    interval: function () {
      return this.editData.interval * 1000
    }
  }
}
</script>
<style lang="scss" scoped>
.image {
  margin-bottom: 8px;
  width: 100%;
  height: 150px;
}
.nopic {
  margin-bottom: 0px;
}
</style>
