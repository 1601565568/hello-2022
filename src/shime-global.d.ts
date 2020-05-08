import Vue, { VNode } from 'vue'
import axios from 'axios/index.d'

declare global {
  // eslint-disable-next-line camelcase
  interface Window {
    logger: any;
    // @ts-ignore
    axios: axios;
    // eslint-disable-next-line camelcase
    g_infos: any;
    // eslint-disable-next-line camelcase
    g_config: any;
  }
}
