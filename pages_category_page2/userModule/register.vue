<!-- 注册 -->
<template>
	<view class="container flex-items-plus flex-column">
		<view class="login-logoBox">
			<image class="login-logo" src="@/static/logo.png"></image>
		</view>
		<view>
			<view class="iphoneNum-box flex-row-plus flex-items">
				<view style="margin-left: 24upx;">
					手机
				</view>
				<view style="margin-left: 60rpx;">
					<input v-model="phone" class="iphoneNum-inputbox" placeholder-class="iphoneNum-input" type="number"
						placeholder="请输入您的手机号" />
				</view>
			</view>
			<view class="flex-row-plus mar-top-20">
				<view class="code-box">
					<view>
						验证码
					</view>
					<view>
						<input v-model="RegisterQuery.code" class="codeNum-inputbox" placeholder-class="codeNum-input"
							placeholder="请输入验证码" />
					</view>
				</view>
				<view :class="disabled === true ? 'on' : ''" :disabled="disabled" class="getcode" @click="codede">
					{{text}}</view>
			</view>
		</view>
	<!-- 	<view class="mar-top-100">
			<text class="font-color-999">注册即代表同意</text>
			<text class="font-color-47A7EE" @click="protocol">《cereshop》商城用户协议</text>
		</view> -->
		<view class="registerBut" @click="onregister">注册</view>
<!-- 		<view class="flex-row-plus mar-top-30">
			<text class="font-color-FF7800">已有账号，</text>
			<view class="font-color-47A7EE" @click="gologin">去登录</view>
		</view> -->
	</view>
</template>

<script>
	import sendVerifyCode from "@/mixins/SendVerifyCode";
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	export default {
		data() {
			return {
				getCodeisWaiting: false,
				// 注册
				phone: '',
				RegisterQuery: {
					account: "",
					code: "",
				},
				// 获取验证码
				VerifyQuery: {
					phone: "",
					type: ""
				},
			}
		},
		mixins: [sendVerifyCode],
		onLoad() {

		},
		methods: {
			// 注册账号
			getRegister() {
				let phoneCodeVerification = /^[1][3,4,5,7,8][0-9]{9}$/;
				if (this.phone == '') {
					uni.showToast({
						title: '请输入手机号！',
						duration: 2000,
						icon: 'none'
					});
				} else if (!phoneCodeVerification.test(this.phone)) {
					uni.showToast({
						title: '请输入正确的手机号！',
						duration: 2000,
						icon: 'none'
					});
				} else if (this.RegisterQuery.code == '') {
					uni.showToast({
						title: '请获取验证码！',
						duration: 2000,
						icon: 'none'
					});
				} else {
					uni.showLoading({
						title: '正在注册...',
						duration: 2000,
					})
					NET.request(API.Login, {
						type: 1,
						phone: this.phone,
						verificationCode: this.RegisterQuery.code,
					}, 'POST').then(res => {
						console.log(res,'成功')
						uni.hideLoading()
            uni.showToast({
              title: '注册成功！',
              duration: 2000,
              icon: 'none'
            });
						setTimeout(()=>{
							uni.navigateBack()
						},2000)
					}).catch(res => {
						console.log(res,'报错')
						uni.showToast({
							title: res.message,
							duration: 2000,
							icon: 'none',
						});
					})
				}
			},
			// 获取验证码
			getVerify() {
				let phoneCodeVerification = /^[1][3-9][0-9]{9}$/;
				if (this.phone == '') {
					uni.showToast({
						title: '请输入手机号！',
						duration: 2000,
						icon: 'none'
					});
				} else if (!phoneCodeVerification.test(this.phone)) {
					uni.showToast({
						title: '请输入正确的手机号！',
						duration: 2000,
						icon: 'none'
					});
				} else {
					this.VerifyQuery.phone = this.phone
					NET.request(API.Verify, {
						phone: this.VerifyQuery.phone,
					}, 'GET').then(res => {
						this.sendCode()
					}).catch(res => {
						uni.showToast({
							title: res.data.message,
							duration: 2000,
							icon: 'none',
							duration: 1000
						});
					})
				}

			},
			// 注册
			onregister() {
				this.getRegister()
			},
			// 获取验证码
			codede() {
				this.getVerify()
			},

			getCode() {
				uni.hideKeyboard()
				if (this.getCodeisWaiting) {
					return;
				}
				if (this.phone == "" || this.phone == null) {
					uni.showToast({
						title: '手机号不能为空',
						icon: 'none'
					})
					return false;
				} else if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phone))) {
					uni.showToast({
						title: '输入的手机号错误',
						icon: 'none'
					})
					return false;
				}
				this.getCodeisWaiting = true;

			},
			// 跳转登录
			gologin() {
				uni.navigateTo({
					url: 'login'
				})
			},
			// 多商户用户协议
			protocol() {
				uni.navigateTo({
					url: 'protocol'
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.container {
		background-color: #FFFFFF;
		height: 100vh;
		.login-logoBox {
			
			margin-top: -200upx;
			padding-bottom: 30rpx;
			.login-logo {
				
				width: 250rpx;
				height: 250rpx;
			}
		}

		.iphoneNum-box {
			border: 1upx solid #DDDDDD;
			height: 88upx;
			width: 600upx;
			border-radius: 44upx;
			input{
				font-size: 28upx;
			}
			.iphoneNum-input {
				color: #999999;
				font-size: 28upx;
				font-weight: 400;
			}

			.iphoneNum-inputbox {
				width: 400upx;
			}
		}

		.code-box {
			border: 1upx solid #DDDDDD;
			height: 88upx;
			width: 360upx;
			border-radius: 44upx;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			padding: 0upx 20upx 0upx;
			input{
				font-size: 28upx;
			}
			.code-lab {
				width: 200upx;
			}

			.codeNum-input {
				color: #999999;
				font-size: 28upx;
				font-weight: 400;
				width: 200upx;
			}

			.codeNum-inputbox {
				width: 200upx;
			}
		}

		.getcode {
			background-color:rgba(0, 206, 82, 1.0) ;
			height: 88upx;
			width: 220upx;
			border-radius: 44upx;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			margin-left: 20upx;
			color: #FFFFFF;
		}

		.getcodeActive {
			background-color: #DDDDDD;
			height: 88upx;
			width: 220upx;
			border-radius: 44upx;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			margin-left: 20upx;
			color: #333333;
		}

		.registerBut {
			background-image: linear-gradient(135deg, rgba(0, 206, 82, 1.0) 10%, rgba(0, 170, 73, 1) 100%);
			color: #FFFFFF;
			height: 88upx;
			width: 600upx;
			text-align: center;
			line-height: 88upx;
			border-radius: 88upx;
			margin-top: 17upx;
		}
	}
</style>
