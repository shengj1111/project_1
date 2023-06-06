<template>
	<view class="page">
		<tabcenter :current="currents"/>
		<view class="page-padding" style="padding-bottom: 120rpx;">
			<u-form :model="apply" ref='uForm'>
				<u-form-item label-width="150" label="门店名称" prop="shopName" :required="true"
					:label-position="labelPosition">
					<u-input v-model="apply.shopName" placeholder="请输入门店名称" />
				</u-form-item>
				<u-form-item label-width="150" label="门店负责人" prop="chargePersonName" :required="true"
					:label-position="labelPosition">
					<u-input v-model="apply.chargePersonName" placeholder="请输入门店负责人" />
				</u-form-item>
				<u-form-item label-width="150" label="登录手机号" prop="shopPhone" :label-position="labelPosition"
					:required="true">
					<u-input v-model="apply.shopPhone" placeholder="请输入登录手机号" />
				</u-form-item>



				<u-form-item label-width="150" label="登录密码" prop="shopPassword" :label-position="labelPosition"
					:required="true">
					<u-input v-model="apply.shopPassword" placeholder="请输入登录密码" type="password" />
				</u-form-item>

				<u-form-item label-width="150" label="确认密码" :label-position="labelPosition" :required="true">
					<u-input v-model="querenShopPassword" placeholder="请确认登录密码" type="password" />
				</u-form-item>



				<u-form-item label-width="180" label="负责人手机号" :label-position="labelPosition">
					<u-input v-model="apply.chargePersonPhone" placeholder="请输入门店负责人手机号" />
				</u-form-item>

				<!-- 门店地址选择器 -->
				<view class="container-dz flex-center flex-column">
					<view class="addressBack-box">
						<view @click="locationClick"
							class="location-box bor-line-F7F7F7 flex-row-plus flex-sp-between flex-items">
							<view class=" location"><text style="color: red;margin:0rpx 2rpx 0rpx -15rpx;">*</text>门店地址
							</view>
							<view>
								<city-select v-model="locationShowFalg" @city-change="cityChange"></city-select>
								<text v-model="apply.shopAdress">{{apply.shopAdress}}</text>
								<image class="arrow mar-left-20" src="../../static/img/user/arrow.png"></image>
							</view>
						</view>
					</view>
				</view>

				<u-form-item label-width="230" label="请填写详细地址" :label-position="labelPosition">
					<u-input v-model="address" placeholder="详细地址：如道路、门牌号、小区、楼栋号、单元等" type="textarea" />
				</u-form-item>
				<u-form-item :border-bottom='false'>
					<view>请上传身份证正面(人脸)</view>
					<u-upload :action="action" ref="uUploadsfzz"
						:limitType="['png', 'jpg', 'jpeg', 'webp', 'gif', 'image']" :header="headerToken" :max-count='1'
						:form-data="formData"></u-upload>
				</u-form-item>
				<u-form-item :border-bottom='false'>
					<view>请上传身份证反面(国徽)</view>
					<u-upload :action="action" ref="uUploadsfzf"
						:limitType="['png', 'jpg', 'jpeg', 'webp', 'gif', 'image']" :header="headerToken" :max-count='1'
						:form-data="formData"></u-upload>
				</u-form-item>
				<u-form-item :border-bottom='false'>
					<view>请上传营业执照</view>
					<u-upload :action="action" ref="uUploadyyzz"
						:limitType="['png', 'jpg', 'jpeg', 'webp', 'gif', 'image']" :max-count='1' :header="headerToken"
						:form-data="formData"></u-upload>
				</u-form-item>

				<u-form-item :border-bottom='false'>
					<view class="mystyle">
						<u-checkbox-group @change="checkboxGroupChange">
							<u-checkbox @change="checkboxChange" v-model="item.checked" v-for="(item, index) in list"
								:key="index" :name="item.name">
							</u-checkbox>
						</u-checkbox-group>
						<view style="font-size: 24rpx;">
							我已仔细阅读并同意<text style="color: rgb(255,125,0);" @click.stor="shangjiaruzhu">《商家入驻协议》</text>
							<!-- <text style="color: rgb(255,125,0);" @click.stor="falvshengming"> , 《法律声明》</text> -->
							<text style="color: rgb(255,125,0);" @click.stor="article"> , 《隐私条款》</text>
							
						</view>
					</view>
				</u-form-item>
			</u-form>
		</view>
		<view class="bottom-btn-block" style="padding-bottom: 20rpx;">
			<button type="primary" @click="submitApply" :disabled="!isTijiao">提交申请</button>
		</view>

	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	import citySelect from './u-city-select.vue';
    import tabcenter from "../../pages/tabcenter/index.vue"
	export default {
		components: {
			citySelect,tabcenter
		},
		data() {
			return {
				currents:1,
				list: [{
					name: 'apple',
					checked: false,
					disabled: false
				}],
				url: '',
				type: 'text',
				border: false,
				apply: {
					shopName: '', //门店名称
					chargePersonName: '', // 门店负责人
					chargePersonPhone: '', //门店负责人手机号
					shopPhone: '', //登录手机号
					shopAdress: '', //地址
					servicePhone: '', //客服电话
					isPublice: 1, //是否公开个人信息
					shopPassword: '', //密码
				}, // 申请信息
				querenShopPassword: '', //确认密码
				locationShowFalg: false, //是否弹窗,地址选择
				address: '', //详细地址
				province: '',
				city: '',
				area: '',
				rules: {
					shopPassword: [{
						required: true,
						message: '请填写密码',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					shopName: [{
						required: true,
						message: '请填写门店名称',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					chargePersonName: [{
						required: true,
						message: '请填写门店负责人名字',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					shopPhone: [{
						required: true,
						message: '请填写登录手机号',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
				},
				fileListsfzz: [], //省份证正面地址列表
				fileListsfzf: [], //省份证反面地址列表
				fileListyyzz: [], //营业执照图片地址列表
				action: API.UploadUrl, //上传地址
				headerToken: {
					Authorization: ''
				},
				formData: {
					'folderId': -1
				},
				isTijiao: false,
			}
		},
		onLoad() {
			console.log("onloadonload1");
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		onUnload() {
			// if(this.flagcurrent==1){
				// uni.redirectTo({
				// 	url:"/pages/applyVip/applyVip"
				// })
				// console.log("页面关闭1");
			// }
		},
		methods: {
		//跳转到文章
			article() {
				uni.navigateTo({
					url: '/pages_category_page3/xieyi/yinsixieyi'
				})
			},
			//跳转到合作协议
			shangjiaruzhu() {
				uni.navigateTo({
					url: '/pages_category_page3/xieyi/shangjiaruzhu'
				})
			},
			falvshengming() {
				uni.navigateTo({
					url: '/pages_category_page3/xieyi/falvshengming'
				})
			},
			// 选中某个复选框时，由checkbox时触发
			checkboxChange(e) {
				console.log(e, 1);
			},
			// 选中任一checkbox时，由checkbox-group触发
			checkboxGroupChange(e) {
				if (e.length == 1) {
					//this.apply.isPublice = 1
					this.isTijiao = true
					console.log(e, '已经选中,就是公开');
				} else {
					this.isTijiao = false
					//this.apply.isPublice = 0
					console.log(e, '未选中,不公开');
				}

			},
			cityChange(e) {
				this.apply.shopAdress = e.province.label + '-' + e.city.label + '-' + e.area.label;
				this.province = e.province.label
				this.city = e.city.label
				this.area = e.area.label
			},
			locationClick() {
				this.locationShowFalg = true
			},
			submitApply() {
				// if(this.apply.shopPassword != this.querenShopPassword){
				// 	return uni.showToast({
				// 		title: "两次输入的密码不一致!",
				// 		duration:2000,
				// 		icon: "none"
				// 	})
				// }
				this.$refs.uForm.validate(valid => {
					console.log(valid)
					if (valid) {

						let phoneCodeVerification = /^[1][3-9][0-9]{9}$/;
						if (!phoneCodeVerification.test(this.apply.shopPhone)) {
							uni.showToast({
								title: '请输入正确的手机号！',
								duration: 2000,
								icon: 'none'
							});
							return;
						}
						if (this.apply.shopAdress == '') {
							uni.showToast({
								title: '请选择门店地址',
								duration: 2000,
								icon: 'none'
							});
							return;
						}

						let newApply = {
							...this.apply
						}
						// let newApply = this.apply
						if (newApply.chargePersonPhone == '') {
							newApply.chargePersonPhone = newApply.shopPhone
						}
						newApply.servicePhone = newApply.shopPhone
						newApply.shopAdress += this.address

						let sfzzm = [];
						sfzzm = this.$refs.uUploadsfzz.lists.filter(val => {
							return val.progress == 100;
						})

						newApply.personalCardPositive = "";
						if (sfzzm && sfzzm.length && sfzzm.length > 0) {
							//上传了身份证正面照片
							newApply.personalCardPositive = sfzzm[0].response.data.url;
						}

						let sfzfm = [];
						sfzfm = this.$refs.uUploadsfzf.lists.filter(val => {
							return val.progress == 100;
						})

						newApply.personalCardSide = "";
						if (sfzfm && sfzfm.length && sfzfm.length > 0) {
							//上传了身份证正面照片
							newApply.personalCardSide = sfzfm[0].response.data.url;
						}

						let yyzz = [];
						yyzz = this.$refs.uUploadyyzz.lists.filter(val => {
							return val.progress == 100;
						})

						newApply.license = "";
						if (yyzz && yyzz.length && yyzz.length > 0) {
							//上传了身份证正面照片
							newApply.license = yyzz[0].response.data.url;
						}
						console.log(yyzz, newApply, 999229)




						uni.showLoading({
							title: "提交中...."
						})
						console.log(newApply, '提交前的表单')
						// if(this.newApply.shopPassword != this.querenShopPassword){
						// 	return uni.showToast({
						// 		title: "两次输入的密码不一致!",
						// 		duration:2000,
						// 		icon: "none"
						// 	})
						// }
						NET.request(API.personalCheck, newApply, 'POST').then(res => {
							//this.emptyApply()
							uni.hideLoading();
							uni.showToast({
								title: "提交成功,请耐心等待审核哦!",
								duration: 2000,
								icon: "none"
							})
							// this.emptyApply()
							setTimeout(() => {
								this.emptyApply()
								uni.navigateBack()
							}, 2000)
						})
					} else {
						uni.showToast({
							title: "请完善信息!",
							icon: "error"
						})
						this.apply.shopAdress = ''
					}
				})

			},
			//清空表单
			emptyApply() {
				this.apply.shopName = '' //门店名称
				this.apply.chargePersonName = '' // 门店负责人
				this.apply.chargePersonPhone = '' //门店负责人电话
				this.apply.shopPhone = '' //登录手机号
				this.apply.shopAdress = '' //地址
				this.apply.servicePhone = '' //客服电话
				this.address = '' //详细地址
			}
		}
	}
</script>

<style lang="scss" scoped>
	.mystyle {
		display: flex;
		align-items: center;
		height: 100rpx;
	}

	.xinghao::before {
		content: '*';
		color: red;
	}

	.container-dz {
		.addressBack-box {
			background-color: #FFFFFF;
			padding: 0upx 30upx 30upx 0upx;

			.location-box {
				padding-bottom: 36upx;
				width: 690upx;
				margin-top: 36upx;

				.location {
					color: black;
					font-size: 28upx;
				}
			}

			.detailAddress-box {
				padding-bottom: 36upx;
				width: 690upx;
				margin-top: 36upx;

				input {
					width: 100%;
				}

				.detailAddress {
					color: #999999;
					font-size: 28upx;
				}
			}
		}

		.arrow {
			width: 24upx;
			height: 24upx;
		}

	}

	.content {
		font-size: 35rpx;
		width: 500rpx;

		.btn {
			margin-bottom: 20rpx;
			width: 200rpx;
			background-color: #00AA49;
		}
	}

	.deadress {
		position: relative;
		top: 20rpx;
	}

	.container {

		width: 750rpx;
		height: 924rpx;
		// background: #F2F4F6;

		.form-group {
			margin-top: -30rpx;
		}

		.u-input__input.data-v-460c1d26 {
			position: relative;
			top: -11rpx;
		}

		.u-steps {
			margin-top: 111rpx;
		}

		.u-cell-group {
			wdith: 750rpx;
			height: 100rpx;
		}

		.u-btn--success.data-v-6e15e680 {
			background-color: #018A45;
			top: 300rpx;
		}

		.mertopBox {
			width: 750rpx;
			height: 368rpx;
			background: #FFFFFF;
		}

		.merName {
			width: 204rpx;
			height: 48rpx;
			font-size: 34rpx;
			font-weight: 500;
			color: #333333;
			line-height: 24rpx;
			margin-top: 60rpx;
			margin-left: 30rpx;
		}

		.merTips {
			width: 576rpx;
			height: 34rpx;
			font-size: 24rpx;
			font-weight: 400;
			color: #bcbcbc; //#333333
			line-height: 17rpx;
			margin: 16rpx 0 0 30rpx;
			position: relative;
		}

		.between {
			display: flex;
			justify-content: space-between;
		}

		.between-text {
			margin-top: 20rpx;
			width: 750rpx;
			display: flex;
			justify-content: space-around;
		}

		.merProcess {
			width: 460rpx;
			height: 50rpx;
			margin-left: 100rpx;
			margin-top: 60rpx;

			.number1 {
				content: "";
				width: 50rpx;
				height: 50rpx;
				background: #018A45;
				border-radius: 26rpx;
				text-align: center;
				z-index: 10;
				position: absolute;
			}



			.number1 .number1-text {
				width: 18rpx;
				height: 36rpx;
				font-size: 30rpx;
				font-weight: bold;
				line-height: 45rpx; //36rpx
				color: #FFFFFF;
				z-index: 8;
			}

			.line {
				display: block;
				width: 460rpx;
				height: 4rpx;
				background: #C0C4CD;
				border-radius: 6rpx;
				margin-top: 25rpx;
				z-index: 0;
				position: absolute;
				;
			}
		}

		.merInfo {
			display: block;
			width: 112rpx;
			height: 40rpx;
			font-size: 28rpx;
			font-weight: 400;
			color: #333333;
			line-height: 40rpx;
			position: absolute;
			margin-left: -35rpx;
		}

		.merInfo1 {
			display: block;
			width: 112rpx;
			height: 40rpx;
			font-size: 28rpx;
			font-weight: 400;
			color: #333333;
			line-height: 40rpx;
			position: absolute;
			margin-left: -10rpx;
		}

		.merInfo2 {
			display: block;
			width: 140prx;
			height: 40rpx;
			font-size: 28rpx;
			font-weight: 400;
			color: #686870;
			line-height: 40rpx;

		}

		.storeInfo {
			width: 750rpx;
			height: 102rpx;
			margin-top: 20rpx;
			background: #FFFFFF;
		}

		.icon {
			width: 6rpx;
			height: 30rpx;
			background: #018A45;
			border-radius: 2rpx;
			position: absolute;
			margin: 38rpx 0 0 26rpx;
		}

		.storeInfotext {
			width: 128rpx;
			height: 44rpx;
			font-size: 32rpx;
			font-weight: 500;
			color: #333333;
			line-height: 44px;
			position: relative;
			display: flex;
			align-items: center;
			position: absolute;
			margin: 30rpx 0 0 42rpx;
		}


	}
</style>
