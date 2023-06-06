import {
	showToast
} from '@/utils/dialog';
// 页面白名单 不登录可访问的页面
const whiteList = [
	
	'/pages/tabbar/user/index',
	'/pages_category_page2/userModule/login', //登陆页面
	'/pages/tabbar/category/index',
	'bindPhone'
]

function hasPermission(url) {
	// 在白名单中或有token，直接跳转
	console.log(url,"跳转的页面url");
	return true;//全部放行
	url = url.indexOf("?") !== -1 ? url.substring(0, url.indexOf("?")) : url
	if (whiteList.indexOf(url) !== -1 || uni.getStorageSync('token')) {
		return true
	}
	return false
}

uni.addInterceptor('navigateTo', {
	// 页面跳转前进行拦截, invoke根据返回值进行判断是否继续执行跳转
	invoke(e) {
		console.log(e.url,"跳转的页面");
		if (!hasPermission(e.url)) {
			return true
			/* uni.navigateTo({
				url: '/pages_category_page2/userModule/login'
			}) */
			return false
		}
		return true
	},
	success(e) {
		console.log(e)
	}
})

uni.addInterceptor('switchTab', {
	// tabbar页面跳转前进行拦截
	invoke(e) {
		console.log(e.url,"跳转的页面");
		if (!hasPermission(e.url)) {
			return true
			/* uni.navigateTo({
				url: '/pages_category_page2/userModule/login'
			}) */
			return false
		}
		return true
	},
	success(e) {
		// console.log(e)
	}
})
