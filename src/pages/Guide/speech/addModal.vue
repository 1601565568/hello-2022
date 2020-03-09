<template>
  <div>
      <el-table
        ref="multipleTable"
        :data="dataList"
        v-loading="tableLoading"
        :element-loading-text="$t('prompt.loading')"
        tooltip-effect="dark"
        stripe
        style="width: 100%">
        <el-table-column label="序号" width="100">
          <template slot-scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>

        <el-table-column  width="200"  align="center" prop="content">
          <template slot="header">
            欢迎语
            <el-tooltip content="配置后，客户将在添加员工为微信好友时，发送欢迎语">
              <Icon type="question-circle"/>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column  width="200"  align="center">
          <template slot="header">
            内容类型
          </template>
          <template slot-scope="scope">
            <p v-if="scope.row.type == 0">
              图片
            </p>
            <p v-if="scope.row.type == 1">
              链接
            </p>
            <p v-if="scope.row.type == 2">
              小程序
            </p>
            <p v-if="scope.row.type == 3">
              文字
            </p>
          </template>
        </el-table-column>

        <el-table-column  width="200"  align="center">
          <template slot="header">
            发送顺序
            <el-tooltip content="调整发送顺序">
              <Icon type="question-circle"/>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <i class='sort' :class="scope.$index?'topShow':'topHid'" v-if="0 != scope.$index" @click='exchangeSort(1,scope.row.id)'><Icon type="zhiding"/></i>
            <i class='sort' :class="scope.$index?'topShow':'topHid'" v-if="0 != scope.$index" @click='exchangeSort(2,scope.row.id)'><Icon type="top-arr"/></i>
            <i class='sort' :class="scope.$index!==dataList.length-1?'topShow':'topHid'" v-if="scope.$index != dataList.length-1" @click='exchangeSort(3,scope.row.id)'><Icon type="down-arr"/></i>
            <i class='sort' :class="scope.$index!==dataList.length-1?'topShow':'topHid'" v-if="scope.$index != dataList.length-1" @click='exchangeSort(4,scope.row.id)'><Icon type="zhidi"/></i>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          width="100"
          align="center">
          <template slot-scope="scope">
            <ns-button @click="AddShowToggle(scope.row)" type="text">编辑</ns-button>
            <a href="javascript:" @click="delsTipFun(scope.row.id)">删除</a>
          </template>
        </el-table-column>
      </el-table>
    <el-form>
      <el-form-item>
        <el-popover
          placement="top"
          width="360"
          v-model="addVisible">
          <el-row>
            <ns-button type="primary" icon="el-icon-edit" circle @click="addText">文字</ns-button>
            <ns-button type="success" icon="el-icon-picture" circle @click="addPic">图片</ns-button>
            <ns-button type="info" icon="el-icon-video-camera" circle @click="addVideo">视频</ns-button>
            <ns-button type="warning" icon="el-icon-paperclip" circle @click="addLink">链接</ns-button>
            <ns-button type="danger" icon="el-icon-monitor" circle @click="addProgram">小程序</ns-button>
          </el-row>
          <ns-button type='text' slot="reference">+添加欢迎语内容</ns-button>
        </el-popover>
        <span style="margin-left: 20px; color: #8c939d">欢迎语最多添加10条</span>
      </el-form-item>
      <el-form-item label="使用范围：">
        <span>已选{{count}}名员工</span><ns-button type='text' @click="choosePersonnel()">+选择员工</ns-button><span style="margin-left: 10px; color: #8c939d">设置使用该欢迎语的员工</span>
      </el-form-item>
    </el-form>
    <!--弹框 begin-->
    <el-dialog
      :title="innerTitleText"
      :close-on-click-modal=false
      :visible.sync="addDialong"
      width="380px"
      :before-close="handleClose">
      <el-form ref="searchform" :model="form"  :inline="true">
        <!--0图片，1链接，2小程序,3文字,4视频-->
        <span v-if="0 == addEditType">

          </span>
        <span v-if="1 == addEditType">
            <el-form-item label="页面地址：" label-width="80px">
              <el-input v-model="form.link" placeholder="请输入正确链接" style="width: 90%"></el-input>
            </el-form-item>
            <el-form-item label="标题：" label-width="80px">
              <el-input v-model="form.title" placeholder="请输入标题" style="width: 90%"></el-input>
            </el-form-item>
            <el-form-item label="文案：" label-width="80px">
              <el-input v-model="form.offical" placeholder="请输入文案" style="width: 90%"></el-input>
            </el-form-item>
            <el-form-item label="素材图片：" prop="imageList" label-width="80px">
              <div class="comUploadBox">
                <ul class="comUploadList">
                  <li class="imgItem" v-if="form.img">
                    <img :src="form.img" class="comUploadImg">
                    <div class="del">
                      <Icon type="delete" />
                    </div>
                  </li>
                  <li v-if="!form.img">
                    <el-upload class="avatar-uploader" :action="this.$api.core.sgUploadFile('test')" accept=".jpg,.jpeg,.png,.bmp,.gif" :show-file-list="false" list-type="picture-card" multiple  :on-remove="handleRemove" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                      <Icon type="plus"/>
                    </el-upload>
                  </li>
                </ul>
              </div>
            </el-form-item>
          </span>
        <span v-if="2 == addEditType">
            <el-form-item label="appid：" label-width="80px">
              <el-input v-model="form.appid" placeholder="请输入小程序appid" style="width: 90%"></el-input>
            </el-form-item>
            <el-form-item label="小程序路径：" label-width="80px">
              <el-input v-model="form.minUrl" placeholder="请输入小程序路径" style="width: 90%"></el-input>
            </el-form-item>
            <el-form-item label="备用网页：" label-width="80px">
              <el-input v-model="form.backUrl" placeholder="请输入备用网页" style="width: 90%"></el-input>
            </el-form-item>
            <el-form-item label="素材图片：" prop="imageList" label-width="80px">
              <div class="comUploadBox">
                <ul class="comUploadList">
                  <li class="imgItem" v-if="form.img">
                    <img :src="form.img" class="comUploadImg">
                    <div class="del">
                      <Icon type="delete" />
                    </div>
                  </li>
                  <li v-if="!form.img">
                    <el-upload class="avatar-uploader" :action="this.$api.core.sgUploadFile('test')" accept=".jpg,.jpeg,.png,.bmp,.gif" :show-file-list="false" list-type="picture-card" multiple  :on-remove="handleRemove" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                      <Icon type="plus"/>
                    </el-upload>
                  </li>
                </ul>
              </div>
            </el-form-item>
          </span>
          <span v-if="3 == addEditType">
              <el-input type="textarea" v-model="form.content" placeholder="请输入欢迎语内容"  :rows="8" style="width: 100%"></el-input>
              <div class="expressionBar_div">
                <i @click="faceFace"><Icon type="biaoqing"/></i>
              </div>
          </span>
          <span v-if="4 == addEditType">

          </span>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <ns-button @click="handleClose">取 消</ns-button>
          <ns-button type="primary" :loading="loading" @click="saveFun">确 定</ns-button>
        </span>
    </el-dialog>
    <!--弹框 end-->
    <!--选择好友弹窗开始-->
    <ElDialog
      width="600px"
      title="选择员工"
      :visible.sync="dialogVisible"
      :show-scroll-x=false>
      <ElRow :gutter="10" class="code-container">
        <ElCol :span="12" class="code-container__item">
          <div class="code-title">可选员工</div>
          <ElInput
            placeholder="请输入员工姓名"
            suffix-icon="el-icon-search"
            v-model="input" class="code-space">
          </ElInput>
          <div class="text-primary code-space">全部</div>
          <ElScrollbar>
            <ElTree
              ref="tree"
              :data="leftTreeData"
              show-checkbox
              node-key="id"
              :default-expanded-keys="[1, 2]"
              :default-checked-keys="choosePerson"
              :props="leftDefaultProps"
              @check-change="handleCheckChange" class="code-space">
            <span class="code-detail clearfix" slot-scope="{ node, data }">
              <span class="code-detail__text">{{ node.label }}</span>
              <span>{{ data.children ? '/' + data.children.length : '' }}</span>
            </span>
            </ElTree>
          </ElScrollbar>
        </ElCol>
      </ElRow>
      <template slot="footer">
        <ns-button @click="dialogVisible = false">取消</ns-button>
        <ns-save />
      </template>
    </ElDialog>
    <!--选择好友弹窗结束-->
  </div>
</template>
<script>
import { getErrorMsg } from '@/utils/toast'
import apiRequestConfirm from '@nascent/ecrp-ecrm/src/utils/apiRequestConfirm'
import Emotion from './EmotionConfig.js' // 表情配置文件
export default {
  data () {
    return {
      dialogVisible: false,
      choosePerson: null,
      // 左边输入框绑定值
      input: '',
      // 左边树数据
      leftTreeData: null,
      // 左边树默认绑定数据
      leftDefaultProps: {
        children: 'children',
        label: 'label'
      },

      count: 0,
      loading: false, // 防重复提交
      innerTitleText: '新增欢迎语',
      tableLoading: false,
      editId: null,
      dataList: [],
      addVisible: false,
      addDialong: false,
      addEditType: 3,
      emotionList: Emotion,
      form: {
        id: null,
        content: null, // 文本类型 欢迎页文本内容
        link: null, // 链接类型
        title: null, // 链接类型  标题
        offical: null, // 链接类型  文案
        img: null, // 链接类型  图片
        appid: null, // 小程序类型
        minUrl: null, // 小程序类型 路径
        backUrl: null, // 小程序类型 备用网页
        picUrl: null, // 图片类型 路径
        videoUrl: null // 视频类型 路径
      }
    }
  },
  created: function () {},
  mounted: function () {
    let paramId = this.$route.params.id
    // eslint-disable-next-line eqeqeq
    if (paramId === 'undefined') {
      this.editId = undefined
    } else {
      this.editId = paramId
    }
    this.loadListFun(this.editId)
  },
  methods: {
    // 加载列表
    async loadListFun (id) {
      if (!id) {
        return
      }
      this.tableLoading = true
      let params = { id: id }
      await this.$http
        .fetch({
          url: '/Guide/speech/getSubSpeech',
          method: 'post'
        }, params)
        .then(resp => {
          this.dataList = resp.result.list
          this.count = resp.result.count
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
      this.tableLoading = false
    },
    // 调整发送顺序
    async exchangeSort (type, id) {
      this.tableLoading = true
      let params = { id: id, type: type, parentId: this.editId }
      await this.$http
        .fetch({
          url: '/Guide/speech/adjustmentOrder',
          method: 'post'
        }, params)
        .then(resp => {
          this.loadListFun(this.editId)
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
      this.tableLoading = false
    },
    // 选择表情
    faceFace () {
      this.InternetMemeShow = !this.InternetMemeShow
    },
    AddShowToggle (row) {
      this.form.id = row.id
      this.form.content = row.content // 文本类型 欢迎页文本内容
      this.form.link = row.link // 链接类型
      this.form.title = row.title// 链接类型  标题
      this.form.offical = row.offical // 链接类型  文案
      this.form.img = row.img // 链接类型  图片
      this.form.appid = row.appid // 小程序类型
      this.form.minUrl = row.minUrl // 小程序类型 路径
      this.form.backUrl = row.backUrl // 小程序类型 备用网页
      this.form.picUrl = row.picUrl // 图片类型 路径
      this.form.videoUrl = row.videoUrl // 视频类型 路径
      if (row.type === 0) {
        this.addPic()
      } else if (row.type === 1) {
        this.addLink()
      } else if (row.type === 2) {
        this.addProgram()
      } else if (row.type === 3) {
        this.addText()
      } else if (row.type === 4) {
        this.addVideo()
      }
    },
    delsTipFun (val) {
      apiRequestConfirm('永久删除该欢迎语')
        .then(() => {
          this.delsFun(val)
        })
        .catch(() => {
          // 点击取消事件
        })
    },
    async delsFun (val) {
      let obj = {
        id: val
      }
      await this.$http
        .fetch({
          url: '/Guide/speech/deleteSub',
          method: 'post'
        }, obj)
        .then(resp => {
          this.$notify({
            type: 'success',
            message: '删除成功!'
          })
          this.loadListFun(this.editId)
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('删除失败', resp))
        })
    },
    // 0图片，1链接，2小程序,3文字,4视频
    // 添加文字
    addText () {
      this.addVisible = false
      if (this.dataList.length >= 10) {
        this.$notify.error('欢迎语最多添加10条')
      } else {
        this.addDialong = true
        this.addEditType = 3
        this.innerTitleText = '文字'
      }
    },
    // 添加图片
    addPic () {
      this.addVisible = false
      if (this.dataList.length >= 10) {
        this.$notify.error('欢迎语最多添加10条')
      } else {
        this.addDialong = true
        this.addEditType = 0
        this.innerTitleText = '图片'
      }
    },
    // 添加视频
    addVideo () {
      this.addVisible = false
      if (this.dataList.length >= 10) {
        this.$notify.error('欢迎语最多添加10条')
      } else {
        this.addDialong = true
        this.addEditType = 4
        this.innerTitleText = '视频'
      }
    },
    // 添加链接
    addLink () {
      this.addVisible = false
      if (this.dataList.length >= 10) {
        this.$notify.error('欢迎语最多添加10条')
      } else {
        this.addDialong = true
        this.addEditType = 1
        this.innerTitleText = '链接'
      }
    },
    // 添加小程序
    addProgram () {
      this.addVisible = false
      if (this.dataList.length >= 10) {
        this.$notify.error('欢迎语最多添加10条')
      } else {
        this.addDialong = true
        this.addEditType = 2
        this.innerTitleText = '小程序'
      }
    },
    // 提交保存
    // <!--0图片，1链接，2小程序,3文字,4视频-->
    saveFun () {
      let params = {}
      params.parentId = this.editId
      params.type = this.addEditType
      params.id = this.form.id
      if (this.addEditType === 0) {
        // 图片
        if (!this.form.content) {
          this.$notify.warning('请先上传图片')
          return
        }
        params.content = this.form.content
      } else if (this.addEditType === 1) {
        // 链接
        if (!this.form.link || !this.form.title || !this.form.offical || !this.form.img) {
          this.$notify.warning('请先完善链接信息')
          return
        }
        params.link = this.form.link
        params.title = this.form.title
        params.offical = this.form.offical
        params.img = this.form.img
      } else if (this.addEditType === 2) {
        // 小程序
        if (!this.form.appid || !this.form.minUrl || !this.form.backUrl) {
          this.$notify.warning('请先完善小程序信息')
          return
        }
        params.appid = this.form.appid
        params.minUrl = this.form.minUrl
        params.backUrl = this.form.backUrl
      } else if (this.addEditType === 3) {
        // 文字
        if (!this.form.content) {
          this.$notify.warning('请输入欢迎语内容')
          return
        }
        params.content = this.form.content
      } else if (this.addEditType === 4) {
        // 视频
        if (!this.form.content) {
          this.$notify.warning('请先上传视频')
          return
        }
        params.content = this.form.content
      }
      this.loading = true
      this.$http
        .fetch({
          url: '/Guide/speech/addSpeech',
          method: 'post'
        }, params)
        .then(resp => {
          this.loading = false
          for (let attr in this.form) {
            this.form[attr] = null
          }
          if (!resp.result.parentId && !this.editType) {
            this.editId = resp.result.parentId
          }
          this.loadListFun(this.editId)
          this.addDialong = false
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('保存失败', resp))
        })
    },
    // 删除链接图
    handleRemove (file, fileList) {

    },
    // 处理链接上传图片
    handleAvatarSuccess: function (res, file) {
      this.form.img = res.result.url
    },
    // 处理链接上传钱
    beforeAvatarUpload (file) {
      if (file.size / 1024 > 500) {
        this.$notify.warning('上传图片不得大于500KB')
        return false
      }
      // 图片格式判断
      if (!/\.(gif|jpg|jpeg|png|bmp|BMP|GIF|JPG|PNG|JPEG)$/.test(file.name)) {
        this.$notify.error('仅支持jpg/jepg/png/bmp/gif的图片格式')
        return false
      }
    },
    handleClose () {
      this.loading = false
      for (let attr in this.form) {
        this.form[attr] = null
      }
      this.addDialong = false
      this.loadListFun(this.editId)
    },
    choosePersonnel () { // 选择员工
      let _this = this
      _this.dialogVisible = true
      _this.$http.fetch(_this.$api.guide.personalQrcode.getDepartment).then(resp => {
        if (resp.success && resp.result != null) {
          _this.leftTreeData = JSON.parse(resp.result)
          _this.choosePerson = [5, 6, 7, 8]
        } else {
          _this.$notify.error(getErrorMsg('获取员工数据失败', resp))
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('获取员工数据失败', resp))
      })
    },
    handleCheckChange () {
      let _this = this
      let res = this.$refs.tree.getCheckedNodes()
      let arr = []
      res.forEach((item) => {
        if (item.id) {
          arr.push(item.id)
        }
      })
      _this.choosePerson = arr
    }
  }
}
</script>
