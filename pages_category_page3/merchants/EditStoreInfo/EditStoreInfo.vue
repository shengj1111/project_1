<template>
	<view class="container">
		<view class="wrap">
			<view class="editInfo ">
				<view class="item itemupload">
					<view class="name">Logo</view>
					<view class="right">
						<u-upload ref="uUpload" :action="uploadurl" :header="uploadHead" :file-list="logolist"
							:auto-upload="true" :show-progress="false" :max-count="1" :width="160" :height="160"></u-upload>
					</view>
				</view>

				<view class="item">
					<view class="name">门店名称</view>
					<view class="right">
						<u-input class="serName" v-model="shopName" :clearable="false" placeholder="请输入门店名称" />
						<!-- <u-input type="text" placeholder="正品茂"/> -->
					</view>
				</view>
				<view class="item">
					<view class="name">店铺账号</view>
					<view class="right">
						<u-input class="serName" v-model="shopPhone" :clearable="false" placeholder="请输入店铺账号" />
					</view>
				</view>
				<view class="item">
					<view class="name">负责人</view>
					<view class="right">
						<u-input class="serName" v-model="chargePersonName" :clearable="false"
							placeholder="请输入负责人姓名" />
					</view>
				</view>
				<view class="item">
					<view class="name">负责人电话</view>
					<view class="right">
						<u-input class="serName" v-model="chargePersonPhone" :clearable="false"
							placeholder="请输入负责人电话" />
					</view>
				</view>
			</view>
		</view>

		<view class="bottom-btn-block">
			<view class="btn1" @click="doupdate">修改</view>
		</view>
	</view>
</template>

<script>
	import {
		getById,
		editShop
	} from '../../../api/shopmanage.js'
	import {
		getBaseUrl,
		getToken
	} from '../../../utils/shoprequest.js'
	import {
		area
	} from './area.js'
	import citySelect from './u-city-select.vue';
	export default {
		components: {
			citySelect
		},
		data() {
			return {
				shopId: 0,
				shopName: '', //门店名称
				shopAdress: "", //经营范围
				shopLogo: "",
				shopPhone: '', //用来登录的手机号
				uploadurl: "",
				logolist: [],
				popupShow: false,
				selectShow: false,
				form: {},
				cityItemHave: true,
				typeShow: false,
				chargePersonName:'',//负责人
				chargePersonPhone:'',//负责人电话
			};
		},

		onLoad(option) {
			this.uploadurl = getBaseUrl() + "/file/upload";
			this.uploadHead = {
				"authorization-business": getToken()
			}
			this.shopGetById()
		},
		methods: {
			plus() {
				this.cityItemHave = true
				this.DetailedAddress = ''
				this.ssqText = ''
				this.popupShow = true
			},
			cityChange(e) {
				this.cityItemHave = false
				this.ssqText = e.province.label + e.city.label + e.area.label
			},
			confrimBtn() {
				this.popupShow = false
				let address = this.ssqText + this.DetailedAddress
				this.city.push({
					ssqText: this.ssqText,
					DetailedAddress: this.DetailedAddress
				})
			},
			minus(index) {
				this.city.splice(index, 1)
			},
			//请求基本信息
			shopGetById() {
				const _this = this;
				let _shopid = _this.shopId;
				getById(_shopid).then(res => {
					let _d = res.data
					if (_d.shopLogo && _d.shopLogo != "") {
						_this.logolist = [{
							url: _d.shopLogo
						}];
					}

					_this.shopName = _d.shopName;
					_this.shopLogo = _d.shopLogo;
					_this.shopAdress = _d.shopAdress;
					
					_this.chargePersonName = _d.chargePersonName;
					_this.chargePersonPhone = _d.chargePersonPhone;
					
					_this.shopPhone = _d.shopPhone;
					
				

				})
			},
			//修改按钮
			doupdate() {
				const _this = this;
				let files = [];
				// 通过filter，筛选出上传进度为100的文件(因为某些上传失败的文件，进度值不为100，这个是可选的操作)
				files = this.$refs.uUpload.lists.filter(val => {
					return val.progress == 100;
				})
				// 如果您不需要进行太多的处理，直接如下即可
				// files = this.$refs.uUpload.lists;
				console.log(files, 8888)
				if (files && files.length && files.length > 0) {
					if (files[0].response) {
						this.shopLogo = files[0].response.data.url;
					}
				}

				let _data = {
					"shopAdress": _this.shopAdress,
					"shopId": _this.shopId,
					"shopLogo": _this.shopLogo,
					"shopName": _this.shopName,
					"shopPhone": _this.shopPhone,
					"chargePersonName":  _this.chargePersonName,
					"chargePersonPhone":  _this.chargePersonPhone,
				}
				uni.showLoading({
					title: "请求中..."
				})
				editShop(_data).then(res => {
					uni.hideLoading();
					uni.showToast({
						title: "修改成功"
					})
					uni.navigateBack()
				},rej=>{
					uni.hideLoading();
				uni.showToast({
				    title: rej.message,
				    duration: 2000,
						icon:'none'
						
				});
					console.log(rej,999)
				})
			}

		},
	}
</script>
<style lang="scss">
	page {
		background-color: #fff;
	}

	.container {
		width: 750rpx;
		background: #fff;
	}

	.wrap {
		margin: 0 auto;
		width: 700rpx;
	}

	.name {
		border-radius: 25rpx;
		height: 50rpx;
		line-height: 50rpx;
		color: #333;
		text-align: center;
	}

	.editInfo {
		margin-top: 40rpx;



		.item {
			// border-top: 2rpx solid #c8c8c8;
			// border-bottom: 2rpx solid #c8c8c8;
			border-bottom: 1px solid #eee;
			display: flex;
			justify-content: space-between;
			align-items: center;
			line-height: 100rpx;
			height: 100rpx;



			.right {
				width: 500rpx;
				display: flex;
				justify-content: flex-end;
				align-items: center;

				input {
					text-align: right;
					width: 100%;
					color: #333333;
					font-weight: 600;
					font-size: 28rpx;
				}


			}
		}

		.itemupload {
			height: auto;
			line-height: 160rpx;


			image {
				width: 150rpx;
				height: 150rpx;
			}
		}


		.city-box {
			margin-top: 20rpx;
			// border-bottom: 2rpx solid #c8c8c8;
			display: flex;
			flex-direction: column;
			line-height: 100rpx;

			.title {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.topRight {
					display: flex;
					justify-content: flex-end;
					align-items: center;

					.plus {
						margin-right: 30rpx;
						color: #FFF;
						text-align: center;
						padding-left: 10rpx;
						width: 40rpx;
						height: 50rpx;
						border-radius: 10rpx;
						background-color: $mainColor;
					}
				}
			}

			.address-box {
				margin-left: 30rpx;

				.address-item {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.text {
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
						word-break: break-all;
						width: 500rpx;
					}
				}

				.plus {
					margin-right: 30rpx;
					color: #FFF;
					text-align: center;
					padding-left: 10rpx;
					width: 40rpx;
					height: 50rpx;
					border-radius: 10rpx;
					background-color: $mainColor;
				}
			}
		}
	}

	.u-popup {
		.confrim-btn {
			width: 700rpx;
			margin: 0;
			position: fixed;
			bottom: 10rpx;
			margin-left: 25rpx;

			.u-btn--default {
				color: #FFF;
				background-color: $mainColor;
			}
		}

		.form {
			margin: 20rpx 0;

			.item {
				width: 700rpx;
				margin: 0 auto;
				display: flex;
				justify-content: flex-start;
				align-items: center;

				.city-text {
					white-space: nowrap;
				}

				.cityItem {
					margin: 20rpx;
					flex: 1;
				}

				.input {
					flex: 1;
					margin: 20rpx;



					view {
						display: flex;
						justify-content: space-between;
						align-items: center;
					}
				}
			}
		}
	}

	.save {
		width: 700rpx;
		margin: 0;
		position: fixed;
		bottom: 10rpx;
		// font-weight: bold;
		color: #FFF;
		font-size: 32rpx;
		border-radius: 20rpx;
		background-color: $mainColor;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
	}
</style>
