<template>
  <div>
    <div class="dowm-module" id="dowm-module" @click="openDownFileList">
      <Icon type="down-file" class="down-icon"  className="nav-avatar__icon--svg" />
    </div>
    <div class="run-icon-view" id="run-icon-view" v-show="showFile">
      <span class="iconfont icon-wenben2x red-file-view"></span>
    </div>
    <DownFileList ref="downFileList"/>
  </div>
</template>

<script>
import isShowArea from '@/layout/small/src/isShowArea'
import DownFileList from './components/DownFileList'
export default {
  name: 'downModule',
  props: {
    isArea: {
      type: Boolean,
      default: false
    }
  },
  components: {
    DownFileList
  },
  watch: {
    $route: {
      handler () {
        this.activeName = this.$route.matched[0].name
        this.isShowAreaSelect = isShowArea(this.$route)
      },
      immediate: true
    }
  },
  data () {
    return {
      timer: null,
      showFile: false
    }
  },
  methods: {
    openDownFileList () {
      this.$refs.downFileList.openDrawer()
    },
    getDownIconInfo () {
      const ball = document
        .querySelector('#run-icon-view')
      this.showFile = true
      const widthX = this.isShowAreaSelect ? 150 - 112 - 114 - 32 : 150 - 112
      const heightY = -340
      const run = ball.animate([
        // keyframes
        // { transform: 'rotate(180deg)' },
        { transform: `translate(${widthX}px, ${heightY}px` }
      ], {
        // timing options
        duration: 500,
        iterations: 1
      })
      run.onfinish = () => {
        this.showFile = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.dowm-module {
  margin-right: calc(15px + 8px);
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, .2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  .down-icon {
    font-size: 20px;
  }
}
.run-icon-view {
  width: 32px;
  height:32px;
  border-radius: 50%;
  position: fixed;
  top: 350px;
  right: 150px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #5BA5F5;
  .red-file-view {
    color: white;
  }
}
</style>
