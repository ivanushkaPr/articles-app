import Vue from 'vue';
import Vuelidate from 'vuelidate';
import App from './App.vue';
import store from './store';
import BaseActionButton from './UI/BaseActionButton.vue';
import BaseInput from './UI/BaseInput.vue';
import BaseSelect from './UI/BaseSelect.vue';
import BaseMultiSelect from './UI/BaseMultiSelect.vue';
import BaseCancelButton from './UI/BaseCancelButton.vue';

Vue.use(Vuelidate);
Vue.component('BaseActionButton', BaseActionButton);
Vue.component('BaseInput', BaseInput);
Vue.component('BaseSelect', BaseSelect);
Vue.component('BaseMultiSelect', BaseMultiSelect);
Vue.component('BaseCancelButton', BaseCancelButton);
Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
