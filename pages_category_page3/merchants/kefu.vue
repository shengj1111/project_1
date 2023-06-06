<template>
	<view>
		<view class="chatlist">
			<view class="chatitem" v-for="(item,index) in list" @click="gotodetail(item)">
				<view class="avatr-warp">
					<image class="avatr" :src="item.avatar"></image>
				</view>
				<view class="name-warp">
					<text>{{item.username}}</text>
				</view>
				<view class="num-box" v-if="item.weidu != 0">
					<text>{{item.weidu}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getShopUserid,
		login,
		getMyFriend
	} from '@/api/chat.js'

	export default {
		data() {
			return {
				shopid: 0,
				list: [],
				chatShop: {
					shopavatar: "https://zpmxcx.ylbtl.cn/file/2021/11/b3e4f50d4ac44cae9e4a12cdd80e4faa_微信图片_20211113130849.jpg",
					shopid: 73,
					shopnickname: "立邦金牌店"
				}
			}
		},
		onLoad(option) {
			this.shopid = option.shopid
			//this.initData()
		},
		onShow() {
			//this.shopid = option.shopid
			this.initData()
		},
		methods: {
			initData() {
				const _this=this;
				getShopUserid({
					shopid: this.shopid
				}).then(res => {
					_this.chatShop = res.data;
					login(_this.chatShop.shopid).then(res => {
						let _token = res.data.userinfo.token;
						uni.setStorageSync("chattoken", _token)
						_this.bindList();
					})
				})
			},
			gotodetail(item) {
				uni.setStorageSync("tempkefuin",{
					chatShop:this.chatShop,
					chatUser: {
						useravatar: item.avatar,
						userid: item.id,
						usernickname: item.username
					}
				})
				uni.navigateTo({
					url: "kefuinfo"
				})
			},
			bindList() {
				//商品
				const _this=this;
				getMyFriend().then(res=>{
					let _f=res.data.friend;
					if(_f && _f!="" && _f.length && _f.length>0){
						let _list=_f[0].list;
						_this.list=_list;
					}
				})
			}
		}
	}
</script>

<style>
	.chatlist{
		padding: 0 30rpx;
	}
	.chatitem {
		display: flex;
		padding-top: 20rpx;
		padding-bottom: 20rpx;
		border-bottom: 1px solid #f2f2f2;
		position: relative;
	}

	.chatitem .avatr-warp {
		width: 140rpx;
		display: flex;
		justify-content: center;
	}

	.chatitem .avatr {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
	}

	.name-warp {
		padding-left: 20rpx;
		height: 120rpx;
		display: flex;
		align-items: center;
	}
	.num-box{
		position: absolute;
		top: 10rpx;
		left: 0rpx;
		width: 50rpx;
		height: 50rpx;
		text-align: center;
		line-height: 50rpx;
		background-color: red;
		color: #FFFFFF;
		border-radius: 50%;
	}
</style>
