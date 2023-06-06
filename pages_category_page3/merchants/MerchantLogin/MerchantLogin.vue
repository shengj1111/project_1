<template>
	<!-- 登录 -->
	<view class="container flex-items-plus flex-column">
		<view class="login-logoBox">

			<image class="login-logo" :src="src"></image>
			<!-- <image class="login-logo" src="../../static/img/log.png"></image> -->
		</view>
		<view class="iphoneNum-box flex-row-plus flex-items">
			<view style=" margin-left:20upx;white-space: nowrap;">
				手机号
			</view>
			<view style="margin-left: 60rpx;">
				<input v-model="loginQuery.account" placeholder-class="iphoneNum-input" type="number" @blur="myyanzheng"
					placeholder="请输入您的手机号" />
			</view>
		</view>
		<view class="iphoneNum-box flex-row-plus flex-items">
			<view style=" margin-left:20upx;white-space: nowrap;">
				密码
			</view>
			<view style="margin-left: 60rpx;">
				<input v-model="loginQuery.password" placeholder-class="iphoneNum-input" type="password"
					placeholder="请输入您的密码" />
			</view>
		</view>

		<view class="iphoneNum-box flex-row-plus flex-items" v-if="isCode">
			<view style=" margin-left:20upx;white-space: nowrap;">
				验证码
			</view>
			<view class="yanzheng">
				<input v-model="loginQuery.code" placeholder-class="iphoneNum-input" placeholder="请输入验证码"
					style="width: 270rpx;" />
				<u-button slot="right" type="success" size="mini" @click="getCode">{{codeTips}}</u-button>
			</view>
		</view>
		<u-verification-code seconds="60" ref="uCode" @change="codeChange"></u-verification-code>
		<view class="mar-top-20" style="width: 560rpx;">
			<text style="margin-left: 420rpx;" @click="wangji">忘记密码</text>
		</view>
		<view class="mar-top-60" @click="login1()">
			<view class="registerBut mar-top-100">登录</view>
		</view>
	</view>
</template>

<script>
	import sendVerifyCode from "@/mixins/SendVerifyCode";
	import {
		login,
		getSmsCode, //获取短信验证码
	} from '@/api/shopmanage.js'
	export default {
		data() {
			return {
				src: 'https://oos.zhengpinmao.cn/lQLPDhrf05I8gJPNAgDNAgCw0pBcTxBrFHwBm_XGhEBkAA_512_512.png_720x720q90g.jpg',
				loginQuery: {
					account: '', //手机号
					code: '', //短信验证码
					password: '', //密码
				},
				// inviteSpell: {},
				// inviteSpelltype: false,
				// beforePage: undefined,
				// doubleBeforePage: undefined,
				codeTips: '获取验证码',
				isCode: true, //true 是显示
			}
		},
		mixins: [sendVerifyCode],
		onShow() {
			let account = uni.getStorageSync("account")
			let password = uni.getStorageSync("password")
			if (account !== '' & password !== '') {
				this.loginQuery.account = account
				this.loginQuery.password = password
				this.isCode = false
			} else {
				this.isCode = true
			}

		},
		methods: {
			// 验证他输入框的手机号跟缓存的是不是一样的
			myyanzheng(){
				if(!this.isCode){
					let account = uni.getStorageSync("account")
					if (this.loginQuery.account != account) {
						uni.showToast({
							title: '验证信息以失效,请重新登录',
							duration: 2000,
							icon: 'none'
						});
						this.loginQuery.account = ''
						this.loginQuery.password = ''
						this.isCode = true
						return;
					}
				}
			
			},
	
			//忘记密码
			wangji() {
				uni.navigateTo({
					url: `/pages_category_page2/userModule/wangjimima`
				})
			},
			codeChange(text) {
				this.codeTips = text;
			},
			// 获取验证码
			getCode() {
				if (this.$refs.uCode.canGetCode) {
					let _phone = this.loginQuery.account;
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
				if (this.loginQuery.account == '') {
					uni.showToast({
						title: '请输入手机号！',
						duration: 2000,
						icon: 'none'
					});
					return;
				}
				let phoneCodeVerification = /^[1][3-9][0-9]{9}$/;
				if (!phoneCodeVerification.test(this.loginQuery.account)) {
					uni.showToast({
						title: '请输入正确的手机号！',
						duration: 2000,
						icon: 'none'
					});
					return;
				}
	
				const _this = this
				let obj = {
					"username": _this.loginQuery.account,
					"password": _this.loginQuery.password,
					"rememberMe": false,

				}
				if (this.isCode) {
					if (this.loginQuery.code == '') {
						uni.showToast({
							title: '验证码不能为空!',
							duration: 2000,
							icon: 'none'
						});
						return;
					} else {
						obj.code = _this.loginQuery.code
					}
				}



				login(obj).then((res) => {
					let _code = res.code;
					if (_code != undefined && _code == "") {
						//登录成功
						let _token = res.data.token;

						let _shopid = res.data.shopId;
						//token放到storage
						uni.setStorageSync("authorization-business", _token)
						//shopid放到storage
						uni.setStorageSync("liaotianshopid", res.data.shopId)
						//将用户名放到 storage
						uni.setStorageSync("account", _this.loginQuery.account)
						//将密码放到你 storage
						uni.setStorageSync("password", _this.loginQuery.password)
						//跳转到上商家管理主页
						uni.navigateTo({
							url: "../merchants?shopid=" + _shopid
						})
					}
				}, (res2) => {

				})
			},

		}
	}
</script>

<style lang="scss">
	.yanzheng {
		margin-left: 30rpx;
		display: flex;
		justify-content: flex-start;
	}

	.container {
		background-color: #FFFFFF;
		height: 100vh;

		.login-logoBox {
			margin-top: -300upx;

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
