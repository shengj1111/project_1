export function showModal(options) {
	//弹窗的封装
	return new Promise((resolve, reject) => {
		uni.showModal({
			title: options.title || "提示",
			content: options.content || "",
			showCancel: options.showCancel || true,
			cancelText: options.cancelText || '取消',
			cancelColor: options.cancelColor || '#000',
			confirmText: options.confirmText || '确定',
			confirmColor: options.confirmColor || '',
			success: (res) => {
				if (res.confirm) {
					resolve(res)
				} else if (res.cancel) {
					reject(res)
				}
			},
			fail: (err) => {
				reject(err)
			}
		})
	});
}
//提示信息
export function showToast(title, icon = "none", duration = 2000) {
	uni.showToast({
		title: title,
		icon: icon,
		duration: duration
	});
}
