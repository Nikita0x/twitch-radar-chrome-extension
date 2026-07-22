import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';

import '../assets/reset.css';
import '../assets/theme.css';

const app = createApp(App);

app.use(createPinia());

app.mount('#app');
