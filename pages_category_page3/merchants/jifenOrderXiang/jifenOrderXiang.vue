<!-- 订单详情 -->
<template>
	<view>
		<view class="content" style="padding-bottom:200upx;">
			<view class="order-details-status">
				<!--  待付款-->
				<view class="status-title-box" v-if='dataList.state==1'>
					<view class="l">
						<text class="status">等待买家付款</text>
						<text class="label">剩{{hou}}小时{{min}}分{{sec}}秒自动关闭</text>
					</view>
					<image class='r' src="../../static/images/orderDaifukuan.png"></image>
				</view>
				<!--  待发货-->
				<view class="status-title-box" v-else-if='dataList.state==2'>
					<view class="l">
						<text class="status">等待卖家发货</text>
						<text class="label">付款后2-5个工作日发货</text>
					</view>
					<!-- 	<image class='r' src="../../static/images/orderDaifahuo.png"></image> -->
				</view>
				<!--  待收货-->
				<view class="status-title-box" v-else-if='dataList.state==3'>
					<view class="l">
						<text class="status">卖家已发货</text>
						<!-- <text class="label">还剩5天21小时自动确认</text> -->
					</view>
					<image class='r' src="../../static/images/orderDaishouhuo.png"></image>
				</view>
				<!-- 已完成 -->
				<view class="status-title-box" v-else-if='dataList.state==4'>
					<view class="l">
						<text class="status">交易成功</text>
						<text class="label">感谢您的使用</text>
					</view>
					<image class='r' src="../../static/images/orderDaipingjia.png"></image>
				</view>
				<!--  拼团失败-->
				<view class="status-title-box" v-else-if='dataList.state==5 && dataList.collageId != 0'>
					<view class="l">
						<text class="status">拼团失败</text>
						<text class="label">剩余时间 00:00:00</text>
					</view>
					<view class="clusterback">
						<image class='r' src="../../static/images/staycluster.png"></image>
					</view>
				</view>
				<!-- 交易关闭-->
				<view class="status-title-box2" v-else-if='dataList.state==5'>
					<text class="status">交易关闭</text>
					<text class="label">您已关闭了这笔交易</text>
				</view>
				<!-- 退款成功-->
				<view class="status-title-box2"
					v-else-if='(dataList.returnType==1 && dataList.moneyReturnList.status==4) || (dataList.returnType==2 && dataList.moneyReturnList.status==6)'>
					<text class="status">退款成功</text>
					<text class="label">该笔订单 ¥{{dataList.paySum}} 退款，已原路退回</text>
				</view>
				<!--  待成团-->
				<view class="status-title-box" v-else-if='dataList.state==6'>
					<view class="l">
						<text class="status">待成团</text>
						<text class="label">剩余时间{{hou}}小时{{min}}分{{sec}}秒</text>
					</view>
					<image class='r' src="../../static/images/clusterloss.png"></image>
				</view>

			</view>
			<view class="order-details-info-box">
				<view class="address-box">
					<image src="../../static/images/orderAddress.png" class="address-img"></image>
					<view class="address-r">
						<view class="address-name-box">
							<text>{{dataList.receiveName}}</text>
							<text class="phone">{{dataList.receivePhone}}</text>
						</view>
						<view class="address-info">
							<view>{{dataList.receiveAdress}}</view>
							<view>{{dataList.address}}</view>
						</view>
					</view>
					<image src="../../static/images/arrowRight.png" v-if="false" class="arrow-right-img"></image>
				</view>

				<view class="order-list-box">
					<view class="item">
			
						<view class="order-info-box">
							<view class="order-info">
								<view class="order-info-item" v-for="(proItem, proIndex) in dataList.skus"
									:key="proItem.productId" @click="goodsItemTap(proItem.productId,proItem.skuId)">
									<image :src="proItem.image" class="product-img"></image>
									<view class="info-box">
										<text class="product-name">{{proItem.productName}}</text>
										<view class="price-sku-box">
											<view class="product-sku">
												<view class="mar-left-20" v-for="(vItem, proIndex) in proItem.values">
													<text>{{vItem}}</text>
												</view>
											</view>
											<view class="product-num">x {{proItem.number}}</view>
										</view>
										<view class="price-sku-box">
											<view class="price-box">
												<view class="product-price1">实付：<text
														class="fuhao">￥</text>{{proItem.price}}</view>
												
											</view>


											<view v-if="proItem.returnType == 1">
												<view class="item-applay-btn"
													@click="goApplyTap(proItem.returnCode,proItem.returnType)"
													v-if="proItem.returnStatus == 0 || proItem.returnStatus == 1 || proItem.returnStatus == 3 || proItem.returnStatus == 4">
													退款中</view>
												<view class="item-applay-btn"
													@click="goApplyTap(proItem.returnCode,proItem.returnType)"
													v-if="proItem.returnStatus == 4">已退款</view>
												<view class="item-applay-btn"
													@click="goApplyTap(proItem.returnCode,proItem.returnType)"
													v-if="proItem.returnStatus == 5">退款失败</view>
												<view class="item-applay-btn"
													@click="applyPlatform(proItem.returnCode,proItem.returnType)"
													v-if="proItem.canApplyIntervention">客服介入</view>
											</view>
											<view v-if="proItem.returnType == 2">
												<view class="item-applay-btn"
													@click="goApplyTap(proItem.returnCode,proItem.returnType)"
													v-if="proItem.returnStatus == 0 || proItem.returnStatus == 1 || proItem.returnStatus == 3 || proItem.returnStatus == 4">
													退货中</view>
												<view class="item-applay-btn"
													@click="goApplyTap(proItem.returnCode,proItem.returnType)"
													v-if="proItem.returnStatus == 6">已退款</view>
												<view class="item-applay-btn"
													@click="goApplyTap(proItem.returnCode,proItem.returnType)"
													v-if="proItem.returnStatus == 7">退款中</view>
												<view class="item-applay-btn"
													@click="goApplyTap(proItem.returnCode,proItem.returnType)"
													v-if="proItem.returnStatus == 5 || proItem.returnStatus == 8">退款失败
												</view>
												<view class="item-applay-btn"
													@click="applyPlatform(proItem.returnCode,proItem.returnType)"
													v-if="proItem.canApplyIntervention">客服介入</view>
											</view>

											<view v-if="proItem.commentStatus == 0" class="evaluate"
												@click="evaluateTap(pIndex)">立即评价</view>
											<view v-if="proItem.commentStatus == 1 && proItem.additionalComment != null"
												@click="evaluateTowTap(pIndex)" class="evaluate2">追加评价</view>

										</view>
									</view>
								</view>
								<!-- 商品列表下面的哪一块 -->
								<view class="delivery-way-box">
									<!-- 赠送积分 -->
									<view class="item" v-if="item.integral > 0 || item.wuliuIntegral > 0">
										<view class="way" v-if="item.integral && item.integral > 0">赠送积分 :
											{{item.integral}}</view>
										<view class="way" v-if="item.wuliuIntegral && item.wuliuIntegral > 0">赠送物流积分 :
											{{item.wuliuIntegral}}</view>
									</view>


									<view class="item">
										<text class="way">支付方式</text>
										<text class="way">{{dataList.paymentMode}}</text>
									</view>
									<view class="item">
										<text class="way">配送方式</text>
										<text class="way" v-if="dataList.pickupWay == 0">配送</text>
										<text class="way" v-if="dataList.pickupWay == 1">自提</text>
									</view>
									<view class="item">
										<text class="way">商品总价</text>
										<text class="way">¥{{dataList.orderPrice}}</text>
									</view>
							
									<view class="item">
									
										<text class="way" v-if="dataList.coupon.couponType == 1">满减券</text>
										<text class="way" v-if="dataList.coupon.couponType == 2">折扣券</text>
										<text class="way" v-if="dataList.coupon.couponType == 3">物品券</text>
										<text class="way"
											v-if="dataList.coupon.couponType == 1">减{{dataList.coupon.couponContent}}</text>
										<text class="way"
											v-if="dataList.coupon.couponType == 2">打{{dataList.coupon.couponContent}}折</text>
										<text class="way"
											v-if="dataList.coupon.couponType == 3">{{dataList.coupon.couponName}}</text>

									</view>
								</view>
							</view>
							<!-- 待发货 待收货 已完成 -->
							<view class="order-total-box"
								v-if='dataList.state==2||dataList.state==3||dataList.state==4'>
								<text>实付款</text>
								<text class="way-color">¥{{dataList.price}}</text>
							</view>
							<!-- 待付款 价格是橙色-->
							<view class="order-total-box" v-else-if="dataList.state==1">
								<text>需付款</text>
								<text class="way-color">¥{{dataList.price}}</text>
							</view>
							<!-- 退款成功 交易关闭 -->
							<view class="order-total-box"
								v-else-if="(dataList.returnType==1 && dataList.moneyReturnList.status==4) || (dataList.returnType==2 && dataList.goodsReturn.status==6) || (dataList.state==5)">
								<text>需付款</text>
								<text>¥{{dataList.price}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="order-details-information padd">
				<view class="order-title">
					<text class="line"></text>
					<text>订单信息</text>
				</view>
				<view class="info-box">
					<!--都有  但是：待付款  待发货  退款成功 交易关闭  只有前两个item-->

					<view class="item" v-if="dataList.coupon && dataList.coupon.couponType != undefined">
						<text v-if="dataList.coupon.couponType != 3">优惠券：{{dataList.coupon.couponName}}</text>
						<text v-if="dataList.coupon.couponType == 3">优惠券：{{dataList.coupon.giftname}}</text>
						<view v-if="dataList.coupon.couponType == 3">
							<image :src="dataList.coupon.giftpic" class="product-img"></image>
						</view>
						<!-- <text class="copy-color" :data-clipboard-text="dataList.orderFormid" @click="copy">复制</text> -->
					</view>



					<view class="item">
						<text>订单编号：{{dataList.orderFormid}}</text>
						<text class="copy-color" :data-clipboard-text="dataList.orderFormid" @click="copy">复制</text>
					</view>
					<view class="item">
						<text>创建时间：{{dataList.createTime}}</text>
					</view>
					<!-- 待收货  有付款时间和发货时间 -->
					<!-- 	<view class="item" v-if="dataList.state==3">
						<text>付款时间：{{dataList.paymentTime}}</text>
					</view> -->
					<view class="item" v-if="dataList.state == 3 || dataList.state == 4">
						<text>发货时间：{{dataList.dileveryTime}}</text>
					</view>
					<view class="item" v-if="dataList.state == 3 || dataList.state == 4">
						<text>快递公司：{{dataList.express}}</text>
					</view>

					<view class="item" v-if="dataList.state == 3 || dataList.state == 4">
						<text>发货备注：{{dataList.deliverFormid}}</text>
					</view>
					<!-- 交易成功 有成交时间-->
					<view class="item" v-if="dataList.state == 4">
						<text>成交时间：{{dataList.receiveTime}}</text>
					</view>


				</view>
			</view>
			<view class="order-details-information padd">
				<view class="order-title">
					<text class="line"></text>
					<text>订单备注</text>
				</view>
				<view class="info-box">
					<!-- 交易成功 有成交时间-->
					<view class="item">
						<text>{{dataList.remark}}</text>
					</view>


				</view>
			</view>
			<view class="order-details-information mt20" v-if="false">
				<view class="order-title-box" @click="wuLiuTap">
					<view class="order-title padd-l">
						<text class="line"></text>
						<text>物流信息</text>
					</view>
					<image mode="aspectFill" src="../../static/images/arrowDown.png" class="arrow-down-img"
						style="transform:rotate(180deg);" v-if="isShowWuLiu == true"></image>
					<image mode="aspectFill" src="../../static/images/arrowDown.png" class="arrow-down-img" v-else>
					</image>
				</view>
			</view>
			<!-- 暂无物流 -->
			<view v-if="isShowWuLiu">
				<view v-if="steps.length>0" class="logistics">
					<uni-steps :options="steps" direction="column" :active="0"></uni-steps>
				</view>
				<view v-else class="emptyOrder-box flex-items-plus flex-column">
					<image class="emptyOrder-img" src="../../static/images/totalAwardEmpty.png"></image>
					<label class="font-color-999 fs26 mar-top-30">这里空空如也～</label>
				</view>
			</view>
		</view>
		<!-- 待付款 待发货 待收货 已完成 退款成功 -->
		<view class="order-details-btn" style="padding-top:30upx;"
			:style="{'padding-bottom':(isIphone==true? 40:0)+'rpx'}">
		</view>
		<u-popup class="pay-type-popup" v-model="showPayTypePopup" mode="bottom" border-radius="14"
			close-icon-pos="top-right" close-icon-size="20">
			<view class="pay-type-item">
				<radio-group @change="payTypeChange" v-model="paymentMode">
					<view class="pay-type-radio">
						<view class="pay-type-img">
							<img class="pay-type-img-inner" src="../../static/images/alipay.png" />
						</view>
						<label class="pay-type-label">支付宝支付</label>
						<radio class="pay-type-radio-item" style="transform:scale(0.7)" :checked="paymentMode == 2"
							value="2" />
					</view>
					<view class="pay-type-radio">
						<view class="pay-type-img">
							<img class="pay-type-img-inner" src="../../static/images/huabei.png" />
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
								<label class="period-each">￥ {{fenqiFeeList[0]|clip2Decimal}}x3期</label>
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
	// const NET = require('../../utils/request')
	// const API = require('../../config/api')
	// import uniSteps from "@/components/uni-steps/uni-steps.vue"
	// import ClipboardJS from "clipboard";
	// #ifdef H5
	var jweixin = require('jweixin-module')
	// #endif
	export default {
		data() {
			return {
				canApplyIntervention: false,
				dataList: [],
				orderId: 0,
				active: 0,
				steps: [],
				isShowWuLiu: false,
				hou: "00",
				min: "00",
				sec: "00",
				timeOut: undefined,
				Orderrefundlist: [],
				item: {},
				isIphone: false,
				noticeId: 0,
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
		components: {
			uniSteps
		},
		onLoad(options) {
			// this.isIphone = getApp().globalData.isIphone;
			// this.orderId = (parseInt(options.orderId))
			// if (uni.getStorageSync("afterapplyItem")) {
			// 	this.item = uni.getStorageSync("afterapplyItem")
			// }
			// if (options.noticeId) {
			// 	this.noticeId = options.noticeId
			// }
			// this.getDataList(this.orderId)
			// this.Orderrefund()
			// this.getHuabeiFeeRateList()
		},
		onUnload() {
			if (this.timeOut) {
				clearTimeout(this.timeOut)
			}
		},
		onBackPress(e) {
			if (e.from === 'navigateBack') {
				return false;
			}
			this.back();
			return true;
		},
		methods: {
			//去商品详情
			againCollage(productId, shopId, skuId) {
				uni.navigateTo({
					url: '/pages_category_page3/merchants/goodsDetails?productId=' + productId + '&shopId=' +
						shopId + '&skuId=' +
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
				uni.navigateTo({
					url: 'index'
				})
			},
			//商品详情
			goodsItemTap(productId, skuId) {
				wx.navigateTo({
					url: '/pages_category_page3/merchants/goodsDetails?shopId=' + this.dataList.shopId +
						'&productId=' + productId +
						'&skuId=' + skuId
				})
			},
			copy() {
				// #ifdef H5
				let clipboard = new ClipboardJS('.copy-color');
				clipboard.on('success', function(e) {
					uni.showToast({
						title: '复制成功',
						icon: 'success'
					})
					clipboard.destroy();
				})
				clipboard.on('error', function(e) {
					uni.showToast({
						title: '复制失败',
						icon: 'success'
					})
					clipboard.destroy();
				})
				// #endif
				// #ifndef H5
				uni.setClipboardData({
					data: this.dataList.orderFormid,
					success: function() {
						uni.showToast({
							title: '复制成功',
							icon: 'success'
						})
					}
				});
				// #endif
			},
			getDataList(orderId) {
				// uni.showLoading({
				//   title: '加载中...',
				// })
				NET.request(API.GetOrderDetail, {
					orderId: orderId,
					noticeId: this.noticeId
				}, 'GET').then(res => {
					// uni.hideLoading()
					let data = res.data
					this.dateformat(res.data.time)
					this.dataList = data
					console.log(dataList.collageDetail.length, 888)
					this.getShippingTrace(this.dataList.express, this.dataList.deliverFormid)
					if (this.dataList.state == 1 || this.dataList.state == 6) {
						this.countDown();
					}
				}).catch(res => {
					// uni.hideLoading()
				})
			},
			timeFormat(param) { //小于10的格式化函数
				return param < 10 ? '0' + param : param;
			},
			wuLiuTap() {
				this.isShowWuLiu = !this.isShowWuLiu
			},
			//时分秒换算
			dateformat(micro_second) {
				// 总秒数
				let second = Math.floor(micro_second / 1000);
				// 天数
				let day = Math.floor(second / 3600 / 24);
				// 小时
				let hr = Math.floor(second / 3600 % 24);
				// 分钟
				let min = Math.floor(second / 60 % 60);
				// 秒
				let sec = Math.floor(second % 60);
				this.hou = hr
				this.min = min
				this.sec = sec
			},
			countDown() {
				let timeOut = setTimeout(() => {
					let hou = parseInt(this.hou);
					let min = parseInt(this.min);
					let sec = parseInt(this.sec);

					let netxSec = sec - 1;
					let netxMin = min
					let netxHou = hou;

					if (netxHou == 0 && netxMin == 0 && netxSec == -1) {
						clearTimeout(timeOut)
						this.getDataList(this.orderId)

					} else {
						if (netxSec == -1) {
							netxSec = 59
							netxMin = netxMin - 1;
						}
						if (netxMin == -1) {
							netxMin = 59
							netxHou = netxHou - 1
						}
						if (netxHou == -1) {
							netxHou = 23
						}

						this.hou = this.timeFormat(netxHou),
							this.min = this.timeFormat(netxMin),
							this.sec = this.timeFormat(netxSec),
							this.timeOut = timeOut
						this.countDown();
					}
				}, 1000)
			},
			//物流信息
			getShippingTrace(express, deliverFormid) {
				NET.request(API.ShippingTrace, {
					express: express,
					deliverFormid: deliverFormid
				}, "GET").then(res => {
					let traces = res.data
					let len = traces.length
					for (let i = 0; i < len; i++) {
						let item = traces[i]
						this.steps.push({
							title: item.reason,
							desc: item.time,
						})
					}
					this.steps = this.steps.reverse()
				}).catch(res => {})
			},
			//删除订单
			delOrder() {
				uni.showModal({
					title: '温馨提示',
					content: '您确定要删除该订单吗？',
					confirmText: '确定删除',
					cancelText: '点错了',
					success: res => {
						if (res.confirm) {
							this.doDel()
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},
			doDel() {
				uni.showLoading({
					title: '提交中...',
				})
				NET.request(API.DelOrder, {
					orderId: this.orderId
				}, 'POST').then(res => {
					uni.hideLoading()
					uni.showToast({
						title: '删除成功',
					})
					setTimeout(() => {
						uni.navigateTo({
							url: 'index?type=0'
						})
					}, 1500);

				}).catch(res => {
					uni.hideLoading()
				})
			},
			//去门店首页
			goShop(id) {
				uni.navigateTo({
					url: '../store/index?storeId=' + id
				})
			},
			//退款
			applayItemTap(proItem) {
				uni.setStorageSync('applyItem', proItem)
				uni.navigateTo({
					url: 'afterSaleApplyRefund?orderId=' + this.orderId
				})
			},
			//去退款详情
			goApplyTap(code, type) {
				if (type == 1) {
					uni.navigateTo({
						url: 'refundDetails?returnCode=' + code
					})
				} else if (type == 2) {
					uni.navigateTo({
						url: 'returnDetails?returnCode=' + code
					})
				}
			},
			applyPlatform(code, type) {
				// uni.navigateTo({
				//   url: `/pages/userCenter/afterSale/platformJoin/index?returnCode=${code}&returnType=${type}`,
				// })
			},

			//取消订单
			cancelOrder() {
				uni.showModal({
					title: '温馨提示',
					content: '您确定要取消该订单吗？',
					confirmText: '确定取消',
					cancelText: '点错了',
					success: res => {
						if (res.confirm) {
							this.doCancel()
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},
			doCancel() {
				uni.showLoading({
					title: '提交中...',
				})
				NET.request(API.CancelOrder, {
					orderId: this.orderId
				}, 'POST').then(res => {
					uni.hideLoading()
					uni.showToast({
						title: '取消成功',
					})
					setTimeout(() => {
						this.getDataList(this.orderId)
					}, 1500);

				}).catch(res => {
					uni.hideLoading()
				})
			},
			payOrder() {
				// #ifdef MP-ALIPAY
				this.showPayTypePopup = true
				this.totalPrice = this.dataList.price
				// #endif
				// #ifndef MP-ALIPAY
				uni.showLoading({
					title: '订单提交中...',
				})
				// #endif
				let submitResult = {
					collageId: this.dataList.collageId,
					money: this.dataList.orderPrice,
					orderId: this.dataList.orderId,
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
							uni.navigateTo({
								url: 'index?type=0'
							})
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
				// #ifdef MP-ALIPAY
				this.alipayInfo = submitResult
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
					console.log(res.data, '111')
					console.log(obj, '111')
					uni.requestPayment({
						provider: 'wxpay',
						orderInfo: obj,
						success: function(payRes) {
							uni.showToast({
								icon: 'none',
								title: '支付成功'
							})
							uni.navigateTo({
								url: 'index?type=0'
							})
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
			// 继续付款
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
			//立即付款
			// payOrder() {
			//     uni.showLoading({
			//       title: '加载中...',
			//     })
			//     NET.request(API.ContinuePay, {
			//       orderCode: this.dataList.orderCode
			//     }, 'POST').then(res => {
			//       uni.hideLoading()
			//       let payInfo = res.data
			//       uni.requestPayment({
			//         timeStamp: payInfo.timeStamp,
			//         nonceStr: payInfo.nonceStr,
			//         package: payInfo.packageValue,
			//         signType: payInfo.signType,
			//         paySign: payInfo.paySign,
			//         success: res => {
			//           uni.showToast({
			//             title: '支付成功',
			//           })
			//           setTimeout(() => {
			//             this.getDataList(this.orderId)
			//           }, 1500)

			//         },
			//         fail: res => {
			//           uni.showToast({
			//             title: '支付失败',
			//             icon: 'none'
			//           })
			//         },
			//         complete: res => {

			//         }
			//       })

			//     }).catch(res => {
			//       uni.hideLoading()
			//     })
			// },
			//退款列表
			Orderrefund() {
				NET.request(API.Orderrefund, {
					orderId: this.orderId,
				}, 'GET').then(res => {
					this.Orderrefundlist = res.data
				}).catch(res => {})
			},
			//申请退款
			applyMoneyAllTap() {
				console.log(111)
				if (this.Orderrefundlist.length == 0) {
					uni.showToast({
						title: '您所有商品已经申请退款，请勿重复申请',
						icon: 'none'
					})
					return
				}
				uni.setStorageSync('afterSaleApplyRefund', this.Orderrefundlist)
				uni.navigateTo({
					url: `afterSaleApplyRefund?orderId=${this.orderId}&sellPriceitem=${this.dataList.price}`,
				})
			},
			//确认收货
			confirmReceiptTap() {
				uni.showModal({
					title: '温馨提示',
					content: '确定您已经收到货物，否则会造成财产损失',
					confirmText: '确定收到',
					cancelText: '点错了',
					success: res => {
						if (res.confirm) {
							this.confirmReceiveGooods()
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},
			//确认收货
			confirmReceiveGooods() {
				uni.showLoading({
					title: '确认中...',
				})
				NET.request(API.ConfirmReceive, {
					orderId: this.dataList.orderId
				}, 'POST').then(res => {
					uni.hideLoading()
					uni.showToast({
						title: '确认成功',
					})
					uni.navigateTo({
						url: "index?type=4"
					})
				}).catch(res => {
					uni.hideLoading()
				})
			},
			// 申请售后
			applyTap() {
				uni.navigateTo({
					url: 'afterSaleApply?item=' + JSON.stringify(this.item),
				})
			},
			// 支付类型变更
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
			// 重新计算花呗分期的手续费
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
			//花呗分期数变更
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
			},
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
		background: #f7f7f7;
	}

	.logistics {
		padding: 20upx 20upx;
	}

	.content {
		padding: 0 0 120upx 0;
	}

	.order-details-status {
		width: 750upx;
		height: 230upx;
		// background: linear-gradient(90deg, rgba(0, 229, 95, 1.0), rgba(0, 170, 73, 1));
		background-color: #00AA49;
		border-radius: 0 0 40upx 40upx;
	}

	.status-title-box {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 40upx 30upx 0;
		box-sizing: border-box;
	}

	.status-title-box2 {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 40upx 30upx 0;
		box-sizing: border-box;
	}

	.status-title-box .l {
		display: flex;
		flex-direction: column;
	}

	.status-title-box .l .status,
	.status-title-box2 .status {
		font-size: 30upx;
		color: #fff;
	}

	.status-title-box .l .label,
	.status-title-box2 .label {
		font-size: 24upx;
		color: #fff;
		margin-top: 14upx;
	}

	.status-title-box .r {
		width: 80upx;
		height: 80upx;
	}

	.order-details-info-box {
		padding: 0 30upx;
		box-sizing: border-box;
		margin-top: -80upx;
	}

	.address-box {
		margin-top: 20upx;
		background: #fff;
		border-radius: 10upx;
		width: 100%;
		padding: 30upx;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.address-box .address-img {
		width: 70upx;
		height: 70upx;
		margin-right: 20upx;
	}

	.address-box .address-r {
		flex: 1;
		display: flex;
		flex-direction: column;
		font-size: 28upx;
		color: #333;
	}

	.arrow-right-img {
		width: 24upx;
		height: 24upx;
		margin-left: 20upx;
	}

	.address-name-box {
		font-size: 30upx;
		color: #333;
	}

	.phone {
		font-size: 24upx;
		color: #999;
		margin-left: 20upx;
	}

	.address-info {
		font-size: 28upx;
		color: #333;
		margin-top: 15upx;
	}

	.order-list-box {
		margin-top: 20upx;
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
		width: 34upx;
		height: 34upx;
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
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.product-sku {
		font-size: 24upx;
		color: #999;
		display: inline-block;
		margin-left: -20upx;
		display: flex;
		flex-direction: row;
	}

	.price-box {
		display: flex;
		flex-direction: column;
	}

	.product-price1 {
		font-size: 24upx;
		color: #333;
		font-weight: 400;
	}

	.product-price2 {
		font-size: 24upx;
		color: #999;
		text-decoration: line-through;
		font-weight: 400;
	}

	.product-price .fuhao {
		font-size: 28upx;
	}

	.item-applay-btn {
		height: 50upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 0 30upx;
		background: rgba(255, 255, 255, 1);
		border: 1px solid rgba(187, 187, 187, 1);
		border-radius: 25upx;
		font-size: 24upx;
		font-weight: 400;
		color: rgba(51, 51, 51, 1);
	}

	.product-num {
		font-size: 28upx;
		color: #999;
		display: inline-block;
	}

	.delivery-way-box {
		display: flex;
		flex-direction: column;
		margin: 30upx 0 10upx;
	}

	.delivery-way-box .item {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		font-size: 26upx;
		color: #333;
	}

	.delivery-way-box .item .way {
		color: #999;
	}

	.order-total-box {
		padding: 30upx 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		font-size: 26upx;
		color: #333;
	}

	.order-total-box .way-color {
		color: #ff7911;
	}

	.order-details-information {
		background: #fff;
	}

	.order-details-information.padd {
		padding: 30upx;
		box-sizing: border-box;
	}

	.order-details-information .order-title {
		font-size: 30upx;
		color: #333;
		font-weight: 500;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.order-details-information .order-title .line {
		width: 4upx;
		height: 30upx;
		background: #ff7911;
		margin-right: 10upx;
	}

	.order-details-information .info-box {
		margin-top: 30upx;
	}

	.order-details-information .info-box .item {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		font-size: 24upx;
		color: #666;
		margin-bottom: 20upx;
	}

	.order-details-information .info-box .item .copy-color {
		font-size: 24upx;
		color: #ff7911;
	}

	.order-details-btn {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		min-height: 140upx;
		background: #fff;
		box-shadow: 0px 0px 10px 0px rgba(51, 51, 51, 0.1);
		box-sizing: border-box;
		display: flex;
		padding: 0 30upx;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		z-index: 10;
	}

	.order-details-btn .btn {
		width: 100%;
		height: 80upx;
		background: linear-gradient(90deg, rgba(255, 162, 0, 1), rgba(255, 121, 17, 1));
		border-radius: 40upx;
		font-size: 28upx;
		color: #fff;
		text-align: center;
		line-height: 80upx;
		font-weight: 500upx;
	}

	.order-details-btn .btn-l {
		width: 216upx;
		height: 80upx;
		border: 1px solid #bbb;
		border-radius: 40upx;
		font-size: 28upx;
		color: #999;
		text-align: center;
		line-height: 80upx;
		box-sizing: border-box;
	}

	.order-details-btn .btn-r {
		width: 454upx;
	}

	.mt20 {
		margin-top: 20upx;
	}

	.order-title-box {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.order-details-information .order-title-box .order-title.padd-l {
		padding-left: 30upx;
	}

	.arrow-down-img {
		width: 40upx;
		height: 40upx;
		margin: 30upx;
		box-sizing: border-box;
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

	.emptyOrder-box {
		padding: 70upx 0;

		.emptyOrder-img {
			width: 200upx;
			height: 200upx;
		}
	}

	.clusterback {
		width: 80rpx;
		height: 80rpx;
		background-color: #FFFFFF;
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
