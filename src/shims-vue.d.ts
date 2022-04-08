declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module '*.json' {
  const value: any
  export default value
}

declare module '@nascent/nui';
declare module '@nascent/log';
declare module '@nascent/icons-vue';
declare module '@nascent/ecrp-ecrm';
declare module '@/apis';
declare module 'whats-element/pure';
