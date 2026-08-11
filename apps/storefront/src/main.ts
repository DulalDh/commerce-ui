import './styles.css';
import router from './router';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { configureApiClient } from '@org/api-client';
import { registerAuthRefreshHandler, useAuthStore } from '@org/auth';
import App from './app/App.vue';

configureApiClient({ baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api' });

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);

registerAuthRefreshHandler(useAuthStore());

app.mount('#root');
