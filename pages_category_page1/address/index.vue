<template>
	<view class="page">
		<view class="" v-for="(item,index) in list">
			<checkbox-group @change="val=>{radioGroupChange(val,item)}">
				  <view class="d-flex">
					  <radio :checked="flag==index" :value="index"></radio>
					  <view class="con-message">
						  <view class="message">
							  <text>{{item.mdname}}</text>
							  <text>{{item.vipname}}</text>
							  <text>{{item.vipphone}}</text>
						  </view>
						  
						  <view class="">
						  	  {{item.address}}
						  </view>
					  </view>
					  <view class="kmpp" v-if="item.juli && item.juli!=0">
						  {{item.juli/1000+"km"}}
					  </view>
				  </view>		
		     </checkbox-group>
		</view>
		<view class="bottom-btn-block">
			<view class="btn1" @click="doSubmit">确认</view>
		</view>
	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	import {
		getCurShopid
	} from '@/api/common.js'
	export default{
		data(){
			return {
				flag:-1, // 选中的地址
				valuech:0,
				form:{},
				list:[],
				rules: {
					vipname: [{
						required: true,
						message: '请输入姓名',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					vipphone: [{
						required: true,
						message: '请输入联系方式',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					address: [{
						required: true,
						message: '请选择地址',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}]
			}
			}
		},
		onLoad() {
			this.getaddressjxsfun()
			uni.removeStorageSync("addresssd");
		},
		methods:{
			// 
			getaddressjxsfun(){
				// 获取经销商地址
				let shopId = getCurShopid();
				let _t = this;
				uni.getLocation({
					success(e){
						  let shopId = getCurShopid();
						  let data = {
							shopId,
							latitude: e.latitude,
							longitude: e.longitude
						}
						NET.request(API.getaddressjxs,data,"post").then(res=>{
							 _t.list = res.data;
							 console.log(res,"配送地址配送地址配送地址配送地址");
						})
					}
				})
			},
			// 选择地址
			radioGroupChange(e,item){
				this.flag = e.target.value[0];
				this.form = item;
			},
			// 确认提交
			doSubmit(){
				let data = {
					...this.form
				}
				uni.setStorageSync("dataaddress",data);
				uni.navigateBack();
			}
		}
	}
</script>

<style scoped>
 .page{
	 padding: 20rpx 20rpx;
 }
 .d-flex{
	 display: flex;
	 height: 200rpx;
	 justify-content: flex-start;
	 align-items: center;
	 border-bottom: 1px solid #dedede;
	 padding: 20rpx 20rpx;
 }
 
 .box-address{
	 height: 200rpx;
 }
 .kmpp{
	 margin-left: 30rpx;
	 margin-right: 10rpx;
	 color: red;
 }
 .con-message{
	 height: 100%;
	 display: flex;
	 flex-direction: column;
	 justify-content: space-between;
 }
 radio{
	 margin-right: 40rpx;
 }
 .message{
	 display: flex;
	 flex-direction: column;
	 justify-content: space-between;
 }
 .message>text:first-child{
	 margin-right: 10rpx;
 }
</style>