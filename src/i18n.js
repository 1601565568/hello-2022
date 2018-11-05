// i18n-setup.js
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import store from 'store/dist/store.legacy.min.js'
import messages from '@/lang'
import axios from 'axios'
import zh from '@/lang/zh'

Vue.use(VueI18n)

// language
const language = () => {
  let lang = window.navigator.browserLanguage || window.navigator.language
  lang = lang.slice(0, lang.indexOf('-'))
  if (!messages[lang]) {
    lang = 'en'
  }

  let navigator = store.get('navigator')
  if (navigator && navigator.userLanguage) {
    lang = navigator.userLanguage
  }
  return lang
}
export const i18n = new VueI18n({
  locale: 'zh', // set locale
  fallbackLocale: 'zh',
  messages: {
    zh
  } // set locale messages
})

const loadedLanguages = ['zh'] // our default language that is prelaoded

const setI18nLanguage = (lang) => {
  i18n.locale = lang
  axios.defaults.headers.common['Accept-Language'] = lang
  document.querySelector('html').setAttribute('lang', lang)
  return lang
}

export function setLanguage (lang) {
  store.set('navigator', {userLanguage: lang})
  if (i18n.locale !== lang) {
    if (!loadedLanguages.includes(lang)) {
      return import(/* webpackChunkName: "lang-[request]" */ `@/lang/${lang}`).then(msgs => {
        i18n.setLocaleMessage(lang, msgs.default)
        loadedLanguages.push(lang)
        return setI18nLanguage(lang)
      })
    }
    return Promise.resolve(setI18nLanguage(lang))
  }
  return Promise.resolve(lang)
}
// 当前配置语言不等于默认时
if (language() !== 'zh') {
  setLanguage(language())
}
