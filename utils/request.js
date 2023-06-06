const request = (url, data, method = 'GET') => {
	return new Promise((resolve, reject) => {
		let header = {
			"Content-Type": "application/json"
		}
		const res = uni.getStorageSync('storage_key');
		const token = res.token
		if (token) {
			header['Authorization'] = token
		}
		uni.request({
			url: url,
			data: data,
			method: method,
			header: header,
			success: res => {
				if (res.statusCode == 200) {
					let data = res.data
					if (data.code === "200" || data.code === "") {
						resolve(res.data)
					} else if (data.code === "20004") {
						uni.removeStorageSync("storage_key")
						// uni.navigateTo({
						// 	url: '/pages_category_page2/userModule/login'
						// })
						reject(data)
					} else if (data.code === "20005") {
						uni.removeStorageSync("storage_key")
						// uni.navigateTo({
						// 	url: '/pages_category_page2/userModule/login'
						// })
						reject(data)
					} else {
						uni.showToast({
							title: data.message,
							icon: "none"
						})
						reject(data)
					}
					
				} else {
					reject(res)

				}
			},
			fail: res => {
				reject(res)

			}
		})
	});
}
//不带token接口请求，首页
const request1 = (url, data, method = 'GET') => {
	return new Promise((resolve, reject) => {
		let header = {
			'Content-Type': 'application/json',
			'tenant': 'MDAwMA==',
		}
		uni.request({
			url: url,
			data: data,
			method: method,
			header: header,
			success: res => {
				if (res.data.code === "200") {
					resolve(res.data)
				} else {
					reject(res)
				}
			},
			fail: res => {
				reject(res)
			}
		})
	});
}

module.exports = {
	request: request,
	request1: request1
}
