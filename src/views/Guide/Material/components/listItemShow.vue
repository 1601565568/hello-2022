<template>
  <!-- 素材对像列表显示 wanrengang 20180802 -->
  <div class="materialItem">

    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="560px"
      :before-close="handleClose">
      <div class="slide-show">
        <div class="slide-img">
          <img :src="itemObj.imageList[nowIndex]">
        </div>
        <ul class="slide-pages">
          <li v-for="(item, index) in itemObj.imageList" :key="index" @click="goto(index)">
            <img :class="{'active': index==nowIndex }" :src="item">
          </li>
        </ul>
        <div class="iconLeft" @click="nextImg(0)"></div>
        <div class="iconRight" @click="nextImg(1)"></div>
      </div>
    </el-dialog>
    <div class="picBox" v-if="itemObj.m_type==1">
      <div class="tit">{{itemObj.content}}</div>
      <ul class="imgList">
        <li v-for="(item,index) in itemObj.imageList.slice(0,3)" :key="index">
          <img @click="showImg(index, itemObj.m_type)" :src="item" alt="">
        </li>
        <li v-if="itemObj.imageList.length>3">
          …
        </li>
      </ul>
    </div>
    <div class="shareBox" v-if="itemObj.m_type==0">
      <img @click="showImg(0, itemObj.m_type)" v-show="itemObj.imageList[0]" :src="itemObj.imageList[0]" alt="">
      <div class="tit">{{itemObj.content}}</div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      itemObj: Object
    },
    data () {
      return {
        title: '查看图片',
        dialogVisible: false,
        nowIndex: 0
      }
    },
    created: function () {
      // console.log(this.itemObj)
    },
    methods: {
      // 显示弹窗
      showImg (index, type) {
        if (type === 0) {
          return
        }
        this.nowIndex = index
        this.dialogVisible = true
      },
      handleClose (done) {
        done()
      },
      nextImg (type) {
        if (type === 1) {
          this.nowIndex = this.nowIndex + 1
          if (this.nowIndex >= this.itemObj.imageList.length) {
            this.nowIndex = 0
          }
        } else {
          this.nowIndex = this.nowIndex - 1
          if (this.nowIndex < 0) {
            this.nowIndex = this.itemObj.imageList.length - 1
          }
        }
      },
      goto (index) {
        this.nowIndex = index
      }
    },
    computed: {}
  }
</script>
<style scoped>
@component-namespace materialItem {
  .slide-show {
    width: 540px;
    height: 340px;
    overflow: hidden;
    margin: 20px 0 10px;
    position: relative;
    .iconLeft{
      cursor: pointer;
      width: 60px;
      height: 60px;
      position: absolute;
      left: 0px;
      top:100px;
      background:url('http://ecrp.oss-cn-hangzhou.aliyuncs.com/admin/comImg/lefticon.png')
    }
    .iconRight{
      cursor: pointer;
      width: 60px;
      height: 60px;
      position: absolute;
      right: 0px;
      top:100px;
      background:url('http://ecrp.oss-cn-hangzhou.aliyuncs.com/admin/comImg/righticon.png') right center;
    }
    /* border: 1px solid #f2f2f2; */
  }
  .slide-img {
    width: 540px;
    height: 280px;
    overflow: hidden;
    text-align: center;
    vertical-align: middle;
    img {
      display: inline-block;
      max-height: 280px;
      max-width: 540px;
    }
  }

  .slide-pages {
    width: 540px;
    height: 50px;
    margin-top: 10px;
    padding: 0;
    li {
      width: 50px;
      margin: 0 4px;
      height: 50px;
      float: left;
      border-radius: 2px;
      overflow: hidden;
      cursor: pointer;
      line-height: 50px;
      color: #999;
      padding: 0;
      img {
        width: 50px;
        height: 50px;
        opacity: 0.3;
        &:hover {
          opacity: 1;
        }
        &.active {
          opacity: 1;
          border: 1px solid #ccc;
        }
      }
    }
  }
  .shareBox {
    img {
      width: 50px;
      height: 50px;float: left;
      margin-right: 5px;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
    }
    .tit{width: 220px;float: left;}
  }
  .picBox {
    width: 300px;
    .tit {
      width: 300px;
    }
    .imgList {
      list-style: none;
      padding: 5px 0;
      height: 60px;
      li {
        width: 50px;
        margin: 0 5px 0 0;
        height: 50px;
        float: left;
        border-radius: 2px;
        overflow: hidden;
        cursor: pointer;
        line-height: 50px;
        color: #999;
        border:1px solid #f2f2f2;
        img {
          width: 50px;
          height: 50px;
          &:hover {
            opacity: 0.8;
          }
        }
      }
    }
  }
}
</style>

