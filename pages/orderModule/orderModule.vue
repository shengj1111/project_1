<!-- 订单中心 -->
<template>
	<view class="container">
		<view style="padding-bottom:68upx;">
			<view>
				<u-tabs :list="tabList" :is-scroll="false" bg-color="#F7F7F7" active-color="#FF7800" :current="type"
					@change="orderStateChange"></u-tabs>
			</view>
			<view class="order-list-box">
				<view v-if="listTotal > 0">
					<view class="item" v-for="(item, index) in list" :key="index" @click="itemTap(item.orderId,item)">
						<view class="order-list-top">
							<view class="top-l" @click.stop="goShop(item.shopId)">
								<image :src="item.shopLogo" class="shop-img"></image>
								<text class="shop-name">{{item.shopName}}</text>
								<image src="@/static/images/arrowRight.png" class="arrow-img"></image>
							</view>
							<!--订单状态： 退款中 交易关闭 待付款 待发货 待收货 已完成-->
							<view class="order-status" v-if='item.state==1'>待付款</view>
							<view class="order-status" v-else-if='item.state==2'>待发货</view>
							<view class="order-status" v-else-if='item.state==3'>待收货</view>
							<view class="order-status" v-else-if='item.state==4'>已完成</view>
							<view class="order-status" v-else-if='item.state==5'>售后</view>
		<!-- 					<view class="order-status" v-else-if='item.state==6'>待成团</view>
							<view class="order-status" v-else-if='item.returnType==1'>退款中</view> -->
						</view>
						<view class="order-info-box">
							<view class="order-info">
								<view class="order-info-item" v-for="(proItem, pIndex) in item.skus" :key="pIndex">
									<image :src="proItem.image" class="product-img"></image>
									<view class="info-box">
										<text class="product-name">{{proItem.productName}}</text>
										<view class="product-sku">{{proItem.value}}</view>
										<view class="price-sku-box">
											<view class="box-h">
												<text class="product-price"><text
														class="fuhao">￥</text>{{proItem.price}}</text>
												<text class="product-num">x {{proItem.number}}</text>
											</view>
											<view v-if="proItem.commentId == 0 && item.state == 4" class="evaluate"
												@click.stop="evaluateTap(proItem,item.orderId)">立即评价</view>
											<view v-if="proItem.commentId != 0 && item.state == 4" class="evaluate2"
												@click.stop="evaluateTowTap(index,proItem.commentId)">追加评价</view>
										</view>
									</view>
								</view>
								<view class="total-price-box">总价¥{{item.orderPrice}},优惠¥{{item.discountPrice}}
									<block v-if="item.price > 0">
										，实付¥{{item.price}}
									</block>
								</view>
							</view>

							<view class="order-btn-box">
								<text class="btn l" v-if='item.state==1|| item.state == 6 '
									@click.stop="cancelOrder(item.orderId,index)">取消订单</text>
								<!-- <text class="btn l" v-if='item.state==2' >提醒发货</text> -->
								<text class="btn r" v-if='item.state==1' @click.stop="payOrder(item,index)">立即付款</text>
								<text class="btn l"
									v-if="(item.state==3 || item.state==4) && ( item.afterState == 0 || item.afterState == 6)"
									@click.stop="applyTap(item,index)">申请售后</text>
								<text class="btn l" v-if='item.state==3 || item.state==4'
									@click.stop="goLogisticsTap(item.express,item.deliverFormid)">查看物流</text>
								<text class="btn r" v-if='item.state==3'
									@click.stop="confirmReceiptTap(item.orderId)">确认收货</text>
								<text class="btn l" v-if='item.state==5|| item.state == 9'
									@click.stop="delOrder(item.orderId)">删除订单</text>
								<text class="btn l" v-if='item.returnType==1'
									@click.stop="refundDetail(item)">退款详情</text>
								<text class="btn r" v-if='item.state==6'
									@click.stop="goInviteSpll(item.collageId,item.orderId,item.skus[0].productId,item.skus[0].skuId,item.shopId)">邀请拼单</text>
								<text class="btn r" v-if='item.state==5'
									@click.stop="againCollage(item.skus[0].productId,item.shopId,item.skus[0].skuId)">{{item.collageId !=0 ? '再次开团' : '再次购买'}}</text>
							</view>
						</view>
					</view>
				</view>
				<view v-else class="emptyOrder-box flex-items-plus flex-column">
					<image class="emptyOrder-img" src="../../static/images/emptyOrderImg.png"></image>
					<label class="font-color-999 fs26 mar-top-30">你还没有订单哦～</label>
				</view>
			</view>
		</view>
		<u-popup class="pay-type-popup" v-model="showPayTypePopup" mode="bottom" border-radius="14"
			close-icon-pos="top-right" close-icon-size="20">
			<view class="pay-type-item">
				<radio-group @change="payTypeChange" v-model="paymentMode">
					<view class="pay-type-radio">
						<view class="pay-type-img">
							<img class="pay-type-img-inner" src="@/static/images/alipay.png" />
						</view>
						<label class="pay-type-label">支付宝支付</label>
						<radio class="pay-type-radio-item" style="transform:scale(0.7)" :checked="paymentMode == 2"
							value="2" />
					</view>
					<view class="pay-type-radio">
						<view class="pay-type-img">
							<!-- <img class="pay-type-img-inner" src="@/static/images/huabei.png" /> -->
						</view>
						<label class="pay-type-label">花呗分期</label>
						<radio class="pay-type-radio-item" style="transform:scale(0.7)" :disabled="totalPrice < 0.03"
							:checked="paymentMode == 3" value="3" />
					</view>
				</radio-group>
				<view class="huabei-detail">
					<radio-group @change="huabeiPeriodChange" v-model="huabeiPeriod">
						<view class="period-radio">
							<view class="period-amount">
								<label class="period-each">￥ {{fenqiFeeList[0]||clip2Decimal}}x3期</label>
								<label class="period-each-charge">手续费￥{{chargeFeeList[0]|clip2Decimal}}/期</label>
							</view>
							<radio class="period-type-radio-item" style="transform:scale(0.7)"
								:disabled="fenqiDisabledList[0]" :checked="huabeiPeriod == 3" value="3" />
						</view>
						<view class="period-radio">
							<view class="period-amount">
								<label class="period-each">￥ {{fenqiFeeList[1]|clip2Decimal}}x6期</label>
								<label class="period-each-charge">手续费￥{{chargeFeeList[1]|clip2Decimal}}/期</label>
							</view>
							<radio class="period-type-radio-item" style="transform:scale(0.7)"
								:disabled="fenqiDisabledList[1]" :checked="huabeiPeriod == 6" value="6" />
						</view>
						<view class="period-radio">
							<view class="period-amount">
								<label class="period-each">￥ {{fenqiFeeList[2]|clip2Decimal}}x12期</label>
								<label class="period-each-charge">手续费￥{{chargeFeeList[2]|clip2Decimal}}/期</label>
							</view>
							<radio class="period-type-radio-item" style="transform:scale(0.7)"
								:disabled="fenqiDisabledList[2]" :checked="huabeiPeriod == 12" value="12" />
						</view>
					</radio-group>
				</view>
			</view>
			<view class="paytype-confirm">
				<view class="fenqi-total-amount" v-if="totalPrice >= 0.03 && paymentMode == 3">
					<label class="fenqi-all">分期总额 ￥{{ totalPrice|clip2Decimal }}</label>
					<label class="charge-fee-all">手续费 ￥{{ chargeFee|clip2Decimal }}</label>
				</view>
				<view class="fenqi-total-amount" v-if="paymentMode == 2">
					<label class="order-amount">订单总额 ￥{{ totalPrice|clip2Decimal }}</label>
				</view>
				<view class="fenqi-confirm">
					<text class="btn active" @click="continuePay">确认</text>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				type: 0,
				page: 1,
				pageSize: 20,

				list: [{
					orderId: 4011,
					shopGroupWorkId: 95,
					shopSeckillId: 0,
					shopDiscountId: 0,
					collageId: 346,
					shopId: 2,
					shopName: "测试门店1188213",
					shopLogo: "https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-07-09/3d411a471f8e40288d20f0142ba340eb%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20210630142216.png",
					afterState: "",
					state: 1,
					orderPrice: 2000.00,
					discountPrice: 0.50,
					price: 0.00,
					skus: [{
						shopId: 0,
						commentId: 0,
						productId: 457,
						skuId: 1189,
						productName: "黑色和米白色短款连帽连衣裙",
						price: 2000.00,
						weight: 1.00,
						number: 1,
						total: 2000.00,
						image: "https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-07-06/e91bf286176c43b5a8768b50d853940cWeb%201920%20%E2%80%93%208.png",
						value: 11,						
						afterState: 0,
						shopGroupWorkId: 0,
						shopSeckillId: 0,
						shopDiscountId: 0,
						sku: ""
					}],
					"express": "",
					"deliverFormid": "",
					"time": -129363000
				}],
				scrollLeft: 0,
				tabList: [{
					name: '全部',
					number: 0
				}, {
					name: '待付款',
					number: 1
				}, {
					name: '待发货',
					number: 2
				}, {
					name: '待收货',
					number: 3
				}, {
					name: '待评价',
					number: 4
				}, {
					name: '售后',
					number: 5
				},
				// , {
				// 	name: '待评价',
				// 	number: 4
				// }, {
				// 	name: '待成团',
				// 	number: 6
				// },
				],
				listTotal: 1,
				loadingType: 1,
				orderState: 1,
				paymentMode: 2,
				showPayTypePopup: false,
				chargeFee: 0,
				totalPrice: 0,
				huabeiPeriod: -1,
				fenqiFeeList: [0, 0, 0],
				chargeFeeList: [0, 0, 0],
				fenqiDisabledList: [true, true, true],
				huabeiChargeType: 1,
				huabeiFeeRateList: [0, 0, 0],
				alipayInfo: {}
			}
		},
		onLoad(options) {
			this.type = options.type;
			// if (options.type) {
			// 	this.type = options.type,
			// 		this.orderState = options.type
			// 	this.getListData()
			// } else {
			// 	this.getListData()
			// }
			// this.getHuabeiFeeRateList()
		},
		onReachBottom() {
			if (this.loadingType == 1) {
				uni.stopPullDownRefresh()
			} else {
				this.page = this.page + 1
				this.getListData()
			}
		},
		onBackPress(e) {
			if (e && e.from === 'navigateBack') {
				return false;
			}
			this.back();
			return true;
		},
		methods: {
			//去商品详情
			againCollage(productId, shopId, skuId) {
				uni.navigateTo({
					url: '/pages_category_page3/merchants/goodsDetails?productId=' + productId + '&shopId=' + shopId + '&skuId=' +
						skuId
				})
			},
			goInviteSpll(collageId, orderId, productId, skuId) {
				uni.navigateTo({
					url: '../goodsModule/inviteSpell?collageId=' + collageId + '&orderId=' + orderId + '&type=1' +
						'&productId=' + productId + '&skuId=' + skuId

				})
			},
			back() {
				uni.switchTab({
					url: '../../pages/tabbar/user/index'
				});
			},
			//退款详情
			refundDetail(item) {
				uni.navigateTo({
					url: 'refundDetails?item=' + JSON.stringify(item)
				})
			},
			orderStateChange(index) {
				this.type = index;
				this.orderState = this.tabList[index].number
				this.page = 1
				// this.list = []
				// this.getListData()
				console.log(234567)
			},
			// 订单列表数据
			getListData() {
				if (this.orderState == 0) {
					this.orderState = ''
				}
				// uni.showLoading({
				// 	title: '加载中...',
				// })
				// NET.request(API.FindOrderList, {
				// 	state: this.orderState,
				// 	page: this.page,
				// 	pageSize: this.pageSize
				// }, 'GET').then(res => {
				// 	if (res.data.list.length == 0) {
				// 		this.loadingType = 1
				// 		this.page = this.page
				// 	}
				// 	uni.hideLoading()
				// 	this.listTotal = res.data.total
				// 	this.list = this.list.concat(res.data.list)

				// }).catch(res => {
				// 	uni.hideLoading()
				// })
			},
			cancelOrder(orderId, index) {
				uni.showModal({
					title: '温馨提示',
					content: '您确定要取消该订单吗？',
					confirmText: '确定取消',
					cancelText: '点错了',
					success: res => {
						if (res.confirm) {
							this.doCancel(orderId, index)
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},
			doCancel(orderId, index) {
				uni.showLoading({
					title: '提交中...',
				})
				NET.request(API.CancelOrder, {
					orderId: orderId
				}, 'POST').then(res => {
					uni.hideLoading()
					uni.showToast({
						title: '取消成功',
					})
					setTimeout(() => {
						this.type = 0
						this.orderState = 0
						this.page = 1
						this.list = []
						this.getListData()
					}, 1500);

				}).catch(res => {
					uni.hideLoading()
				})
			},
			goLogisticsTap(express, deliverFormid) {
				uni.navigateTo({
					url: 'logisticsInfo?express=' + express + '&deliverFormid=' + deliverFormid
				})
			},
			confirmReceiptTap(orderId) {
				uni.showModal({
					title: '温馨提示',
					content: '确定您已经收到货物，否则会造成财产损失',
					confirmText: '确定收到',
					cancelText: '点错了',
					success: res => {
						if (res.confirm) {
							this.doConfirm(orderId)
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},
			doConfirm(orderId) {
				NET.request(API.ConfirmReceive, {
					orderId: orderId
				}, 'POST').then(res => {
					uni.hideLoading()
					uni.showToast({
						title: '确认成功',
					})
					setTimeout(() => {
						this.type = 4;
						this.orderState = 4
						this.page = 1
						this.list = []
						this.getListData()
					}, 1500);
				}).catch(res => {
					uni.hideLoading()
				})
			},
			delOrder(orderId) {
				uni.showModal({
					title: '温馨提示',
					content: '您确定要删除该订单吗？',
					confirmText: '确定删除',
					cancelText: '点错了',
					success: res => {
						if (res.confirm) {
							this.doDel(orderId)
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},
			doDel(orderId) {
				uni.showLoading({
					title: '提交中...',
				})
				NET.request(API.DelOrder, {
					orderId: orderId
				}, 'POST').then(res => {
					uni.hideLoading()
					uni.showToast({
						title: '删除成功',
					})
					setTimeout(() => {
						this.type = 0;
						this.orderState = 0
						this.page = 1
						this.list = []
						this.getListData()
					}, 1500);

				}).catch(res => {
					uni.hideLoading()
				})
			},
			// 跳转订单详情
			itemTap(orderId, item) {
				uni.setStorageSync("afterapplyItem", item)
				uni.navigateTo({
					url: 'orderDetails?orderId=' + orderId
				})
			},
			goShop(id) {
				uni.navigateTo({
					url: "../store/index?storeId=" + id
				})

			},
			applyTap(item, index) {
				// 申请售后
				uni.navigateTo({
					url: 'afterSaleApply?item=' + JSON.stringify(item)
				})
			},
			payOrder(item, index) {
				// #ifdef MP-ALIPAY
				this.showPayTypePopup = true
				this.totalPrice = item.orderPrice
				// #endif
				// #ifndef MP-ALIPAY
				uni.showLoading({
					title: '订单提交中...',
				})
				// #endif
				let submitResult = {
					collageId: item.collageId,
					money: item.orderPrice,
					orderId: item.orderId,
					type: 2
				}
				// #ifdef H5
				let ua = navigator.userAgent.toLowerCase();
				// if (ua.match(/MicroMessenger/i) == "micromessenger") {
				// 	this.payRequest(submitResult)
				// } else {
				NET.request(API.gotoH5Pay, submitResult, 'POST').then(res => {
					//console.dir(res)
					location.replace(res.data.mwebUrl)
					// window.location.replace(url)
				}).catch(err => {
					this.submitActive = true
					uni.hideLoading()
					uni.showToast({
						title: '支付失败',
						icon: 'none'
					})
				})
				// }
				// #endif
				// #ifdef MP-ALIPAY
				this.alipayInfo = submitResult
				// #endif
				// #ifdef MP-WEIXIN
				NET.request(API.gotoPay, submitResult, 'POST').then(res => {
					uni.requestPayment({
						privider: 'wxpay',
						timeStamp: res.data.timeStamp,
						nonceStr: res.data.nonceStr,
						package: res.data.package,
						signType: res.data.signType,
						paySign: res.data.paySign,
						success: function(payRes) {
							uni.showToast({
								icon: 'none',
								title: '支付成功'
							})
							this.type = 0
							this.page = 1
							this.getListData()
						},
						fail: function(err) {
							uni.showToast({
								icon: 'none',
								title: '支付失败'
							})
						}
					})
				}).catch(err => {
					uni.hideLoading()
					uni.showToast({
						title: '支付失败',
						icon: 'none'
					})
				})
				// #endif
				// #ifdef APP-PLUS
				NET.request(API.gotoAppPay, submitResult, 'POST').then(res => {
					let str = res.data.package
					var index = str.lastIndexOf("\=");
					str = str.substring(index + 1, str.length);
					var obj = {
						appid: res.data.appId,
						noncestr: res.data.nonceStr,
						package: 'Sign=WXPay',
						prepayid: str,
						timestamp: res.data.timeStamp,
						sign: 'MD5',
						partnerid: res.data.partnerId
					}
					uni.requestPayment({
						provider: 'wxpay',
						orderInfo: obj,
						success: function(payRes) {
							uni.showToast({
								icon: 'none',
								title: '支付成功'
							})
							this.type = 0
							this.page = 1
							this.getListData()
						},
						fail: function(err) {
							console.log(err)
							uni.showToast({
								icon: 'none',
								title: '支付取消'
							})
						}
					})
				}).catch(err => {
					uni.hideLoading()
					uni.showToast({
						title: '支付失败',
						icon: 'none'
					})
				})
				// #endif
			},
			continuePay() {
				uni.showLoading({
					title: '加载中...',
				})
				const payInfo = Object.assign({}, this.alipayInfo, {
					'paymentMode': this.paymentMode,
					'huabeiPeriod': this.huabeiPeriod
				});
				this.aliPay(payInfo)
			},
			// 支付宝支付
			aliPay(payInfo) {
				NET.request(API.gotoPay, payInfo, 'POST').then(res => {
					console.log('alipay gotoPay-----------')
					uni.requestPayment({
						provider: 'alipay',
						orderInfo: res.data.tradeNo,
						success: function(payRes) {
							uni.hideLoading()
							if (payRes.resultCode == '6001') {
								uni.showToast({
									icon: 'none',
									title: '取消支付'
								})
							}
							if (payRes.resultCode == '9000') {
								uni.showToast({
									icon: 'none',
									title: '支付成功'
								})
								uni.navigateTo({
									url: 'index?type=0'
								})
							}
						},
						fail: function(err) {
							uni.showToast({
								icon: 'none',
								title: '支付取消'
							})
						}
					});
				}).catch(err => {
					uni.hideLoading()
					uni.showToast({
						title: '支付失败',
						icon: 'none'
					})
				})
			},
			// H5支付微信内置浏览器支付
			payRequest(payInfo) {
				payInfo.paymentMode = 1
				NET.request(API.gotoPay, payInfo, 'POST').then(res => {
					jweixin.config({
						debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
						appId: res.data.appId, // 必填，公众号的唯一标识
						timestamp: res.data.timeStamp, // 必填，生成签名的时间戳
						nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
						signature: res.data.paySign, // 必填，签名，见附录1
						jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
					});
					jweixin.ready(function() {
						jweixin.checkJsApi({
							jsApiList: ['chooseWXPay'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
							success: function(res) {
								// console.log('checkjsapi Success')
								// console.log(res);
							},
							fail: function(res) {
								// console.log('res')
								// console.log(res);
							}
						});
						jweixin.chooseWXPay({
							timestamp: res.data
								.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
							nonceStr: res.data.nonceStr, // 支付签名随机串，不长于 32 位
							package: res.data
								.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
							signType: res.data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
							paySign: res.data.paySign, // 支付签名
							success: function(res) {
								// 支付成功后的回调函数
								uni.showToast({
									icon: 'none',
									title: '支付成功'
								})
								uni.navigateTo({
									url: 'index?type=0'
								})
							},
							cancel: function(r) {
								uni.showToast({
									icon: 'none',
									title: '取消支付'
								})
							},
							fail: function(res) {
								uni.showToast({
									icon: 'none',
									title: '支付失败'
								})
							}
						});
					});
					jweixin.error(function(res) {
						console.log('error')
						console.log(res)
						uni.hideLoading()
						uni.showToast({
							icon: 'none',
							title: '支付失败了',
							duration: 3000
						});
					});
				}).catch(err => {
					uni.hideLoading()
				})
			},
			evaluateTap(item, orderId) {
				uni.setStorageSync('evaluateItem', item)
				uni.setStorageSync('orderId', orderId)
				uni.navigateTo({
					url: '../goodsModule/evaluate',
				})
			},
			evaluateTowTap(index, commentId) {
				console.log(commentId, 444)
				uni.setStorageSync('addCommentVOList', this.list[index]);
				uni.navigateTo({
					url: '../goodsModule/addEvaluate?type=1&commentId=' + commentId
				})
			},
			payTypeChange(event) {
				this.paymentMode = event.target.value;
				if (this.paymentMode == 2) {
					this.huabeiPeriod = -1
					this.fenqiDisabledList = [true, true, true]
				} else {
					this.huabeiPeriod = 3
				}
				this.recalcHuabei()
			},
			recalcHuabei() {
				if (this.paymentMode == 3) {
					this.fenqiFeeList[0] = this.totalPrice * (1 + this.huabeiFeeRateList[0] / 100) / 3
					this.fenqiFeeList[1] = this.totalPrice * (1 + this.huabeiFeeRateList[1] / 100) / 6
					this.fenqiFeeList[2] = this.totalPrice * (1 + this.huabeiFeeRateList[2] / 100) / 12

					this.chargeFeeList[0] = this.totalPrice * (this.huabeiFeeRateList[0] / 100) / 3
					this.chargeFeeList[1] = this.totalPrice * (this.huabeiFeeRateList[1] / 100) / 6
					this.chargeFeeList[2] = this.totalPrice * (this.huabeiFeeRateList[2] / 100) / 12

					var index = 0;
					if (this.huabeiPeriod == 6) {
						index = 1
					} else if (this.huabeiPeriod == 12) {
						index = 2
					}
					this.chargeFee = (this.totalPrice * (this.huabeiFeeRateList[index] / 100))
						.toFixed(2)

					if (this.totalPrice >= 0.03) {
						this.fenqiDisabledList[0] = false
					}
					if (this.totalPrice >= 0.06) {
						this.fenqiDisabledList[1] = false
					}
					if (this.totalPrice >= 0.12) {
						this.fenqiDisabledList[2] = false
					}
				}
			},
			// 花呗分期数变更
			huabeiPeriodChange(event) {
				this.huabeiPeriod = event.target.value
				this.recalcHuabei()
			},
			// 查询花呗分期配置
			getHuabeiFeeRateList() {
				NET.request(API.GetHuabeiConfig, {}, 'GET').then(res => {
					this.huabeiChargeType = res.data.huabeiChargeType
					if (this.huabeiChargeType == 2) {
						this.huabeiFeeRateList = res.data.huabeiFeeRateList
					}
				})
			}
		},
		filters: {
			clip2Decimal(value) {
				if (value === undefined || value === null) {
					return "0.00"
				}
				return (parseInt(value * 100) / 100).toFixed(2)
			}
		}
	}
</script>

<style lang="scss">
	page {
		width: 100%;
		height: 100%;
		background: #f6f6f6;
	}

	.nav-box-box {
		height: 88upx;
		background: #f6f6f6;
		white-space: nowrap;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 10;
	}

	.nav-box-box .item {
		display: inline-view;
		padding: 0 30upx;
		box-sizing: border-box;
		height: 88upx;
		text-align: center;
		line-height: 88upx;
		font-size: 30upx;
		color: #666;
		font-weight: 500;
	}

	.nav-box-box .item.active text {
		display: inline-view;
		color: #ff7911;
		box-sizing: border-box;
		height: 88upx;
		border-bottom: 2px solid #ff7911;
	}

	.order-list-box {
		padding: 20upx 30upx 0;
		box-sizing: border-box;
	}

	.order-list-box .item {
		margin-bottom: 20upx;
		background: #fff;
		border-radius: 10upx;
	}

	.order-list-top {
		height: 96upx;
		padding: 0 30upx;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #eee;
	}

	.top-l {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.shop-img {
		width: 36upx;
		height: 36upx;
		margin-right: 10upx;
	}

	.shop-name {
		font-size: 30upx;
		color: #333;
		font-weight: bold;
	}

	.arrow-img {
		margin-left: 15upx;
		width: 24upx;
		height: 24upx;
	}

	.order-status {
		font-size: 28upx;
		color: #ff7911;
		font-weight: 500;
	}

	.order-info-box {
		padding: 0 30upx;
		box-sizing: border-box;
	}

	.order-info {
		border-bottom: 1px solid #eee;
	}

	.order-info-item {
		display: flex;
		flex-direction: row;
		padding: 20upx 0;
	}

	.product-img {
		width: 180upx;
		height: 180upx;
		border-radius: 10upx;
		margin-right: 30upx;
	}

	.info-box {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.product-name {
		font-size: 26upx;
		color: #333;
		height: 68upx;
		line-height: 34upx;
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: break-all;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.price-sku-box {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.product-sku {
		font-size: 24upx;
		color: #999;
	}

	.product-price {
		font-size: 28upx;
		color: #333;
		font-weight: 400;
	}

	.product-price .fuhao {
		font-size: 28upx;
	}

	.product-num {
		display: inline-view;
		font-size: 28upx;
		margin-left: 20upx;
		color: #999;
	}

	.total-price-box {
		font-size: 26upx;
		color: #333;
		text-align: right;
		padding: 30upx 0;
	}

	.order-btn-box {
		padding: 20upx 0;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
	}

	.order-btn-box .btn {
		display: inline-view;
		width: 150upx;
		height: 56upx;
		border-radius: 28upx;
		text-align: center;
		line-height: 56upx;
		font-size: 26upx;
		color: #333;
		margin-left: 20upx;
	}

	.evaluate {
		height: 56upx;
		border-radius: 28upx;
		text-align: center;
		line-height: 56upx;
		font-size: 26upx;
		padding: 0 30upx;
		border: 1px solid #FF7911;
		color: #FF7911;
	}

	.evaluate2 {
		height: 56upx;
		border-radius: 28upx;
		text-align: center;
		line-height: 56upx;
		font-size: 26upx;
		padding: 0 30upx;
		border: 1px solid #BBBBBB;
		color: #333;
	}

	.order-btn-box .btn.l {
		border: 1px solid #BBBBBB;
		color: #333;
	}

	.order-btn-box .btn.r {
		border: 1px solid #FF7911;
		color: #FF7911;
	}

	.emptyOrder-box {
		margin-top: 70upx;

		.emptyOrder-img {
			width: 270upx;
			height: 270upx;
		}
	}

	.pay-type-item {
		.pay-type-radio {
			background-color: white;
			border-bottom: 1upx solid #EDEDED;
			margin-bottom: 20upx;
			padding: 24upx 20upx 24upx 20upx;

			.pay-type-img {
				display: inline-block;

				.pay-type-img-inner {
					width: 50upx;
					height: 50upx;
					vertical-align: middle;
				}
			}

			.pay-type-label {
				vertical-align: middle;
				margin-left: 30upx;
			}

			.pay-type-radio-item {
				float: right;
				margin-right: 20upx;
				width: 50upx;
				height: 50upx;
			}
		}

		.huabei-detail {
			margin-top: 20upx;

			.fenqi-wenzi {
				display: inline-block;
				margin-left: 64upx;
			}

			.fenqi-amount {
				display: block;
				margin-left: 64upx;
				margin-top: 14upx;
				color: #BABBBC;
			}

			.fenqi-charge-fee {
				float: right;
				margin-right: 68upx;
				color: #BABBBC;
			}

			.fenqi-modal {
				width: 40upx;
				height: 40upx;
				margin-left: 20upx;
				float: right;
				position: relative;
				top: -80upx;
			}
		}
	}

	.paytype-confirm {
		height: 120upx;
		padding: 0upx 108upx 0upx 32upx;

		.fenqi-all {
			display: inline-block;
			width: 100%;
		}

		.fenqi-total-amount {
			width: 65%;
			float: left;
		}

		.fenqi-confirm {
			float: right;
			width: 160upx;
			padding: 0upx 20upx;

			.btn {
				width: 216upx;
				height: 80upx;
				line-height: 80upx;
				border-radius: 40upx;
				font-size: 28upx;
				text-align: center;
				background: linear-gradient(90deg, rgba(255, 162, 0, 1), rgba(255, 121, 17, 1));
				color: #fff;
				display: inline-block;
				margin-right: 66upx;
			}
		}
	}

	.period-radio {
		margin: 30upx;
		padding-right: 100upx;
		width: 95%;
		border-bottom: 1px solid #EFEFEF;

		.period-amount {
			display: inline-block;

			.period-each-charge {
				display: inline-block;
				margin-top: 12upx;
				margin-left: 6upx;
				font-size: 26upx;
				color: #b7b7b7;
				margin-bottom: 13upx;
			}
		}

		.period-each {
			display: block;
		}

		.period-type-radio-item {
			float: right;
		}
	}
</style>
