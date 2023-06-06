<template>
	<view class="container flex-items-plus flex-column">
		<view class="login-logoBox">
			<image class="login-logo" src="@/static/logo.png"></image>
		</view>
		<view class="loginTitle-text flex-column-plus flex-items font-color-666 fs26">
			<text>为了给您提供更好的服务</text>
			<text>我们需要您的授权哦~</text>
		</view>
		<view>
			<!-- #ifdef MP-WEIXIN -->
			<button class="loginWxBut fs28" @click="GetUserInfo">微信登录</button>
			<button class="goToHome fs28" @click="back">去首页逛逛</button>
			
			<!-- #endif -->
			<!-- #ifdef MP-ALIPAY -->
			<button class="loginWxBut fs28" @click="GetAliPayUserInfo">支付宝登录</button>
			<!-- #endif -->
			<!-- #ifndef MP-ALIPAY -->
			<view class="loginBut" v-if="noMp" @click="goLogin">手机号登录</view>
			<!-- #endif -->
		</view>
		<view class="flex-row-plus mar-top-30" v-if="noMp">
			<text class="font-color-FF7800">还没有账号，</text>
			<view class="register-text" @click="goRegister">去注册</view>
		</view>
	</view>
</template>

<script>
	const NET = require('@/utils/request')
	const API = require('@/config/api')
	export default {
		data() {
			return {
				WXloginQuery: {
					"code": "",
					"salesId": 0,
					"headImg": ''
				},
				noMp: false,
				beforePage: null,
				doubleBeforePage: null
			}
		},
		onLoad(options) {
			// #ifndef MP
			this.noMp = true
			// #endif
			/* var pages = getCurrentPages()
			if (pages.length >= 2) {
				this.beforePage = pages[pages.length - 2]
			}
			if (pages.length >= 3) {
				this.doubleBeforePage = pages[pages.length - 3]
			} */
		},
		
		methods: {
			
			back() {
				uni.switchTab({
					// url: '/pages/tabbar/index/index'
					url:'/pages/homePage/homePage'
				});
			},
			goLogin() {
				uni.navigateTo({
					url: 'accountLogin'
				})
			},
			goRegister() {
				uni.navigateTo({
					url: 'register'
				})
			},
			GetUserInfo() {
				// #ifdef APP-PLUS
				const that = this
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						// 获取用户信息
						uni.getUserProfile({
							desc: '用于完善会员资料',
							success: function(infoRes) {
								console.log(infoRes,9992)
								let wechatOpenId = infoRes.userInfo.openId
								let avatarUrl = infoRes.userInfo.avatarUrl
								NET.request(API.WxAppLogin, {
									'wechatOpenId': wechatOpenId
								}, 'POST').then(res => {
									let data = {
										wechatOpenId: wechatOpenId,
										headImg: avatarUrl
									}
									that.loginSuc(res.data,data);
								}).catch(res => {
									console.log('WxAppLogin failed: ', res)
								})
							},
							fail: () => {
								uni.showToast({
									title: "微信登录授权失败",
									icon: "none"
								});
							}
						});
					}
				});
				// #endif
				// #ifdef MP-WEIXIN
				const that = this
				uni.login({
					provider: 'weixin',
					success: (res2) => {
						that.WXloginQuery.code = res2.code
					},
					fail: () => {
						uni.showToast({
							title: "微信登录授权失败",
							icon: "none"
						});
					}
				})

				uni.getUserProfile({
					desc: '正在获取', //不写不弹提示框
					success: function(res) {
						console.log(res,9992)
						let _userInfo=res.userInfo;
						that.WXloginQuery.headImg = _userInfo.avatarUrl
						NET.request(API.WxLogin, that.WXloginQuery, 'POST').then(res => {
							let data = {
								wechatOpenId: res.data.wechatOpenId,
								nickName:_userInfo.nickName,
								headImg: _userInfo.avatarUrl
							}
							that.loginSuc(res.data, data);
						
						}).catch(err => {
							console.log('wxLogin failed', err)
						})
					},
					fail: function(err) {
						uni.showToast({
							title: "微信登录授权失败",
							icon: "none"
						});
					},
				});
				/* uni.getUserInfo({
					provider: 'weixin',
					success: function(infoRes) {
					},
					fail: () => {
						uni.showToast({
							title: "微信登录授权失败",
							icon: "none"
						});
					}
				}); */
				/* uni.getUserProfile({
					desc: '正在获取', //不写不弹提示框
					success: function(res) {
						console.dir(res)
						that.WXloginQuery.headImg = res.userInfo.avatarUrl
						// that.loginSuc({'ifFirst': 1}, {'headImg': res.userInfo.avatarUrl})
					},
					fail: function(err) {
						uni.showToast({
							title: "微信登录授权失败",
							icon: "none"
						});
					}
				}) */
				// #endif
			},
			GetAliPayUserInfo() {
				const that = this
				uni.login({
					provider: 'alipay',
					scopes: 'auth_user',
					success: function(loginRes) {
						that.alipayLogin(loginRes.authCode)
					}
				});
			},
			alipayLogin(authCode) {
				NET.request(API.AlipayLogin, {
					'code': authCode
				}, 'POST').then(res => {
					this.loginSuc(res.data, {
						'buyerUserId': res.data.buyerUserId
					})
				}).catch(err => {
					console.log('alipayLogin failed', err)
				})
			},
			loginSuc(buyerUser, data) {
				if (buyerUser.ifFirst == 0) {
					uni.setStorageSync('storage_key', buyerUser);
					this.bindSalesCustomer()
					/* uni.switchTab({
						url: '/pages/tabbar/user/index',
						success() {
							uni.hideLoading()
						}
					}) */
					if (this.beforePage && this.beforePage.route !== 'pages_category_page2/userModule/accountLogin'
						&& this.beforePage.route !== 'pages_category_page2/userModule/login') {
						uni.navigateBack({
						    delta: 1
						})
					} else if (this.doubleBeforePage && this.doubleBeforePage.route !== 'pages_category_page2/userModule/accountLogin'
						&& this.doubleBeforePage.route !== 'pages_category_page2/userModule/login') {
						uni.navigateBack({
						    delta: 2
						})
					} else {
						// #ifdef MP-ALIPAY
						uni.navigateTo({
							url: '/pages/tabbar/user/index'
						})
						// #endif
						// #ifndef MP-ALIPAY
						uni.switchTab({
							url: '/pages/tabbar/user/index'
						})
						// #endif
					}
				} else {
					console.log(data,"跳转页面");
					uni.navigateTo({
						url: 'bindPhone?data=' + JSON.stringify(data)
					})
				}
			},
			bindSalesCustomer() {
				const shopId = uni.getStorageSync('shopId')
				const salesId = uni.getStorageSync('salesId')
				if (shopId && salesId && shopId !== '' && salesId !== '') {
					// 多次调用绑定方法，不提示任何信息即可
					NET.request(API.BindSalesCustomer, {
					  shopId: shopId,
					  distributorId: salesId
					}, 'POST').then(res => {
					  uni.removeStorageSync('salesId');
					  uni.removeStorageSync('shopId');
					}).catch(res => {
					  console.log('login bindSalesCustomer error')
					  console.dir(res)
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.container {
		background-color: #FFFFFF;
		height: 100vh;

		.login-logoBox {
			margin-top: -200upx;

			.login-logo {
				width: 250upx;
				height: 250upx;
			}
		}

		.loginTitle-text {
			margin-top: 100upx;
		}

		.goToHome {
			background: none;
			border: none;
			width: auto;
			margin-top: 50upx;
			color: #999999;
			text-decoration: underline;

			&:after {
				display: none;
			}
		}

		.loginWxBut {
			background-color: $mainColor;
			color: #FFFFFF;
			height: 88upx;
			width: 600upx;
			text-align: center;
			line-height: 88upx;
			border-radius: 88upx;
			margin-top: 49upx;
		}

		.loginBut {
			background-color: #FFFFFF;
			color: $mainColor;
			height: 88upx;
			width: 600upx;
			text-align: center;
			line-height: 88upx;
			border-radius: 88upx;
			border: 2upx solid $mainColor;
			margin-top: 30upx;
		}

		.register-text {
			color: #47A7EE;
		}
	}
</style>
