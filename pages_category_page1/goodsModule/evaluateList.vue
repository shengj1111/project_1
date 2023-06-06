<template>
	<view class="container">
		<!-- 查看全部评论 -->
		<view class="evaluateTag-box"  >
			<view class="evaluateTag-text">
				全部({{commentListLength}})
			</view>
		</view>
		<view class="flex-column-plus evaluateList-box">
			<view class="evaluate-contentbox mar-top-20" v-for="(item,index) in commentList" :key="index">
				<view class="evaluate-content flex-items flex-row flex-sp-between">
					<view class="flex-items">
						<image class="user-headSmallImg" :src="item.headImage"></image>
						<text class="fs28 mar-left-20">{{item.name}}</text>
					</view>
					<text class="font-color-999 fs22">{{item.createTime}}</text>
				</view>
				<view class="fs22 font-color-999 mar-top-10">
					<text>{{item.value}}</text>
				</view>
				<view class="fs26 pad-topbot-20">{{item.comment}}。</view>
				<view class="evaluateImg-box">
					<view v-for="(commentItemImg, cindex) in item.images" :key="index">
						<image @click="previewImg(index,cindex)" class="img-item" :src="commentItemImg"></image>
					</view>
				</view>
        <view class="addEvaluate">
          <view class="addEvaluateText">追加评价：{{item.addComment}}</view>
          <view class="item-image-box" v-if="item.addImages">
            <view v-for="(itemAddImg, imgIndex) in item.addImages" :key="imgIndex">
              <image @click='previewImg(index, imgIndex)' class="img-item" :src="itemAddImg"></image>
            </view>
          </view>
        </view>
			<!-- 	<view class="praisebig-box flex-items flex-row mar-top-30 flex-end">
					<view class="praise-box flex-items flex-row"> -->
						<!-- <image class="praise-icon" src="../../static/images/praiseIcon.png"></image> -->
		<!-- 				<image class="praise-icon" @click="zanTap(index,item.commen0tId,0)" src="../../static/images/praiseActiveIcon.png"
						 v-if="item.ifLike == 1"></image>
						<image class="praise-icon" @click="zanTap(index,item.commentId,1)" src="../../static/images/praiseIcon.png" v-else></image>
						<text class="mar-left-10">{{item.likes}}</text>
					</view>
				</view> -->
			</view>
		</view>
	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	export default {
		data() {
			return {
				commentList:[],
				commentListLength:''
			}
		},
		onLoad(list) {
			this.commentList = JSON.parse(list.commentList)
			this.commentListLength = this.commentList.length
		},
		methods: {
			previewImg(index,cindex){
				let img =  this.commentList[index].images[cindex]
				wx.previewImage({
					current: img, // 当前显示图片的http链接
					urls: [img] // 需要预览的图片http链接列表
				})
			},
			commentImgData(imgData){
				let imgDataResult = []
				imgDataResult = imgData.split(",");
				return imgDataResult
			},
			//点赞
			zanTap(index, likeId, actionType) {
				uni.showLoading({
					title: '提交中...',
				})
				NET.request(API.LikeOrUnLikeComment, {
					commentId: likeId,
					ifLike: actionType
				}, 'POST').then(res => {
					uni.hideLoading()
					this.commentList[index].ifLike = !this.commentList[index].ifLike
					this.commentList[index].likes = this.commentList[index].ifLike ? this.commentList[index].likes + 1 :
						this.commentList[index].likes - 1
				}).catch(res => {
					uni.hideLoading()
				})
			},
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F7F7F7;
	}
	.evaluateTag-box{
		margin-top: 10upx;
		margin-left: 10upx;
		padding-bottom: 10upx;
		display: flex;
		flex-wrap: wrap;
		.evaluateTag-text{
			background-color: #FFE4CC;
			border-radius: 6upx;
			padding: 16upx 14upx;
			color: #656565;
			margin-left: 20upx;
			margin-top: 20upx;
		}
	}
	.container{
		.img-item {
		  width: 223upx;
		  height: 223upx;
		  border-radius: 10upx;
		  margin-right: 10upx;
		  margin-top: 10upx;
		}
		.topLabbig-box{
			padding-bottom: 30upx;
			border-bottom: 1upx solid #EEEEEE;
			background-color: #FFFFFF;
			.topLab-box{
				display: flex;
				justify-content: flex-start;
				flex-wrap: wrap;
				.labtext{
					background-color: #FFE4CC;
					border-radius: 6upx;
					padding: 15upx 15upx;
					margin-left: 20upx;
					margin-top: 20upx;
				}
				.labtext-active{
					background-color: #FF7800;
					border-radius: 6upx;
					padding: 15upx 15upx;
					margin-left: 20upx;
					margin-top: 20upx;
				}
			}
		}
		.evaluateList-box{
			padding-bottom: 30upx;
			.evaluate-contentbox{
				display: flex;
				justify-content: center;
				flex-direction: column;
				padding: 30upx 30upx;
				background-color: #FFFFFF;
				.evaluate-content{
					width: 670upx;
					display: flex;
					justify-content: space-between;
					.user-headSmallImg{
						width: 46upx;
						height: 46upx;
						border-radius: 50%;
					}
				}
				.evaluateImg-box{
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					margin-left: -9upx;
					.evaluate-Img{
						width: 224upx;
						height: 224upx;
						border-radius: 10upx;
						margin-left: 9upx;
						margin-top: 9upx;
					}
				}
        .addEvaluate {
          margin-top: 20upx;
          .addEvaluateText {
            margin: 25upx 0;
          }
        }
				.addCommentsBut{
					width: 150upx;
					height: 56upx;
					border: 1upx solid #FF7800;
					border-radius: 28upx;
					font-size: 26upx;
					line-height: 56upx;
					text-align: center;
					color: #FF7800;
				}
				.praisebig-box{
					border-top: 1upx solid #EEEEEE;
					padding-top: 30upx;
					.praise-box{
						.praise-icon{
							width: 36upx;
							height: 36upx;
						}

					}
				}
				.addComments-box{
					border-top: 1upx solid #EEEEEE;
					margin-top: 35upx;
				}
			}
		}

	}
</style>
