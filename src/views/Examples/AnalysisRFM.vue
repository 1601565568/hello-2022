<template>
  <div>
    <div class="form-main">
      <el-form :inline="true" @submit.native.prevent @keyup.enter.native="onSearch" label-width="100px">
        <el-form-item>
          <el-form-grid>
            最近付款时间在
          </el-form-grid>
          <el-form-grid size="md">
            <el-date-picker
              v-model="valueDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-grid>
          <el-form-grid>
            前
          </el-form-grid>
          <el-form-grid size="xs">
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-grid>
          <el-form-grid>
            的客户
          </el-form-grid>
        </el-form-item>
        <el-form-item>
          <ns-button type="primary">{{$t('operating.search')}}</ns-button>
          <ns-button>{{$t('operating.reset')}}</ns-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="form-main">
      <div class="rfm-main">
        <span class="rfm-main__titleX">{{titleX}}</span>
        <span class="rfm-main__titleY">{{titleY}}</span>
        <div class="rfm-main__content">
          <ul class="rfm-list clearfix" ref="rfmList">
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      valueDate: '',
      options: [{
        value: '一年',
        label: '一年'
      }, {
        value: '全部',
        label: '全部'
      }],
      value: '一年',
      /* 忠诚度阶梯 */
      titleX: '忠诚度',
      titleY: '活跃度',
      lengthX: 5, // 横轴长度
      lengthY: 5, // 竖轴长度
      firColor: '#176cd8',
      secColor: '#f5a915',
      domList: [],
      isOpen: false,
      lists: [
        {
          items: [
            {
              title: 'R≤45，F=1',
              num: '3人（16.53%）',
              price: '￥0.22',
              total: '￥0.65'
            },
            {
              title: 'R≤45，F=2',
              num: '3人（16.53%）',
              price: '￥0.22',
              total: '￥0.65'
            },
            {
              title: 'R≤45，F=3',
              num: '3人（16.53%）',
              price: '￥0.22',
              total: '￥0.65'
            },
            {
              title: 'R≤45，F=4',
              num: '3人（16.53%）',
              price: '￥0.22',
              total: '￥0.65'
            },
            {
              title: 'R≤45，F=5',
              num: '3人（16.53%）',
              price: '￥0.22',
              total: '￥0.65'
            }
          ]
        },
        {
          items: [
            {
              title: 'R≤45，F=1',
              num: '3人（16.53%）',
              price: '￥0.22',
              total: '￥0.65'
            },
            {
              title: 'R≤45，F=1',
              num: '3人（16.53%）',
              price: '￥0.22',
              total: '￥0.65'
            },
            {
              title: 'R≤45，F=1',
              num: '3人（16.53%）',
              price: '￥0.22',
              total: '￥0.65'
            },
            {
              title: 'R≤45，F=1',
              num: '3人（16.53%）',
              price: '￥0.22',
              total: '￥0.65'
            },
            {
              title: 'R≤45，F=1',
              num: '3人（16.53%）',
              price: '￥0.22',
              total: '￥0.65'
            }
          ]
        },
        {
          items: [
            {
              title: 'R≤45，F=1',
              num: '3人（16.53%）',
              price: '￥0.22',
              total: '￥0.65'
            },
            {
              title: 'R≤45，F=1',
              num: '3人（16.53%）',
              price: '￥0.22',
              total: '￥0.65'
            },
            {
              title: 'R≤45，F=1',
              num: '3人（16.53%）',
              price: '￥0.22',
              total: '￥0.65'
            },
            {
              title: 'R≤45，F=1',
              num: '3人（16.53%）',
              price: '￥0.22',
              total: '￥0.65'
            },
            {
              title: 'R≤45，F=1',
              num: '3人（16.53%）',
              price: '￥0.22',
              total: '￥0.65'
            }
          ]
        },
        {
          items: [
            {
              title: 'R≤45，F=1',
              num: '3人（16.53%）',
              price: '￥0.22',
              total: '￥0.65'
            },
            {
              title: 'R≤45，F=1',
              num: '3人（16.53%）',
              price: '￥0.22',
              total: '￥0.65'
            },
            {
              title: 'R≤45，F=1',
              num: '3人（16.53%）',
              price: '￥0.22',
              total: '￥0.65'
            },
            {
              title: 'R≤45，F=1',
              num: '3人（16.53%）',
              price: '￥0.22',
              total: '￥0.65'
            },
            {
              title: 'R≤45，F=1',
              num: '3人（16.53%）',
              price: '￥0.22',
              total: '￥0.65'
            }
          ]
        },
        {
          items: [
            {
              title: 'R≤45，F=1',
              num: '3人（16.53%）',
              price: '￥0.22',
              total: '￥0.65'
            },
            {
              title: 'R≤45，F=1',
              num: '3人（16.53%）',
              price: '￥0.22',
              total: '￥0.65'
            },
            {
              title: 'R≤45，F=1',
              num: '3人（16.53%）',
              price: '￥0.22',
              total: '￥0.65'
            },
            {
              title: 'R≤45，F=1',
              num: '3人（16.53%）',
              price: '￥0.22',
              total: '￥0.65'
            },
            {
              title: 'R≤45，F=1',
              num: '3人（16.53%）',
              price: '￥0.22',
              total: '￥0.65'
            }
          ]
        }
      ]
      /* 忠诚度阶梯-end */
    }
  },
  mounted () {
    this.rfnFun()
  },
  methods: {
    /* 忠诚度初始化函数 */
    rfnFun () {
      this.domFun()
      this.setBackground()
      this.setOpacity(this.lengthX, this.lengthY)
      /* 输出内容 */
      this.domList.forEach((value) => {
        this.$refs.rfmList.appendChild(value)
      })
      /* 填充数据函数 */
      this.fillData()
    },
    /* 循环dom节点 */
    domFun () {
      this.lists.forEach((value) => {
        let domLi = document.createElement('li')
        this.createDomFun(value, domLi)
        this.domList.push(domLi)
      })
    },
    /* 创建dom节点 */
    createDomFun (listLi, domLi) {
      listLi.items.forEach(() => {
        let domDiv = document.createElement('div')
        domDiv.className = 'rfm-list__content clearfix'
        let domContent = document.createElement('div')
        domContent.className = 'list-content clearfix'
        let domBackground = document.createElement('div')
        domBackground.className = 'list-bg'
        domDiv.appendChild(domContent)
        domDiv.appendChild(domBackground)
        domLi.appendChild(domDiv)
      })
    },
    /* 循环数据 */
    fillData () {
      /* 循环忠诚度中li结构 */
      this.lists.forEach((value, firIndex, array) => {
        /* 循环li结构中div子级 */
        value.items.forEach((value, secIndex, array) => {
          /* 调用填充数据函数 */
          this.dataFun(firIndex, secIndex, value)
        })
      })
    },
    /* 填充数据 */
    dataFun (firIndex, secIndex, value) {
      this.$refs.rfmList.children[firIndex].children[secIndex].children[0].innerHTML = `<h4 class="list-title text-center">${value.title}</h4>` +
          `<p class="list-data">客户数：${value.num} </p>` +
          `<p class="list-data">客单价：${value.price}</p>` +
          `<p class="list-data">付款总额：${value.total}</p>`
    },
    /* 设置忠诚度背景颜色 */
    setBackground () {
      for (let i = 0; i < this.domList.length; i++) {
        for (let j = 0; j < this.domList[i].childNodes.length; j++) {
          this.domList[i].childNodes[j].childNodes[1].style.backgroundColor = this.firColor
        }
        for (let m = i + 1; m < this.domList[i].childNodes.length; m++) {
          this.domList[i].childNodes[m].childNodes[1].style.backgroundColor = this.secColor
        }
      }
    },
    /* 设置忠诚度背景透明度 */
    setOpacity (lengthX, lengthY) {
      let xVlue = 1 / (lengthX - 1)
      let yVlue = 1 / lengthY
      for (let i = 0; i < lengthY; i++) {
        for (let j = 0; j <= i; j++) {
          this.domList[i].childNodes[j].childNodes[1].style.opacity = (i - j + 1) * yVlue
        }
        /* 右上方颜色透明度设置 */
        for (let h = (lengthY - 1); h > 0; h--) {
          if (h <= i) {
            continue
          }
          this.domList[i].childNodes[h].childNodes[1].style.opacity = (h - i) * xVlue
        }
      }
    },
    /* 执行搜索方法 */
    onSearch () {
      console.log('搜索')
    }
  },
  created () {
  }
}
</script>

<style scoped>
  @import "../../style/small/variables.pcss";
  .form-main {
    >>> .el-form-item {
      margin: 0;
    }
    &+ .form-main {
      margin-top: var(--default-margin-base);
    }
  }
  @component-namespace rfm {
    @b main {
      position:relative;
      padding: var(--default-padding-base) var(--default-padding-base) 20px;
      @e titleX {
        position: absolute;
        top: 0;
        left: 15px;
      }
      @e titleY {
        position: absolute;
        bottom: 0;
        right: 10px;
      }
      @e content {
        position: relative;
        padding: 20px 0 5px 10px;
        border-left: 1px solid var(--theme-base-border-color-primary);
        border-bottom: 1px solid var(--theme-base-border-color-primary);
        &:before, &:after {
          position: absolute;
          content: ' ';
          width: 0;
          height: 0;
          border: 4px solid var(--theme-base-border-color-primary);
          border-color: var(--theme-base-border-color-primary) var(--theme-base-border-color-primary) transparent transparent;
        }
        &:before {
          top: 0;
          left: -5px;
          transform:rotate(-45deg);
        }
        &:after {
          bottom: -5px;
          right: 0;
          transform:rotate(45deg);
        }
      }
    }
    @b list {
      padding: 0;
      margin: 0 0 0 -10px;
      >>> .rfm-list__content {
        position: relative;
        width: 100%;
        padding-left: var(--default-padding-base);
      }
      >>> li {
        position: relative;
        display: flex;
        width: 100%;
        height: 110px;
        margin-bottom: var(--default-margin-base);
        list-style: none;
        &:last-child {
          margin-bottom: 0;
        }
        .list-content {
          position: absolute;
          right: 0;
          left: 5px;
          padding: var(--default-padding-base) var(--default-padding-base) var(--default-padding-base);
          z-index: 1;
          h4 {
            margin: 0;
          }
          p {
            margin: 0;
            padding: var(--default-padding-base) 0 0;
          }
        }
        .list-bg {
          position: absolute;
          top: 0;
          left: 5px;
          bottom: 0;
          right: 0;
        }
      }
    }
  }

  @media (max-width: 1370px) {
    @component-namespace rfm {
      @b list {
        >>> li {
          height: 95px;
          .list-content {
            padding: var(--default-padding-base);
            p {
              padding: 3px 0 0;
            }
          }
        }
      }
    }
  }

</style>
