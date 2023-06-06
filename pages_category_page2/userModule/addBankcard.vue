<template>
	<view class="container flex-center flex-column">
		<view class="addressBack-box">
			<view class="consignee-box bor-line-F7F7F7">
				<input v-model="username" class="fs28" placeholder-class="consignee" placeholder="姓名" />
			</view>
			<view class="iphoneNum-box bor-line-F7F7F7">
				<input type="number" v-model="phone" class="fs28" placeholder-class="iphoneNum" placeholder="手机号码" />
			</view>
			<view class="consignee-box bor-line-F7F7F7">
				<input v-model="bankName" class="fs28" placeholder-class="consignee" placeholder="银行名称" />
			</view>
			<view class="cardnum">
				<input type="number" class="fs28" v-model="cardNum" placeholder-class="detailAddress" placeholder="卡号" />
			</view>
		</view>
		<view class="deleteBankcard-box" v-if="type == 2">
			<label class="font-color-FF7800" @click="delBankcard">删除银行卡</label>
		</view>
		<view class="saveAddress-box">
			<view class="saveAddress" v-if="type == 1" @click="saveBankcardClick">添加银行卡</view>
			<view class="saveAddress" v-else @click="saveBankcardClick">保存</view>
		</view>

	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	export default {
		data() {
			return {
				show: false,
				type: 1, // 1.添加银行卡 2.编辑银行卡
				cardNum: '',
				bankCode: '',
				bankName: '',
				bankTagList: [],
				username: '',
				phone: '',
				id: '',
        withdraw: '',
				choosedValueList: [0]
			}
		},
		onLoad(options) {
		  if (options.type) {
        this.type = options.type
      }
		  if (options.withdraw) {
		    this.withdraw = options.withdraw
      }
			this.initBankList()
			if (this.type == 2) {
				this.bankcardId = uni.getStorageSync('bankcardId')
				this.renderBankcard(this.bankcardId)
				uni.removeStorageSync('bankcardId')
			}
		  console.log(this.type, 'type')
		},
		onShow() {

		},
		methods: {
			renderBankcard(bankcardId) {
				const _ = this
				NET.request(API.GetByIdBankcard ,{bankId:bankcardId},"GET").then(res => {
					const bankCard = res.data
					_.id = bankcardId
					_.username = bankCard.name
					_.phone = bankCard.phone
					_.bankName = bankCard.bankName
					_.bankCode = bankCard.bankCode
					_.cardNum = bankCard.bankCard
					_.bankTagList.forEach((item, index) => {
						if (_.bankCode == item.value) {
							_.choosedValueList = [index]
							return
						}
					})
				}).catch(res => {

				})
			},
			initBankList() {
				const _ = this
				NET.request(API.QueryBankList).then(res => {
					_.bankTagList = res.data.map((item) => {
						return {
							'value': item.bankCode,
							'label': item.bankName
						}
					})
				}).catch(res => {

				})
			},
			//新增或更新银行卡
			saveBankcardClick() {
				const _ = this
				this.bankTagList.forEach((item, index) => {
					if (item.label == _.bankName) {
						_.bankCode = item.value
					}
				})
				let phoneCodeVerification = /^[1][3-9][0-9]{9}$/;
				const method = this.type == 1 ? 'POST' : 'PUT';
				console.log(this.cardNum.length,333)
				if (this.username == '') {
					uni.showToast({
						title: '请输入姓名！',
						duration: 2000,
						icon: 'none'
					});
				} else if (this.phone == '') {
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
				} else if (this.bankName == '') {
					uni.showToast({
						title: '请填写银行名称！',
						duration: 2000,
						icon: 'none'
					});
				}else if (this.cardNum == '') {
					uni.showToast({
						title: '请输入卡号！',
						duration: 2000,
						icon: 'none'
					});
				}else if (this.cardNum.length != 16 && this.cardNum.length != 19 ) {
					uni.showToast({
						title: '请输入正确的卡号！',
						duration: 2000,
						icon: 'none'
					});
				}else {
					if(this.type == 1){
						NET.request(API.SaveBankcard, {
							name: this.username,
							phone: this.phone,
							bankName: this.bankName,
							bankCard: this.cardNum
						}, 'POST').then(res => {
							if (res.code === "200") {
								uni.showToast({
									title: '添加成功',
									duration: 2000,
									icon: 'none'
								});
								if (this.withdraw == 1) {
                  setTimeout(function(){
                    uni.navigateTo({
                      url: 'withdraw'
                    })
                  },2000)
                } else {
                  setTimeout(function(){
                    uni.navigateTo({
                      url: 'bankcard'
                    })
                  },2000)
                }
							} else {
								uni.showToast({
									title: res.data.message,
									duration: 2000,
									icon: 'none'
								});
							}
						}).catch(res => {
							uni.showToast({
								title: res.data.message,
								duration: 2000,
								icon: 'none'
							});
						})
					}else{
						NET.request(API.UpdateBankcard, {
							bankId:this.id,
							name: this.username,
							phone: this.phone,
							bankName: this.bankName,
							bankCard: this.cardNum
						}, 'POST').then(res => {
							if (res.code === "200") {
								uni.navigateTo({
									url: 'bankcard'
								})
							} else {
								uni.showToast({
									title: res.msg,
									duration: 2000,
									icon: 'none'
								});
							}
						}).catch(res => {
							uni.showToast({
								title: '操作失败',
								duration: 2000,
								icon: 'none'
							});
						})
					}

				}
			},
			//删除银行卡
			delBankcard() {
				uni.showModal({
					title: '温馨提示',
					content: '确认删除该银行卡？',
					confirmText: '确定',
					cancelText: '取消',
					success: (res) => {
						if (res.confirm) {
							this.subm()
						} else if (res.cancel) {

						}
					}
				})
			},
			subm() {
				NET.request(API.DelMemberBankcard, {
					bankId: this.bankcardId
				}, 'POST').then(res => {
					uni.navigateTo({
						url: 'bankcard'
					})
				}).catch(res => {

				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F7F7F7;
	}

	.container {
		.addressBack-box {
			background-color: #FFFFFF;
			padding: 30upx 30upx;

			.consignee-box {
				padding-bottom: 36upx;
				width: 690upx;
				margin-top: 20upx;

				.consignee {
					color: #999999;
					font-size: 28upx;
				}
			}

			.iphoneNum-box {
				padding-bottom: 36upx;
				width: 690upx;
				margin-top: 36upx;

				.iphoneNum {
					color: #999999;
					font-size: 28upx;
				}
			}

			.location-box {
				padding-bottom: 36upx;
				width: 690upx;
				margin-top: 36upx;

				.location {
					color: #999999;
					font-size: 28upx;
				}
			}

			.bankTag-box {
				margin-top: 19px;
				padding-bottom: 19px;

				.addressTag {
					color: #999999
				}
			}

			.cardnum {
				margin-top: 19px;
			}

			.detailAddress-box {
				padding-bottom: 36upx;
				width: 690upx;
				margin-top: 36upx;

				.detailAddress {
					color: #999999;
					font-size: 28upx;
				}
			}
		}

		.addressTagBack-box {
			background-color: #FFFFFF;
			padding: 30upx 30upx;
			margin-top: 20upx;

			.addressTag-box {
				padding-bottom: 36upx;
				width: 690upx;

				.addressTag {
					color: #999999;
					font-size: 28upx;
				}
			}

			.defaultState-box {
				padding-bottom: 10upx;
				width: 690upx;
				margin-top: 36upx;

				.defaultState {
					color: #999999;
					font-size: 28upx;
				}
			}
		}

		.arrow {
			width: 24upx;
			height: 24upx;
		}

		.saveAddress-box {
			position: fixed;
			bottom: 50upx;
			left: 30upx;

			.saveAddress {
				width: 690upx;
				height: 80upx;
				color: #FFFFFF;
				border-radius: 40upx;
				text-align: center;
				line-height: 80upx;
				background-image: linear-gradient(135deg, #00AA49 10%, #00AA49 100%);
			}
		}
	}

	.deleteBankcard-box {
		background-color: #FFFFFF;
		padding: 30upx 30upx;
		margin-top: 20upx;
		text-align: center;
	}

	.content {
		font-size: 35rpx;
		width: 500rpx;

		.btn {
			margin-bottom: 20rpx;
			width: 200rpx;
			background-image: linear-gradient(135deg, #FFA100 10%, #FF7911 100%);
		}
	}
</style>
