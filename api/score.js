import request from "@/utils/shoprequest.js";

export function getgoods(params){
	//获取商品列表
	return request.get({
		url:'/api/Integral/getgoods',
		params})
}

export function getIDgoods(id){
	//获取商品详情 
	return request.get({
		url:'/api/Integral/getIDgoods',
		params:{id}
	})
}

export function setOrder(data){
	//填写订单 
	return request.post({
		url:'/api/Integral/setOrder',
		data
	})
}

export function getUscore(data){
	//获取用户积分 
	return request.get({
		url:'/api/Integral/getUscore',
		params:data
	})
}

export function getScoreRiZhi(data){
	//获取用户积分明细 
	return request.get({
		url:'/api/Integral/getScoreRiZhi',
		params:data
	})
}

export function getOrder(data){
	//获取兑换记录列表 
	return request.get({
		url:'/api/Integral/getOrder',
		params:data
	})
}

export function getOrderXp(id){
	//获取兑换记录详情 
	return request.get({
		url:'/api/Integral/getOrderXp',
		params:{ id }
	})
}