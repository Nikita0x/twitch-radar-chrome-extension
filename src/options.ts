import { createApp } from 'vue';
import { createPinia } from 'pinia';

import Options from './Options.vue';

import '../assets/reset.css';
import '../assets/theme.css';

const app = createApp(Options);

app.use(createPinia());

app.mount('#app');
