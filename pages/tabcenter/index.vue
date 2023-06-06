<template>
	<view class="container">
		<u-subsection @change="change" :animation="false" :list="list" :current="current" active-color="#fff" mode="button" buttonColor="#00AA49"></u-subsection>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				list: [{
						name: '店铺会员'
					},{
						name: '门店申请'
					}],
			}
		},
		props:{
			current:{
				type:[Number,String],
				default:0
			}
		},
		methods:{
			change(index){
				switch (index){
					case 0:
					uni.redirectTo({
						url:"/pages_category_page1/applyVip/applyVip",
					})
					break;
					// case 1:
					// uni.redirectTo({
					// 	url:"/pages/distributorapplication/index",
					// })
					// break;
					case 1:
					uni.redirectTo({
						url:"/pages_category_page1/linkOthers/index",
					})
					break;		
					default: 
					consloe.log("默认跳转!")
					break;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		margin-top: 20rpx;
	}
	::v-deep .u-item-bg{
		background-color:#00AA49;
	}
</style>