import { createApp } from 'vue';
import Toast from 'vue-toastification';
import App from './App.vue';
import router from './router';
import store from './store';
import PrimeVue from 'primevue/config';
import './main.css';


const app = createApp(App);
app.use(Toast);
app.use(PrimeVue);
app.use(router);
app.use(store);
app.mount('#app');
