// import App from './App.vue'
import { createApp } from 'vue';
// import App from './App.vue';
import ProviderWrapper from "./ProviderWrapper.vue";
import {createSuiue} from "suiue";

// 引入我们导出的 router
import { setupRouter } from '@/router';

const setupApp = async () => {
    const app = createApp(ProviderWrapper);
    // 创建路由
    app.use(createSuiue());
    setupRouter(app);
    app.mount('#app');
};

setupApp();