import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
import "@/utils/router"; //路由拦截
import {getstorage,setstorage,removestorage,getsumdj,getdistributorId,getmessageshop } from "./utils/auth.js"
Vue.use(uView);

Vue.config.productionTip = false

Vue.prototype.$toUrl = (url) => {
	console.log(url);
	uni.navigateTo({
		url
	})
}

Vue.prototype.$getstorage = getstorage
Vue.prototype.$getmessageshop = getmessageshop
Vue.prototype.$getdistributorId = getdistributorId
Vue.prototype.$setstorage  = setstorage
Vue.prototype.$removestorage = removestorage;
Vue.prototype.getsumdj = getsumdj;


App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
