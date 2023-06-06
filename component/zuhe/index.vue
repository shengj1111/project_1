<template>
	<view class="">
		<view class="zuhe">
			<view class="d-flex" :style="[fontSize?{fontSize}:{}]">
				<text>10包精装修外墙腻子粉送1包德高II型瓷砖胶</text>
				<text class="mar-left-20 cred">x2</text>
			</view>
			
			<view class="d-flex" :style="[fontSize?{fontSize}:{}]">
				<text>30包精装生态（红）腻子粉送1桶德高K11防水砂浆（滚涂）</text>
				<view class="mar-left-20 cred">
					
					<view class="num">
						x2
					</view>
					<view class="zsyuan">
						赠
					</view>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			fontSize:{
				type:String,
				default:""
			}
		}
	}
</script>

<style lang="scss" scoped>
	.d-flex{
			display: flex;
			align-items: center;
			font-weight: normal;
			text:first-child{
				display: inline-block;
				width:340rpx;
			    overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
		.cred{
			display: flex;
			color: #f43;
			position: relative;
			.zsyuan{
				position: absolute;
				top: -7rpx;
				right: -28rpx;
				font-size: 18rpx;
				width: 30rpx;
				height: 30rpx;
				background-color: #f43;
				color: #fff;
				border: 1rpx solid #ccc;
				border-radius: 50%;
				text-align: center;
			}
		}
</style>