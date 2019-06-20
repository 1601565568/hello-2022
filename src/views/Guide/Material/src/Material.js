import tableMixin from 'web-crm/src/mixins/table'
import api from '@/config/http'
import { getErrorMsg } from '@/utils/toast'
export default {
  props: {
    url: Object
  },
  name: 'guide',
  mixins: [tableMixin],
  data: function () {
    let pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    const tableButtons = [
      {
      }
    ]
    let quickInput = [{
      'template': '',
      'inline': false,
      'name': 'name',
      'text': '任务名称',
      'placeholder': '请输入任务名称',
      'type': 'text',
      'value': ''
    }]
    let quickSearchNames = quickInput.map(x => x.name)
    let quickSearchModel = {}
    let searchModel = {
      sgMaterial: {
        title: null,
        type: null,
        source_id: null,
        content: null,
        url: null,
        m_type: null,
        imageUrl: null
      },
      sgMaterialSubdivision: {
        id: null,
        type: null,
        source_id: null,
        name: null
      }
    }
    let findVo = {
      'titleName': null,
      'contentName': null,
      'urlName': null,
      'type': null,
      'sub': null
    }
    let model = Object.assign({}, findVo, {}, searchModel)
    let rules = {
      'title': [
        { required: true, message: '请输入素材标题', trigger: 'blur' },
        { min: 0, max: 20, message: '长度在20个字符以内', trigger: 'blur,change' }
      ],
      'content': [
        { required: false, message: '请输入素材文案', trigger: 'blur' },
        { min: 0, max: 50, message: '长度在50个字符以内', trigger: 'blur,change' }
      ],
      'url': [
        { required: true, message: '请输入二维码链接', trigger: 'blur' },
        { min: 0, max: 50, message: '长度在50个字符以内', trigger: 'blur,change' }
      ]
    }
    let that = this
    quickInput.map(item => {
      Object.defineProperty(quickSearchModel, item.name, {
        get: function () {
          return model[item.name]
        },
        set: function (val) {
          model[item.name] = val
          if (item.type === 'radio') {
            that._data._table.quickSearchMap[item.name] = val
            that.$quickSearch$()
          }
        },
        enumerable: true
      })
    })

    return {
      title: '',
      imageRoot: api.API_ROOT + '/core/file/showImage?fileKey=',
      transferWay: '1',
      brandId: null,
      dialogFormVisible_image: false, // 添加图文弹窗
      dialogFormVisible_link: false, // 添加链接弹窗
      dialogFormVisible_update: false, // 设置分组弹窗
      dialogFormVisible_edit: false, // 编辑素材弹窗
      resignFormVisible: false,
      specifyTransferFormVisible: false,
      row: null,
      rules: rules,
      queryTable: [],
      queryTableList: [],
      querySubToOptions: [],
      querySubTableList: [],
      model: model,
      quickSearchModel: quickSearchModel,
      state: {},
      _pagination: pagination,
      _table: {
        table_buttons: tableButtons,
        quickSearchNames: quickSearchNames,
        quickSearchMap: {}
      },
      _queryConfig: { expand: false }
    }
  },

  mounted: function () {
    var vm = this
    vm.initShopList(1)
    if (typeof this.$init === 'function') {
      this.$init(this, this.$generateParams$)
    } else {
      this.$reload()
    }
    if (this.$refs.table_filter_form.$el) {
      this.$refs.table_filter_form.$el.onkeyup = function (event) {
        if (event.keyCode === 13) {
          vm.$searchAction$()
        }
      }
    }
    if (this.$refs.quickText && this.$refs.quickText.$el) {
      this.$refs.quickText.$el.onkeyup = function (event) {
        if (event.keyCode === 13) {
          vm.$quickSearchAction$(event)
        }
      }

      this.$refs.quickText.$el.onkeydown = function (event) {
        if (event.keyCode === 13) {
          return false
        }
      }
    }
  },
  computed: {
  },
  methods: {
    initShopList () {
      var _this = this
      _this.$http.fetch(_this.$api.guide.materialSubdivision.querySubTableList, {
        length: 100
      }).then(resp => {
        if (resp.success && resp.result.data != null) {
          _this.queryTable = resp.result.data
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    // 新增图文
    onAddImage () {
      this.title = '添加图文素材'
      this.model.sgMaterial = {
        title: null,
        sourceId: null,
        content: null,
        url: null,
        imgList: null
      }
      this.model.sgMaterialSubdivision = {
        sub: null
      }
      this.dialogFormVisible_image = true
    },
    // 新增链接
    onAddLink () {
      this.title = '添加链接素材'
      this.model.sgMaterial = {
        title: null,
        sourceId: 0,
        content: null,
        url: null,
        imgList: null
      }
      this.model.sgMaterialSubdivision = {
        sub: null
      }
      this.dialogFormVisible_link = true
    },
    // 设置分组
    selsChange: function (sels) {
      this.sels = sels
    },
    onUpdateGroup: function () {
      this.title = '设置分组'
      if (this.sels == null || this.sels.length < 1) {
        this.$notify.error('请选择素材')
      } else {
        var ids = this.sels.map(item => item.id).join()
        var titles = this.sels.map(item => item.title).join()
        this.model.ids = ids
        this.model.titles = titles
        this.dialogFormVisible_update = true
      }
    },
    // 编辑素材
    edit (row) {
      let that = this
      that.title = '编辑素材'
      that.model.id = row.id
      that.model.title = row.title
      that.model.content = row.content
      that.model.url = row.url
      that.model.subName = row.subName
      that.model.imageUrl = this.imageRoot + row.imageUrl
      that.model.mType = row.m_type
      that.dialogFormVisible_edit = true
    },
    // 保存图文
    onSaveImage () {
      var that = this
      var strRegex = '^((https|http|ftp|rtsp|mms)?://)' +
        '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' +
        '(([0-9]{1,3}.){3}[0-9]{1,3}' +
        '|' +
        '([0-9a-z_!~*\'()-]+.)*' +
        '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' +
        '[a-z]{2,6})' +
        '(:[0-9]{1,4})?' +
        '((/?)|' +
        '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$'
      var re = new RegExp(strRegex)
      let title = that.model.sgMaterial.title
      let content = that.model.sgMaterial.content
      let url = that.model.sgMaterial.url
      let mType = 1
      let imgList = that.model.sgMaterial.imgList
      let sub = that.model.sgMaterialSubdivision.sub
      that.$refs.form.validate((valid) => {
        if (valid) {
          if (imgList.split('fileKey=')[1].length <= 4) {
            that.$notify.info('请添加图片')
          } else {
            if (re.test(url)) {
              this.$http.fetch(this.$api.guide.material.saveMaterial, {
                title: title,
                content: content,
                url: url,
                mType: mType,
                imgList: imgList,
                sub: sub
              }).then(resp => {
                that.$notify.success('添加成功')
                that.$reload()
                that.dialogFormVisible_image = false
              }).catch((resp) => {
                that.$notify.error('添加失败' + resp.msg)
              })
            } else {
              that.$notify.error('URL格式错误')
            }
          }
        }
      })
    },
    // 保存链接
    onSaveLink () {
      var that = this
      var strRegex = '^((https|http|ftp|rtsp|mms)?://)' +
        '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' +
        '(([0-9]{1,3}.){3}[0-9]{1,3}' +
        '|' +
        '([0-9a-z_!~*\'()-]+.)*' +
        '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' +
        '[a-z]{2,6})' +
        '(:[0-9]{1,4})?' +
        '((/?)|' +
        '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$'
      var re = new RegExp(strRegex)
      let title = that.model.sgMaterial.title
      let content = that.model.sgMaterial.content
      let url = that.model.sgMaterial.url
      let mType = 0
      let imgList = that.model.sgMaterial.imgList
      let sub = that.model.sgMaterialSubdivision.sub
      that.$refs.form.validate((valid) => {
        if (valid) {
          if (re.test(url)) {
            this.$http.fetch(this.$api.guide.material.saveMaterial, {
              title: title,
              content: content,
              url: url,
              mType: mType,
              imgList: imgList,
              sub: sub
            }).then(resp => {
              that.$notify.success('添加成功' + resp.msg)
              that.$reload()
              that.dialogFormVisible_link = false
            }).catch((resp) => {
              that.$notify.error('添加失败' + resp.msg)
            })
          } else {
            that.$notify.error('URL格式不正确')
          }
        }
      })
    },
    //  保存分组
    onUpdate () {
      var that = this
      let ids = that.model.ids
      let sub = that.model.sgMaterialSubdivision.sub
      this.$http.fetch(this.$api.guide.material.batchEditSub, {
        ids: ids,
        subId: sub
      }).then(resp => {
        that.$notify.success('设置成功' + resp.msg)
        that.$reload()
        that.dialogFormVisible_update = false
      }).catch((resp) => {
        that.$notify.error('设置失败' + resp.msg)
      })
    },
    // 保存修改
    onSaveEdit () {
      var that = this
      var strRegex = '^((https|http|ftp|rtsp|mms)?://)' +
        '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' +
        '(([0-9]{1,3}.){3}[0-9]{1,3}' +
        '|' +
        '([0-9a-z_!~*\'()-]+.)*' +
        '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' +
        '[a-z]{2,6})' +
        '(:[0-9]{1,4})?' +
        '((/?)|' +
        '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$'
      var re = new RegExp(strRegex)
      let id = that.model.id
      let title = that.model.title
      let content = that.model.content
      let url = that.model.url
      let sub = that.model.sgMaterialSubdivision.sub
      let imgList = that.model.sgMaterial.imgList
      let mType = that.model.mType
      that.$refs.form.validate((valid) => {
        if (valid) {
          if (imgList.split('fileKey=')[1].length <= 4) {
            that.$notify.info('请添加图片')
          } else {
            if (re.test(url)) {
              this.$http.fetch(this.$api.guide.material.saveMaterial, {
                id: id,
                title: title,
                content: content,
                url: url,
                mType: mType,
                imgList: imgList,
                sub: sub
              }).then(resp => {
                that.$notify.success('修改成功' + resp.msg)
                that.$reload()
                that.dialogFormVisible_edit = false
              }).catch((resp) => {
                that.$notify.error('修改失败' + resp.msg)
              })
            } else {
              that.$notify.error('URL格式错误')
            }
          }
        } else {
          that.$refs.form.validate((valid) => {
            if (valid) {
              if (imgList.split('fileKey=')[1].length <= 4) {
                that.$notify.info('请添加图片')
              } else {
                if (re.test(url)) {
                  this.$http.fetch(this.$api.guide.material.saveMaterial, {
                    id: id,
                    title: title,
                    content: content,
                    url: url,
                    mType: mType,
                    imgList: imgList,
                    sub: sub
                  }).then(resp => {
                    that.$notify.success('修改成功' + resp.msg)
                    that.$reload()
                    that.dialogFormVisible_edit = false
                  }).catch((resp) => {
                    that.$notify.error('修改失败' + resp.msg)
                  })
                } else {
                  that.$notify.info('URL格式错误')
                }
              }
            }
          })
        }
      })
    },
    //  表单重置
    resetFun () {
      this.model.sgMaterial = {
        titleName: null,
        contentName: null,
        urlName: null,
        type: null,
        sub: null,
        page: 1,
        pageSize: 10
      }
      this.model.sgMaterialSubdivision = {
        sub: null
      }
      this.$searchAction$()
    },
    // 删除素材
    deleteMaterialById: function (id, title) {
      var that = this
      var mId = id
      // 删除任务
      that.$confirm('是否确认删除素材【' + title + '】？', '删除素材提示', {
        confirmButtonText: '确定',
        type: 'warning',
        cancelButtonText: '取消'
      }).then(() => {
        that.$http.fetch(that.$api.guide.material.deleteMaterialById, { mId: mId })
          .then(resp => {
            that.$notify.success('删除成功' + resp.msg)
            that.$reload()
          }).catch((resp) => {
            that.$notify.error('删除失败' + resp.msg)
          })
      })
    },
    //  解析后台传进来的字符串
    strToJson (str) {
      if (str && str.length > 0) {
        return JSON.parse(str)
      } else {
        return null
      }
    },
    // 处理上传图片
    'handleAvatarSuccess': function (res, file) {
      var _this = this
      _this.model.sgMaterial.imgList = res.result
    },
    closeDialog () {
      this.$refs.form.resetFields()
      Object.assign(this.$data.model, this.$options.data().model)
    },
    beforeAvatarUpload (file) {
      if (file.size / 1024 > 200) {
        this.$notify.warning('上传图片不得大于200KB')
        return false
      }
    },
    uploadFile: function (file) {
      var _this = this
      let param = new FormData()
      param.append('file', file.file)
      _this.$http.fetch(this.$api.guide.material.uploadImage, param)
        .then((resp) => {
          _this.model.sgMaterial.imgList = _this.imageRoot + resp.result.fileKey
        }).catch((resp) => {
          this.$notify.error('上传图片失败' + resp.result)
        })
    }
  }
}
