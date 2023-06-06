<template>
	<view class="question-box">
		<view class="tabsbox">
			<u-tabs :list="questionTypeList" bar-width="140" :bold="false" active-color="#00AA49" inactive-color="#999999"
			 :is-scroll="false" :current="questionTypeFlag" @change="questionTypeActive"></u-tabs>
		</view>
		<view v-if="questionTypeFlag == 0">
			<view v-if="problemList.length>0">
				<view class="wid function-box">
					<view class="finishbox" @click="finishClick" v-if="allCheckShow">完成</view>
					<view v-else class="flex-row-plus editicon-box flex-items fs28" @click="editClick">
						<image class="editicon" src="../../static/images/collectionEditicon.png"></image>
						<text class="mar-left-10">编辑</text>
					</view>
				</view>
				<view class="swipe-box">
					<u-swipe-action :show="item.show" :index="index"
						v-for="(item, index) in problemList" :key="item.problemId"
						@click="problemClick" @open="problemOpen"
						:options="options"
					>
						<view class="flex-item" @click="goQuestionDetails(item.productId,item.problemId)">
							<view class="item u-border-bottom wid flex-row-plus flex-items">
								<view v-show="allCheckShow">
									<image mode="aspectFill" v-if="item.selected == 1" @click.stop="problemItemSel(index,0)" src="../../static/images/selectActive.png" class="cart-select-img"></image>
									<image mode="aspectFill" v-else @click.stop="problemItemSel(index,1)" src="../../static/images/selectEmpty.png" class="cart-select-img"></image>
								</view>
								<image class="product-img" mode="aspectFill" :src="item.image" />
								<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
								<view class="title-wrap replynum-box">
									<text class="title u-line-2 font-weight-bold fs28">{{ item.problem }}</text>
									<text class="font-color-666 fs24" v-if="item.count>0">{{item.count}}条回复</text>
									<text  class="font-color-666 fs24" v-else>暂无回复</text>
								</view>
							</view>
						</view>
						<!-- <view class="borRig-line-20"></view> -->
					</u-swipe-action>
				</view>
				<view v-show="allCheckShow" class="allcheck-box flex-row-plus flex-sp-between flex-items">
					<view class="left">
						<image mode="aspectFill" v-if="isAllProblemCheck" src="../../static/images/selectActive.png" class="cart-select-img" @click="allProblemSel(0)"></image>
						<image mode="aspectFill" v-else src="../../static/images/selectEmpty.png" class="cart-select-img" @click="allProblemSel(1)"></image>
						<text>全选</text>
					</view>
					<view class="right">
						<view class="btn-delete" @click="questionDel(0)">删除</view>
					</view>
				</view>
				<view v-if="allCheckShow" class="pad-bot-140"></view>
			</view>
			<view v-else class="mar-top-60 empty-box">
				<image class="question-empty" src="../../static/images/questionEmpty.png"></image>
				<view class="tohome-box flex-items-plus">暂无问答内容</view>
			</view>
		</view>
		<view v-if="questionTypeFlag == 1">
			<view v-if="answerList.length>0">
				<view class="finishbox" @click="finishClick" v-if="allCheckShow">完成</view>
				<view v-else class="flex-row-plus editicon-box flex-items fs28" @click="editClick">
					<image class="editicon" src="../../static/images/collectionEditicon.png"></image>
					<text class="mar-left-10">编辑</text>
				</view>
				<view class="swipe-box">
					<u-swipe-action :show="item.show" :index="index"
						v-for="(item, index) in answerList" :key="item.answerId"
						@click="answerClick" @open="answerOpen"
						:options="options"
					>
						<view class="item u-border-bottom flex-item" @click="goQuestionDetails(item.productId,item.problemId)">
							<view class="flex-row-plus flex-sp-between flex-items-plus wid" style="border-radius: 50%;">
								<view class="flex-items-plus flex-row wid">
									<view v-show="allCheckShow">
										<image mode="aspectFill" v-if="item.selected == 1" @click.stop="answerItemSel(index,0)" src="../../static/images/selectActive.png" class="cart-select-img"></image>
										<image mode="aspectFill" v-else @click.stop="answerItemSel(index,1)" src="../../static/images/selectEmpty.png" class="cart-select-img"></image>
									</view>
									<image class="product-img" mode="aspectFill" :src="item.image" />
									<view class="title-wrap mar-left-20 replynum-box wid">
										<text class="title u-line-2 fs28 font-weight-bold">{{ item.problem }}</text>
										<view class="flex-items-plus flex-row flex-sp-between">
											<text v-if="allCheckShow" style="width: 270rpx;" class="font-color-666 fs24 overflow">{{item.name}} : {{item.answer}}</text>
											<text v-else style="width: 360rpx;" class="font-color-666 fs24 overflow">{{item.name}} : {{item.answer}}</text>
											<view class="flex-items-plus">
												<text class="fs24 font-color-999">共{{item.count}}个回答</text>
												<image class="item-btn-right" src="../../static/img/user/arrow.png" mode="widthFix"></image>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
						<!-- <view class="borRig-line-20"></view> -->
					</u-swipe-action>
				</view>
				<view v-show="allCheckShow" class="allcheck-box flex-row-plus flex-sp-between flex-items">
					<view class="left">
						<image mode="aspectFill" v-if="isAllAnswerCheck" src="../../static/images/selectActive.png" class="cart-select-img" @click="allAnswerSel(0)"></image>
						<image mode="aspectFill" v-else src="../../static/images/selectEmpty.png" class="cart-select-img" @click="allAnswerSel(1)"></image>
						<text>全选</text>
					</view>
					<view class="right">
						<view class="btn-delete" @click="questionDel(1)">删除</view>
					</view>
				</view>
				<view v-if="allCheckShow" class="pad-bot-140"></view>
			</view>
			<view v-else class="mar-top-60 empty-box">
				<image class="question-empty" src="../../static/images/questionEmpty.png"></image>
				<view class="tohome-box flex-items-plus">暂无问答内容</view>
			</view>
		</view>
		<u-popup v-model="delshow" class="" mode="center" border-radius="14">
			<view class="pad-topbot-50 del-box flex-items-plus flex-column-plus">
				<label class="font-weight-bold font-color-222 fs36">删除回答？</label>
				<label class="fs28 font-color-222 mar-top-50">删除回答后无法恢复</label>
				<view class="flex-row-plus mar-top-60">
					<view class="cancel-but" @click="cancelClick">取消</view>
					<view class="del-but" @click="delClick">继续删除</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	export default {
		data() {
			return {
				questionTypeList: [{
					name: '我的提问(0)'
				}, {
					name: '我的回答(0)'
				}],
				questionTypeFlag: 0,
				disabled: false,
				btnWidth: 180,
				show: false,
				options: [
					{
						text: '删除',
						style: {
							backgroundColor: '#F15C48'
						}
					}
				],
				isAllProblemCheck:false,
				isAllAnswerCheck:false,
				allCheckShow:false,
				delshow:false,
				problemPage:1,
				problemPageSize:10,
				proloadingType:0,
				problemList:[],
				answerList:[],
				answerPage:1,
				answerPageSize:10,
				answerloadingType:0,
				delType:0
			};
		},
		onLoad() {
			this.getProblemList()
			this.getAnswerList()
		},
		onReachBottom(){
			if(this.questionTypeFlag == 0){
				if(this.proloadingType == 1){
					uni.stopPullDownRefresh()
				}else{
					this.problemPage = this.problemPage+1
					this.getProblemList()
				}
			}else if(this.questionTypeFlag == 1){
				if(this.answerloadingType == 1){
					uni.stopPullDownRefresh()
				}else{
					this.answerPage = this.answerPage+1
					this.getAnswerList()
				}
			}
		},
		methods:{
			goQuestionDetails(productId,problemId){
				let data = {
					  productId:productId,
					  problemId:problemId
				}
				uni.setStorageSync("seeAllFnData",data)
				uni.navigateTo({
					url:'../../pages_category_page1/goodsModule/qADetail'
				})
			},
			//确定批量删除
			delClick(){
				this.delshow = false
				if(this.delType == 0){
					this.problemPage = 1
					this.problemPageSize = 10
					this.problemDel()
				}else if(this.delType == 1){
					this.answerPage=1
					this.answerPageSize=10
					this.answerDel()
				}
			},
			//批量删除
			problemDel(){
				let ids = []
				this.problemList.forEach((value,index)=>{
					if(value.selected == 1){
						ids.push(value.problemId)
					}
				})
				NET.request(API.deleteProblem,{
					ids:ids
				}, 'POST').then(res => {
					this.problemList = []
					this.$u.toast(`删除成功`);
					this.getProblemList()
				}).catch(res => {
					this.$u.toast(`删除失败`);
				})
			},
			answerDel(){
				let ids = []
				this.answerList.forEach((value,index)=>{
					if(value.selected == 1){
						ids.push(value.answerId)
					}
				})
				NET.request(API.deleteAnswer,{
					ids:ids
				}, 'POST').then(res => {
					this.answerList = []
					this.$u.toast(`删除成功`);
					this.getAnswerList()
				}).catch(res => {
					this.$u.toast(`删除失败`);
				})
			},
			//全选
			allProblemSel(type){
				this.isAllProblemCheck = !this.isAllProblemCheck
				this.problemList.forEach((value,index)=>{
					this.problemList[index].selected = type
				})
			},
			allAnswerSel(type){
				this.isAllAnswerCheck = !this.isAllAnswerCheck
				this.answerList.forEach((value,index)=>{
					this.answerList[index].selected = type
				})
			},
			//单个选中
			problemItemSel(index,number){
				this.problemList[index].selected = number
				let proSelectNum = 0
				this.problemList.forEach((value,index)=>{
					if(this.problemList[index].selected == 0){
						this.isAllProblemCheck = false
					}else{
						proSelectNum++
					}
				})
				if(this.problemList.length == proSelectNum){
					this.isAllProblemCheck = true
				}
			},
			answerItemSel(index,number){
				this.answerList[index].selected = number
				let ansSelectNum = 0
				this.answerList.forEach((value,index)=>{
					if(this.answerList[index].selected == 0){
						this.isAllAnswerCheck = false
					}else{
						ansSelectNum++
					}
				})
				if(this.answerList.length == ansSelectNum){
					this.isAllAnswerCheck = true
				}
			},
			problemClick(index, index1){
				if(index1 == 0) {
					let ids = this.problemList[index].problemId
					this.cancelProblem(ids)
					this.problemList.splice(index, 1);
					this.$u.toast(`删除成功`);
				}
			},
			answerClick(index, index1){
				if(index1 == 0) {
					let ids = this.answerList[index].answerId
					this.cancelAnswer(ids)
					this.answerList.splice(index, 1);
					this.$u.toast(`删除成功`);
				}
			},
			problemOpen(index){
				this.problemList[index].show = true;
				this.problemList.map((val, idx) => {
					if(index != idx) this.problemList[idx].show = false;
				})
			},
			answerOpen(index){
				this.answerList[index].show = true;
				this.answerList.map((val, idx) => {
					if(index != idx) this.answerList[idx].show = false;
				})
			},
			//删除提问
			cancelProblem(ids){
				NET.request(API.deleteProblem,{
					ids:[ids]
				}, 'POST').then(res => {
				}).catch(res => {
					uni.showToast({
						title:'失败',
						icon:"none"
					})
				})
			},
			//删除回答
			cancelAnswer(ids){
				NET.request(API.deleteAnswer,{
					ids:[ids]
				}, 'POST').then(res => {
				}).catch(res => {
					uni.showToast({
						title:'失败',
						icon:"none"
					})
				})
			},
			//我的提问列表
			getProblemList(){
				NET.request(API.getProblemList,
				{
					page:this.problemPage,
					pageSize:this.problemPageSize
				},
				'GET').then(res => {
					let total = res.data.total
					this.questionTypeList[0].name = '我的提问('+ total +')'
					if(res.data.list.length == 0){
						this.proloadingType = 1
						this.problemPage = this.problemPage
					}else{
						this.problemList = this.problemList.concat(res.data.list)
					}
				}).catch(res => {
					uni.showToast({
						title:'我的提问查询失败',
						icon:"none"
					})
				})
			},
			//我的回答列表
			getAnswerList(){
				NET.request(API.getAnswerList,
				{
					page:this.answerPage,
					pageSize:this.answerPageSize
				},
				'GET').then(res => {
					let total = res.data.total
					this.questionTypeList[1].name = '我的回答('+ total +')'
					if(res.data.list.length == 0){
						this.answerloadingType = 1
						this.answerPage = this.answerPage
					}else{
						this.answerList = this.answerList.concat(res.data.list)
					}
				}).catch(res => {
					uni.showToast({
						title:'失败',
						icon:"none"
					})
				})
			},
			questionTypeActive(index) {
				this.questionTypeFlag = index
				if(index==0){
					this.problemPage = 1
					this.problemList = []
					this.proloadingType = 0
					this.getProblemList()
				}else if(index==1){
					this.answerPage = 1
					this.answerList = []
					this.answerloadingType = 0
					this.getAnswerList()
				}
			},
			editClick(){
				this.allCheckShow = true
			},
			finishClick(){
				this.allCheckShow = false
			},
			cancelClick(){
				this.delshow = false
			},
			questionDel(num){
				let quNum = 0
				let anNum = 0
				this.problemList.forEach((value,index)=>{
					if(this.problemList[index].selected == 1){
						quNum++
					}
				})
				this.answerList.forEach((value,index)=>{
					if(this.answerList[index].selected == 1){
						anNum++
					}
				})
				if(num==0){
					if(quNum<1){
						uni.showToast({
							title:'至少选择一条提问！',
							icon:"none"
						})
					}else{
						this.delType = num
						this.delshow = true
					}
				}else{
					if(anNum<1){
						uni.showToast({
							title:'至少选择一条回答！',
							icon:"none"
						})
					}else{
						this.delType = num
						this.delshow = true
					}
				}
			}
		}
	}
</script>

<style lang="scss">
page{background-color: #F7F7F7;}
.question-box{
	.empty-box{
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		.tohome-box{
			color:#999999;
			margin-top: 50rpx;
		}
		.question-empty{
			width: 270rpx;
			height: 270rpx;
		}
	}
	.del-box{
		width: 628rpx;
		.cancel-but{
			color: #FF7800;
			border: 1rpx #FF7800 solid;
			width: 208rpx;
			height: 60rpx;
			line-height: 60rpx;
			text-align: center;
			border-radius: 60rpx;
		}
		.del-but{
			background-color: #FF7800;
			color: #FFFFFF;
			width: 208rpx;
			height: 60rpx;
			line-height: 60rpx;
			text-align: center;
			border-radius: 60rpx;
			margin-left: 36rpx;
		}
	}
	.function-box{
		background-color: #F7F7F7;
	}
	.tabsbox{
		margin-top: 4rpx;
		background-color: #FFFFFF;
	}
	.editicon-box{
		display: flex;
		justify-content: flex-end;
		position: relative;
		left: -30rpx;
		padding: 16rpx 0;
	}
	.finishbox{
		display: flex;
		justify-content: flex-end;
		position: relative;
		left: -30rpx;
		padding: 16rpx 0;
	}
	.editicon{
		width: 30rpx;
		height: 30rpx;
	}
	.swipe-box{
		width: 100%;
		.replynum-box{
			height: 184rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin-left: 10rpx;
			.item-btn-right{
				width: 24upx;
				height: 24upx;
			}
		}
		.item {
			display: flex;
			padding: 20rpx;
		}
		.product-img{
			width: 180rpx;
			flex: 0 0 180rpx;
			height: 180rpx;
			border-radius: 12rpx;
		}
		.head-img{
			width: 80rpx;
			flex: 0 0 80rpx;
			height: 80rpx;
			border-radius: 50%;
		}
		.title {
			text-align: left;
			font-size: 28rpx;
			color: $u-content-color;
			margin-top: 20rpx;
		}
		.cart-select-img {
		  width: 50upx;
		  height: 50upx;
		  margin: 0upx 30upx 0upx;
		  box-sizing: border-box;
		}
		.toStore{
			border: 1rpx #FF7800 solid;
			color: #FF7800;
			padding: 0rpx 20rpx;
			border-radius: 5rpx;
			height: 52rpx;
		}
	}
	.allcheck-box{
		background-color: #FFFFFF;
		padding: 10rpx 0;
		width: 100%;
		position: fixed;
		bottom: 0upx;
		.left {
		  display: flex;
		  flex-direction: row;
		  align-items: center;
		  font-size: 28upx;
		  color: #666;
		  .cart-select-img {
		    width: 50upx;
		    height: 50upx;
		    margin: 30upx;
		    box-sizing: border-box;
		  }
		}
		.right {
		  display: flex;
		  flex-direction: row;
		  align-items: center;
		  padding: 0 30upx 0 0;
		  box-sizing: border-box;
		}
		.btn-delete {
		  width: 150upx;
		  height: 60upx;
		  line-height: 60upx;
		  text-align: center;
		  border: 1px solid #ff7911;
		  border-radius: 40upx;
		  font-size: 28upx;
		  color: #ff7911;
		}
	}
}
</style>
