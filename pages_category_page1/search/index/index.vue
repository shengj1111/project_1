<template>
	<view>
		<!-- 搜索商品 -->
		<view>
			<view class="flex-items-plus flex-row mar-top-20">
				<view class="searchImg-box flex-items-plus">
					<image class="searchImg" src="../../../static/img/searchImg.png"></image>
					
					<!-- 下面就是那个搜索框 -->
					<input class="search-box" v-model="keyWord" placeholder-class="searchboxPlace" placeholder="请输入您想要的宝贝" />
					
					<image class="searchClose-icon" @click="searchTextDel" src="../../../static/img/index/searchClose_icon.png"></image>
				</view>
				<view class="mar-left-40 fs26" @click="getList">搜索</view>
			</view>
			<view class="mar-top-30 mar-leftgetList-30" v-if="historyList.length>0">
				<label class="fs30 font-color-999 fs-weight-300 mar-left-30">历史搜索</label>
				<image class="historyDel-icon" @click="historyDelAll" src="../../../static/img/index/historyDel_icon.png"></image>
			</view>
			<view class="historySear-box flex-wrap-1 flex-row">
				<view  v-for="(item, index) in historyList" :key="item.searchId" class="historySearDel-box mar-top-30 flex-items-plus mar-left-30">
					<view @click="historyKeyword(item.search)" class="fs28">{{item.search}}</view>
					<view>
						<label class="font-color-DDD fs22 pad-topbot-10 text-align">|</label>
						<image class="historySearDel-icon text-align" @click="historyDelOne(item.searchId)" src="../../../static/img/index/historySearDel_icon.png"></image>
					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	const NET = require('../../../utils/request')
	const API = require('../../../config/api')
	export default {
		data() {
			return {
				keyWord:'',
				historyList:[],
				list:[]
			}
		},
		onLoad() {

		},
		onShow() {
			this.findSearchHistory()
		},
		methods: {
			searchTextDel(){
				this.keyWord = ''
			},
			getList() {
				if(!this.keyWord){
					uni.showToast({
					    title: '请输入要搜索内容！',
					    duration: 2000,
						icon:'none'
					});
				}else{
					uni.navigateTo({
						url: '../../goodsModule/goodsList?keyWord='+ this.keyWord,
					})
				}
			},
			historyKeyword(keyWord){
				uni.navigateTo({
					url: '../../goodsModule/goodsList?keyWord='+ keyWord,
				})
			},
			//历史记录
			findSearchHistory(){
				NET.request(API.SearchHistory,{},'GET').then(res => {
					this.historyList = res.data
				}).catch(res => {

				})
			},
			historyDelAll(){
				uni.showModal({
				      title: '温馨提示',
				      content: '您确定要清空搜索记录吗？',
				      confirmText:'确定清空',
				      cancelText:'点错了',
				      success: (res)=> {
				        if (res.confirm) {
				            this.deleteAllSearch()
				        } else if (res.cancel) {
				          console.log('用户点击取消')
				        }
				    }
				})
			},
			deleteAllSearch(){
				NET.request(API.DeleteAllSearch,{},'POST').then(res => {
					this.historyList = res.data
				}).catch(res => {

				})
			},
			historyDelOne(searchId){
				uni.showModal({
				      title: '温馨提示',
				      content: '您确定要删除这一条记录吗？',
				      confirmText:'确定删除',
				      cancelText:'点错了',
				      success: (res)=> {
				        if (res.confirm) {
				            NET.request(API.DeleteSearch,{
				            	searchId:searchId
				            },'POST').then(res => {
				            	this.findSearchHistory()
				            }).catch(res => {
				            })
				        } else if (res.cancel) {
				          console.log('用户点击取消')
				        }
				    }
				})
			}
		}
	}
</script>

<style lang='scss'>
	input{padding-left: 80upx;}
	.emptyCart-box{
		margin-top: 70upx;
		.emptyCart-img{
			width: 270upx;
			height: 270upx;
		}
	}
	.searchImg{
		width: 36upx;
		height: 36upx;
		position: absolute;
		left: 60upx;
	}
	.search-box{
		background-color: #F1F1F1;
		border-radius: 33upx;
		width: 530upx;
		height: 66upx;
	}
	.searchboxPlace{
		font-size: 26upx;
		color: #A9A9A9;
		padding-right: 30upx;
	}
	.searchClose-icon{
		width: 30upx;
		height: 30upx;
		margin-left: -50upx;
	}
	.historyDel-icon{
		width: 30upx;
		height: 30upx;
		position: absolute;
		right: 30upx;
	}
	.historySearDel-box{
		background-color: #F1F1F1;
		border-radius: 27upx;
		padding: 10upx 30upx;
		text-align: center;
		height: 54upx;
		line-height: 54upx;
	}
	.historySearDel-icon{
		width: 16upx;
		height: 16upx;
	}

</style>
