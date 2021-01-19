import html2canvas from 'html2canvas'
import { networkImg2Base64 } from '@/utils/networkImg2Base64'
export default {
  props: {
    menuListTitle: {
      type: String,
      default: '工作台'
    },
    moduleType: {
      type: Number,
      default: 1
    },
    menuType: {
      type: Number,
      default: 1
    },
    editData: {
      type: Array
    },
    settingCode: {
      type: String
    }
  },
  data () {
    return {
      PageName: 'Work'
    }
  },
  computed: {
    pageTopBg () {
      return this.menuType === 1 ? 'daogou' : 'dianzhang'
    },
    pageTabBarImage () {
      var url
      if (this.menuType === 1) {
        switch (this.moduleType) {
          case 1:
            url = require(`../../image/tabBar-work.png`)
            break
          case 2:
            url = require(`../../image/tabBar-yeji.png`)
            break
          case 3:
            url = require(`../../image/tabBar-my.png`)
        }
      } else {
        switch (this.moduleType) {
          case 4:
            url = require(`../../image/tabBar-shoperyeji.png`)
            break
          case 5:
            url = require(`../../image/tabBar-shoper-guanli.png`)
        }
      }
      return url
    }
  },
  watch: {
    moduleType (newVal) {
      this.onChangePage(newVal)
    }
  },
  methods: {
    onChangePage (newVal) {
      if (this.menuType === 1) {
        switch (newVal) {
          case 1:
            this.PageName = 'Work'
            break
          case 2:
            this.PageName = 'Achievement'
            break
          case 3:
            this.PageName = 'My'
        }
      } else {
        switch (newVal) {
          case 4:
            this.PageName = 'SAchievement'
            break
          case 5:
            this.PageName = 'ManageMember'
        }
      }
    },
    imgToBase64 () {
      networkImg2Base64(this.pageTopShare).then(res => {
        // this.value = res
        this.navigationUrls = res
        this.$nextTick(() => {
          html2canvas(this.$refs.iphone, {
            useCORS: true,
            width: this.$refs.iphone.clientWidth, // dom 原始宽度
            height: this.$refs.iphone.clientHeight,
            scrollY: 0,
            scrollX: 0
          }).then(canvas => {
            let dataURL = canvas.toDataURL('image/png')
          })
        })
      })
    },
    toImage () {
      // console.log(this.$ref.)
      // this.imgToBase64()
      // html2canvas(this.$refs.iphone, {
      //   useCORS: true,
      //   width: this.$refs.iphone.clientWidth, // dom 原始宽度
      //   height: this.$refs.iphone.clientHeight,
      //   scrollY: 0,
      //   scrollX: 0
      // }).then(canvas => {
      //   this.$nextTick(() => {
      //     let dataURL = canvas.toDataURL('image/png')
      //     console.log(dataURL)
      //   })
      // })
      // this.imgToBase64()
      var this_ = this
      this.$nextTick(() => {
        const canvas = document.createElement('canvas') // 创建一个canvas节点
        const shareContent = document.getElementById('iphone') // 需要截图的包裹的（原生的）DOM 对象
        const width = shareContent.offsetWidth // 获取dom 宽度
        // const height = shareContent.offsetHeight // 获取dom 高度
        const scale = 2 // 定义任意放大倍数 支持小数
        canvas.getContext('2d').scale(scale, scale) // 获取context,设置scale
        const rect = shareContent.getBoundingClientRect() // 获取元素相对于视口的
        const scrollTop =
          document.documentElement.scrollTop || document.body.scrollTop // 获取滚动轴滚动的长度
        html2canvas(document.getElementById('iphone'), {
          // 转换为图片
          x: rect.left, // 绘制的dom元素相对于视口的位置
          y: rect.top,
          // scrollX: scrollTop,// 滚动的长度
          scrollY: -scrollTop,
          scale: scale, // 添加的scale 参数
          width: width, // dom 原始宽度
          useCORS: true, // 开启跨域
          dpi: window.devicePixelRatio * 2
        }).then(canvas => {
          const context = canvas.getContext('2d')
          // 关闭抗锯齿
          context.mozImageSmoothingEnabled = false
          context.msImageSmoothingEnabled = false
          context.imageSmoothingEnabled = false
          const imgUrl = canvas.toDataURL('image/png')
        })
      })
    }
  }
}
