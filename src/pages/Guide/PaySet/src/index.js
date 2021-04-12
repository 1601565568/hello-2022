export default {
  data () {
    return {
      mapItem: [
        {
          key: 'mchid',
          name: '支付商户号',
          isRequire: true,
          value: ''
        },
        {
          key: 'key',
          name: '支付密钥',
          isRequire: true,
          value: ''
        },
        {
          key: 'expireApi',
          name: 'API证书',
          isRequire: true,
          value: ''
        },
        {
          key: 'expireTime',
          name: '证书有效期',
          value: ''
        },
        {
          key: 'linkApp',
          name: '关联公众号',
          isRequire: true,
          value: ''
        }
      ],
      btnLoad: false,
      visible: false,
      drawerData: {}
    }
  },
  methods: {
    update () {}
  }
}
