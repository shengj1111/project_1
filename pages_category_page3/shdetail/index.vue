<template>
	<view class="conssh">
       <view class="projects" v-for="(item,index) in list" :key="index">
			<view class="">
				<text>经销商:</text>
				<text>{{item.name}}</text>
			</view>
			
			<view class="">
				<text>单号:</text>
				<text>{{item.danhao}}</text>
			</view>
			
			<view class="">
				<text>商品:</text>
				<text>{{item.products}}</text>
			</view>
			
			<view class="">
				<text>商品数量:</text>
				<text>{{item.productnum}}</text>
			</view>
			
			<view class="">
				<text>送货时间:</text>
				<text>{{item.shdh}}</text>
			</view>
		</view>	    
	</view>
</template>

<script>
	export default{
		data(){
			return {
				list:[
					{
						name:"经销商A",
						danhao:"12312312316681723",
						products:"多功能墙面加固剂",
						shdh:"2023-5-30",
						productnum:12
					},
					{
						name:"经销商A",
						danhao:"12312312316681723",
						products:"多功能墙面加固剂2",
						shdh:"2023-5-30",
						productnum:13
					}
				]
			}
		},
		methods:{
			
		}
	}
</script>

<style scoped lang="scss">
	.conssh{
		padding: 20rpx 20rpx;
		width: 100vw;
		min-height: 100vh;
		background-color: #f1f1f1;
	}
	.projects{
		margin-bottom: 20rpx;
		padding: 20rpx 20rpx;
		height: 400rpx;
		background-color: #fff;
		border-radius: 20rpx;
		box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, .1);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	text:nth-child(1){
		display: inline-block;
		width: 120rpx;
		text-align: right;
		margin-right: 20rpx;
		font-weight: bold;
	}
</style>