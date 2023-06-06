// export const WSURL = "ws://192.168.0.15:8090/webSocket";
export const WSURL = "wss://xcx.ylbtl.cn/wss";


// export const HTTPURL="http://192.168.0.15:8090"

// export const WSURL = "ws://82.156.205.170:8090/webSocket";
// export const WSURL = "wss://xcx.ylbtl.cn/webSocket"

// export const HTTPURL="http://139.198.116.43:8090"



export function createUserCode(userid) {
	return "user_" + userid;
}

export function createShopCode(shopid) {
	return "shop_" + shopid;
}



export function getSavekey(userid,shopid,sendcode){
	//拼接savekey
	return userid+"_"+shopid+"&"+sendcode;
}