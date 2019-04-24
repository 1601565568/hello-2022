import formMixin from 'web-crm/src/mixins/form'

export default {
  mixins: [formMixin],
  data: function () {
    let rules = {
      'sales_price': [{ required: true, message: '请输入售价' }, {
        validator: (rule, value, callback) => {
          if (!/^([-+]?\d{1,14})(\.\d{1,2})?$/.test(value)) {
            callback(new Error('售价必须14位整数以内且最多2位小数'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }],
      'stock': [{ required: true, message: '请输入库存' }, {
        validator: (rule, value, callback) => {
          if (!/^([-+]?\d{1,14})(\.\d{1,2})?$/.test(value)) {
            callback(new Error('库存必须14位整数以内且最多2位小数'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }],
      // 分类名称
      'name': [{ required: true, message: '请输入分类名称', trigger: ['blur'] },
        {
          min: 1,
          max: 20,
          message: '限1-20个字',
          trigger: ['blur']
        }]
    }
    return {
      rules: rules,
      goodsInfo: null,
      shopId: null,
      shopName: null,
      dialogVisible: false,
      width: null,
      skuList: [],
      formData: {
        sales_price: null,
        stock: null,
        maxStock: 1,
        title: null,
        price: null,
        skuCount: 0
      },
      root: {
        id: null,
        label: '所有分类',
        code: 'root',
        parentId: 0,
        showAdd: true,
        disabled: true
      }
    }
  },
  methods: {
    /**
     * 打开新增弹框
     */
    showAddDialog: function () {
      let that = this
      that.shopId = that.$refs.table.$data.shopId
      that.shopName = that.$refs.table.$data.shopName
      if (!that.shopId) {
        that.$message.warning('请先选择门店')
        return
      }
      that.goodsInfo = []
      this.$refs.goods.onShow()
    },
    /**
     * 保存门店商品
     */
    addShopGoods: function () {
      let that = this
      if (!that.goodsInfo || that.goodsInfo.length <= 0) {
        return
      }
      let goodsArr = []
      for (let i = 0; i < that.goodsInfo.length; i++) {
        goodsArr.push(that.goodsInfo[i].sys_item_id)
      }
      this.$http.fetch(this.$api.guide.goods.saveShopGoods, { list: goodsArr, shop_id: that.shopId }).then(() => {
        that.$refs.table.$reload()
        that.$notify.success('新增成功')
      }).catch((resp) => {
        that.$notify.error(resp.msg)
      }).finally(() => {
        that.goodsInfo = []
      })
    },
    /**
     * 编辑商品
     * @param row
     */
    editGoods: function (row) {
      let that = this
      that.formData.sys_item_id = row.sys_item_id
      that.formData.title = row.title
      that.formData.maxStock = row.stock
      that.formData.price = row.price
      that.formData.sales_price = row.sales_price
      that.formData.stock = row.stock
      that.formData.skuCount = row.sku_count
      that.width = '450px'
      if (that.formData.skuCount > 0) {
        that.width = '800px'
        that.$http.fetch(that.$api.guide.goods.findSkuList, { shop_id: that.shopId, sys_item_id: row.sys_item_id }).then((resp) => {
          that.skuList = resp.result
        }).catch(() => {
          that.$notify.error('商品sku查询失败')
        })
      }
      this.dialogVisible = true
    },
    /**
     * 保存商品库存
     */
    onSave: function () {
      let that = this
      let symbol = true
      let params = {
        shop_id: that.$refs.table.$data.shopId,
        sys_item_id: that.formData.sys_item_id,
        sales_price: null,
        stock: null,
        skuList: null
      }
      if (that.formData.skuCount === '0') {
        that.$refs.form.validate((valid) => {
          if (!valid) {
            symbol = false
          } else {
            params.sales_price = that.formData.sales_price
            params.stock = that.formData.stock
          }
        })
      } else {
        params.skuList = that.skuList
      }
      if (symbol) {
        that.$http.fetch(that.$api.guide.goods.updateGoodsSku, params).then(() => {
          that.dialogVisible = false
          that.$notify.success('保存成功')
          that.$refs.table.$reload()
        }).catch((resp) => {
          that.$notify.error(resp.msg || '保存失败')
        })
      }
    }
  },
  mounted: function () {
  }
}
