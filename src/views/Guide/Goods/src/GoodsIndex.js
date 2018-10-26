import formMixin from 'mixins/form'

export default {
  mixins: [formMixin],
  data: function () {
    let rules = {
      'title': [{required: true, message: '请输入商品名称'}, {
        validator: (rule, value, callback) => {
          if (value && value.length > 100) {
            callback(new Error('商品名称不得超过100位'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }],
      'goods_code': [{required: true, message: '请输入商品编号'}, {
        validator: (rule, value, callback) => {
          if (value && value.length > 32) {
            callback(new Error('商品编号不得超过32位'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }],
      'price': [{required: true, message: '请输入建议零售价'}, {
        validator: (rule, value, callback) => {
          if (!/^([-+]?\d{1,14})(\.\d{1,2})?$/.test(value)) {
            callback(new Error('建议零售价必须14位整数以内且最多2位小数'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }]
    }
    return {
      loading2: false,
      uploadLoading: false,
      row: null,
      rules: rules,
      goodsInfo: null,
      shopName: null,
      shopList: [],
      dialogVisible: false,
      goodsDialogTitle: '',
      skuList: [],
      typeList: [],
      formData: {
        sys_item_id: null,
        title: null,
        goods_code: null,
        description: null,
        goods_cids: null,
        category: {},
        picture_url: null,
        skuCount: 0,
        price: null,
        delete_price: null,
        cost_price: null,
        typeList: [{type: '', list: [{ value: '' }]}],
        skuList: []
      },
      root: {
        id: null,
        label: '所有分类',
        code: 'root',
        parentId: 0,
        showAdd: true,
        disabled: true
      },
      treeData2: [],
      active: 0,
      nextSaveValue: '下一步',
      myConfig: {
        // 你的UEditor资源存放的路径，相对于打包后的index.html
        UEDITOR_HOME_URL: '/static/UEditor/',
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 240,
        // 初始容器宽度
        initialFrameWidth: '100%',
        serverUrl: ''
      },
      editorInstance: {},
      detail: '',
      addFlag: true,
      restaurants: [
        {value: '颜色'},
        {value: '尺寸'},
        {value: '尺码'},
        {value: '规格'},
        {value: '款式'},
        {value: '种类'},
        {value: '净含量'},
        {value: '版本'},
        {value: '套餐'},
        {value: '系列'},
        {value: '使用'},
        {value: '包装'},
        {value: '口味'},
        {value: '产地'},
        {value: '有效期'}
      ]
    }
  },
  methods: {
    categoryClick (data, node) {
      this.formData.goods_cids = data.ext1
    },
    findNodeTextByCids (list, cids) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].ext1 === cids) return list[i].label
        if (list[i].children) {
          let result = this.findNodeTextByCids(list[i].children, cids)
          if (result) return result
        }
      }
      return null
    },
    /**
     * 新增、编辑商品
     * @param row
     */
    async showGoodsDialog (row) {
      let that = this
      // loading2用于防止同步调接口等待时，多次点击造成重复调用
      if (that.loading2) return
      that.loading2 = true
      that.formData.category = {}
      that.treeData2 = this.$refs.table.$data.treeData2
      if (row) {
        that.addFlag = false
        that.nextSaveValue = '保存'
        that.goodsDialogTitle = '编辑商品'
        await that.$http.fetch(that.$api.guide.goods.getInfo, {
          sys_item_id: row.sys_item_id
        }).then((resp) => {
          row = resp.result
        }).catch(() => {
          that.$notify.error('商品信息查询失败')
        })
        if (row.goods_cids) {
          let text = that.findNodeTextByCids(that.treeData2, row.goods_cids) || ''
          let value = row.goods_cids.substring(row.goods_cids.lastIndexOf(',') + 1, row.goods_cids.length)
          that.formData.category = { text: text, value: value }
        }
      } else {
        that.addFlag = true
        that.nextSaveValue = '下一步'
        that.goodsDialogTitle = '新增商品'
        row = {}
      }
      that.formData.sys_item_id = row.sys_item_id
      that.formData.title = row.title
      that.formData.goods_code = row.goods_code
      that.formData.description = row.description
      that.formData.picture_url = row.picture_url
      that.formData.price = row.price
      that.formData.delete_price = row.delete_price
      that.formData.cost_price = row.cost_price
      that.resetDataSku(that, row)
      that.detail = ''
      that.loading2 = false
      that.active = 0
      that.dialogVisible = true
    },
    async showDetailDialog (row) {
      let that = this
      if (that.loading2) return
      that.loading2 = true
      that.goodsDialogTitle = '商品详情'
      await that.$http.fetch(that.$api.guide.goods.getDetail, {
        sys_item_id: row.sys_item_id
      }).then((resp) => {
        that.formData.sys_item_id = row.sys_item_id
        that.detail = resp.result || ''
      }).catch(() => {
        that.detail = ''
        that.$notify.error('商品详情查询失败')
      })
      that.loading2 = false
      that.active = 1
      that.nextSaveValue = '保 存'
      that.addFlag = false
      that.dialogVisible = true
    },
    /**
     * 保存商品库存
     */
    onSave: function () {
      let that = this
      if (this.active === 0) {
        that.$refs.form.validate((valid) => {
          if (valid) {
            if (!that.setFormDataSku(that)) {
              that.$notify.warning('请填写正确的规格信息')
              return
            }
            that.$http.fetch(that.$api.guide.goods.saveGoods, that.formData).then((resp) => {
              if (that.addFlag) {
                that.formData.sys_item_id = resp.result
                that.active++
                that.nextSaveValue = '保 存'
              } else {
                that.dialogVisible = false
              }
              that.$notify.success('保存成功')
            }).catch((resp) => {
              that.$notify.error(resp.msg || '保存失败')
            })
          }
        })
      } else {
        that.$refs.form.validate((valid) => {
          if (valid) {
            that.$http.fetch(that.$api.guide.goods.saveDetail, {
              sys_item_id: that.formData.sys_item_id,
              detail: that.detail
            }).then(() => {
              that.$notify.success('保存成功')
              that.dialogVisible = false
              that.$refs.table.$reload()
            }).catch((resp) => {
              that.$notify.error(resp.msg || '保存失败')
            })
          }
        })
      }
    },
    setFormDataSku (that) {
      let typeList = []
      let skuList = []
      if (that.typeList.length > 0) {
        let length = 1
        for (let i = 0; i < that.typeList.length; i++) {
          if (!that.typeList[i].type) return false
          let list = []
          for (let j = 0; j < that.typeList[i].list.length; j++) {
            if (!that.typeList[i].list[j].value) return false
            list.push(that.typeList[i].list[j].value)
          }
          typeList.push({
            type: that.typeList[i].type,
            list: list
          })
          length *= that.typeList[i].list.length
        }
        if (length !== that.skuList.length) return false
        for (let i = 0; i < that.skuList.length; i++) {
          skuList.push({
            type: that.skuList[i].type.split(' '),
            price: that.skuList[i].price,
            cost_price: that.skuList[i].cost_price,
            picture_url: that.skuList[i].picture_url
          })
        }
      }
      that.formData.typeList = typeList
      that.formData.skuList = skuList
      return true
    },
    resetDataSku (that, data) {
      let typeList = []
      let skuList = []
      if (data && data.typeList && data.typeList.length > 0) {
        for (let i = 0; i < data.typeList.length; i++) {
          let list = []
          for (let j = 0; j < data.typeList[i].list.length; j++) {
            list.push({ value: data.typeList[i].list[j] })
          }
          typeList.push({
            type: data.typeList[i].type,
            list: list
          })
        }
        for (let i = 0; i < data.skuList.length; i++) {
          skuList.push({
            type: data.skuList[i].type.join(' '),
            price: data.skuList[i].price,
            cost_price: data.skuList[i].cost_price,
            picture_url: data.skuList[i].picture_url,
            sales_count: data.skuList[i].sales_count
          })
        }
      }
      that.typeList = typeList
      that.skuList = skuList
    },
    addGoodsType () {
      this.typeList.push({type: '', list: [{ value: '' }]})
    },
    deleteGoodsType (index) {
      let all = 1
      let left = 1
      let start = index > 0 ? 1 : 0
      for (let i = 0; i < this.typeList.length; i++) {
        all *= this.typeList[i].list.length
        if (i !== index) {
          left *= this.typeList[i].list.length
        }
        if (i < index) {
          start *= this.typeList[i].list.length
        }
      }
      this.skuList.splice(start, all - left)
      this.typeList.splice(index, 1)
      if (this.typeList.length) { this.resetSkuList() } else { this.skuList = [] }
    },
    addGoodsTypeValue (index) {
      this.typeList[index].list.push({ value: '' })
      this.resetSkuList()
    },
    resetSkuList () {
      let num = 0
      let skuList = this.skuList
      let typeList = this.typeList
      let length = typeList.length
      if (!length) {
        skuList = []
        return
      }
      let type1 = typeList[0].list
      for (let i = 0; i < type1.length; i++) {
        let type2 = (length > 1 && typeList[1].list) || [{ value: '' }]
        for (let j = 0; j < type2.length; j++) {
          let type3 = (length > 2 && typeList[2].list) || [{ value: '' }]
          for (let k = 0; k < type3.length; k++) {
            if (skuList.length < ++num) {
              skuList.push({type: '', price: null, cost_price: null, picture_url: null, sales_count: 0})
            }
            let sku = skuList[num - 1]
            sku.type = (type1[i].value + ' ' + type2[j].value + ' ' + type3[k].value).trim()
            if (this.formData.price && !sku.price) {
              sku.price = this.formData.price
            }
            if (this.formData.cost_price && !sku.cost_price) {
              sku.cost_price = this.formData.cost_price
            }
          }
        }
      }
    },
    resetSkuPrice () {
      for (let i = 0; i < this.skuList.length; i++) {
        if (this.formData.price && !this.skuList[i].price) {
          this.skuList[i].price = this.formData.price
        }
      }
    },
    resetSkuCostPrice () {
      for (let i = 0; i < this.skuList.length; i++) {
        if (this.formData.cost_price && !this.skuList[i].cost_price) {
          this.skuList[i].cost_price = this.formData.cost_price
        }
      }
    },
    typeNameChange (queryString, cb) {
      let restaurants = this.restaurants
      let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    beforeAvatarUpload (file) {
      if (this.uploadLoading) {
        this.$notify.warning('正在上传图片，请稍后')
        return false
      }
      if (file.size / 1024 > 200) {
        this.$notify.error('上传图片不得大于200KB')
        return false
      }
      this.uploadLoading = true
    },
    // 处理上传图片
    handleAvatarSuccess (res, file) {
      this.formData.picture_url = res.result.url
      this.uploadLoading = false
    },
    handleAvatarSuccess2 (res, file) {
      if (this.row) {
        this.row.picture_url = res.result.url
      }
      this.uploadLoading = false
    },
    editorReady: function (instance) {
      // 将实例 instance 存储到 data中
      this.editorInstance = instance
      instance.setContent(this.detail || '') // 初始化时，对富文本编辑器进行赋值
      instance.addListener('blur', () => {
        this.detail = this.editorInstance.getContent()
      })
    },
    rowClick (row, event, column) {
      this.row = row
    }
  },
  mounted: function () {
    this.$refs.table.$reload()
  }
}
