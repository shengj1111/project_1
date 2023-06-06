<template>
	<!-- 忘记密码 -->
	<view class="container flex-items-plus flex-column">
		<view class="login-logoBox">
			<image class="login-logo" :src="src"></image>
		</view>
		<view class="iphoneNum-box flex-row-plus flex-items">
			<view style=" margin-left:20upx;white-space: nowrap;">
				手机号
			</view>
			<view style="margin-left: 60rpx;">
				<input v-model="loginQuery.username" placeholder-class="iphoneNum-input" type="number"
					placeholder="请输入您的手机号" />
			</view>
		</view>
		<view class="iphoneNum-box flex-row-plus flex-items">
			<view style=" margin-left:20upx;white-space: nowrap;">
				新密码
			</view>
			<view style="margin-left: 60rpx;">
				<input v-model="loginQuery.newPassword" placeholder-class="iphoneNum-input" type="password"
					placeholder="请输入您的新密码" />
			</view>
		</view>
		<view class="iphoneNum-box flex-row-plus flex-items">
			<view style=" margin-left:20upx;white-space: nowrap;">
				确认新密码
			</view>
			<view style="margin-left: 60rpx;">
				<input v-model="queren" placeholder-class="iphoneNum-input" type="password"
					placeholder="请确认您的新密码" />
			</view>
		</view>
		<view class="iphoneNum-box flex-row-plus flex-items">
			<view style=" margin-left:20upx;white-space: nowrap;">
				验证码
			</view>
			<view class="yanzheng">
				<input v-model="loginQuery.code" placeholder-class="iphoneNum-input" placeholder="请输入验证码" style="width: 270rpx;"/>
				<u-button slot="right" type="success" size="mini" @click="getCode">{{codeTips}}</u-button>
			</view>
		</view>
		<u-verification-code seconds="60" ref="uCode" @change="codeChange"></u-verification-code>
		<view class="mar-top-60" @click="login1">
			<view class="registerBut mar-top-100">确认修改</view>
		</view>
	</view>
</template>

<script>
	import sendVerifyCode from "@/mixins/SendVerifyCode";
	import {
		getSmsCode,//获取短信验证码
		forgetPassword,//忘记密码
	} from '@/api/shopmanage.js'
	export default {
		data() {
			return {
				src: 'https://oos.zhengpinmao.cn/lQLPDhrf05I8gJPNAgDNAgCw0pBcTxBrFHwBm_XGhEBkAA_512_512.png_720x720q90g.jpg',
				loginQuery: {
					username: '', //手机号
					code: '', //短信验证码
					newPassword: '', //新密码
				},
				queren:'',//确认新密码
				codeTips: '获取验证码',
			}
		},
		mixins: [sendVerifyCode],
		methods: {
			codeChange(text) {
				this.codeTips = text;
			},
			// 获取验证码
			getCode() {
				if (this.loginQuery.newPassword != this.queren) {
					uni.showToast({
						title: '两次输入的密码不一致',
						duration: 2000,
						icon: 'none'
					});
					return;
				}
				if (this.$refs.uCode.canGetCode) {
					let _phone = this.loginQuery.username;
					let phoneCodeVerification = /^[1][3-9][0-9]{9}$/;
					if (_phone == '') {
						uni.showToast({
							title: '请输入手机号！',
							duration: 2000,
							icon: 'none'
						});
					} else if (!phoneCodeVerification.test(_phone)) {
						uni.showToast({
							title: '请输入正确的手机号！',
							duration: 2000,
							icon: 'none'
						});
					} else {
						getSmsCode(_phone).then(res => {
							// 通知验证码组件内部开始倒计时
							this.$refs.uCode.start();
						})
					}
				} else {
					this.$u.toast('倒计时结束后再发送');
				}
			},
			login1() {
				if (this.loginQuery.username == '') {
					uni.showToast({
						title: '请输入手机号！',
						duration: 2000,
						icon: 'none'
					});
					return;
				}
				let phoneCodeVerification = /^[1][3-9][0-9]{9}$/;
				if (!phoneCodeVerification.test(this.loginQuery.username)) {
					uni.showToast({
						title: '请输入正确的手机号！',
						duration: 2000,
						icon: 'none'
					});
					return;
				}
				if (this.loginQuery.newPassword != this.queren) {
					uni.showToast({
						title: '两次输入的密码不一致',
						duration: 2000,
						icon: 'none'
					});
					return;
				}
				forgetPassword(this.loginQuery).then((res) => {
			
					uni.removeStorageSync("account")
					uni.removeStorageSync("password")
		
					uni.showToast({
						title: '修改成功',
						duration: 1500,
						icon: 'none'
					});
					setTimeout(()=>{
						uni.navigateBack()
					},1500)
				}).catch(rej=>{
					uni.showToast({
						title: rej.message,
						duration: 1500,
						icon: 'none'
					});
				})
			},

		}
	}
</script>

<style lang="scss">
	.yanzheng{
		margin-left: 30rpx;
		display: flex;
		justify-content: flex-start;
	}
	.container {
		background-color: #FFFFFF;
		height: 100vh;

		.login-logoBox {
			// margin-top: -300upx;

			.login-logo {
				width: 234upx;
				height: 234upx;
				border-radius: 50%;
			}
		}

		.iphoneNum-box {
			margin-top: 40upx;
			border: 1upx solid #DDDDDD;
			height: 88upx;
			width: 600upx;
			border-radius: 44upx;

			.iphoneNum-input {
				color: #999999;
				font-size: 28upx;
				font-weight: 400;
			}
		}

		.passwordNum-box {
			border: 1upx solid #DDDDDD;
			height: 88upx;
			width: 600upx;
			border-radius: 44upx;

			.passwordNum-input {
				color: #999999;
				font-size: 28upx;
				font-weight: 400;
				width: 346upx;
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

		.getcode {
			background-color: #FF7800;
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

		.registerBut {
			background-image: linear-gradient(135deg, #269308 10%, #018A45 100%);
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
