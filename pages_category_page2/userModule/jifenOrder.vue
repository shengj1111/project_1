<!-- 订单中心 -->
<template>
	<view class="container">
		<view style="padding-bottom:68upx;">
			<!-- 订单分类 -->
			<view>
				<u-tabs :list="tabList" :is-scroll="false" bg-color="#F7F7F7" active-color="#00AA49"
					:current="getOrderAll.state" @change="orderStateChange"></u-tabs>
			</view>
			<!-- 订单展示 -->
			<view class="order-list-box">
				<!-- 判断商品条数是否有没有 -->
				<view v-if="listTotal > 0">
					<view class="goodsItem" v-for="(item, index) in list" :key="index">
						<!-- 用户信息 -->
						<view class="order-info-box">
							<view class="order-Time">
								<text>{{item.createTime}}</text>
							</view>
							<view class="order-dhhao">
								<text>订单编号: </text>
								<text> {{ item.orderFormid}}</text>
							</view>
							<view class="order-fangshi">
								<text> {{ item.deliveryStateDesc}}</text>
							</view>
						</view>
						<!-- 商品详情 -->
						<view class="order-info-goods">
							<view class="order-info-item my-order-info">
								<image class="product-img" mode="scaleToFill" :src="item.productImg"></image>
								<view class="info-box">
									<text class="product-name">{{item.productName}}</text>
									<view class="price-sku-box">
										<view class="box-h">
											<text class="product-price">
												<text class="fuhao">￥</text>{{item.integral}}
											</text>
											<text class="product-num">x {{item.number}}</text>
										</view>
									</view>
								</view>
								<view class="total-price-box">总积分 ¥ {{item.integral * item.number}}</view>
							</view>
						</view>
						<!-- 收货人部分部分 -->
						<view class="order-info-user" v-if="item.deliveryStateDesc == '配送'">
							<view class="peisong">
								<view class="peisong-row">
									<view class="peisong-row-1">收货人地址:</view>
									<view>{{item.address}}</view>
								</view>
								<view class="peisong-row-my">
									<view>
										<view class="peisong-row-1">收货人姓名:</view>
										<view>{{item.receiveName}}</view>
									</view>
									<view>
										<view class="peisong-row-1">收货人手机号:</view>
										<view>{{item.receivePhone}}</view>
									</view>
								</view>
							</view>
						</view>
						<!-- 合计部分 -->
						<!-- 		<view class="order-info-zong">
							<text>共计{{item.number}}件商品,支付金额:¥{{item.price }}</text>
						</view> -->
						<!-- 操作订单 -->
						<view class="order-btn">
							<text class="text1" @click.stop="fahuoOrder(item)" v-if="item.state == 1 && item.cancelstate != '1'">发货</text>
							<text v-if="item.state != 1" class="text2" @click.stop="delOrder(item)">删除订单</text>
							<!-- <text class="text2" @click.stop="beizhuOrder(item.orderId)">备注订单</text> -->
							<text class="text2" v-if="item.state == 1 && item.cancelstate == ''"
								@click.stop="zhudongquxiao(item,index)">取消订单</text>
										<text class="text2" v-if="item.state == 1 && item.cancelstate == '1'"
								@click.stop="quxiaoOrder(item,index)">订单取消等待审批</text>
							<text class="text2" v-if=" item.cancelstate == '2'"
								@click.stop="quxiaoOrder(item,index)">已通过</text>
							<text class="text2" v-if="item.state == 1 && item.cancelstate == '-1'"
								@click.stop="quxiaoOrder(item,index)">已驳回</text>
						</view>
					</view>
				</view>
				<!-- </view> -->
				<!-- 没有就展示这个 -->
				<view v-else class="emptyOrder-box flex-items-plus flex-column">
					<image class="emptyOrder-img" src="@/static/images/emptyOrderImg.png"></image>
					<label class="font-color-999 fs26 mar-top-30">你还没有订单哦～</label>
				</view>

				<!-- 弹出层 -->
				<u-popup v-model="dialogVisible" mode="center" width="600rpx" height="550rpx">
					<view class="" style="padding: 50rpx;">
						<u-form :model="integralForm" ref="integralForm" label-position='top'>
							<u-form-item label="是否赠送">
								<u-radio-group v-model="integralForm.auditstatus" @change="radioGroupChange">
									<u-radio :name="1">赠送</u-radio>
									<u-radio :name="-1">拒绝赠送</u-radio>
								</u-radio-group>
							</u-form-item>
							<u-form-item label="拒绝原因" v-if="integralForm.auditstatus == -1">
								<u-input v-model="integralForm.rejectmessage" :auto-height="true" type="textarea" />
							</u-form-item>
						</u-form>
						<view class="btn-List">
							<u-button size="medium" @click="dialogVisible = false">取消</u-button>
							<u-button size="medium" @click="submitForm">确定</u-button>
						</view>
					</view>
				</u-popup>
			</view>

		</view>

	</view>
</template>

<script>
	import {
		jifenOrderAll, //查询所有订单
		jifenOrderup, //发货接口

		PointOrdercancel, //商家主动取消
		isPresentedIntegral, //赠送积分
		jifenOrderdel, //删除订单
	} from '@/api/shopmanage.js'


	export default {
		data() {
			return {
				dialogVisible: false, //是否弹出驳回框
				integralForm: {
					rejectmessage: "", //驳回原因
					auditstatus: 1, //是否赠送,-1--拒绝 1--赠送 0--待审核
					orderId: 0, //订单id
				},
				isDecode: true,
				isRemarkShow: false, //商家备注弹出框是否展示
				merchantRemark: '', //商家的备注
				fahuoForm: {
					deliverFormid: '',
					orderId: 0,
					express: "",
				}, //发货表单
				getOrderAll: {
					page: 1,
					pageSize: 20,
					state: 0,
				}, //获取所有订单的表单
				list: [], //所有的订单,来自不同用户,每个用户下单的不同商品

				tabList: [{
						name: '全部',
						number: 0
					}, {
						name: '待发货',
						number: 1
					}, {
						name: '已发货',
						number: 2
					}, {
						name: '已完成',
						number: 3
					}
					, {
						name: '已关闭',
						number: 4
					}

				],
				listTotal: 1, //所有订单的条数,小于0的时候展示没有订单
				loadingType: 0,
				present: '', //选中的快递公司
			}
		},
		onLoad(options) {
			if (options.type) {

				this.getOrderAll.state = options.type
				//this.getListData()
			} else {
				//this.getListData()
			}

		},
		onShow(options) {
			this.list = []
			this.getListData()
			//this.expressageAll()
		},
		onReachBottom() {
			// if (this.loadingType == 1) {
			// 	uni.stopPullDownRefresh()
			// } else {
			// 	this.page = this.page + 1
			// 	this.getListData()
			// }
			this.page = this.page + 1
			this.getListData()
		},


		methods: {
			submitForm() {
				console.log(this.integralForm, '请求参数')
				isPresentedIntegral(this.integralForm).then((res) => {
					console.log(res)
					uni.showToast({
						title: '提交完毕',
						icon: 'none',
						duration: 1000
					});

					setTimeout(() => {
						this.dialogVisible = false;
						this.getListData()
					}, 1000)

				});
			},
			radioGroupChange(val) {
				console.log(val)
			},
			//发货
			fahuoOrder(item) {
				uni.showModal({
					title: '发货',
					//content: '您确定要取消该订单吗？',
					confirmText: '发货', //确定文字的按钮
					cancelText: '取消', //取消文字的按钮
					editable: true,
					placeholderText: '请填写发货备注',
					success: res => {
						console.log(res)
						if (res.confirm) {

							let obj = {};
							obj.id = item.id;
							obj.orderFormid = item.orderFormid
							obj.remark = res.content
							obj.state = 2
							obj.receiveName = item.receiveName
							obj.receivePhone = item.receivePhone
							jifenOrderup(obj).then(res => {
								uni.showToast({
									title: '发货成功',
									icon: 'none',
									duration: 1000
								});
								setTimeout(() => {
									this.page = 1
									this.list = []
									this.getListData()
								}, 1000)
							})


						} else if (res.cancel) {

						}
					}
				})
			},
			//主动取消订单
			zhudongquxiao(item, index) {
				uni.showModal({
					title: '温馨提示',
					//content: '您确定要取消该订单吗？',
					confirmText: '确定取消', //确定文字的按钮
					cancelText: '点错了', //取消文字的按钮
					editable: true,
					placeholderText: '请填写理由',
					success: res => {
						console.log(res)
						if (res.confirm) {
							if (res.content && res.content != '') {
								let obj = {};
								obj.orderFormid = item.orderFormid;
								obj.shopId = item.shopId;
								obj.remark = res.content
								PointOrdercancel(obj).then(res => {
									uni.showToast({
										title: '取消成功',
										icon: 'none',
										duration: 1000
									});
									setTimeout(() => {
										this.page = 1
										this.list = []
										this.getListData()
									}, 1000)
								})
							} else {
								uni.showToast({
									title: '请填写理由',
									icon: "none"
								});
							}

						} else if (res.cancel) {

						}
					}
				})
			},
			quxiaoOrder(item, index) {
				console.log(item, index, 123987)
				uni.navigateTo({
					url: `/pages_category_page3/merchants/shopOrderQuxiao?orderId=${item.orderFormid}&shopId=${item.shopId}&isJiFen=${true}&buyerUserId=${item.buyerUserId}&state=${item.state}`
				})
			},


			//根据不同的分类查询不同的订单
			orderStateChange(index) {
				console.log(index, 'tabs')
				this.getOrderAll.state = this.tabList[index].number
				this.page = 1
				this.list = []
				this.getListData()
			},
			// 获取订单列表数据
			getListData() {
				// if(this.getOrderAll.state == 0){
				// 	this.getOrderAll.state = null
				// }
				uni.showLoading({
					title: '加载中...',
				})
				let obj = {...this.getOrderAll}
				if(obj.state == 0){
					obj.state = null
				}
				jifenOrderAll(obj).then(res => {
					if (res.data.list.length == 0) {
						this.loadingType = 1
						this.page = this.page
					}
					console.log(res.data.list, '所有的订单数据')
					let mylist = res.data.list
					uni.hideLoading()
					this.listTotal = res.data.total
					this.list = this.list.concat(mylist)
					console.log(this.list, '所有修改过的订单数据')
				})

			},
			//备注订单
			beizhuOrder(orderId, index) {
				uni.navigateTo({
					url: 'beizhuOrder?orderId=' + orderId
				})
			},
			//备注订单弹出框的确定按钮
			confirmRemark() {
				this.isRemarkShow = false
			},
			//备注订单弹出框的取消按钮
			cancelRemark() {
				this.isRemarkShow = false
			},

			//通过修改订单按钮切换页面
			cancelOrder(orderId, index) {
				this.$toUrl(`orderDetails?orderId=${orderId}`)
			},

			//删除订单
			delOrder(item) {
				console.log(item)
				uni.showModal({
					title: '温馨提示',
					content: '您确定要删除该订单吗？',
					confirmText: '确定删除',
					cancelText: '点错了',
					success: res => {
						if (res.confirm) {
							let arr = []
							arr.push(item.id)
							jifenOrderdel({
								ids: arr
							}).then(res => {
								uni.showToast({
									title: '删除成功',
									icon: "none",
									duration: 1500
								});
								setTimeout(() => {
									this.page = 1
									this.list = []
									this.getListData()
								}, 1000)
							})
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},
		},

	}
</script>

<style lang="scss">
	page {
		width: 100%;
		height: 100%;
		background: #fff;
	}

	.jiagebufen {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-end;
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

		.goodsItem {
			border-bottom: 1rpx #d3d3d3 solid;
			width: 100%;
			//height: 500rpx;
			margin-bottom: 30rpx;

			.order-info-box {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				font-size: 20rpx;
				color: #989898;
				margin: 20rpx;

				.order-fangshi {
					color: red;
					font-size: 24rpx;
				}
			}

			.order-info-goods {
				margin: 20rpx;
			}

			.order-info-user {
				margin: 20rpx;

				.peisong {
					//height: 300rpx;
					//border: 1rpx red solid;
					display: flex;
					flex-direction: column;

					.peisong-row {
						margin-bottom: 20rpx;

						.peisong-row-1 {
							font-size: 24rpx;
							font-weight: 700;
						}
					}

					.peisong-row-my {
						display: flex;
						flex-direction: row;
						justify-content: space-between;

						.peisong-row-1 {
							font-size: 24rpx;
							font-weight: 700;

						}
					}
				}
			}

			.order-info-zong {
				display: flex;
				flex-direction: row-reverse;
				margin: 20rpx;
				font-size: 22rpx;
			}

			.order-btn {
				display: flex;
				flex-direction: row-reverse;
				margin: 10rpx;

				.text1 {
					border: 1rpx #01983b solid;
					padding: 10rpx 30rpx;
					color: #01983b;
					font-size: 24rpx;
					margin-left: 10rpx;
				}

				.text2 {
					border: 1rpx #828282 solid;
					padding: 10rpx 30rpx;
					color: #828282;
					font-size: 24rpx;
					margin-left: 10rpx;
				}
			}
		}
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





	.my-order-info {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.userTop {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 100rpx;
		font-weight: 700;

	}

	.order-info-item {
		display: flex;
		flex-direction: row;
		padding: 20upx 0;
	}

	.buyNowBut {
		width: 214upx;
		height: 80upx;
		// border-radius: 0 40upx 40upx 0;
		border-radius: 40upx;
		background-color: #00AA49;
		color: #FFFEFE;
		font-size: 28upx;
		line-height: 80upx;
		text-align: center;
		position: fixed;
		bottom: 90rpx;
		left: 37%;
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
		align-self: flex-end;
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
