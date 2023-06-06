<template>
	<view class="isshareShow" v-show="isshareShow">
		<!-- <u-mask :show="true" class="flex-items-plus flex-row"> -->
			<view class="share-box">
				<view class="inactive-box flex-items-plus flex-column-plus">
					<view class="flex-row-plus">
						<view class="fs36 mar-left-60">邀请好友</view>
						<view @click="cancel" class="close-btn">
							<image class="close-icon" src="../static/images/close.png"></image>
						</view>
					</view>
					<view class="mar-top-50 flex-row-plus">
						<!-- <view class="flex-column-plus flex-items-plus">
							<view class="weixin-box flex-items-plus">
								<image src="../static/img/weixin2x.png"></image>
							</view>
							<label class="fs24 mar-top-20">微信</label>
						</view>
						<view class="flex-column-plus flex-items-plus mar-left-50">
							<view class="weixin-box flex-items-plus">
								<image src="../static/images/qq2x.png"></image>
							</view>
							<label class="fs24 mar-top-20">QQ</label>
						</view>
						<view class="flex-column-plus flex-items-plus mar-left-50">
							<view class="weixin-box flex-items-plus">
								<image src="../static/images/weibo2x.png"></image>
							</view>
							<label class="fs24 mar-top-20">微博</label>
						</view> -->
						<view class="copy-color " :data-clipboard-text="url" @click="copy">
							<view class="weixin-box flex-items-plus">
							</view>
							<label class="fs24 mar-top-20">链接</label>
						</view>
					</view>
				</view>
			</view>
		<!-- </u-mask> -->
	</view>
</template>

<script>
	import ClipboardJS from "clipboard"
  import UImage from "../uview-ui/components/u-image/u-image";
	export default {
    components: {UImage},
    props:{
			isshareShow:{
				type:Boolean,
				dafault:false
			},
			url:{
				type:String,
				dafault:''
			}
		},
		name:"share",
		data() {
			return {

			};
		},
		methods:{
			cancel(){
				this.$emit('shareCancel')
			},
			copy() {
				// #ifndef H5
				uni.setClipboardData({
				    data: this.url,
				    success: function () {
				        uni.showToast({
							title:'复制成功',
							icon:'success'
						})
				    }
				});
				// #endif
				// #ifdef H5
				let clipboard = new ClipboardJS('.copy-color');
				clipboard.on('success', function (e) {
				   uni.showToast({
									title:'复制成功',
									icon:'success'
								})
				   clipboard.destroy();
				})
				clipboard.on('error', function (e) {
				   uni.showToast({
				   	title:'复制失败',
				   	icon:'success'
				   })
				   clipboard.destroy();
				})
				// #endif
			},
		}
	}
</script>

<style lang="scss">
	.isshareShow{
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		background-color: #636363;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 999;
	}
.close-btn{
	position: relative;
	left: 120rpx;
}
.close-icon{
	width: 46rpx;
	height: 46rpx;
}
.copy-color{
	display: flex;
	justify-content: center;
	align-items:center;
	flex-direction: column;
}
.share-box{
	background-color: #FFFFFF;
	width: 550rpx;
	height: 380rpx;
	border-radius: 20rpx;
}
.inactive-box{
	padding: 40rpx 40rpx;
	.weixin-box{
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
    background: url("../static/img/lianjie.png") no-repeat center center;
    background-size: contain;
		image{
			width: 55rpx;
			height: 55rpx;
		}
	}
}
</style>
