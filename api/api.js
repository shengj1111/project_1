import request from "@/utils/shoprequest.js";

export function wxLogin(data) {
	//微信授权登录
	return request.post({
		url: '/app/wxLogin',
		data
	})
}

export function getById(data){
	//获取商品详情
	return request.get({
		url:'/product/getById',
		params:data
	})
}