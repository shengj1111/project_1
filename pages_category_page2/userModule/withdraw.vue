<template>
	<view class="container flex-center flex-column">
		<view class="addressBack-box">
			<view class="consignee-box bor-line-F7F7F7">
				<input type="number" :disabled="true" v-model="balance" @input="applycheck" class="fs28" placeholder-class="consignee" placeholder="提现金额(元)" />
			</view>
			<view @click="bankTagClick" class="bankTag-box bor-line-F7F7F7 flex-row-plus flex-sp-between flex-items">
				<view class="fs28 addressTag">银行卡</view>
				<view>
					<label v-model="cardNum">{{cardNum}}</label>
					<image class="arrow mar-left-20" src="../../static/img/user/arrow.png"></image>
				</view>
			</view>
			<view class="apply-box">
				<view class="apply-withdraw" @click="applyWithdraw">申请提现</view>
			</view>
		</view>
		<view class="withdraw-history">
			<view class="history-head">
				<label class="history-label">--- 历史记录 ---</label>
			</view>
			<view class="history-list">
				<view class="history-content flex-row-plus" v-for="(item, index) in withdrawHistoryList" :key="index">
					<view class="withdraw-detail">
						<view class="detail-top">
							<label class="apply-balance">申请金额: {{item.withdrawalMoney}}</label>
							<label class="cardnum">银行卡号：{{item.bankCard}}</label>
						</view>
						<view class="detail-bottom">
							<label class="status" v-if="item.state==0">状态：审核中</label>
							<label class="status" v-else-if="item.state==1">状态：通过</label>
							<label class="status" v-else-if="item.state==2">状态：拒绝</label>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 弹窗 -->
		<u-select v-model="bankTagShowFlag" mode="single-column" title="银行卡" :list="bankcardselectList" @confirm="bankcardConfirm"></u-select>
		<!-- <u-select v-model="bankTagShowFlag" :default-value="choosedValueList" mode="single-column" :list="list"
		 @confirm="bankcardConfirm" title="银行卡" value-name="id" label-name="cardNum"></u-select> -->
	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	export default {
		data() {
			return {
				balance: '',
				cardNum: '',
				bankcardId: 0,
				bankName:'',
				bankTagShowFlag: false,
				choosedValueList: [0],
				bankcardList: [],
				withdrawHistoryList: [],
				bankcardselectList:[{value:'',label:''}],
				price:0
			}
		},
		onLoad(options) {
			this.balance=options.m;
			this.initBankcardList()
			this.getBalance()
		},
		onShow() {

		},
		methods: {
			getBalance(){
				const _ = this
				NET.request(API.GetDistributor,{},"GET").then(res => {
					_.price = res.data.price
					_.withdrawHistoryList = res.data.withdrawals
				}).catch(res => {

				})
			},
			initBankcardList() {
				this.bankcardselectList = []
				NET.request(API.QueryBankcardList, {
					page: 1,
					pageSize:100
				}, 'GET').then(res => {
					this.bankcardList = res.data
					for(let i=0;i<this.bankcardList.total;i++){
						this.bankcardselectList.push({value:this.bankcardList.list[i].bankName,label:this.bankcardList.list[i].bankCard})
					}
				}).catch(res => {

				})
			},
			applycheck(e) {
				//正则表达试
				e.target.value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
				//重新赋值给input
				this.$nextTick(() => {
					this.balance= e.target.value
				})
			},
			applyWithdraw() {
				const _ = this
				if (this.balance === '') {
					uni.showToast({
						title: "提现金额不能为空",
						duration: 2000,
						icon: 'none'
					})
					return
				}
				else if(this.price<=0){
					uni.showToast({
						title: "余额不足，无法提现",
						duration: 2000,
						icon: 'none'
					})
					return
				}
				else if (this.balance > this.price ) {
					uni.showToast({
						title: "余额不足，请重新输入申请金额",
						duration: 2000,
						icon: 'none'
					})
					return
				} else if (parseFloat(this.balance) > 1000000) {
					uni.showToast({
						title: "提现金额不能超过1000000",
						duration: 2000,
						icon: 'none'
					})
					return
				} else if(this.bankName == "" || this.bankName == null) {
					uni.showToast({
						title: '请选择银行卡',
						duration: 2000,
						icon: 'none'
					})
					return
				}else{
					NET.request(API.MemberAccountWithdraw, {
						bankName: this.bankName,
						bankCard: this.cardNum,
						withdrawalMoney: this.balance
					}, 'POST').then(res => {
							uni.showToast({
								title: '申请成功',
								duration: 2000,
								icon: 'none'
							})
							this.balance = ''
							this.getBalance()
							this.initBankcardList()
					}).catch(res => {
						if (res.data && res.data.code == 40001) {
							uni.navigateTo({
								url: 'login'
							})
						} else if (res.data) {
							uni.showToast({
								title: res.data.msg,
								duration: 2000,
								icon: 'none'
							})
						}
					})
				}
				// else {
				// 	let dotPos = this.balance.indexOf(".")
				// 	let length = this.balance.length
				// 	console.log(dotPos,222)
				// 	console.log(length,333)
				// 	if (length - dotPos > 3) {
				// 		uni.showToast({
				// 			title: "提现金额只能精确到小数点后两位",
				// 			duration: 2000,
				// 			icon: 'none'
				// 		})
				// 		return
				// 	}
				// }
			},
			bankTagClick() {
				if(this.bankcardList.total > 0){
					this.bankTagShowFlag = true
				}else{
					uni.showToast({
						title: '你还没有添加银行卡～',
						duration: 2000,
						icon: 'none'
					})
					setTimeout(function(){
						uni.navigateTo({
							url:'addBankcard?withdraw=1'
						})
					},3000)
				}

			},
			bankcardConfirm(e) {
				this.cardNum = e[0].label
				this.bankName = e[0].value
			}
		},
		filters: {
			parseMoney(money) {
				return parseFloat(money/100).toFixed(2)
			},
			parseStatus(status) {
				if(status == 0) {
					return "审核中"
				} else if (status == 1) {
					return "已通过"
				} else {
					return "已拒绝"
				}
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

			.apply-withdraw {
				width: 390upx;
				height: 80upx;
				color: #FFFFFF;
				border-radius: 40upx;
				text-align: center;
				line-height: 80upx;
				background-image: linear-gradient(135deg, #00AA49 10%, #00AA49 100%);
				margin: 0 auto;
				margin-top: 10px;
			}

			.bankTag-box {
				margin-top: 19px;
				padding-bottom: 19px;

				.addressTag {
					color: #999999
				}

				.arrow {
					width: 24upx;
					height: 24upx;
				}
			}
		}

		.withdraw-history {
			margin-top: 7px;
			.history-head {
				text-align: center;
				.history-label {
					color: #999999;
				}
			}

			.history-list {
				background: white;
				.history-content {
					padding: 15px 15px;
					.cardnum {
						position: absolute;
						right: 20px;
					}
					.detail-bottom {
						margin-top:6px;
					}
				}
			}
		}
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
