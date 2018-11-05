import formMixin from 'mixins/form'
import ErrorCode from 'configs/errorCode'
import $ from 'jquery'

export default {
  mixins: [formMixin],
  data: function () {
    return {
      title: '新增角色',
      visible: false,
      stepsActive: 0,
      shopNum: 0, // 选择店铺数量
      dataTree: [], // 菜单树
      readWrite: [1], // 读写
      readWriteOptions: [{label: '可读', value: 1}, {label: '可写', value: 0}],
      powerRadio: 1, // 选择部门
      shopIndex: [], // 所有店铺
      copyShop: {}, // 为了进行重新设置店铺内容
      brand4shop: new Map(), // 品牌和店铺的关系
      copyRole: {}, // 拷贝角色设置
      menuId: [], // 设置选中的菜单
      area: [], // 地区
      isIndeterminate: false,
      saveLoading: false,
      isAllIndeterminate: false,
      copyBrand: [], // 拷贝已经选中的品牌
      selectBrandShop: new Map(), // 根据品牌判断店铺是否选中
      shop: {
        paginationShop: {
          size: 15,
          sizeOpts: [15, 25, 50, 100],
          page: 1,
          total: 0
        },
        selectShops: [], // 选择店铺
        indexSelect: false, // 本页全选
        allSelect: false, //  全部全选
        selectShop: {  // 搜索条件
          platform: [], // 平台
          areaRegion: [], // 地区
          channel: [], // 渠道
          shopName: '',
          brands: [] // 品牌
        },
        brandList: [], // 品牌列表
        isViewInfo: true
      },
      roleModel: {
        role: {
          roleName: '',
          remark: '',
          roleId: ''
        },
        roleRule: {
          roleName: [
            {required: true, message: '请输入角色名称', trigger: 'change'},
            {min: 1, max: 30, message: '请输入 1 到 30 个字符', trigger: 'change'},
            {
              validator: (rule, value, callback) => {
                if ($.trim(value).length > 0) {
                  var that = this
                  that.$http.fetch(that.$api.core.sysRole.findByRoleName,
                  {id: that.roleModel.role.roleId, roleName: that.roleModel.role.roleName}).then((resp) => {
                    if (resp.code === ErrorCode.TITLE_REPEAT) {
                      callback(new Error('此角色名称已存在,请重新输入'))
                    } else {
                      callback()
                    }
                  })
                } else {
                  callback(new Error('请输入正确的角色名称'))
                }
              },
              trigger: 'change'
            }
          ],
          remark: [{min: 1, max: 250, message: '请输入 1 到 250 个字符', trigger: 'change'}]
        }
      }
    }
  },
  watch: {
    powerRadio: function () {
      this.readWrite = [1]
    }
  },
  methods: {
    change () { // 值改变设置页码为1
      this.shop.paginationShop.page = 1
    },
    getRoles () {
      var that = this
      var table = {}
      var searchMap = {}
      searchMap.start = (that.shop.paginationShop.page - 1) * that.shop.paginationShop.size
      searchMap.length = that.shop.paginationShop.size
      table.searchMap = searchMap
      that.$http.fetch(that.$api.core.sysRole.findShopGrant, table)
      .then((resp) => {
        that.shop.brandList = resp.result.brands
        that.shopIndex = resp.result.shopIndex
        that.area = resp.result.area
        that.dataTree = resp.result.tree
        for (let shop of resp.result.brand4shop) {
          that.brand4shop.set(shop.tag, shop.shops)
        }
        that.shop.selectShop.brands = new Map()
        that.shop.paginationShop.total = parseInt(resp.result.count)
        if (that.shop.brandList.length > 0) {
          that.shop.selectShop.brands = []
          that.shop.selectShop.brands.push(that.shop.brandList[0].value)
        }
        if (that.shop.brandList != null) {
          for (var brand of that.shop.brandList) {
            var shops = {
              shops: []
            }
            that.selectBrandShop.set(brand.value, shops)
          }
        }
      })
    },
    handleCheckIndexChange (obj) { // 处理本页全选
      if (this.shop.selectShop.brands.length > 0) {
        this.shop.selectShops = []
        var shops = this.selectBrandShop.get(this.shop.selectShop.brands[0]).shops
        if (obj) {
          var selectShop = []
          for (let indexShop of this.shopIndex) {
            var isShop = false
            for (let shop of shops) {
              if (shop === indexShop.value) {
                isShop = true
              }
            }
            if (!isShop) {
              selectShop.push(indexShop.value)
            }
            this.shop.selectShops.push(indexShop.value)
          }
          shops = shops.concat(selectShop)
          let shopSet = new Set(shops)
          this.selectBrandShop.get(this.shop.selectShop.brands[0]).shops = Array.from(shopSet)
        } else {
          for (let i = 0; i < shops.length; i++) {
            for (let indexObj of this.shopIndex) {
              if (shops[i] === indexObj.value) {
                shops.splice(i, 1)
              }
            }
          }
          this.selectBrandShop.get(this.shop.selectShop.brands[0]).shops = shops
        }
        this.checkSelect()
      }
    },
    handleIndex (obj) { // 处理当前页面选择按钮
      if (this.shop.selectShop.brands.length > 0) {
        var shops = this.selectBrandShop.get(this.shop.selectShop.brands[0]).shops
        var noSelectShop = [] // 获取没有选中的
        for (let shop of this.shopIndex) {
          if (obj.length > 0) {
            var isSelectShop = false
            for (let indexObj of obj) {
              if (indexObj === shop.value) {
                isSelectShop = true
              }
            }
            if (!isSelectShop) {
              noSelectShop.push(shop.value)
            }
          } else {
            noSelectShop.push(shop.value)
          }
        }
        var insertShops = [] // 新选中的
        if (obj.length > 0) {
          for (let indexObj of obj) {
            let isSelect = false
            for (let shopIndex of shops) {
              if (shopIndex === indexObj) {
                isSelect = true
              }
            }
            if (!isSelect) {
              insertShops.push(indexObj)
            }
          }
        }
        var quitShops = []
        // 排除没选中的
        for (let i = 0; i < shops.length; i++) {
          let extShop = false
          for (let indexObj of noSelectShop) {
            if (shops[i] === indexObj) {
              extShop = true
            }
          }
          if (!extShop) {
            quitShops.push(shops[i])
          }
        }
        // 整合店铺选中
        var setShops = new Set(quitShops)
        for (let insertShop of insertShops) {
          setShops.add(insertShop)
        }
        this.selectBrandShop.get(this.shop.selectShop.brands[0]).shops = Array.from(setShops)
        this.checkSelect()
      }
    },
    handleAllChange (obj) { // 处理全选
      if (this.shop.selectShop.brands.length > 0) {
        this.shop.selectShops = []
        if (obj) {
          for (let shop of this.shopIndex) {
            this.shop.selectShops.push(shop.value)
          }
          this.selectBrandShop.get(this.shop.selectShop.brands[0]).shops = this.brand4shop.get(this.shop.selectShop.brands[0])
        } else {
          this.selectBrandShop.get(this.shop.selectShop.brands[0]).shops = []
        }
        this.checkSelect()
      }
    },
    checkSelect () {  // 是否选中
      if (this.shopIndex.length === this.shop.selectShops.length && this.shopIndex.length > 0) {
        this.isIndeterminate = false
        this.shop.indexSelect = true
      } else {
        if (this.shop.selectShops.length > 0) {
          this.isIndeterminate = true
        } else {
          this.isIndeterminate = false
          this.shop.indexSelect = false
        }
      }
      this.shopNum = this.selectBrandShop.get(this.shop.selectShop.brands[0]).shops.length
      if (this.shopNum === this.brand4shop.get(this.shop.selectShop.brands[0]).length && this.shopNum > 0) {
        this.isIndeterminate = false
        this.shop.indexSelect = true
        this.shop.allSelect = true
        this.isAllIndeterminate = false
      } else {
        if (this.shopNum > 0) {
          this.isAllIndeterminate = true
        } else {
          this.isAllIndeterminate = false
        }
        this.shop.allSelect = false
      }
    },
    handleBrand (obj) { // 选中品牌
      if (obj.length > 0) {
        var obj1 = obj[obj.length - 1]
        this.shop.selectShop.brands.splice(0, obj.length)
        this.shop.selectShop.brands.push(obj1)
      }
      this.shop.paginationShop.page = 1
      this.shop.paginationShop.currentPage = 1
      this.search()
    },
    onUpdateShow (obj) { // 显示修改内容
      this.copyShop = JSON.parse(JSON.stringify(this.$data.shop))
      this.copyRole = JSON.parse(JSON.stringify(this.copyRole))
      var that = this
      that.title = '编辑角色'
      that.$http.fetch(that.$api.core.sysRole.getRoleById, {'id': obj.id})
      .then((resp) => {
        that.shop.isViewInfo = obj.is_view_info === 0
        var role = {
          roleId: obj.id,
          roleName: obj.role_name,
          remark: obj.remark
        }
        that.roleModel.role = Object.assign({}, role)
        for (let menu of resp.result.menu) {
          that.menuId.push(menu.menu_id)
        }
        if (resp.result.shop !== null) {
          for (let tagShop of resp.result.shop) {
            var brandShop = that.selectBrandShop.get(tagShop.tag)
            brandShop.shops = tagShop.shops
          }
          that.shop.selectShops = that.selectBrandShop.get(that.shop.selectShop.brands[0]).shops
        }
        that.checkSelect()
        that.stepsActive = 0
      }).finally(() => {
        that.visible = true
        that.$nextTick(() => {
          that.$refs.roleManageTreeHeight.$el.children[0].style.height = '475px'
          that.$refs.roleManageHeight.$el.children[0].style.height = '400px'
          that.$refs.tree.setCheckedKeys(that.menuId)
          var powerPackage = JSON.parse(obj.power_package)
          that.powerRadio = powerPackage.type
          that.$nextTick(() => {
            that.readWrite = powerPackage.value === 2 ? [1, 0] : [1]
          })
        })
      })
    },
    handleSizeChange (val) {
      this.shop.paginationShop.size = val
      this.search()
    },
    handleCurrentChange (val) {
      this.shop.paginationShop.page = val
      this.search()
    },
    nextClick (val) {
      this.shop.paginationShop.page = val
      this.search()
    },
    search () { // 查询
      var that = this
      var table = {}
      var searchMap = {}
      if (this.shop.selectShop.brands.length > 0) {
        searchMap.tagId = this.shop.selectShop.brands[0]
      }
      searchMap.start = (that.shop.paginationShop.page - 1) * that.shop.paginationShop.size
      searchMap.length = that.shop.paginationShop.size
      table.searchMap = searchMap
      var platform = ''
      var channel = ''
      for (let form of that.shop.selectShop.platform) {
        platform += form + ','
      }
      for (let channelIndex of that.shop.selectShop.channel) {
        channel += channelIndex + ','
      }
      if (platform.length > 0) {
        searchMap.platform = platform.substr(0, platform.length - 1)
      }
      if (channel.length > 0) {
        channel = channel.substr(0, channel.length - 1)
        searchMap.channel = channel
      }
      table.searchMap = searchMap
      if (that.shop.selectShop.areaRegion.length === 0) {
        table.searchMap.area = ''
      } else {
        table.searchMap.area = that.shop.selectShop.areaRegion.value
      }
      table.searchMap.shopName = that.shop.selectShop.shopName
      that.$http.fetch(that.$api.core.sysRole.queryShopByRole, table)
      .then((resp) => {
        that.shopIndex = resp.result.shop
        that.shop.paginationShop.total = parseInt(resp.result.count)
        that.shop.selectShops = []
        var shops = that.selectBrandShop.get(this.shop.selectShop.brands[0]).shops
        for (let shopIndex of that.shopIndex) {
          for (let selectShop of shops) {
            if (shopIndex.value === selectShop) {
              that.shop.selectShops.push(shopIndex.value)
            }
          }
        }
        that.checkSelect()
      })
    },
    clearDialog () {
      this.menuId = []
      this.shopNum = 0
      this.shop = {}
      this.stepsActive = 0
      this.roleReadWrite = [1]
      this.$set(this.roleModel, 'role', this.$options.data().roleModel.role)
      this.$refs['role'].resetFields()
      this.$refs.tree.setCheckedKeys([])
      this.$set(this, 'shop', this.copyShop)
      this.isIndeterminate = false
      this.isAllIndeterminate = false
      this.powerRadio = 1
      this.readWrite = [1]
      this.getRoles()
      this.visible = false
    },
    /**
     * 新增角色
     */
    onAdd: function () {
      this.title = '新增角色'
      this.visible = true
      if (this.shop.brandList.length > 0) {
        this.shop.selectShop.brands = []
        this.shop.selectShop.brands.push(this.shop.brandList[0].value)
      }
      this.stepsActive = 0
    },
    /**
     * 关闭弹窗
     */
    onClose: function () {
      this.clearDialog()
    },
    /**
     * 保存数据
     */
    onSave: function () {
      var that = this
      that.saveLoading = true
      var tagShopList = []
      for (let [key, value] of this.selectBrandShop) {
        for (let shop of value.shops) {
          var tagShop = {
            tagId: key,
            shopId: shop
          }
          tagShopList.push(tagShop)
        }
      }
      var powerPackage = {type: this.powerRadio, value: this.readWrite.length}
      var model = {
        roleId: this.roleModel.role.roleId,
        roleName: this.roleModel.role.roleName,
        remark: this.roleModel.role.remark,
        menuId: this.menuId,
        isViewInfo: this.shop.isViewInfo ? 0 : 1,
        powerPackage: JSON.stringify(powerPackage),
        tagIdAndShopIds: tagShopList
      }
      that.$http.fetch(that.$api.core.sysRole.saveOrUpdate, model)
      .then((resp) => {
        that.$refs.table.$reload()
        that.$notify.success(resp.msg)
      }).catch((resp) => {
        this.$notify.error(resp.msg)
      }).finally(() => {
        that.saveLoading = false
      })
      this.stepsActive++
      this.clearDialog()
    },
    /**
     * 上一步
     */
    onUp: function () {
      this.stepsActive--
    },
    /**
     * 下一步
     */
    onDown: function () {
      switch (this.stepsActive) {
        case 0: {
          this.$refs.role.validate((valid) => {
            if (valid) {
              this.stepsActive++
            } else {
              return valid
            }
          })
          break
        }
        case 1: {
          this.menuId = this.$refs.tree.getCheckedKeys()
          let halfNode = this.$refs.tree.getHalfCheckedNodes()
          if (halfNode.length > 0) {
            let ids = halfNode.map(x => x.id)
            this.menuId = this.menuId.concat(ids)
          }
          if (this.menuId.length > 0) {
            this.stepsActive++
          } else {
            this.$notify.warning('请选择功能授权')
          }
          break
        }
        case 2: {
          var isSelect = false
          for (let value of this.selectBrandShop.values()) {
            if (value.shops.length > 0) {
              isSelect = true
              break
            }
          }
          if (isSelect) {
            this.stepsActive++
          } else {
            this.$notify.warning('请选择店铺授权')
          }
          break
        }
        case 3: {
          this.stepsActive++
          break
        }
        default:this.stepsActive++; break
      }
    },
    onCloseNode () {
      var that = this
      setTimeout(function () {
        that.$nextTick(() => {
          if (that.$refs.roleManageTreeHeight.$el.children[0].children[0].style.width === '99%') {
            that.$refs.roleManageTreeHeight.$el.children[0].children[0].style.width = '100%'
          } else {
            that.$refs.roleManageTreeHeight.$el.children[0].children[0].style.width = '99%'
          }
        })
      }, 450)
    }
  },
  created: function () {
    this.copyShop = Object.assign({}, this.$data.shop)
    this.copyRole = Object.assign({}, this.$data.roleModel)
  },
  mounted: function () {
    this.getRoles()
  }
}
