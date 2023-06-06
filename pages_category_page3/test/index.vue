<template>
	<view class="">

	</view>
</template>

<script>
	export default {
		data() {
           return {
			   
		   }
		},
		onLoad() {
			console.log("进入了过渡页",123123123);
			// 
			uni.switchTab({
				url: "/pages/tabbar/user/index"
			})
		},
		onShow() {
			console.log("进入了过渡页",123123123);
			// 
			uni.switchTab({
				url: "/pages/tabbar/user/index"
			})
			
		}
	}
</script>

<style>
</style>