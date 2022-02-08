<template>
  <div @updateAnimate="getDownIconInfo">
    <el-popover
      placement="bottom-end"
      width="188"
      trigger="manual"
      v-model="visible"
    >
      <div class="down-cover-view">
        <div>您有文件已生成，快去下载吧</div>
      </div>
      <div class="dowm-module" id="dowm-module" slot="reference" @click="openDownFileList">
        <Icon type="down-file" class="down-icon"  className="nav-avatar__icon--svg" />
        <div class="down-red-view" v-show="showRed"></div>
      </div>
    </el-popover>
    <div v-show="showFile">
      <div class="run-icon-view" id="run-icon-view" :style="{top: iconTop, right: iconRight}">
        <span class="iconfont icon-wenben2x red-file-view"></span>
      </div>
    </div>
    <DownFileList ref="downFileList" @updateShowRed="updateShowRed"/>
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
    },
    '$store.state.down.downAction': function (status) {
      if (status) {
        this.getDownIconInfo()
      }
    }
  },
  data () {
    return {
      showFile: false,
      iconTop: null,
      iconRight: null,
      timer: null,
      showRed: false,
      visible: false
    }
  },
  mounted () {
    this.timerLoad()
  },
  destroyed () {
    clearInterval(this.timer)
  },
  methods: {
    updateShowRed () {
      this.showRed = false
    },
    async exportIsSuccess (type) {
      const json = await this.$http.fetch(this.$api.guide.task.isSuccess, { state: type })
      if (json.success) {
        this.showRed = json.result === 1
        if (this.showRed) {
          this.visible = true
          setTimeout(() => {
            this.visible = false
          }, 5000)
        }
      }
    },
    timerLoad () {
      this.timer = setInterval(() => {
        this.exportIsSuccess(null)
      }, 10000)
    },
    openDownFileList () {
      this.$refs.downFileList.openDrawer()
    },
    getDownIconInfo () {
      const ball = document
        .querySelector('#run-icon-view')
      this.showFile = true
      const top = this.$store.state.down.top
      const right = this.$store.state.down.right
      if (!top && !right) {
        return
      }
      this.iconTop = top + 'px'
      this.iconRight = right + 'px'
      const widthX = this.isShowAreaSelect ? right - 112 - 114 - 32 : right - 112
      const heightY = 10 - top
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
        this.$store.dispatch({
          type: 'down/downAction',
          status: false,
          width: null,
          height: null
        })
        this.iconRight = null
        this.iconTop = null
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
  position: relative;
  .down-icon {
    font-size: 20px;
  }
  .down-red-view {
    position: absolute;
    width: 6px;
    height: 6px;
    background-color: red;
    top: 0;
    right: 0;
    border-radius: 50%;
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
.down-cover-view {
  padding: 8px;
  .cover-title {
    font-size: 14px;
    color: #262626;
    line-height: 22px;
    font-weight: 600;
    margin-bottom: 4px;
  }
}
</style>
