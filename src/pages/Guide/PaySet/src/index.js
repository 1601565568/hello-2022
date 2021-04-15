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
      visible: true,
      drawerData: {}
    }
  },
  methods: {
    update () {},
    jumpGuide (index) {
      const { href } = this.$router.resolve({ path: `/Guide/Others/PayGuide?step=step${index}` })
      window.open(href, '_blank')
    }
  }
}
