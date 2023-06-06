const baseURL = "https://xcx.ylbtl.cn";

import stringify from "@/utils/querystring";
import {
	showToast
} from '@/utils/dialog';

export function getBaseUrl(){
	return baseURL;
}



// 请求完成时处理结果
function result(res, resolve, reject, isToast) {
	if (res && res != "") {
		let statusCode = res.statusCode;
		if (statusCode == 401) {
			reject();
		}
		if (statusCode == 500) {
			isToast && shoToast('服务器出错：500');
			reject("服务器错误")
		} else {
			let _result; //请求结果
			let code; //请求结果中的status

			if (typeof(res.data) == 'string') {
				//返回的结果为string,转换为对象
				_result = JSON.parse(res.data);
			} else {
				_result = res.data;
			}
			code = _result.code;
			if (code == "" || code == '200' || code == '1') {
				//调用成功
				uni.hideLoading();
				resolve(_result)
			} else {
				//错误
				isToast && showToast(_result.message)
				reject && reject(_result)
			}
		}
	}
}



//发送请求
function baseRequest(url, params, method, options, isToast = false) {
	return new Promise((resolve, reject) => {
		//判断参数不存在或为空则设置为空对象
		if (params == undefined || params == "") {
			params = {};
		}
		let header;
		//请求头
		if (!options.header) {
			header = {
				'Content-type': 'application/json'
			}
		} else {
			header = options.header
		}
		
		let _token = uni.getStorageSync("chattoken")
		if (_token && _token != "") {
			header["token"] = _token;
		}

		isToast && uni.showLoading({
			title: '加载中'
		});
		uni.request({
			url: baseURL + url,
			data: params,
			method: method,
			header: header,
			dataType: 'json',
			timeout: 3000,
			success: (res) => {
				result(res, resolve, reject, isToast)
			},
			fail: (err) => {
				let errMsg = "";
				if (err != undefined && err.errMsg != undefined) {
					errMsg = err.errMsg;
				}
				isToast && showToast("连接失败：服务器出错:" + errMsg);
				reject(errMsg);
			}
		});
	})
}

const request = {
	get(options) {
		return baseRequest(options.url, options.params, 'GET', options, options.isToast)
	},
	post(options) {
		if (options.params) {
			options.url += '?' + stringify(options.params)
		}
		return baseRequest(options.url, options.data, 'POST', options, options.isToast)
	},
	put(options) {
		return baseRequest(options.url, options.params, 'PUT', options, options.isToast)
	},
	delete(options) {
		return baseRequest(options.url, options.params, 'DELETE', options, options.isToast)
	},
	baseURL,
	form(options){
		options.header={
			"Content-Type":"application/x-www-form-urlencoded"
		}
		return baseRequest(options.url, options.params, 'POST', options, options.isToast)
	}

}


export default request