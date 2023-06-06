<template>
	<view class="">
		<!-- 聊天内容 -->
		<view class="content-warp" ref="myContent" id="myContent1">
			<block v-for="(item,index) in receivemsg" class="zhang">
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
		<!-- 底部聊天 -->
		<view class="bottom" style="background-color: #FFFFFF;">
			<view class="send-warp">
				<view class="input-warp">
					<u-input v-model="msg" type="text" :border="false" />
				</view>
				<view class="btnsend" @click="sendmsg">发送</view>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		sendMessage,
		online,
		login,
		getHistoryMsg,
		setMessage
	} from '@/api/chat.js'

	import {
		WSURL
	} from '@/utils/wshelp.js'


	export default {
		data() {
			return {
				msg: "",
				receivemsg: [], //接收到的消息
				clientId: "",
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
				
				sender_id:'', //发送人的id,现在是商家看信息,所以发送者是客户
				geter_id:'',//接受人的id,现在是商家看信息,所以接收者是客户
				// sender_type:2,//1=用户,2=商家 发送人类型
				// geter_type:1,//1=用户,2=商家  接受人类型
				
			};
		},
		onUnload() {
			const _this = this;
			uni.closeSocket({
				success: function() {
					_this.doOnline(_this.chatShop.userid, "offline")
				}
			})
		},
		onReady() {
			
		},
		onLoad(option) {
			const _this = this;
			let _p = uni.getStorageSync("tempkefuin");
			_this.chatShop = _p.chatShop;
			_this.chatUser = _p.chatUser;
			// uni.removeStorageSync("tempkefuin")
			
			_this.sender_id = _p.chatUser.userid
			_this.geter_id = _p.chatShop.shopid
			console.log(this.chatShop, '商家id')
			console.log(this.chatUser, '用户id')
			
			
			//链接websocket
			uni.connectSocket({
				url: WSURL
			});

			let obj = {}
			obj.sender_id = this.sender_id
			obj.geter_id = this.geter_id
			obj.sender_type = 2
			obj.geter_type = 1
console.log(obj,'查看参数')
			setMessage(obj).then(res=>{
				console.log(res)
			})
			


			uni.onSocketMessage(function(res) {
				console.log(res, 92929)
				let _str = res.data;
				let _jobj = JSON.parse(_str);
				if (_jobj.type == "init") {
					//初始化
					_this.clientId = _jobj.client_id
					_this.initData();
				} else if (_jobj.type == "chatMessage") {
					//收到消息
					//{"type":"chatMessage","data":{"username":"ceshi","avatar":"asdasdsaadas","id":"9","type":"friend","content":"ssfsdfsdfsfddf","cid":0,"fromid":"9","timestamp":1637248134000,"mine":false}}
					let _msg = _jobj.data;
					if (_msg.content.indexOf('img[') == 0) {
						_msg.isimg = 1;
					}
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
			initData() {
				const _this = this;
				login(this.chatShop.shopid).then(res => {
					let _token = res.data.userinfo.token;
					uni.setStorageSync("chattoken", _token)
					//设置在线
					_this.doOnline(_this.chatShop.shopid, "online");
					//获取聊天记录
					_this.bindHistoryMsg();
					
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
				online(_d)
			},
			bindHistoryMsg() {
				//获取历史消息
				const _this = this;
				getHistoryMsg(_this.chatUser.userid, _this.clientId).then(res => {
					// let _d = res.data.list;
					let _d = res.data.list.reverse(res.data.list);
					if (_d && _d.length && _d.length > 0) {
						let _msg = [] ;
				
						_d.forEach(i => {
							_msg.push({
								mine: i.id == _this.chatShop.shopid,
								avatar: i.avatar,
								content: i.content,
								username: i.username,
								isimg: i.content.indexOf('img[') == 0,

							})
							
						})
						
						_this.receivemsg = _msg;
						
						setTimeout(function(){
							const query = uni.createSelectorQuery().in(_this);
							query.select('#myContent1').boundingClientRect(data => {
							  console.log("得到布局位置信息" + JSON.stringify(data));
							  console.log("节点离页面顶部的距离为" + data.top);
								uni.pageScrollTo({
									scrollTop: data.bottom
								});
							}).exec();
						},0)
						
					}
				})
			},


			//发送按钮
			sendmsg() {
				const _this = this;
				if (_this.msg && _this.msg != "") {
					let _data = {
						mine: {
							id: _this.chatShop.shopid,
							username: _this.chatShop.shopnickname,
							name: _this.chatShop.shopnickname,
							avatar: _this.chatShop.shopavatar,
							mine: true,
							content: _this.msg,

						},
						to: {
							id: _this.chatUser.userid,
							avatar: _this.chatUser.useravatar,
							username: _this.chatUser.usernickname,
							type: "friend",
						}
					}
					var _p = {
						data: _data,
						client_id: _this.clientId

					}
					sendMessage(_p)
					//窗口中显示
					_this.receivemsg.push({
						mine: true,
						avatar: _this.chatShop.shopavatar,
						content: _this.msg
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
</style>
