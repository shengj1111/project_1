<template>
	<!-- 编辑/添加地址 -->
	<view class="container flex-center flex-column">
		<view class="addressBack-box">
			<view class="consignee-box bor-line-F7F7F7">
				<input v-model="username" class="fs28"  placeholder-class="consignee" placeholder="收货人" />
			</view>
			
			<view class="iphoneNum-box bor-line-F7F7F7">
				<input type="number" v-model="phone" class="fs28" placeholder-class="iphoneNum" placeholder="手机号码" />
			</view>
			
			<view @click="locationClick" class="location-box bor-line-F7F7F7 flex-row-plus flex-sp-between flex-items">
				<view class="fs28 location">所在地</view>
				<view>
					<city-select v-model="locationShowFalg" @city-change="cityChange"></city-select>
					<text v-model="ssqText">{{ssqText}}</text>
					<image class="arrow mar-left-20" src="../../static/img/user/arrow.png"></image>
				</view>
			</view>
			
			<view class="detailAddress-box">
				<!-- <input class="fs28" v-model="address" placeholder-class="detailAddress" placeholder="详细地址：如道路、门牌号、小区、楼栋号、单元等" /> -->
				<textarea 
				class="fs28" 
				v-model="address" 
				placeholder-class="detailAddress" 
				auto-height
				placeholder="详细地址：如道路、门牌号、小区、楼栋号、单元等" />
					<!-- <u-input v-model="address" placeholder="详细地址：如道路、门牌号、小区、楼栋号、单元等" type="textarea"/> -->
			</view>
		</view>
		<view class="addressTagBack-box">
			<view @click="addressTagClick" class="addressTag-box bor-line-F7F7F7 flex-row-plus flex-sp-between flex-items">
				<view class="fs28 addressTag">地址标签</view>
				<view>
					<text v-model="tag">{{tag}}</text>
					<image class="arrow mar-left-20" src="../../static/img/user/arrow.png"></image>
				</view>
			</view>
			<view class="defaultState-box flex-row-plus flex-sp-between flex-items">
				<view class="fs28 defaultState">设为默认地址</view>
				<u-switch v-model="isDefault" active-color="#00AA49" inactive-color="#eee"></u-switch>
			</view>
		</view>
		<view class="deleteAddress-box" @click="delAddress" v-if="type == 2">
			<text class="font-color-FF7800">删除收货地址</text>
		</view>
		<view class="saveAddress-box">
			<view class="saveAddress" v-if="type == 1" @click="addAddressClick">保存</view>
			<view class="saveAddress" v-else @click="saveAddressClick">保存</view>
		</view>
		<!-- 所在地弹窗 -->
		<!-- <u-select v-model="locationShowFalg" safe-area-inset-bottom="true" mode="mutil-column-auto" :list="locationList" @confirm="locationConfirm" title="所在地"></u-select> -->
		<!-- 所在地弹窗 -->
		<u-select v-model="addressTagShowFalg" mode="single-column" :list="addressTagList" @confirm="addressTagconfirm" title="地址标签"></u-select>
	</view>
</template>

<script>
const NET = require('../../utils/request')
const API = require('../../config/api')
import citySelect from './u-city-select.vue';
	export default {
		components: {
			citySelect
		},
		data() {
			return {
				show: false,
				type: 1, // 1.添加新地址 2.编辑收货地址
				locationShowFalg:false,
				locationList: [],
				locationName:'',
				provinceName:'',
				cityName:'',
				districtName:'',
				addressTagList: [
					{
						value: '1',
						label: '家'
					},
					{
						value: '2',
						label: '公司'
					},
					{
						value: '3',
						label: '学校'
					}
				],
				addressTagShowFalg:false,
				areaList:[],
				username:'',
				phone:'',
				ssqText:'',
				address:'',
				tag:'',
				isDefault:false,
				province:'',
				city:'',
				area:'',
				id:'',
				ordertype:0,
				editAddress:{}
			}
		},
		onLoad(options) {
			this.type = options.type
			if(options.ordertype == 1){
				this.ordertype = 1
			}
			let receiveId = options.receiveId
			if(this.type == 2){
        uni.showLoading({
          title: '请稍后...',
        })
        NET.request(API.receiveGetInfo,{receiveId:receiveId},"GET").then(res => {
          this.editAddress = res.data
          this.username = this.editAddress.receiveName
          this.phone = this.editAddress.receivePhone
          this.ssqText = this.editAddress.receiveAdress
          this.address = this.editAddress.address
          this.tag = this.editAddress.label
          this.isDefault = this.editAddress.defult
          let ssqarr = this.ssqText.split("-")
          this.province = ssqarr[0]
          this.city = ssqarr[1]
          this.area = ssqarr[2]
          this.id = this.editAddress.receiveId
          uni.hideLoading()
        }).catch(res => {

        })
        // this.editAddress = JSON.parse(uni.getStorageSync('editAddress')) receiveGetInfo
        // if(Object.keys(this.editAddress).length > 0){
        //   this.username = this.editAddress.receiveName
        //   this.phone = this.editAddress.receivePhone
        //   this.ssqText = this.editAddress.receiveAdress
        //   this.address = this.editAddress.address
        //   this.tag = this.editAddress.label
        //   this.isDefault = this.editAddress.defult
        //   let ssqarr = this.ssqText.split("-")
        //   this.province = ssqarr[0]
        //   this.city = ssqarr[1]
        //   this.area = ssqarr[2]
        //   this.id = this.editAddress.receiveId
        // }

			}
			if(this.editAddress != ''){
				uni.removeStorageSync('editAddress')
			}
		},
		methods: {
			cityChange(e) {
				this.ssqText = e.province.label + '-' + e.city.label + '-' + e.area.label;
				this.province = e.province.label
				this.city = e.city.label
				this.area = e.area.label
			},
			
			
			
			locationClick(){
				this.locationShowFalg = true
			},
			
			
			
			
			locationConfirm(e) {
				this.provinceName = e[0].label
				this.cityName = e[1].label
				this.districtName = e[2].label
				this.locationDot = '·'
			},
			addressTagClick(){
				this.addressTagShowFalg = true
			},
			addressTagconfirm(e){
				this.tag = e[0].label
			},
			//编辑地址
			saveAddressClick(){
				let phoneCodeVerification = /^[1][3-9][0-9]{9}$/;
				if(this.username==''){
					uni.showToast({
					    title: '请输入收货人！',
					    duration: 2000,
						icon:'none'
					});
				}else if(this.phone==''){
					uni.showToast({
					    title: '请输入手机号！',
					    duration: 2000,
						icon:'none'
					});
				}else if(!phoneCodeVerification.test(this.phone)){
					uni.showToast({
						title: '请输入正确的手机号！',
						duration: 2000,
						icon:'none'
					});
				}else if(this.province==''||this.city==''||this.city==''){
					uni.showToast({
					    title: '所在地不能为空！',
					    duration: 2000,
						icon:'none'
					});
				}else if(this.address==''){
					uni.showToast({
					    title: '请输入详细地址！',
					    duration: 2000,
						icon:'none'
					});
				}else{
					NET.request(API.AddresUpdate,{
						receiveId: this.id,
						receiveName: this.username,
						receivePhone: this.phone,
						receiveAdress: this.ssqText,
						address:this.address,
						label:this.tag,
						defult:this.isDefault
					},'POST').then(res => {
						uni.navigateBack({
							delta: 1
						});
						uni.removeStorageSync('editAddress');
					}).catch(res => {

					})
				}

			},
			//新增地址
			addAddressClick(){
				let phoneCodeVerification = /^[1][3-9][0-9]{9}$/;
				if(this.username==''){
					uni.showToast({
					    title: '请输入收货人！',
					    duration: 2000,
						icon:'none'
					});
				}else if(this.phone==''){
					uni.showToast({
					    title: '请输入手机号！',
					    duration: 2000,
						icon:'none'
					});
				}else if(!phoneCodeVerification.test(this.phone)){
				 	uni.showToast({
				 	    title: '请输入正确的手机号！',
				 	    duration: 2000,
				 		icon:'none'
				 	});
				 }else if(this.province==''||this.city==''||this.city==''){
					uni.showToast({
					    title: '所在地不能为空！',
					    duration: 2000,
						icon:'none'
					});
				}else if(this.address==''){
					uni.showToast({
					    title: '请输入详细地址！',
					    duration: 2000,
						icon:'none'
					});
				}else{
					NET.request(API.AddresAdd,
					{
						receiveName: this.username,
						receivePhone: this.phone,
						receiveAdress: this.ssqText,
						address:this.address,
						label:this.tag,
						defult:this.isDefault
					},'POST').then(res => {
						if(this.ordertype == 1){
							uni.setStorageSync('receiveItem', res.data)
							uni.navigateBack({
								delta: 2
							});
						}else{
							uni.navigateBack({
								delta: 1
							});
						}
					}).catch(res => {

					})
				}
			},
			//删除地址
			delAddress(){
				uni.showModal({
				          title: '温馨提示',
				          content: '是否删除此地址？',
				          confirmText:'确定',
				          cancelText:'取消',
				          success: (res)=> {
				            if (res.confirm) {
								this.subm()
				            } else if (res.cancel) {

				            }
				        }
				    })
			},
			subm(){
				NET.request(API.AddresDelete,{
					receiveId:this.id
				},'POST').then(res => {
					if(res.code === "200"){
						uni.navigateBack({
							delta: 1
						});
					}
				}).catch(res => {

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
		.addressBack-box{
			background-color: #FFFFFF;
			padding: 30upx 30upx;
			.consignee-box{
				padding-bottom: 36upx;
				width: 690upx;
				margin-top: 20upx;
				.consignee{
					color: #999999;
					font-size: 28upx;
				}
			}
			.iphoneNum-box{
				padding-bottom: 36upx;
				width: 690upx;
				margin-top: 36upx;
				.iphoneNum{
					color: #999999;
					font-size: 28upx;
				}
			}
			.location-box{
				padding-bottom: 36upx;
				width: 690upx;
				margin-top: 36upx;
				.location{
					color: #999999;
					font-size: 28upx;
				}
			}
			.detailAddress-box{
				padding-bottom: 36upx;
				width: 690upx;
				margin-top: 36upx;
				input{
					width: 100%;
				}
				.detailAddress{
					color: #999999;
					font-size: 28upx;
				}
			}
		}
		.addressTagBack-box{
			background-color: #FFFFFF;
			padding: 30upx 30upx;
			margin-top: 20upx;
			.addressTag-box{
				padding-bottom: 36upx;
				width: 690upx;
				.addressTag{
					color: #999999;
					font-size: 28upx;
				}
			}
			.defaultState-box{
				padding-bottom: 10upx;
				width: 690upx;
				margin-top: 36upx;
				.defaultState{
					color: #999999;
					font-size: 28upx;
				}
			}
		}
		.arrow{
			width: 24upx;
			height: 24upx;
		}
		.saveAddress-box{
			position: fixed;
			bottom: 50upx;
			left: 30upx;
			.saveAddress{
				width: 690upx;
				height: 80upx;
				color: #FFFFFF;
				border-radius: 40upx;
				text-align: center;
				line-height: 80upx;
				background-color: #00AA49;
			}
		}
	}
	.deleteAddress-box{
		background-color: #FFFFFF;
		padding: 30upx 30upx;
		margin-top: 20upx;
	}
	.content{
		font-size: 35rpx;
		width: 500rpx;
		.btn{
			margin-bottom: 20rpx;
			 width: 200rpx;
			 background-color: #00AA49;
		}
	}
</style>
