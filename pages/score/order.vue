<template>
	<view class="content">
		<view class="item">
			{{data.status}}
		</view>
		<view class="item">
			<image :src="$Img(data.goods_thumb)" mode="aspectFill"></image>
			<view class="cont">
				<view class="center">
					<view class="title">
						{{data.goods_name}}
					</view>
					<view class="price">
						<u-icon name="rmb" size="28"></u-icon><span>{{data.score}}</span>
					</view>
				</view>
			</view>
		</view>
		<view class="item">
			订单编号：{{data.order_id}} <span class="copytag" @click="copy(data.order_id)">复制</span>
		</view>
		<view class="item">
			地址：{{data.user_address}}
		</view>
	</view>
</template>

<script>
import {
	getOrderXp,//获取订单详细
} from '@/api/score.js'
export default {
	data(){
		return {
			id:"",
			data:{
				"id": "",
				"status": "",
				"order_id": "",
				"user_address": "",
				"goods_thumb": "",
				"goods_name": "",
				"score": ""
			}
		}
	},
	methods:{
		copy(data){
			//复制订单号
			uni.setClipboardData({
				data: data + '',
				success: function (res) {
					console.log(res,"复制成功");
				}
			});
		},
		getInfo(id){
			//获取订单详细
			getOrderXp(id).then(res => {
				console.log(res,"获得订单详细");
				this.data = res.data[0]
				this.data.status = this.recordStatus(res.data[0].status)
			})
		},
		recordStatus(index){
			return ['已兑换','已发货'][+index - 1]
		}
	},
	onLoad(data){
		this.id = data.id
		this.getInfo(data.id)
	}
}
</script>

<style lang="scss" scoped>
	.content{
		padding: 0 20rpx;
	}
	.copytag{
		margin-left: 12rpx;
		padding: 4rpx 10rpx;
		background-color: #eee;
		color: #444;
		border-radius: 15rpx;
	}
	.item{
		display: flex;
		background-color: #fff;
		padding: 20rpx;
		border-radius: 8rpx;
		margin-top: 20rpx;
		image{
			width: 230rpx;
			height: 230rpx;
			border-radius: 8rpx;
		}
		.cont{
			width: calc(100% - 210rpx);
			display: flex;
			flex-direction: column;
			padding: 0 20rpx 0;
			.top{
				display: flex;
				span{
					margin-left: auto;
					font-size: 32rpx;
				}
			}
			.center{
				display: flex;
				flex-direction: column;
				width: 100%;
				.title{
					font-size: 30rpx;
				}
				.price{
					margin-top: 30rpx;
					span{
						font-size: 35rpx;
						font-weight: 600;
					}
				}
			}
		}
	}
</style>
