<template>
	<view>
		<u-popup v-model="showauth" mode="center" @close='shouqi'>
			<view class="authblock">
				<view class="authtip">
					<text>为了给您提供更好的服务</text>
					<text>我们需要您的授权哦~</text>
				</view>
				<view>
					<!-- #ifdef MP-WEIXIN -->
					<button class="loginWxBut fs28" @click="GetUserInfo">微信登录</button>
					<button class="goToHome fs28" @click="stopAuth">暂不授权</button>
					<!-- #endif -->

					<!-- #ifdef APP-PLUS-->
					<view class="iphoneNum-box flex-row-plus flex-items">
						<view style=" margin-left:20upx;">手机号</view>
						<view style="margin-left: 60rpx;">
							<input v-model="loginQuery.account" placeholder-class="iphoneNum-input" type="number" placeholder="请输入您的手机号" />
						</view>
					</view>

					<view class="flex-row-plus mar-top-20">
						<view class="code-box">
							<view>验证码</view>
							<view>
								<input v-model="loginQuery.code" style="width: 180upx;margin-left: 10upx;"
									placeholder-class="codeNum-input" placeholder="请输入验证码" />
							</view>
						</view>
						<view :class="disabled === true ? 'on' : ''" :disabled="disabled" class="getcode" @click="codede">{{text}}</view>
					</view>

					<view>
						<view class="registerBut" @click="login">登录</view>
					</view>
					
					<button class="goToHome fs28" @click="shoujihaozhuce">还没有账号,去注册</button>
					<!-- #endif -->

					<view class="mystyle">
						<u-checkbox-group @change="checkboxGroupChange">
							<u-checkbox @change="checkboxChange" v-model="item.checked" v-for="(item, index) in list" :key="index" :name="item.name"></u-checkbox>
						</u-checkbox-group>
						<view style="font-size: 24rpx;">
							我以阅读并同意<text style="color: rgb(255,125,0);" @click="article">《隐私条款》</text>
							<text style="color: rgb(255,125,0);" @click="xiaofeizhe"> ,《消费者服务协议》</text>
							<text style="color: rgb(255,125,0);" @click="falv"> ,《法律声明》</text>
						</view>
					</view>

				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	const NET = require('@/utils/request')
	const API = require('@/config/api')
	import sendVerifyCode from "@/mixins/SendVerifyCode";
   
	export default {
		name: "wxauth",
		props: {
			showauth: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				list: [{
					name: 'apple',
					checked: false,
					disabled: false
				}],
				isRead: 0,
				WXloginQuery: {
					"code": "",
					"salesId": 0,
					"headImg": ''
				},
				loginQuery: {
					account: '',
					code: '',
					salesId: '',
				}, //手机号登录
				// 获取验证码
				VerifyQuery: {
					phone: ""
				},
			};
		},
		mixins: [sendVerifyCode],
		methods: {
			// 手机号注册
			shoujihaozhuce(){
				
				uni.navigateTo({
					url: '/pages_category_page2/userModule/register'
				})
			
			},
			// 获取验证码
			codede() {
				this.getVerify()
			},
			getVerify() {
				let phoneCodeVerification = /^[1][3-9][0-9]{9}$/;
				if (this.loginQuery.account == '') {
					uni.showToast({
						title: '请输入手机号！',
						duration: 2000,
						icon: 'none'
					});
				} else if (!phoneCodeVerification.test(this.loginQuery.account)) {
					uni.showToast({
						title: '请输入正确的手机号！',
						duration: 2000,
						icon: 'none'
					});
				} else {
					this.VerifyQuery.phone = this.loginQuery.account

					NET.request(API.Verify, {
						phone: this.VerifyQuery.phone,
					}, 'GET').then(res => {
						this.sendCode()
					}).catch(res => {
						uni.showToast({
							title: res.data.message,
							duration: 1000,
							icon: 'none'
						});
					})
				}

			},
			//手机号登录
			login() {
				if (this.isRead) {
					if(this.loginQuery.code == ''){
						uni.showToast({
							title: '请输入验证码',
							duration: 2000,
							icon: 'none'
						});
					}
					let phoneCodeVerification = /^[1][3-9][0-9]{9}$/;
					if (this.loginQuery.account == '') {
						uni.showToast({
							title: '请输入手机号！',
							duration: 2000,
							icon: 'none'
						});
					} else if (!phoneCodeVerification.test(this.loginQuery.account)) {
						uni.showToast({
							title: '请输入正确的手机号！',
							duration: 2000,
							icon: 'none'
						});
					} else {
						const that = this
						uni.showLoading({
							title: '正在登录...',
							duration: 2000,
						});
						NET.request(API.Login, {
							type: 2,
							phone: this.loginQuery.account,
							verificationCode: this.loginQuery.code
						}, 'POST').then(res => {
							uni.hideLoading()
							const item = res.data
							uni.setStorageSync('storage_key', item);
							if (uni.getStorageSync("salesId")) {
								let salesId = uni.getStorageSync("salesId")
								let shopId = uni.getStorageSync("shopId")
								// this.bindSalesCustomer(salesId, shopId)
								uni.removeStorageSync('salesId');
								uni.removeStorageSync('shopId');
							}
							this.loginQuery.account = ''
							this.loginQuery.code = ''
							this.$emit("stop-auth");
						})
						.catch(res => {
							console.log(res,'Login failed')
							// console.dir(res)
							uni.hideLoading()
							uni.showToast({
								title: res.message,
								duration: 2000,
								icon: 'none',
							});
						})
					}
				} else {
					uni.showToast({
						title: "请阅读并同意,隐私条款,用户行为规范",
						icon: "none"
					});
				}


			},
			//跳转手机号登录页面
			goLogin() {
				uni.navigateTo({
					url: '/pages_category_page2/userModule/accountLogin'
				})
			},
			// 选中某个复选框时，由checkbox时触发
			checkboxChange(e) {
				console.log(e, 1);
			},
			// 选中任一checkbox时，由checkbox-group触发
			checkboxGroupChange(e) {
				if (e.length == 1) {
					this.isRead = 1
					console.log(e, '已经选中');
				} else {
					this.isRead = 0
					console.log(e, '未选中');
				}

			},
			//跳转到文章
			article() {
				uni.navigateTo({
					url: '/pages_category_page3/xieyi/yinsixieyi'
				})
			},
			xiaofeizhe() {
				uni.navigateTo({
					url: '/pages_category_page3/xieyi/xiaofeizhe'
				})
			},
			falv() {
				uni.navigateTo({
					url: '/pages_category_page3/xieyi/falvshengming'
				})
			},
			stopAuth() {
				this.$emit("stop-auth");
			},
			//弹框收起来的时候触发 这一段是我加的,因为有个报错无法解决
			shouqi() {
				let isShou = uni.getStorageSync('storage_key');
				if (isShou && isShou !== '') {

				} else {
					this.$emit("stop-auth");
				}

			},
			
			// 微信登陆
			GetUserInfo() {
				if (this.isRead) {
					const that = this
					uni.showLoading({
						title: "加载中...",
						icon: "none"
					})
					uni.login({
						provider: 'weixin',
						success: (res2) => {
							uni.hideLoading();
							console.log(res2, '登录后')
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
							console.log(res, '获取用户信息')
							let _userInfo = res.userInfo;
							that.WXloginQuery.headImg = _userInfo.avatarUrl
							//没登录才登录
							uni.showLoading({
								title: "登录中",
								icon: "none"
							})
							NET.request(API.WxLogin, that.WXloginQuery, 'POST').then(res => {
								
								console.log(res, '获取用户信息后,调的接口')
								let data = {
									wechatOpenId: res.data.wechatOpenId,
									nickName: _userInfo.nickName,
									headImg: _userInfo.avatarUrl
								}
								let buyerUser = res.data;
								uni.setStorageSync('userId', res.data.buyerUserId);
								uni.setStorageSync('wechatOpenId', res.data.wechatOpenId);
								uni.hideLoading();
                                
								if (buyerUser.ifFirst == 0) {
									uni.setStorageSync('storage_key', buyerUser);
								} else {
									//第一次登录要绑定手机号
									uni.navigateTo({
										url: '/pages_category_page2/userModule/bindPhone?data='+JSON.stringify(data)
									})
								}
								that.$emit("after-auth", {
									auth: true
								});
							}).then(()=>{
								// 页面初始化查询分销员id
								let shopId = uni.getStorageSync("curshopid")
								let _data = {shopId}
								NET.request(API.getdistributorId,_data,'POST').then(res=>{
									if(typeof res.data == "number" || typeof res.data == "string"){
										that.$setstorage(res.data)
									}
								})
							})
						},
						fail: function(err) {
							uni.showToast({
								title: "微信登录授权失败",
								icon: "none"
							});
						},
					});
					
					
				} else {
					uni.showToast({
						title: "请阅读并同意,隐私条款,用户行为规范",
						icon: "none"
					});
				}
			}
		}
	}
</script>



<style lang="scss">
	.iphoneNum-box {
		margin-top: 40upx;
		border: 1upx solid #DDDDDD;
		height: 88upx;
		// width: 600upx;
		border-radius: 44upx;

		.iphoneNum-input {
			color: #999999;
			font-size: 28upx;
			font-weight: 400;
		}
	}

	.code-box {
		border: 1upx solid #DDDDDD;
		height: 88upx;
		width: 366upx;
		border-radius: 44upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 0upx 20upx 0upx;
		align-items: center;

		.code-lab {
			width: 200upx;
		}

		.codeNum-input {
			color: #999999;
			font-size: 28upx;
			font-weight: 400;
		}
	}

	.registerBut {
		background-image: linear-gradient(135deg, rgba(0, 206, 82, 1.0) 10%, rgba(0, 170, 73, 1) 100%);
		color: #FFFFFF;
		height: 88upx;
		// width: 600upx;
		text-align: center;
		line-height: 88upx;
		border-radius: 88upx;
		margin-top: 17upx;
	}

	.getcode {
		background-color: rgba(0, 170, 73, 1);
		height: 88upx;
		width: 240upx;
		border-radius: 44upx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		margin-left: 80upx;
		color: #FFFFFF;
	}

	.mystyle {
		display: flex;
		align-items: center;
		height: 100rpx;
	}

	.authblock {
		padding: 0 30upx;
		padding-top: 20upx;
		.authtip {
			display: flex;
			flex-direction: column;
			align-items: center;
		}

		.goToHome {
			background: none;
			border: none;
			width: auto;
			margin-top: 20upx;
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
