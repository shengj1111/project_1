<!-- 订单中心 -->
<template>
	<view class="container">
		<view>订单备注</view>
		<view class="content">
			<textarea auto-height placeholder='请输入商家订单备注' v-model="beizhuForm.platformRemark"/>
		</view>
		<view>
			<!-- <u-button type='default' size='mini' @click.stop="cancelRemark">取消</u-button> -->
			<u-button type='success' @click.stop="confirmRemark">确定</u-button>
		</view>
	</view>
</template>

<script>
	import {
		shangjiabeizhu
	} from '../../api/shopmanage.js'


	export default {
		data() {
			return {
				beizhuForm: {
					orderId: 0, //订单id
					platformRemark: '', //商家的备注
				}
			}
		},
		onLoad(options) {
			this.beizhuForm.orderId = options.orderId
		},
		onShow() {

		},


		methods: {
			confirmRemark() {
				shangjiabeizhu(this.beizhuForm).then(res => {
					uni.showToast({
						title: '备注成功',
						duration: 1500
					});
					setTimeout(()=>{
						this.beizhuForm.platformRemark = ''
						uni.navigateBack()
					},1500)
				})
			},


		}
	}
</script>

<style lang="scss">
	.container {
		margin: 20rpx;

		.content {
			margin: 30rpx 0;

			textarea {
				width: 100%;
			}
		}
	}
</style>
