<template>
	<view class="loading-box" v-show="canvasLoading">
	</view>
</template>

<script>
	import store from '../config/mixin/store'
	export default {
		name: 'loading-toast',
		data() {
			return {
				canvasLoading: true
			}
		},
		computed: {
			loadNum() {
				return store.state.loadNum
			}
		},
		watch: {
			loadNum(newVal, oldVal) {
				if (newVal === 0) {
					this.canvasLoading = false
					uni.hideLoading()
				}
			}
		},
		methods: {
			setCanvasLoading(status) {
				this.canvasLoading = status
				if(status){
					uni.showLoading({
						title: '加载中...'
					})
				} else {
					uni.hideLoading()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.loading-box{
		position: fixed;
		width: 100%;
		height: 100%;
		background-color: #fff;
		top: 0;
		left: 0;
		z-index: 99;
	}
</style>
