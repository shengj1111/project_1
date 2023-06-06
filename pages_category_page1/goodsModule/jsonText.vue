<template>

	<view class="container">
		<rich-text :nodes="jsonText"></rich-text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				jsonText: '',
			}
		},
		onLoad() {

		},
		onShow() {
			let jsonT = uni.getStorageSync('jsonText')
			this.jsonText = jsonT.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ')
			uni.removeStorageSync('jsonText')
		},
		onReady() {

		},
		methods: {


		}
	}
</script>

<style lang="scss">
.container{
	margin: 30rpx;
}

</style>
