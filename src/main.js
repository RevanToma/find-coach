import { createApp, defineAsyncComponent } from 'vue';
import App from './App.vue';
import router from './route';
import store from './store/index';
// import BaseCard from './components/UI/BaseCard.vue';
// import BaseButton from './components/UI/BaseButton.vue';
// import BaseBadge from './components/UI/BaseBadge.vue';
// import BaseSpinner from './components/UI/BaseSpinner.vue';
// import BaseDialog from './components/UI/BaseDialog.vue';

const app = createApp(App);

// Base components
const BaseDialog = defineAsyncComponent(() => import('./components/UI/BaseDialog.vue'));
const BaseCard = defineAsyncComponent(() => import('./components/UI/BaseCard.vue'));
const BaseButton = defineAsyncComponent(() => import('./components/UI/BaseButton.vue'));
const BaseSpinner = defineAsyncComponent(() => import('./components/UI/BaseSpinner.vue'));
const BaseBadge = defineAsyncComponent(() => import('./components/UI/BaseBadge.vue'));

// route
app.use(router);
app.use(store);

//components
app.component('base-card', BaseCard);
app.component('base-button', BaseButton);
app.component('base-badge', BaseBadge);
app.component('base-spinner', BaseSpinner);
app.component('base-dialog', BaseDialog);

// mount
app.mount('#app');
