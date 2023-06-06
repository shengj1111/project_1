<template>
	<view class="container">
		<!-- 评论详情 -->
		<view class="evaluate-contentbox">
			<view class="evaluate-content flex-items flex-row flex-sp-between">
				<view class="flex-items">
					<image class="user-headSmallImg" v-if="commentVOList.headImage" :src="commentVOList.headImage"></image>
					<image class="user-headSmallImg" src="../../static/images/storeLogo.png" v-else ></image>
					<label class="fs28 mar-left-20" v-if="commentVOList.name">{{commentVOList.name}}</label>
					<label class="fs28 mar-left-20" v-else>匿名</label>
				</view>
				<label class="font-color-999 fs22">{{commentVOList.createTime}}</label>
			</view>
			<view class="fs22 font-color-999 mar-top-10">
				{{commentVOList.value}}
			</view>
			<view class="fs26 pad-topbot-20">{{commentVOList.comment}}</view>
			<view class="evaluateImg-box" v-if="commentVOList.image">
				<view v-for="(cItem, index) in imageList" :key="index" @click="previewImg(1, index)">
					<image class="evaluate-Img" :src="cItem"></image>
				</view>
			</view>
			<view class="addComments-box flex-column-plus" v-if="commentVOList.addComment">
				<label class="font-color-FF7800 mar-top-30">用户追评</label>
				<label class="mar-top-20">{{commentVOList.addComment}}</label>
				<view class="evaluateImg-box mar-top-20" v-if="commentVOList.addImage">
					<view v-for="(dItem, index) in imgDataResult" :key="index" @click="previewImg(2, index)">
						<image class="evaluate-Img" :src="dItem"></image>
					</view>
				</view>
			</view>
			<view class="goodsDes-box flex-column-plus mar-top-30">
				<view class="flex-row-plus" @click="goGoodsDetails">
					<image class="goodsDes-img" :src="commentVOList.productImage"></image>
					<view class="goodsDesText-box">
						<label class="fs26 goodsDes-text">{{commentVOList.productName}}</label>
						<view class="mar-top-70">
							<label>¥ {{commentVOList.productPrice}}</label>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="linkBox">
			<view class="butBox flex-row-plus" v-if="commentVOList.addComment != ''">
				<view class="addPraise-box1 flex-items-plus" @click="zanTap">
					<image class="addPraise-icon" src="../../static/images/addPraiseIcon.png"></image>
					<label class="mar-left-10">点赞</label>
				</view>
			</view>
			<view class="butBox flex-row-plus" v-else>
				<view class="addComments-box flex-items-plus" @click="addCommentsClick()">
					<image class="addComments-cion" src="../../static/images/addCommentsIcon.png"></image>
					<label class="mar-left-10">追加评价</label>
				</view>
				<view class="addPraise-box flex-items-plus" @click="zanTap">
					<image class="addPraise-icon" src="../../static/images/addPraiseIcon.png"></image>
					<label class="mar-left-10">点赞</label>
				</view>
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
				commentVOList:{},
				actionType:true,
        imgDataResult: [],
        imageList: []
			}
		},
		onLoad() {
			this.commentVOList = uni.getStorageSync('commentVOList');
			uni.removeStorageSync('commentVOList')
      this.commentImgData(this.commentVOList.image)
      this.imgDataResultData(this.commentVOList.addImage)
		},
		onBackPress(e) {
			if (e.from === 'navigateBack') {
				return false;
			}
			this.back();
			return true;
		},
		methods: {
			goGoodsDetails(){
				let shopId = this.commentVOList.shopId
				let productId = this.commentVOList.productId
				let skuId = this.commentVOList.skuId
				uni.navigateTo({
					url:'/pages_category_page3/merchants/goodsDetails?shopId='+shopId+'&productId='+productId+'&skuId='+skuId
				})
			},
			back(){
				uni.navigateTo({
					url:'userEvaluate'
				})
			},
			commentImgData(imgData){
				this.imageList = imgData.split(",");
				console.log(this.imageList)
			},
      imgDataResultData(imgData){
        this.imgDataResult = imgData.split(",");
        console.log(this.imgDataResult)
      },
			//点赞
			zanTap(){
				this.actionType = this.commentVOList.ifLike == 1 ?0:1
				NET.request(API.LikeOrUnLikeComment,{
				  commentId: this.commentVOList.commentId,
				  ifLike: this.actionType
				},'POST').then(res => {
					this.commentVOList.ifLike =  !this.commentVOList.ifLike
					this.commentVOList.likes = this.commentVOList.ifLike ? this.commentVOList.likes + 1 : this.commentVOList.likes - 1
					if(this.actionType == 1){
						uni.showToast({
						  title: '点赞成功',
						})
					}else{
						uni.showToast({
						  title: '已取消点赞',
						  icon:"none"
						})
					}
				}).catch(res => {
				  uni.hideLoading()
				})
			},
			//追加评论
			addCommentsClick(){
				uni.setStorageSync('addCommentVOList', this.commentVOList);
				uni.navigateTo({
					url:'addEvaluate'
				})
			},
      // 查看图片
      // previewImg(img) {
			//   console.log(img, 'img')
      //   let imgsArray = [];
      //   imgsArray[0] = img
      //   uni.previewImage({
      //     current: 0,
      //     urls: imgsArray
      //   });
      // },
      // 预览图片多张
      previewImg(type, index) {
        let imgsArray = [];
			  if (type === 1) {
          for (let i = 0; i < this.imageList.length - 1; i++) {
            imgsArray.push(this.imageList[i]);
          }
        } else {
          for (let i = 0; i < this.imgDataResult.length - 1; i++) {
            imgsArray.push(this.imgDataResult[i]);
          }
        }
			  console.log(imgsArray, 'imgs')
        uni.previewImage({
          current: index,
          urls: imgsArray,
        });
      },
		}
	}
</script>

<style lang="scss">
	.container{
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
			.goodsDes-box{
				background-color: #F7F7F7;
				padding: 20upx 44upx 20upx 20upx;
				.goodsDes-img{
					width: 180upx;
					height: 180upx;
					border-radius: 10upx;
				}
				.goodsDesText-box{
					width: 416upx;
					margin-left: 30upx;
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
		.butBox{
			margin-left: 30upx;
			.addComments-box{
				height: 80upx;
				width: 345upx;
				background-color: #FFC300;
				color: #FFFFFF;
				border-radius: 40upx 0 0 40upx;
				.addComments-cion{
					width: 36upx;
					height: 36upx;
				}
			}
			.addPraise-box{
				height: 80upx;
				width: 345upx;
				background-image: linear-gradient( 135deg, #FFA100 10%, #FF7911 100%);
				color: #FFFFFF;
				border-radius: 0 40upx 40upx 0;
				.addPraise-icon{
					width: 36upx;
					height: 36upx;
				}
			}
			.addPraise-box1{
				height: 80upx;
				width: 690upx;
				background-image: linear-gradient( 135deg, #FFA100 10%, #FF7911 100%);
				color: #FFFFFF;
				border-radius: 40upx;
				.addPraise-icon{
					width: 36upx;
					height: 36upx;
				}
			}

		}
	}
	.linkBox{
		position: absolute;
		bottom: 20upx;
	}
</style>
