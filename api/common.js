const NET = require('@/utils/request')
const API = require('@/config/api')
export function getCurShopid() {
	//获取当前shopid
	let _s = uni.getStorageSync("curshopid");
	return _s;
}

export function setCurShopid(shopid) {
	//设置当前shopid
	uni.setStorageSync("curshopid", shopid);
}

export function setPhone(chargePersonPhone) {
	//设置当前店铺的负责人手机号
	uni.setStorageSync("chargePersonPhone", chargePersonPhone);
}

export function getPhone() {
	//获取当前店铺的负责人手机号
	let _p = uni.getStorageSync("chargePersonPhone");
	return _p;
}

export function getCurUserid() {
	//获取当前用户id
	let _u = uni.getStorageSync("storage_key");
	if (_u && _u != "") {
		return _u.buyerUserId
	}
}

export function clearlogin() {
	//移除登录信息
	uni.removeStorageSync("storage_key");
}

export function getlogininfo() {
	//获取登录信息
	return uni.getStorageSync("storage_key");
}



