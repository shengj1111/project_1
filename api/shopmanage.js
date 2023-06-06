import request from "@/utils/shoprequest.js";

// export function login(phone, pwd,code) {
// 	//商家登录接口
// 	let data = {
// 		"username": phone,
// 		"password": pwd,
// 		"rememberMe": false,
// 		code,
// 	}
// 	return request.post({
// 		url: '/business/login',
// 		data,
// 		isToast: true
// 	})
// }
//之前用上面的,现在用下面的
export function login(data) {
	//商家登录接口

	return request.post({
		url: '/business/login',
		data,
		isToast: true
	})
}

export function getShopFinanceCount(shopid) {
	//获取商家财务统计数据
	let data = {
		"shopId": shopid
	}
	return request.post({
		url: '/finance/getFinanceCount',
		data
	})
}

export function getById(shopid) {
	// 获取商店信息
	let data = {
		"shopId": shopid
	}
	return request.post({
		url: '/shop/getById',
		data
	})
}

export function getById2(shopid) {
	// 获取商店信息
	let data = {
		"shopId": shopid
	}
	return request.post({
		url: '/shop/getById2?fromxcx=1',
		data
	})
}



export function editShop(data) {
	//修改商家信息
	return request.post({
		url: '/shop/update',
		data
	})
}


export function getAllOrder(page, pageSize, state) {
	//查询订单
	let data = {
		page: page,
		pageSize: pageSize,
		state: state
	}

	return request.post({
		url: '/order/getAll',
		data
	})

}


export function getBankOption() {
	//获取所有银行
	return request.post({
		url: '/dict/getSelect',
		data: {
			'dictName': '所属银行'
		}
	})
}


export function bindBank(data) {
	//绑定银行卡
	return request.post({
		url: '/bank/save',
		data,
		isToast: true
	})
}

export function updateBank(data){
	///更换账户
	return request.post({
		url: '/bank/update',
		data,
		isToast: true
	})
}


export function getSmsCode(phone) {
	//获取短信验证码
	let data = {
		"phone": phone
	}
	return request.post({
		url: '/business/getCode',
		data,
		isToast: true
	})
}


export function getBank() {
	//获取绑定的银行卡
	return request.post({
		url: '/finance/getBank',
	})
}

export function tixian(data) {
	//提现申请
	return request.post({
		url: '/finance/withdrawal',
		data,
		isToast: true
	})
}

export function acquireParticulars(id) {
	//根据id获取商品详情
	return request.post({
		url: '/order/getById',
		data:{
			orderId:id
		}
	})
}
export function amendOrder(data) {
	//修改订单商品价格或订单支付价格
	return request.post({
		url: '/order/historyPrice',
		data
	})
}

export function orderGetSelect(data){
	//获取所有的快递公司
	return request.post({
		url: '/express/getExpressSelect',
		data
	})
}

export function orderDilevery(data){
	//发货接口
	return request.post({
		url: '/order/dilevery',
		data
	})
}

export function shangjiabeizhu(data) {
	//商家订单备注
	return request.post({
		url: '/order/platform_remark',
		data
	})
}

export function getCanTXOrder(data) {
	//商家订单备注
	return request.post({
		url: '/order/getCanTXOrder',
		data
	})
}

export function getWaterList(data) {
	//商家订单备注
	return request.post({
		url: '/finance/getWithdrawalDetails',
		data
	})
}

export function approveCancelOrder(data) {
	//商家取消订单
	return request.post({
		url: '/order/approveCancelOrder',
		data
	})
}

export function getApplyCancel(data) {
	//取消订单的详情
	return request.get({
		url: '/order/getApplyCancel?orderId=' + data,
		
	})
}
export function doCancelOrder(data) {
	//商家主动取消订单
	return request.post({
		url: "/order/doCancelOrder",
		data
	})
}

export function ticketAll(data) {
	//查询所有的优惠券
	return request.post({
		url: "/coupon/getAll?fromxcx=1",
		data
	})
}

export function couponGetById(data) {
	//查询优惠券的详情
	return request.post({
		url: "/coupon/getById?fromxcx=1",
		data
	})
}

export function forgetPassword(data) {
	//忘记密码
	return request.post({
		url: "/business/forgetPassword",
		data
	})
}
export function updatePassword(data) {
	//修改密码
	return request.post({
		url: '/business/updatePassword',
		data
	})
}
// export function getJifenAll(data) {
// 	//商家的接口,获取积分订单
// 	return request.post({
// 		url: '/point_exchange/getAll',
// 		data
// 	})
// }

export function isPresentedIntegral(data) {
// 是否赠送积分
	return request.post({
		url: '/order/auditCheck',
		data
	})
}
export function jifenOrderAll(data) {
// 获取所有积分订单
	return request.post({
		url: '/point_exchange/getAll',
		data
	})
}
export function jifenOrderdel(data) {
// 删除积分订单
	return request.post({
		url: '/point_exchange/delete',
		data
	})
}
export function jifenOrderup(data) {
// 积分订单发货
	return request.post({
		url: '/point_exchange/update',
		data
	})
}
// pointcancelById: WX_API_BASE + '/pointcancel/getById', //
export function pointcancelById(oid) {
// 根据订单id查询取消详情
	return request.get({
		url: `/pointcancel/getById?orderFormid=${oid}`,
		
	})
}
export function insertPointOrdercancel(data) {
// 积分取消订单
	return request.post({
		url: '/pointcancel/insertPointOrdercancel',
		data
	})
}
export function checkPointOrdercancel(data) {
// 积分取消订单审核,商家端
	return request.post({
		url: '/pointcancel/checkPointOrdercancel',
		data
	})
}
export function PointOrdercancel(data) {
// 积分订单主动取消,商家端
	return request.post({
		url: '/pointcancel/PointOrdercancel',
		data
	})
}
