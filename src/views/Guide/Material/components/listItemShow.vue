<template>
  <!-- 素材对像列表显示 wanrengang 20180802 -->
  <div class="materialItem">

    <el-dialog :visible.sync="dialogVisible" :before-close="handleClose" customClass="custom-dialog">
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
      <div class="tit">{{itemObj.content.length>77?itemObj.content.substr(0,77)+'…':itemObj.content.substr(0,77)}}</div>
      <ul class="imgList">
        <li v-for="(item,index) in itemObj.imageList.slice(0,3)" :key="index">
          <img @click="showImg(index, itemObj.m_type)" :src="item" alt="">
        </li>
        <li v-if="itemObj.imageList.length>3">
          …
        </li>
      </ul>
    </div>
    <div v-if="itemObj.m_type==0">{{itemObj.content.length>77?itemObj.content.substr(0,70)+'…':itemObj.content.substr(0,70)}}</div>
    <a :href="itemObj.url" target="_blank" class="shareBox" v-if="itemObj.m_type==0">
      <!--<img @click="showImg(0, itemObj.m_type)" v-show="itemObj.imageList[0]" :src="itemObj.imageList[0]" alt="">-->
      <img :src="itemObj.imageList[0]" alt="">
      <div class="tit">{{itemObj.title.length>77?itemObj.title.substr(0,70)+'…':itemObj.title.substr(0,70)}}</div>
    </a>
  </div>
</template>
<script>
  export default {
    props: {
      itemObj: Object
    },
    data () {
      return {
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
    width: 100%;
    overflow: hidden;
    margin: 50px 0 40px;
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
    width: 100%;
    overflow: hidden;
    text-align: center;
    vertical-align: middle;
    margin-bottom: 50px;
    img {
      display: inline-block;
      max-height: 350px;
      max-width: 100%;
    }
  }

  .slide-pages {
    width: 80%;
    height: 50px;
    margin-top: 10px;
    padding: 0 0 0 10%;
    position: fixed;
    bottom: 28px;
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
    height: 60px;
    padding: 5px;
    margin: 5px 0;
    background-color: #e4eaec;
    border-radius: 1px;
    display: block;
    max-width: 500px;
    overflow: hidden;
    img {
      width: 50px;
      height: 50px;float: left;
      margin-right: 5px;
      cursor: pointer;
      /* &:hover {
        opacity: 0.8;
      } */
    }
    .tit{
      padding-top: 3px;
      display: -webkit-box;
      overflow: hidden;
      -webkit-line-clamp: 2;
      /*! autoprefixer: off */
      -webkit-box-orient: vertical;
      /* autoprefixer: on */
      color: #333;
      line-height: 1.9;
    }
  }
  .picBox {
    .tit {
      display: -webkit-box;
      overflow: hidden;
      -webkit-line-clamp: 2;
      /*! autoprefixer: off */
      -webkit-box-orient: vertical;
      /* autoprefixer: on */
      max-width: 500px;
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

<style>
.custom-dialog {
  width: 100% !important;
  background: none !important;
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
  border-radius: 0 !important;
}
.materialItem .v-modal {
  opacity: 0.96 !important;
}
.custom-dialog .el-dialog__header {
  height: 50px;
  width: 50px;
  position: fixed;
  right: 6px;
  top: 0;
}
.custom-dialog .el-dialog__headerbtn {
  font-size: 26px !important;
}
</style>