<template>
	<view class="container">
		<!-- 评论商品 -->
		<view class="addEvaluate-box flex-items-plus flex-column-plus">
			<view class="addEvaluate flex-column-plus">
				<view class="addEvaluateTitle-box flex-row-plus mar-top-20 mar-left-20">
					<image class="title-img" :src="commentData.image"></image>
					<view class="title-textbox overflow">
						<label class="fs24 title-text">{{commentData.productName}}</label>
						<view class="font-color-999 fs22 mar-top-10">
							{{commentData.value}}
						</view>
					</view>
				</view>
				<view class="fs26 mar-top-50 flex-display flex-sp-around">
					<label>宝贝描述</label>
					<u-rate v-model="commentStar" active-color="#FFC300" inactive-color="#b2b2b2" gutter="32" @change="onCommentStarChange"></u-rate>
					<label style="width: 80upx;" v-if="commentStar<2">差</label>
					<label style="width: 80upx;" v-else-if="commentStar<4">好</label>
					<label style="width: 80upx;" v-else>非常好</label>
				</view>
				<view class="textarea-box mar-top-40 mar-left-20">
					<textarea class="textarea-text" v-model="commentText" placeholder-style="color:#BBBBBB" placeholder="聊聊您对宝贝的看法"/>
				</view>
				<view class="mar-left-10">
					<u-upload :action="action" ref="uUpload" :limitType="['png', 'jpg', 'jpeg', 'webp', 'gif', 'image']" :header="headerToken" :form-data="formData"></u-upload>
				</view>
				<!-- <view class="addPicture-box flex-column-plus">
					<label class="addPicture-icon">+</label>
					<label class="fs24 addPicture">图片</label>
				</view> -->
			</view>
		</view>
		<view class="storeEvaluate-box">
			<view class="storeEvaluate flex-start flex-column">
				<view class="fs26 mar-top-30 flex-display flex-sp-around">
					<label>描述相符</label>
					<u-rate v-model="descStar" @change="ondescStarChange" active-color="#FFC300" inactive-color="#b2b2b2" gutter="32"></u-rate>
					<label style="width: 80upx;" v-if="descStar<2">差</label>
					<label style="width: 80upx;" v-else-if="descStar<4">好</label>
					<label style="width: 80upx;" v-else>非常好</label>
				</view>
				<view class="fs26 mar-top-50 flex-display flex-sp-around">
					<label>物流服务</label>
					<u-rate v-model="logisticsStar" @click="onlogisticsStarChange" active-color="#FFC300" inactive-color="#b2b2b2" gutter="32"></u-rate>
					<label style="width: 80upx;" v-if="logisticsStar<2">差</label>
					<label style="width: 80upx;" v-else-if="logisticsStar<4">好</label>
					<label style="width: 80upx;" v-else>非常好</label>
				</view>
				<view class="fs26 mar-top-50 flex-display flex-sp-around">
					<label>服务态度</label>
					<u-rate v-model="serviceStar" @click="onserviceStarChange" active-color="#FFC300" inactive-color="#b2b2b2" gutter="32"></u-rate>
					<label style="width: 80upx;" v-if="serviceStar<2">差</label>
					<label style="width: 80upx;" v-else-if="serviceStar<4">好</label>
					<label style="width: 80upx;" v-else>非常好</label>
				</view>
			</view>
		</view>
		<view class="butBox flex-items-plus">
			<view class="submitbut" @click="submitTap">发表评论</view>
		</view>
	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	export default {
		data() {
			return {
				commentData: {},
				orderId:0,
				commentStar:5,
				descStar:5,
				logisticsStar:5,
				serviceStar:5,
				fileList:[],
				action:API.UploadUrl,
				formData:{'folderId': -1},
				commentText:'',
				commentImgsFlag:false,
				commentImgs:'',
				headerToken:{Authorization:''}

			}
		},
		onLoad() {
			this.commentData = uni.getStorageSync('evaluateItem'),
			this.orderId = uni.getStorageSync('orderId')
			uni.removeStorageSync('evaluateItem')
			uni.removeStorageSync('orderId')
			const res = uni.getStorageSync('storage_key');
			this.headerToken.Authorization = res.token
		},
		onReady() {
			this.fileList = this.$refs.uUpload.lists
		},
		methods: {
			onCommentStarChange(e){
				this.commentStar = e
			},
			ondescStarChange(e){
				this.descStar = e
			},
			onlogisticsStarChange(e){
				this.logisticsStar = e
			},
			onserviceStarChange(e){
				this.serviceStar = e
			},
			submitTap(){
				if (!this.commentText) {
					uni.showToast({
						title: '请先说点什么吧',
						icon: 'none'
					})
					return
				}
				uni.showLoading({
				    title: '提交中...',
				})
				if(this.fileList.length>0){
					this.commentImgsFlag = true
					for(let i=0;i<this.fileList.length;i++){
						this.commentImgs += this.fileList[i].response.data.url+','
					}
				}
				let data = [{
					orderId:this.orderId,
					skuId:this.commentData.skuId,
					productId:this.commentData.productId,
					image:this.commentImgs,
					comment:this.commentText,
					star:this.commentStar,
					des:this.descStar,
					delivery:this.logisticsStar,
					attitude:this.serviceStar
				}]
				NET.request(API.Comment, {
					params:data
				}, 'POST').then(res => {
          uni.hideLoading()
          uni.showToast({
            title: '评价成功',
          })
          setTimeout(() => {
            uni.redirectTo({
              url: '../orderModule/index'
            })
          }, 1500);
        }).catch(res => {
          uni.hideLoading()
          uni.showToast({
            title: res.message,
          })
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F7F7F7;
	}
	.container{
		.addEvaluate-box{
			margin-top: 20upx;
			.addEvaluate{
				width: 690upx;
				height: auto;
				background-color: #FFFFFF;
				border-radius: 10upx;
				padding-bottom: 30upx;
				.addEvaluateTitle-box{
					.title-img{
						width: 90upx;
						height: 90upx;
						border-radius: 4upx;
					}
					.title-textbox{
						width: 530upx;
						margin-left: 20upx;
					}

				}
			}
			.textarea-box{
				.textarea-text{
					width: 610upx;
					height: 200upx;
					background-color: #F5F5F5;
					font-size: 26upx;
					padding: 20upx 20upx;
					border-radius: 10upx;
				}
			}
			.addPicture-box{
				background-color: #F5F5F5;
				width: 150upx;
				height: 150upx;
				margin-top: 40upx;
				margin-left: 20upx;
				border-radius: 10upx;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #BBBBBB;
				.addPicture-icon{
					font-size: 100upx;
					font-weight: 300;
					margin-top: -30upx;
				}
				.addPicture{
					margin-top: -20upx;
				}
			}
		}
		.storeEvaluate-box{
			margin-top: 20upx;
			margin-left: 30upx;
      height: 440upx;
			.storeEvaluate{
				background-color: #FFFFFF;
				width: 690upx;
				height: 270upx;
				border-radius: 10upx;
			}
		}
		.butBox{
			position: fixed;
			bottom: 20upx;
      width: 100%;
			.submitbut{
				height: 80upx;
				width: 690upx;
				background-image: linear-gradient( 135deg, #FFA100 10%, #FF7911 100%);
				color: #FFFFFF;
				font-size: 28upx;
				border-radius: 40upx;
				text-align: center;
				line-height: 80upx;
        margin: 0 auto;
			}
		}
	}
</style>
