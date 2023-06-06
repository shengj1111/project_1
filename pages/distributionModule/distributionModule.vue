<template>
	<view class="emptyCart-box">
		<image class="emptyCart-img" src="../../static/img/bgnull.png"></image>
		<label class="font-color-999 fs26 mar-top-30">这里空空如也~</label>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	.emptyCart-box{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 170upx;
		.emptyCart-img{
			width: 270upx;
			height: 270upx;
		}
	}
	.container {
		.inStoreBackImg {
			width: 100%;
			height: 100upx;
			background: url(../../static/images/inStoreBackImg.png) no-repeat;
			background-size: 100% 100upx;
			color: #FFFFFF;
		}

		.store-box {
			width: 690upx;

			.storeLogoImg {
				width: 140upx;
				height: 140upx;
			}
		}
	}
</style>
