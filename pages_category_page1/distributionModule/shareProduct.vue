<template>
	<view>
		<u-mask :show="show" z-index="10000">
			<view class="warp">
				<view class="rect" @tap.stop>
					<!-- 关闭按钮 -->
					<view class="guanbiView">
						<img @click="showcos" src="@../../static/img/guanbi.png" class="guanbi" style="width:30px;height:30px;" mode="widthFix"></img>
					</view>
					<!-- 内容 -->
					<view class="imgBox">
						<!-- this.erweima = "@/static/img/user/dizhi1.png" -->
						<!-- <view v-if="shareType==1" class="boxInner imgBoxShop" :style="{'backgroundImage':'url("../../static/img/bgnull.png")'}"></view> -->
						<view v-if="shareType==1" class="boxInner imgBoxShop" :style="{'backgroundImage':'url(' + erweima + ')'}"></view>
						<view v-else class="boxInner imgBoxProduct" :style="{'backgroundImage':'url(' + erweima + ')'}"></view>
					</view>
					<!-- 分享 -->
				</view>
			</view>
			<view class="fenx">
				<view class="shareBox" :class="{'width100':noMp}" hover-class="btn-click" @click="WXfenx">
					<view style="flex: 1;text-align: center;display: flex;">
						<view style="margin-left: 120rpx;" v-if="noMp">
							<image src="../../static/img/album.png" mode="widthFix"></image>
						</view>
						<view style="margin-left: 35%;" v-else>
							<image src="../../static/img/album.png" mode="widthFix"></image>
						</view>
						<view style="margin-left: 10rpx;font-size: 28rpx;color: #333333" >保存到本地</view>
					</view>
				</view>
				<view class="linkBtnBox" hover-class="btn-click" @click="FZlianj" v-if="noMp">
					<view style="flex: 1;text-align: center;display: flex;">
						<view class="linkBox">
							<image src="../../static/img/lianjie.png" mode="widthFix"></image>
						</view>
						<view style="margin-left: 10rpx;">
							复制链接
						</view>
					</view>
				</view>
			</view>
		</u-mask>
	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	export default {
		data() {
			return {
				size: 110, // 二维码大小
				onval: true, // val值变化时自动重新生成二维码
				loadMake: true, // 组件加载完成后自动生成二维码
				erweima: '',
				openSettingBtnHidden: true, //是否授权
				show: true,
				item: {},
				listitem: {},
				skuId: 0,
				FindSalesPromQuery: {
					type: 1,
					tenantCode: ''
				},
				shopId: null,
				salesId: null,
				productId: null,
				noMp: false,
				shareType: 1
			}
		},
		onLoad: function(options) {
			if (options.productId) {
				this.productId = options.productId
			}
			if (options.skuId) {
				this.skuId = options.skuId
			}
			if (options.shopId) {
				this.shopId = options.shopId
			}
			if (options.salesId) {
				this.salesId = options.salesId
			}
			if (options.shareType) {
				this.shareType = options.shareType
			}
			this.erweima = options.shareImg
				
			// #ifndef MP
			this.noMp = true
			// #endif
		},
		methods: {
			showcos() {
				uni.navigateBack({
					delta: 1
				})
			},
			// 保存图片到本地
			WXfenx() {
				// #ifdef MP-WEIXIN || MP-ALIPAY
				uni.getImageInfo({
					src: this.erweima,
					success: function(image) {
						uni.saveImageToPhotosAlbum({
							filePath: image.path,
							success: function() {
								uni.showToast({
									title: '图片保存成功'
								});
							},
							fail: function() {
								uni.showModal({
									title: '图片保存失败',
									content: '请确认是否已开启授权',
									confirmText: '开启授权',
									success(res) {
										if (res.confirm) {
											uni.openSetting({
												success(settingdata) {
													if (settingdata.authSetting[
															"scope.writePhotosAlbum"
														]) {
														uni.showToast({
															title: '授权成功，请重试哦~',
															icon: "none"
														});
													} else {
														uni.showToast({
															title: '请确定已打开保存权限',
															icon: "none"
														});
													}
												}
											})
										}
									}
								})
							},
						});
					},
					fail() {}
				});
				// #endif
				// #ifdef H5
				var oA = document.createElement('a');
				oA.download = ''; // 设置下载的文件名，默认是’下载’
				oA.href = this.erweima;
				document.body.appendChild(oA);
				oA.click();
				oA.remove(); // 下载之后把创建的元素删除
				// #endif
			},
			// 复制链接
			FZlianj() {
				if (this.productId) {
					var link =
						`${API.shareLink}/h5/#/pages_category_page3/merchants/goodsDetails?shopId=${this.shopId}&productId=${this.productId}&skuId=${this.skuId}&salesId=${this.salesId}`
				} else {
					var link =
						`${API.shareLink}/h5/#/pages_category_page1/store/index?storeId=${this.shopId}&salesId=${this.salesId}`
				}
				// #ifdef MP-WEIXIN || MP-ALIPAY || APP-PLUS
				uni.setClipboardData({
					data: link,
					success: res => {
						uni.showToast({
							title: '复制成功',
							icon: 'none',
							duration: 2000 //时间
						});
					}
				})
				// #endif
				// #ifdef H5
				let result
				let textarea = document.createElement("textarea")
				textarea.value = link
				textarea.readOnly = "readOnly"
				document.body.appendChild(textarea)
				textarea.select() // 选中文本内容
				textarea.setSelectionRange(0, link.length) // 设置选定区的开始和结束点
				uni.showToast({
					title: '复制成功'
				})
				result = document.execCommand("copy") //将当前选中区复制到剪贴板
				textarea.remove()
				// #endif
			},
		}
	}
</script>

<style lang="less" scoped>
	.warp {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;

	}

	.qrimg-i {
		margin-right: 10px;
	}

	.rect {
		background-color: #fff;
		position: relative;
		margin-top: -20rpx;

		.imgBox {
			
			.boxInner {
				display: inline-block;
				background-size: contain !important;
				background-position: center top !important;
				background-repeat: no-repeat !important;
			}
			
			.imgBoxShop {
				min-height: 814upx;
				min-width: 426upx;
			}
			
			.imgBoxProduct {
				min-height: 700upx;
				min-width: 426upx;
			}
		}

		.guanbiView {	
			.guanbi {
				width: 50upx;
				height: 40upx;
				position: absolute;
				top: -80rpx;
				left: 50%;
				margin-left: -23rpx;
			}
		}

		//.shareImg {
		//	width: 100%;
		//	height: 720rpx !important;
		//}
	}

	.btn-click {
		background-color: #ececec;
	}

	.fenx {
		position: fixed;
		bottom: 101rpx;
		z-index: 10001;
		background-color: #F7F7F7;
		width: 100%;
		height: 98rpx;
		display: flex;
		color: #343434;

		view {
			line-height: 98rpx;
		}

		image {
			width: 50rpx;
			height: 50rpx !important;
			display: inline-block;
			margin-top: 25rpx;
		}
	}

	.shareBox {
		width: 100%;
	}

	.linkBtnBox {
		flex: 1;
		width: 50%;
		text-align: center;
		display: flex;

		.linkBox {
			margin-left: 70rpx;
		}
	}

	.width100 {
		width: 50%;
	}
</style>
