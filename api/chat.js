import request from "@/utils/chat.js";
import qs from "qs"

export function getChatUserId(data) {
	//获取聊天模块用户id
	return request.post({
		url: '/api/Yib/getUserId',
		data
	})
}

export function synchronousUser(data) {
	//用户信息同步接口
	return request.post({
		url: '/api/Yib/synchronous_user',
		data
	})
}

export function synchronousShop(data) {
	//商家信息同步接口
	return request.post({
		url: '/api/Yib/synchronous_shop',
		data
	})
}

export function setRelation(data) {
	//写入商家与用户好友关系
	return request.post({
		url: '/api/Yib/setRelation',
		data
	})
}

/**
 * 在线
 * @param {Object} data
 */
export function online(data) {
	return request.form({
		url: '/webim/Friends/onLine',
		params: qs.stringify(data)
	})
}


/**
 * 接收离线消息
 */
export function offline(client_id) {
	let data = {
		"client_id": client_id
	}
	return request.form({
		url: '/webim/Friends_Message/offline',
		params: qs.stringify(data)
	})
}

/**
 * 发送消息
 * @param {Object} data
 */
export function sendMessage(data) {
	return request.form({
		url: '/webim/Friends_Message/add',
		params: qs.stringify(data)
	})
}


/**
 * 登录
 * @param {Object} uid
 */
export function login(uid) {
	return request.form({
		url: '/api/user/login',
		params: {
			account: uid
		}
	})
}


/**
 * @param {Object} targetid  和谁的聊天记录
 * @param {Object} client_id
 */
export function getHistoryMsg(targetid, client_id) {
	//
	// targetid: 9
	// page: 1
	// client_id: 7f0000010c800000001a
	let data = {
		page: 1,
		targetid: targetid,
		client_id: client_id
	}
	return request.form({
		url: '/webim/Friends_Message/messageHistory',
		params: qs.stringify(data)
	})
}


/**
 * 获取商家id
 * @param {Object} shopid
 */
export function getShopUserid(data) {
	return request.post({
		url: '/api/Yib/getShopUserId',
		data
	})

}


/**
 * 获取好友
 */
export function getMyFriend() {
	return request.form({
		url: '/webim/Common/init'
	})
}

/**
 * 消息已读
 */
export function setMessage(data) {
	return request.post({
		url: '/api/Yib/setMessage',
		data
	})
}

/**
 * 客户获取未读信息的数量
 */
export function getSjWdMessage(data) {
	return request.get({
		url: `/api/Yib/getSjWdMessage?shop_id=${data}`,
	})
}