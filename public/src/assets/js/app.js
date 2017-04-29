import axios from 'axios';
import moment from 'moment';
import Vue from 'vue';
import VueRouter from 'vue-router';
import lang from 'element-ui/lib/locale/lang/en';
import locale from 'element-ui/lib/locale';
import Buefy from 'buefy'
import header from '../../components/shared/header.vue';
import footer from '../../components/shared/footer.vue';
import acceptbtn from '../../components/Admin/accept-btn.vue';
import rejectbtn from '../../components/Admin/reject-btn.vue';
import couponDeleteBtn from '../../components/Business/Service/coupon-delete.vue'
import TopHero from '../../components/shared/gr-top-hero.vue';
import clientRemoveBtn from '../../components/Admin/remove-client-btn.vue';
import businessRemoveBtn from '../../components/Admin/remove-business-btn.vue';
import CategoryActions from '../../components/Admin/category-actions.vue';
import TransactionsAction from '../../components/Business/manage/business-trans-actions.vue';
import * as VueGoogleMaps from 'vue2-google-maps';

import '../css/style.css';

import router from '../../services/routes.js';

/**
 * Element UI.
 */

import {
  Dialog,
  Autocomplete,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxGroup,
  Switch,
  Select,
  Option,
  OptionGroup,
  Button,
  ButtonGroup,
  DatePicker,
  TimeSelect,
  TimePicker,
  Tooltip,
  Popover,
  Form,
  FormItem,
  Alert,
  Icon,
  Spinner,
  Rate,
  Steps,
  Step,
  Carousel,
  Scrollbar,
  CarouselItem,
  Slider,
  Loading,
} from 'element-ui';

Vue.use(Dialog)
Vue.use(Autocomplete)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Switch)
Vue.use(Select)
Vue.use(Option)
Vue.use(OptionGroup)
Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(Popover)
Vue.use(DatePicker)
Vue.use(TimeSelect)
Vue.use(TimePicker)
Vue.use(Tooltip)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Alert)
Vue.use(Slider)
Vue.use(Icon)
Vue.use(Spinner)
Vue.use(Rate)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Carousel)
Vue.use(Scrollbar)
Vue.use(CarouselItem)

Vue.use(Loading.directive)

locale.use(lang);

Vue.prototype.$loading = Loading.service

/**
 * Allow axios to be accessed globaly.
 */
window.axios = axios;

/**
 * Register Vue Components to be accessed globaly.
 */

Vue.component('accept-btn', acceptbtn);
Vue.component('reject-btn', rejectbtn);
Vue.component('client-remove-btn', clientRemoveBtn);
Vue.component('business-remove-btn', businessRemoveBtn);
Vue.component('category-actions-btns', CategoryActions);
Vue.component('gr-top-hero', TopHero);
Vue.component('bus-trans-actions', TransactionsAction);
Vue.component('coupon-delete-btn', couponDeleteBtn);
Vue.component('gr-top-hero', TopHero);

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBzlLYISGjL_ovJwAehh6ydhB56fCCpPQw',
    v: '3.26',
  },
  installComponents: true,
});

/**
 * Register Vue Filters.
 */

Vue.filter('appendRandom', (e) => {
  return `${e}${Math.random() * 10000000}`;
});
Vue.filter('moment', date => moment(date).format('dddd MMMM Do YYYY.'));

/**
 * Register Vue Plugins.
 */

Vue.use(VueRouter);

Vue.use(Buefy, {
  defaultIconPack: 'fa',
});

/**
 * Instantiate a Vue Instance.
 */
new Vue({
  el: '#root',
  router,
  components: {
    'gr-header': header,
    'gr-footer': footer,
  },
});
