<template>
	<view class="messageCenter">
		<view v-if="messageList.length>0">
			<view v-for="item in messageList" :key='item.noticeId'>
				<view class="messageItem" @click="goToMesDetail(item.noticeId,item.only,item.jump)">
					<view class="messageBox">
						<view class="messageType">
							<view v-if="item.noticeType == 1" class="messageTypeL">
								<!-- <image src="../../static/assets/images/cereshop/tongzhi2x.png" alt=""></image> -->
								<span>订单消息</span>
							</view>
							<view v-else class="messageTypeL">
								<!-- <image src="../../static/assets/images/cereshop/xitonggonggao2x.png" alt=""></image> -->
								<span>系统公告</span>
							</view>
							<view class="messageTypeR">{{item.createTime}}</view>
						</view>
						<view class="messageInfo mar-left-35 mar-right-35">
							<rich-text :nodes="item.htmlData"></rich-text>
						</view>

					</view>
					<view class="messageBtn">
						<span class="viewDetail">查看详情</span>
						<span class="arrow"></span>
					</view>
				</view>
			</view>
		</view>
		<view v-else class="mar-top-60 empty-box">
			<image class="question-empty" src="../../static/images/questionEmpty.png"></image>
			<view class="tohome-box flex-items-plus">暂无消息</view>
		</view>
	</view>
</template>

<script>
	import parse from 'mini-html-parser2';
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	export default {
		data() {
			return {
				list: 3,
				messageList: [],
				page: 1,
				pageSize: 5,
				loadingType: 0,
			}
		},
		onLoad() {
			this.getAllMessage()
		},
		onReachBottom() {
			if (this.loadingType == 1) {
				uni.stopPullDownRefresh()
			} else {
				this.page = this.page + 1
				this.getAllMessage()
			}
		},
		methods: {
			parseText(html) {
				parse(html, (err, htmlData) => {
					console.log(htmlData)
					return htmlData
				})
			},
			formatRichText(html) {
				let newContent = html.replace(/<img[^>]*>/gi, function(match, capture) {
					match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
					match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
					match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
					return match;
				});
				newContent = newContent.replace(/style="[^"]+"/gi, function(match, capture) {
					match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi,
						'max-width:100%;');
					return match;
				});
				newContent = newContent.replace(/<br[^>]*\/>/gi, '');
				newContent = newContent.replace(/\<img/gi,
					'<img style="max-width:100%;height:auto;display:block;margin-top:0;margin-bottom:0;"');
				return newContent;
			},
			getAllMessage() {
				uni.showLoading({
					title:'加载中...'
				})
				NET.request(API.getMessage, {
					'page': this.page,
					'pageSize': this.pageSize
				}, 'GET').then(res => {
					uni.hideLoading()
					if (res.data.length == 0) {
						this.loadingType = 1
						this.page = this.page
					} else {
						let _messageList = this.messageList.concat(res.data.list)
						this.messageList = _messageList.map((item)=>{
							let newContent = item.noticeContent.replace(/<img[^>]*>/gi, function(match, capture) {
								match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
								match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
								match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
								return match;
							});
							newContent = newContent.replace(/style="[^"]+"/gi, function(match, capture) {
								match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi,
									'max-width:100%;');
								return match;
							});
							newContent = newContent.replace(/<br[^>]*\/>/gi, '');
							newContent = newContent.replace(/\<img/gi,
								'<img style="max-width:100%;height:auto;display:block;margin-top:0;margin-bottom:0;"');
							// return newContent;
							parse(newContent, (err, htmlData) => {
								item.htmlData = htmlData
							})
							return item
						})
					}
				}).catch(res => {
					uni.hideLoading()
					uni.showToast({
						title: '失败',
						icon: "none"
					})
				})
			},
			goToMesDetail(noticeId, only, jump) {
				if (jump == 2) {
					uni.navigateTo({
						url: "../../pages_category_page1/orderModule/orderDetails?orderId=" + only + '&noticeId=' +
							noticeId
					})
				} else {
					uni.navigateTo({
						url: 'messageDetail?noticeId=' + noticeId
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.messageCenter {
		background: #f7f7f7;
		padding: 30upx;
		height: 100%;
		width: 100%;

		.empty-box {
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;

			.tohome-box {
				color: #999999;
				margin-top: 50rpx;
			}

			.question-empty {
				width: 270rpx;
				height: 270rpx;
			}
		}

		.messageItem {
			width: 100%;
			background: #FFFFFF;
			border-radius: 16upx;
			margin-bottom: 38upx;

			.messageBox {
				.messageType {
					padding: 30upx;
					display: flex;
					align-items: center;
					justify-content: space-between;

					.messageTypeL {
						display: flex;
						align-items: center;
						image {
							width: 54upx;
							height: 54upx;
							border-radius: 50%;
							margin-right: 20upx;
						}

						span {
							font-size: 32upx;
							color: #333333;
						}
					}

					.messageTypeR {
						color: #999999;
						font-size: 26upx;
					}
				}

				.messageInfo {
					padding-bottom: 35upx;
					border-bottom: 1upx solid #EEEEEE;

					img {
						width: 100%;
						margin-bottom: 25upx;
					}

					p {
						padding: 0 40upx;
						color: #999999;
						font-size: 28upx;
					}
				}
			}

			.messageBtn {
				height: 88upx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 40upx;

				.viewDetail {
					color: #333333;
					font-size: 28upx;
				}

				.arrow {
					display: block;
					width: 28upx;
					height: 28upx;
					background: url("../../static/images/arrowRight.png") no-repeat center center;
					background-size: contain;
				}
			}
		}
	}
</style>
<style>
	page {
		background: #f7f7f7;
	}
</style>
