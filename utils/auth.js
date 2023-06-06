
const distributorId = "distributorId"
const NET = require('./request')
const API = require('../config/api')
export function getstorage(){
	let _d = uni.getStorageSync(distributorId);
	if(typeof _d === "number"){
		return _d
	}else{
		return ""
	}
}

export function setstorage(distributorId){
	uni.setStorageSync("distributorId",distributorId)
}

export function removestorage(){
	uni.getStorageSync(distributorId)
}

// 获取分销员id
export function getdistributorId(){
	let shopId = uni.getStorageSync("curshopid");
	let data = {
		shopId
	}
	NET.request(API.getdistributorId,data,'POST').then(res=>{
		uni.setStorageSync("distributorId",res.data);
	})
}

// 获取门店  地址 电话
export function getmessageshop(){
	let _d = uni.getStorageSync("shopItim");
	if(_d && Object.keys(_d).length>0){
		return _d;
	}else{
		return "";
	}
}

// 获取微信授权openid
export function getauth(){
	let _data  = {}
	uni.login({
		provider: 'weixin',
		success: (res2) => {
			console.log(res2, '登录后')
			_data.code = res2.code;
			NET.request(API.WxLogin, _data, 'POST').then(res => {
				console.log(res, '获取用户信息后,调的接口')
				uni.setStorageSync('wechatOpenId', res.data.wechatOpenId);
			})
		},
		fail: () => {
			uni.showToast({
				title: "微信登录授权失败1",
				icon: "none"
			});
		}
	})
}

export function getsumdj(pagetitle,pagedata,pageurl){
		let wechatOpenId = uni.getStorageSync("wechatOpenId");
		let shopId = uni.getStorageSync("curshopid")??"";
		let fromBuyerUserId = uni.getStorageSync("salesId123")??"";
		// pagetitle 是产品的名，pagedata 产品id
		if(wechatOpenId && wechatOpenId!=""){
			let data = { fromBuyerUserId,wechatOpenId,shopId,pagedata:pagedata || "",pagetitle:pagetitle || "",pageurl:pageurl || ""}
			 console.log(data,"配置分享信息分享信息");
			 
			NET.request(API.GetAlwayssumdj,data,'post').then(res=>{
			      console.log(res,"配置分享信息分享信息");	
			})	
		}
	
}