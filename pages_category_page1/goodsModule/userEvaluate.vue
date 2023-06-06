<template>
	<view class="container">
		<!-- 我的评论 -->
		<view class="evaluateTitle-box flex-row-plus flex-sp-around">
			<view :class="{'evaluateTitle-on' : evaluateTitleFlag == 1}" @click="evaluateTitleClick(1)">全部评价({{myCommentList.total}}）</view>
			<view :class="{'evaluateTitle-on' : evaluateTitleFlag == 2}" @click="evaluateTitleClick(2)">有图({{myCommentList.imageTotal}}）</view>
		</view>
		<view v-if="evaluateTitleFlag == 1" class="mar-top-20">
			<template v-if="myCommentList.total > 0">
				<view class="evaluate-contentbox" @click="commentDetails(index)" v-for="(item, index) in commentVOList" :key="index">
					<view class="evaluate-content flex-items flex-row flex-sp-between">
						<view class="flex-items">
							<image class="user-headSmallImg" v-if="item.headImage" :src="item.headImage"></image>
							<image class="user-headSmallImg" src="../../static/images/storeLogo.png" v-else></image>
							<label class="fs28 mar-left-20" v-if="item.name">{{item.name}}</label>
							<label class="fs28 mar-left-20" v-else>匿名</label>
						</view>
						<label class="font-color-999 fs22">{{item.createTime}}</label>
					</view>
			<!-- 		<view class="fs22 font-color-999 mar-top-10">
						{{item.value}}
					</view> -->
					<view class="fs26 pad-topbot-20">{{item.comment}}</view>
					<view class="evaluateImg-box" v-if="item.image">
						<view v-for="(cItem, index) in commentImgData(item.image)" :key="index">
							<image class="evaluate-Img" :src="cItem"></image>
						</view>
					</view>
					<view class="addComments-box flex-column-plus" v-if="item.addComment">
						<label class="font-color-FF7800 mar-top-30">用户追评</label>
						<label class="mar-top-20">{{item.addComment}}</label>
						<view class="evaluateImg-box mar-top-20" v-if="item.addImage">
							<view v-for="(dItem, index) in commentImgData(item.addImage)" :key="index">
								<image class="evaluate-Img" :src="dItem"></image>
							</view>
						</view>
					</view>
					<view class="goodsDes-box flex-column-plus mar-top-30">
						<view class="flex-row-plus" @click.stop="goGoodsDetails(item.shopId,item.productId,item.skuId)">
							<image class="goodsDes-img" :src="item.productImage"></image>
							<view class="goodsDesText-box">
								<label class="fs26 goodsDes-text">{{item.productName}}</label>
								<view class="mar-top-70">
									<label>¥ {{item.productPrice}}</label>
								</view>
							</view>
						</view>
						<view class="flex-items flex-row mar-top-30 flex-sp-between">
							<view class="addCommentsBut" v-if="item.addComment == ''" @click.stop="addCommentsClick(index)">追加评价</view>
							<view class="addCommentsBut1" v-else></view>
							<!-- <view class="praise-box flex-items flex-row">
								<image class="praise-icon" @click.stop="zanTap(index,item.commentId,0)" src="../../static/images/praiseActiveIcon.png"
								 v-if="item.ifLike"></image>
								<image class="praise-icon" @click.stop="zanTap(index,item.commentId,1)" src="../../static/images/praiseIcon.png"
								 v-else></image>
								<label class="mar-left-10">{{item.likes}}</label>
							</view> -->
						</view>
					</view>
				</view>
			</template>
			<view v-else class="emptyOrder-box flex-items-plus flex-column">
				<!-- <image class="emptyOrder-img" src="../../static/images/totalAwardEmpty.png"></image> -->
				<label class="font-color-999 fs26 mar-top-30">你还没有评论哦～</label>
			</view>
		</view>
		<view v-if="evaluateTitleFlag == 2" class="mar-top-20">
			<template v-if="myCommentList.imageTotal>0">
			<view class="evaluate-contentbox" v-for="(item, index) in commentVOList" :key="index">
				<view class="evaluate-content flex-column" @click="commentDetails(index)" >
					<view class="flex-items">
						<image class="user-headSmallImg" v-if="item.headImage" :src="item.headImage"></image>
						<image class="user-headSmallImg" src="../../static/images/storeLogo.png" v-else></image>
						<label class="fs28 mar-left-20" v-if="item.name">{{item.name}}</label>
						<label class="fs28 mar-left-20" v-else>匿名</label>
					</view>
					<view class="fs22 font-color-999 mar-top-10">
						{{item.value}}
					</view>
					<view class="fs26 pad-topbot-20">{{item.comment}}</view>
					<view class="evaluateImg-box" v-if="item.image">
						<view v-for="(cItem, index) in commentImgData(item.image)" :key="index">
							<image class="evaluate-Img" :src="cItem"></image>
						</view>
					</view>
					<view class="addComments-box flex-column-plus" v-if="item.addComment">
						<label class="font-color-FF7800 mar-top-30">用户追评</label>
						<label class="mar-top-20">{{item.addComment}}</label>
						<view class="evaluateImg-box mar-top-20" v-if="item.addImage">
							<view v-for="(dItem, index) in commentImgData(item.addImage)" :key="index">
								<image class="evaluate-Img" :src="dItem"></image>
							</view>
						</view>
					</view>

					<view class="flex-items flex-row mar-top-30 flex-sp-between">
						<view class="addCommentsBut" v-if="item.addComment == ''" @click.stop="addCommentsClick(index)">追加评价</view>
						<view class="addCommentsBut1" v-else></view>
						<!-- <view class="praise-box flex-items flex-row">
							<image class="praise-icon" @click.stop="zanTap(index,item.commentId,0)" src="../../static/images/praiseActiveIcon.png"
							 v-if="item.ifLike"></image>
							<image class="praise-icon" @click.stop="zanTap(index,item.commentId,1)" src="../../static/images/praiseIcon.png"
							 v-else></image>
							<label class="mar-left-10">{{item.likes}}</label>
						</view> -->
					</view>
				</view>
			</view>
			</template>
			<view v-else class="emptyOrder-box flex-items-plus flex-column">
				<!-- <image class="emptyOrder-img" src="../../static/images/totalAwardEmpty.png"></image> -->
				<label class="font-color-999 fs26 mar-top-30">你还没有评论哦～</label>
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
				evaluateTitleFlag: 1,
				myCommentList: [],
				commentVOList: [],
				state:"",
				page:1,//当前页
				pageSize:20,//每页记录数
				loadingType:0,
			}
		},
		onLoad() {
			this.getMyCommentList()
		},
		onReachBottom(){
			if(this.loadingType == 1){
				uni.stopPullDownRefresh()
			}else{
				this.page = this.page+1
				this.getMyCommentList()
			}
		},
		onBackPress(e) {
			if (e.from === 'navigateBack') {
				return false;
			}
			this.back();
			return true;
		},
		methods: {
			goGoodsDetails(shopId,productId,skuId){
				uni.navigateTo({
					url:'/pages_category_page3/merchants/goodsDetails?shopId='+shopId+'&productId='+productId+'&skuId='+skuId
				})
			},
			back(){
				uni.switchTab({
					url:'../../pages/tabbar/user/index'
				});
			},
			commentImgData(imgData) {
				let imgDataResult = []
				imgDataResult = imgData.split(",");
				return imgDataResult
			},
			evaluateTitleClick(type) {
				if(type == 1){
					this.state = ''
				}else{
					this.state = "1"
				}
				this.page = 1
				this.commentVOList = []
				this.evaluateTitleFlag = type
				this.getMyCommentList()
			},
			//我的评价列表
			getMyCommentList() {
        uni.showLoading({
          title: '加载中...',
          mask: true
        });
				NET.request(API.MyCommentList, {
					page: this.page,
					pageSize: this.pageSize,
					state: this.state
				}, 'GET').then(res => {
          uni.hideLoading()
					if(res.data.page.list.length == 0){
						this.loadingType = 1
						this.page = this.page
					}
					this.myCommentList = res.data
					this.commentVOList = this.commentVOList.concat(res.data.page.list)
				}).catch(res => {
          uni.hideLoading()
          uni.showToast({
            title: res.data.message,
            duration: 2000,
            icon: 'none'
          });
				})
			},
			//点赞
			zanTap(index, likeId, actionType) {
				NET.request(API.LikeOrUnLikeComment, {
					commentId: likeId,
					ifLike: actionType
				}, 'POST').then(res => {
					this.commentVOList[index].ifLike = !this.commentVOList[index].ifLike
					this.commentVOList[index].likes = this.commentVOList[index].ifLike ? this.commentVOList[index].likes + 1 : this.commentVOList[index].likes - 1
					this.commentVOList = []
					this.page = 1
					this.getMyCommentList()
				}).catch(res => {
					uni.hideLoading()
				})
			},
			commentDetails(id) {
				uni.setStorageSync('commentVOList', this.commentVOList[id]);
				uni.navigateTo({
					url: 'evaluateDetails'
				})
			},
			//追加评论
			addCommentsClick(id) {
				uni.setStorageSync('addCommentVOList', this.commentVOList[id]);
				uni.navigateTo({
					url: 'addEvaluate?type=2'
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F7F7F7;
	}

	.container {
		.emptyOrder-box {
			margin-top: 70upx;

			.emptyOrder-img {
				width: 270upx;
				height: 270upx;
			}
		}

		.evaluateTitle-box {
			color: #666666;
			margin-top: 26upx;

			.evaluateTitle-on {
				padding-bottom: 20upx;
				border-bottom: 2upx solid #00AA49;
			}
		}

		.evaluate-contentbox {
			display: flex;
			justify-content: center;
			flex-direction: column;
			padding: 30upx 30upx;
			background-color: #FFFFFF;

			.evaluate-content {
				width: 670upx;
				display: flex;
				justify-content: space-between;

				.user-headSmallImg {
					width: 46upx;
					height: 46upx;
					border-radius: 50%;
				}
			}

			.evaluateImg-box {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				margin-left: -9upx;

				.evaluate-Img {
					width: 224upx;
					height: 224upx;
					border-radius: 10upx;
					margin-left: 9upx;
					margin-top: 9upx;
				}
			}

			.goodsDes-box {
				background-color: #F7F7F7;
				padding: 20upx 44upx 20upx 20upx;

				.goodsDes-img {
					width: 180upx;
					height: 180upx;
					border-radius: 10upx;
				}

				.goodsDesText-box {
					width: 416upx;
					margin-left: 30upx;
				}



				.praise-box {
					.praise-icon {
						width: 36upx;
						height: 36upx;
					}

				}
			}

			.addComments-box {
				border-top: 1upx solid #EEEEEE;
				margin-top: 35upx;
			}
		}
	}
	.praise-icon {
		width: 36upx;
		height: 36upx;
	}
	.addCommentsBut {
		width: 150upx;
		height: 56upx;
		border: 1upx solid #00AA49;
		border-radius: 28upx;
		font-size: 26upx;
		line-height: 56upx;
		text-align: center;
		color: #00AA49;
	}

	.addCommentsBut1 {
		width: 150upx;
		height: 56upx;
		border-radius: 28upx;
		font-size: 26upx;
		line-height: 56upx;
		text-align: center;
	}
</style>
