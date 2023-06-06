<template>
	<view class="container">
		<view class="content-warp" id="myContent1">
			<block v-for="(item,index) in receivemsg">
				<view class="part" :class="{'part-right':item.mine } ">
					<view class="image">
						<image :src="item.avatar" mode=""></image>
					</view>
					<view class="msg">
						<image v-if="item.isimg==1" mode="widthFix" :src="item.content.replace('img[','')"></image>
						<text v-else>{{item.content}}</text>
					</view>
				</view>
			</block>
		</view>
		<view class="bottom" style="background-color: #FFFFFF;">
			<view class="send-warp">
				<view style="margin-left: 15rpx; width: 60rpx; height: 60rpx;">
					<image src="../../static/images/myphone.png" mode="" style="width: 100%;height: 100%;"
						@click="dadianhua"></image>

				</view>
				<view class="input-warp">
					<u-input v-model="msg" type="text" :border="false" />
				</view>

				<view class="btnsend" @click="sendmsg">发送</view>
			</view>
		</view>

		<view class="shop-box" v-if="isGoodsShow">
			<view class="img-box">
				<image :src="prodimg" ></image>
			</view>
			<view class="name-box">
				<view>{{prodname}}</view>
			</view>
			<view class="btn-box">
				<u-button size="mini" type="success" @click="sendGoods">发送</u-button>
			</view>
		</view>


		<view class="returnTopService-box">
			<view class="tousu" @click="tousudianhua">
				<view style="font-weight: 600;">投诉电话:</view>
				<view style="color: red;">400-8399567</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getChatUserId,
		setRelation,
		sendMessage,
		online,
		login,
		getHistoryMsg
	} from '@/api/chat.js'

	import {
		WSURL
	} from '@/utils/wshelp.js'

	import {
		getCurShopid,
		getCurUserid,
		//打电话
		getPhone
	} from '@/api/common.js'

	export default {
		data() {
			return {
				shopid: "",
				userid: "",
				msg: "",
				receivemsg: [], //接收到的消息
				clientId: "",
				prodname: "", //商品名
				prodimg: "", //商品图
				chatShop: {
					shopavatar: "https://zpmxcx.ylbtl.cn/file/2021/11/b3e4f50d4ac44cae9e4a12cdd80e4faa_微信图片_20211113130849.jpg",
					shopid: 73,
					shopnickname: "立邦金牌店"
				},
				chatUser: {
					useravatar: "https://thirdwx.qlogo.cn/mmopen/vi_32/zib5gQuOIYwJwxemyX1VbNIzyuiaLn6wtKicZ6eZBpT5ia62N6OYDjBvhsibg5uFBzPB70bIXcwKd31onHGKmhKu9sQ/132",
					userid: 521,
					usernickname: "花间一壶酒"
				},
				isGoodsShow: true,
			};
		},
		onUnload() {
			const _this = this;
			uni.closeSocket({
				success: function() {
					_this.doOnline(_this.chatUser.userid, "offline")
				}
			})
		},
		onLoad(option) {
			const _this = this;
			this.userid = getCurUserid();
			let prod = uni.getStorageSync("tempchatproduct");
			this.shopid = prod.shopid;
			//shopid=415&productId=403&skuId=767&name=墙漆伴（石膏基耐水腻子粉）&cover=https://zpmxcx.ylbtl.cn/file/2021/10/21e307b404224f7ab5fc7ae07d194c4b_44a44461d8c40deed8a2f819f8df4fb6.jpg
			this.prodname = prod.name;
			this.prodimg = prod.cover;
			//链接websocket
			uni.connectSocket({
				url: WSURL
			});

			uni.onSocketOpen(function(res) {
				console.log('WebSocket连接已打开！', res);
			});
			uni.onSocketError(function(res) {
				console.log('WebSocket连接打开失败，请检查！', res);
			});


			uni.onSocketMessage(function(res) {
				console.log(res, 92929)
				let _str = res.data;
				let _jobj = JSON.parse(_str);
				if (_jobj.type == "init") {
					//初始化
					_this.clientId = _jobj.client_id
					_this.getChatUId();
				} else if (_jobj.type == "chatMessage") {
					//收到消息
					//{"type":"chatMessage","data":{"username":"ceshi","avatar":"asdasdsaadas","id":"9","type":"friend","content":"ssfsdfsdfsfddf","cid":0,"fromid":"9","timestamp":1637248134000,"mine":false}}
					let _msg = _jobj.data;
					_this.receivemsg.push(_msg);
				} else if (_jobj.type == "onLine") {
					//检测在线状态
					let _d = _jobj.data;
					console.log(_d, "type:onLine");
					let _uid = _d.uid;
					if (_d.status == "offline") {
						//离线
						_this.doOnline(_uid, "offline")
					} else if (_d.status == "online") {

						_this.doOnline(_uid, "online")
					}
				}


			});

		},
		methods: {
			//获取聊天模块用户id
			getChatUId() {
				getChatUserId({
					shopid: this.shopid,
					userid: this.userid
				}).then(res => {
					this.chatShop = res.data.shop;
					this.chatUser = res.data.user;
					this.relationship();
				})
			},

			//写入商家与用户好友关系
			relationship() {
				const _this = this;
				setRelation({
					shopuserid: this.chatShop.shopid,
					userid: this.chatUser.userid
				}).then(res => {
					//登录用户
					login(this.chatUser.userid).then(res => {
						let _token = res.data.userinfo.token;
						uni.setStorageSync("chattoken", _token)
						//设置在线
						_this.doOnline(_this.chatUser.userid, "online");
						//获取聊天记录
						_this.bindHistoryMsg();

					})
				})
			},
			doOnline(uid, staus) {
				//staus状态值 offline隐身 ，online在线
				const _this = this;
				let _d = {
					"status": staus,
					"client_id": _this.clientId,
					"uid": uid
				}
				online(_d);
			},
			bindHistoryMsg() {
				//获取历史消息
				const _this = this;
				getHistoryMsg(_this.chatShop.shopid, _this.clientId).then(res => {
					let _d = res.data.list.reverse(res.data.list) ;
					
					if (_d && _d.length && _d.length > 0) {
						let _msg = []
						_d.forEach(i => {
							_msg.push({
								mine: i.id == _this.chatUser.userid,
								avatar: i.avatar,
								content: i.content,
								username: i.username,
								isimg: i.content.indexOf('img[') == 0,
							})
						})
						_this.receivemsg = _msg;

						setTimeout(function() {
							const query = uni.createSelectorQuery().in(_this);
							query.select('#myContent1').boundingClientRect(data => {
								console.log("得到布局位置信息" + JSON.stringify(data));
								console.log("节点离页面顶部的距离为" + data.top);
								uni.pageScrollTo({
									scrollTop: data.bottom 
								});
							}).exec();
						}, 0)


						//发送产品信息
						//_this.sendProduct();
					}
				})
			},
			//打电话
			dadianhua() {
				let Phone = getPhone()
				wx.makePhoneCall({
					phoneNumber: Phone,
				})
			},
			tousudianhua() {
				wx.makePhoneCall({
					phoneNumber: '400-8399567',
				})
			},
			sendGoods(){
				this.sendProduct();
				this.isGoodsShow = false
			},
			sendProduct() {
				//发送产品信息
				this.msg = this.prodname
				this.sendmsg()
				//img[/uploads/20211119/4a75b5d61675c05c90b8cf9b9cc156ea.jpg]
				this.msg = "img[" + this.prodimg;
				this.sendmsg();
			},

			//发送按钮
			sendmsg() {
				const _this = this;
				if (_this.msg && _this.msg != "") {
					let _data = {
						uid: _this.chatUser.userid,
						mine: {
							id: _this.chatUser.userid,
							username: _this.chatUser.usernickname,
							mine: true,
							content: _this.msg,
							avatar: _this.chatUser.useravatar
						},
						to: {
							id: _this.chatShop.shopid,
							username: _this.chatShop.shopnickname,
							name: _this.chatShop.shopnickname,
							avatar: _this.chatShop.shopavatar,
							type: "friend",
						}
					}
					var _p = {
						data: _data,
						client_id: _this.clientId

					}
					sendMessage(_p)
					_this.receivemsg.push({
						mine: true,
						avatar: _this.chatUser.useravatar,
						content: _this.msg,
						isimg: _this.msg.indexOf('img[') == 0,
					})
					//清空
					_this.msg = "";
					uni.pageScrollTo({
						scrollTop: 99999999999,
						duration: 300
					});
				}
			}
		}
	}
</script>
<style lang="scss">
	@import url("../../static/css/chat.css");
	.container{
		position: relative;
		padding-bottom: 50rpx;
	}
	.shop-box {
		// position: absolute;
		position: fixed;
		bottom: 80rpx;
		left: 30rpx;
		width: 480rpx;
		height: 130rpx;
		display: flex;
		// background-color: #00aa00;
		align-items: center;
		.img-box{
			width: 140rpx;
			height: 130rpx;
			image{
				width: 140rpx;
				height: 130rpx;
			}
		}
	}



	.returnTopService-box {
		position: fixed;
		bottom: 90upx;
		right: 30upx;

		//z-index: -1;
		.tousu {
			padding: 10rpx 20rpx;
			font-size: 24rpx;
			border: #dcdcdc 1rpx solid;
			border-radius: 15rpx;
			background-color: #FFFFFF;
			text-align: center;
			// padding: 4rpx;
		}

		.fs16 {
			font-size: 14rpx;
		}

		.returnTop-box {
			width: 90upx;
			height: 90upx;
			border-radius: 50%;
			background-color: #FFFFFF;
			box-shadow: 0upx 0upx 5upx 3upx #999999;

			.returnTopImg {
				width: 36upx;
				height: 36upx;
			}
		}

		.serviceImg-box {
			width: 90upx;
			height: 90upx;
			border-radius: 50%;
			background-color: #FFFFFF;
			box-shadow: 0upx 0upx 5upx 3upx #999999;

			.serviceImg {
				width: 36upx;
				height: 36upx;
				display: block;
				background: url("../../static/images/serviceImg.png") no-repeat center center;
				background-size: contain;
			}
		}
	}
</style>
