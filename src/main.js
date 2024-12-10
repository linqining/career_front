// import { createApp } from 'vue'
// import App from './App.vue'
//
// createApp(App).mount('#app')
//

import { createApp } from 'vue';
import App from './App.vue';

// const app = createApp(App);
// 引入我们导出的 router
import { setupRouter } from '@/router';

const setupApp = async () => {
    const app = createApp(App);
    // 创建路由
    setupRouter(app);
    app.mount('#app');
};

setupApp();
