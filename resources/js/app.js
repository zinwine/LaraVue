
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

// *************** VForm *******************

import { Form, HasError, AlertError } from 'vform'

window.Form = Form;

Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)

// ******************** Laravel Vue Pagination **********************

Vue.component('pagination', require('laravel-vue-pagination'));

// ****************** Moment *****************

import moment from 'moment'
Vue.filter('myDate', function (time) {
    return moment(time).format("MMM Do YYYY");
  })

// *************** Filter ******************

Vue.filter('capitalize', function (text) {
    return text.charAt(0).toUpperCase() + text.slice(1)
  })

// ******************* Sweet Alert ***************
  
import Swal from 'sweetalert2'
window.Swal = Swal;

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: false,
  onOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

window.Toast = Toast;

// **************** Custom Event ****************

window.Fire = new Vue();

// ************** Gate ***********************

import Gate from "./Gate"

Vue.prototype.$gate = new Gate(window.user)

// *************** Prograss Bar ***************

import VueProgressBar from 'vue-progressbar'

const options = {
  color: '#bffaf3',
  failedColor: '#f00',
  thickness: '5px',
  transition: {
    speed: '0.2s',
    opacity: '0.6s',
    termination: 300
  },
  autoRevert: true,
  location: 'top',
  inverse: false
}


Vue.use(VueProgressBar, options)
// *************** Router ******************

import VueRouter from 'vue-router'
Vue.use(VueRouter)

let routes = [
  { path: '/dashboard', component: require('./components/Dashboard.vue').default },
  { path: '/developer', component: require('./components/Developer.vue').default },
  { path: '/users', component: require('./components/Users.vue').default },
  { path: '/profile', component: require('./components/Profile.vue').default },
  { path: '/*', component: require('./components/404Page.vue').default },
]

const router = new VueRouter({
    mode: 'history',
    routes // short for `routes: routes`
})
  

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

Vue.component('example-component', require('./components/ExampleComponent.vue').default);
Vue.component('not-found', require('./components/404Page.vue').default);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: '#app',
    router,
    data:{
      search: ''
    },
    methods: {
      searchData: _.debounce(() => {
        Fire.$emit('searching');
      }, 800),
      
    }
});
