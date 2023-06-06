<!-- 取消订单页面 -->
<template>
	<view class="content">
		<view>
			<view class="header-quxiao">
				<view>
					取消原因
				</view>
				<view style="color: red;">
					{{orderState.reason}}
				</view>
			</view>

			<view class="header-quxiao">
				<view>
					申请时间
				</view>
				<view style="color: red;">
					{{orderState.createTime}}
				</view>
			</view>
			<view class="header-quxiao">
				<view>
					订单状态
				</view>
				<view style="color: red;">
					{{orderState.approvestate}}
				</view>
			</view>

			<view class="header-quxiao" v-if=" orderState.approveTime &&
          orderState.approveTime != '' && isDate">
				<view>
					审批时间
				</view>
				<view style="color: red;">
					{{orderState.approveTime}}
				</view>
			</view>


			<view class="header-quxiao" v-if="orderState.remark && orderState.remark != ''">
				<view>
					备注
				</view>
				<view style="color: red;">
					{{orderState.remark}}
				</view>
			</view>
		</view>



		<view class="header-quxiao" v-if="isShenhe">
			<view>
				是否同意
			</view>
			<u-radio-group v-model="value">
				<u-radio v-for="(item, index) in list" :key="index" :name="item.name" @change="radioChange(item)"
					:disabled="item.disabled">
					{{item.name}}
				</u-radio>
			</u-radio-group>
		</view>

		<view class="header-quxiao" v-if="isShenhe">
			<view>
				备注
			</view>
			<u-input v-model="quxiaoFrom.remark" type="textarea" border placeholder="请输入订单取消原因" auto-height />
		</view>
		
		<view class="tijiao" @click="quxiaodingdan" v-if="isShenhe">提交</view>
	</view>
	
	</view>
</template>

<script>
	import {
		getApplyCancel, //获取取消订单的详情,普通订单
		approveCancelOrder, //审核申请,普通订单
		checkPointOrdercancel,//审核,积分订单
		pointcancelById,//订单状态
	} from '../../api/shopmanage.js'
	export default {
		data() {
			return {
				quxiaoFrom: {
					remark: '', //驳回原因
					approvestate: 1, //是否驳回, 1-同意 0-不同意
					orderId: 0, //订单id
				}, //取消订单需要的参数
				orderState: {},
				list: [{
						name: '同意',
						value: 1,
					},
					{
						name: '驳回',
						value: 0,
					},
				],
				// u-radio-group的v-model绑定的值如果设置为某个radio的name，就会被默认选中
				value: '同意',
				isJiFen:false,
				buyerUserId:'',
			}
		},
		onLoad(options) {
			if (options.orderId != undefined) {
				this.quxiaoFrom.orderId = options.orderId
			}
			if (options.shopId != undefined) {
				this.quxiaoFrom.shopId = options.shopId
			}
			if (options.isJiFen != undefined) {
				this.isJiFen = options.isJiFen
			}
			if (options.buyerUserId != undefined) {
				this.buyerUserId = options.buyerUserId
			}
			this.orderXiangqing()
		},
		computed: {
			isDate() {
				return typeof this.orderState.approveTime != 'object';
			},
			isShenhe() {
				return this.orderState.approvestate == "审核中";
			},
		},
		methods: {
			radioChange(e) {
				this.quxiaoFrom.approvestate = e.value
			},
			orderXiangqing() {
				if(this.isJiFen){
					pointcancelById(this.quxiaoFrom.orderId).then(res => {

					this.orderState = res.data
			
				})
				}else{
					getApplyCancel(this.quxiaoFrom.orderId).then(res => {
					
						this.orderState = res.data
						console.log(res.data.id, '查看订单的状态')
					})
				}
			
			},
			// 取消订单
			quxiaodingdan() {
				console.log(this.quxiaoFrom, 9988)
				if (this.quxiaoFrom.remark == '') {
					uni.showToast({
						title: '请填写备注',
						icon: 'none',
						duration: 1500
					});
					return
				}
				uni.showModal({
					title: '温馨提示',
					content: '您确定要执行该操作吗？',
					confirmText: '确定取消',
					cancelText: '点错了',
					success: res => {
						if (res.confirm) {
							if(this.isJiFen){
								//积分订单取消
								let obj = {...this.quxiaoFrom}
								obj.buyerUserId = this.buyerUserId
								obj.orderFormid = obj.orderId
								checkPointOrdercancel(obj).then(res => {
									uni.showToast({
										title: '提交成功',
										icon: 'none',
										duration: 1500
									});
									setTimeout(() => {
										uni.navigateBack({
											delta: 1
										});
									}, 1500)
								})
								
							}else{
								approveCancelOrder(this.quxiaoFrom).then(res => {
									uni.showToast({
										title: '提交成功',
										icon: 'none',
										duration: 1500
									});
									setTimeout(() => {
										uni.navigateBack({
											delta: 1
										});
									}, 1500)
								})
							}
						
						} else if (res.cancel) {
							// uni.showToast({
							// 	title: '已取消',
							// 	icon: 'none',
							// 	duration: 1000
							// });
						}
					}
				})

			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		padding: 20rpx;
		box-sizing: border-box;

		.header-quxiao {

			// display: flex;
			// flex-direction: column;
			// justify-content: space-around;
			// height: 200rpx;
			view {
				font-weight: 600;
				margin: 25rpx 0rpx;
			}
		}

		.tijiao {
			position: fixed;
			z-index: 99;
			bottom: 40rpx;
			left: 50%;
			width: 85%;
			height: 80rpx;
			background-color: rgb(0, 170, 73);
			text-align: center;
			line-height: 80rpx;
			font-size: 36rpx;
			font-weight: 600;
			border-radius: 10rpx;
			transform: translateX(-50%);
		}
	}
</style>
