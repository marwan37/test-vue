import { createApp } from 'vue';
import Toast from 'vue-toastification';
import App from './App.vue';
import router from './router';
import store from './store';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ConfirmDialog from 'primevue/confirmdialog';

import './main.css';
import 'primeicons/primeicons.css';
import 'vue-toastification/dist/index.css';

const app = createApp(App);
app.use(Toast);
app.use(PrimeVue);
app.use(ConfirmationService);
app.component('ConfirmDialog', ConfirmDialog);
app.use(router);
app.use(store);
app.mount('#app');
