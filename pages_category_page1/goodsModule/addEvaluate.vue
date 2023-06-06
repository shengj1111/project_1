<template>
	<view class="container">
		<!-- 追加评论 -->
		<view class="addEvaluate-box flex-items-plus flex-column-plus">
			<view class="addEvaluate flex-column-plus">
				<view class="addEvaluateTitle-box flex-row-plus mar-top-20 mar-left-20">
					<image class="title-img" :src="productImage"></image>
					<view class="title-textbox overflow">
						<label class="fs24 title-text">{{orderProductVO.productName}}</label>
						<view v-if="orderProductVO.value" class="font-color-999 fs22 mar-top-10">
							{{orderProductVO.value}}
						</view>
						<view v-else class="font-color-999 fs22 mar-top-10">
							默认规格
						</view>
					</view>
				</view>
				<view class="fs26 mar-top-40 mar-left-20">追加评价</view>
				<view class="textarea-box mar-top-20 mar-left-20">
					<textarea class="textarea-text" v-model="commentText" placeholder-style="color:#BBBBBB" placeholder="亲，有什么需要追加的吗"/>
				</view>
				<view class="mar-left-10 mar-top-10">
					<u-upload :action="action" ref="uUpload" :limitType="['png', 'jpg', 'jpeg', 'webp', 'gif', 'image']" :header="headerToken" :form-data="formData"></u-upload>
				</view>
			</view>
		</view>
		<view class="butBox flex-items-plus mar-left-30">
			<view class="submitbut" @click="submitTap">追加评论</view>
		</view>
	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	export default {
		data() {
			return {
				addCommentVOList:{},
				orderProductVO:{},
				commentText:'',
				fileList:[],
				commentImgsFlag:false,
				commentImgs:'',
				action:API.UploadUrl,
				formData:{'folderId': -1},
				headerToken:{Authorization:''},
				productImage:'',
				type:0
			}
		},
		onLoad(options) {
			this.type = options.type;
			if(options.type == 1){
				this.addCommentVOList = uni.getStorageSync('addCommentVOList');
				this.orderProductVO = this.addCommentVOList.skus[0]
				this.productImage = this.orderProductVO.image
			}else{
				this.addCommentVOList = uni.getStorageSync('addCommentVOList');
				this.orderProductVO = this.addCommentVOList
				this.productImage = this.orderProductVO.productImage
			}
			if(options.commentId){
				this.commentId = options.commentId
			}
			uni.removeStorageSync('addCommentVOList')
			const res = uni.getStorageSync('storage_key');
			this.headerToken.Authorization = res.token
		},
		onReady() {
			this.fileList = this.$refs.uUpload.lists
		},
		methods: {
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
				let data = []
				if(this.type == 1){
					data = [{
						commentId:this.commentId,
						image:this.commentImgs,
						comment:this.commentText
					}]
				}else if(this.type == 2){
					data = [{
						commentId:this.addCommentVOList.commentId,
						image:this.commentImgs,
						comment:this.commentText
					}]
				}
				NET.request(API.AdditionalComment,{params:data} , 'POST').then(res => {
				      uni.hideLoading()
				      uni.showToast({
				        title: '追评成功',
				      })
				      setTimeout(() => {
				        uni.redirectTo({
				          url: 'userEvaluate'
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
				width: 40upx;
				height: 40upx;
				margin-top: 100upx;
				margin-left: 100upx;
				border-radius: 10upx;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #BBBBBB;
			}
		}
		.butBox{
			position: absolute;
			bottom: 40upx;
			.submitbut{
				height: 80upx;
				width: 690upx;
				background-image: linear-gradient( 135deg, #FFA100 10%, #FF7911 100%);
				color: #FFFFFF;
				font-size: 28upx;
				border-radius: 40upx;
				text-align: center;
				line-height: 80upx;
			}
		}
	}
</style>
