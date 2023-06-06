<template>
	<view class="page">
		<tabcenter :current="currents"/>
		<view class="page-padding">
			<u-form :model="form" ref="uForm">
			
				<u-form-item label-width="150" label="会员名称" prop="vipname" :required="true" :label-position="labelPosition">
					<u-input v-model="form.vipname" placeholder="请输入会员名称" />
				</u-form-item>
				<u-form-item label-width="150" label="联系方式" prop="vipphone" :required="true" :label-position="labelPosition">
					<u-input v-model="form.vipphone" placeholder="请输入联系方式" />
				</u-form-item>
				<u-form-item label-width="150" label="门店名称" :label-position="labelPosition">
					<u-input v-model="form.mdname" placeholder="请输入门店名称" />
				</u-form-item>
				<u-form-item label-width="150" :label-position="labelPosition" label="申请理由">
					<u-input type='textarea'  v-model="form.vipreason" placeholder="请输入申请理由" />
				</u-form-item>
				
				<u-form-item label-width="150" label="地址" prop="" :label-position="labelPosition">
					<u-input v-model="form.address" placeholder="请选择地址" disabled @click="gomap"/>
				</u-form-item>
				
				<u-form-item v-if="flagshow===-1 && this.form.viprefuse" label-width="150" label="拒绝理由" prop="" :label-position="labelPosition">
					<u-input type="textarea" v-model="form.viprefuse" disabled placeholder=" " style="color: red;"/>
				</u-form-item>
				
				<u-form-item v-if="flagshow===0 || flagshow==1" label-width="150" label="审核状态" prop=""  :label-position="labelPosition">
					{{ flagshow===0 ? "审核中" : flagshow==1 ? "已同意" : ""}}
				</u-form-item>
				
			</u-form>
		</view>
		<view class="bottom-btn-block" v-if="flagshow!==0 && flagshow!=1">
			<view class="btn1" @click="doSubmit">提交申请</view>
			<!-- <view class="btn1" v-else>您已是该店铺的会员,无需再次申请</view> -->
		</view>
	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	import {
		getCurUserid, // 获取用户id
	} from '@/api/common.js';
    import tabcenter from "../../pages/tabcenter/index.vue"
	export default {
		components:{
			tabcenter
		},
		data() {
			return {
				currents:0,
				labelPosition: 'top',
				labelName:'',//会员等级
				shopId:0,  //商店 Id
				form: {
					vipname: '',
					vipphone: '',
					vipreason: ''
				},
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
					},{
						min:11,
						max:11,
						message: '联系方式为11位数', 
						trigger: 'change'
					}
					],
					address: [{
						required: true,
						message: '请选择地址',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					// vipreason: [{
					// 	required: true,
					// 	message: '请输入申请理由',
					// 	// 可以单个或者同时写两个触发验证方式 
					// 	trigger: ['change', 'blur'],
					// }],
				},
				hideshowStatus: false,
				address:{
					
				},
				flagshow:""
			};
		},
		onLoad(options) {
			this.getstatus();
			if(options.labelName && options.labelName != ''){
				this.labelName = options.labelName
				console.log(this.labelName,typeof this.labelName ,'传递进来的参数')
				console.log('游客' == this.labelName ,'传递进来的参数');
			}
		},
        onShow(){
			// 
			this.address = uni.getStorageSync("addresssd") || {};
			
			if(Object.keys(this.address).length>0){
				
				this.$nextTick(()=>{
					this.form.address = this.address.title;
				})
				console.log(this.address,9999999999);
			}
        },
		onReady(){
			this.$refs.uForm.setRules(this.rules);			
		},
		methods: {
			// 去地图选点
			gomap(){
				if(this.flagshow===0 || this.flagshow===1){
					uni.showToast({
						title:"当前状态无法修改",
						icon:"none"
					})
					return
				}
				uni.navigateTo({
					url:"/pages_category_page3/gdmap/index"
				})
			},
			// 查询会员状态
			getstatus(){
				let shopId = uni.getStorageSync("curshopid")
				let buyerUserId = getCurUserid() ==undefined ? "" : getCurUserid();
				console.log(shopId,buyerUserId,"99999");
				NET.request(API.statuslist,{shopId,buyerUserId},'POST').then(res =>{
					// 是否会员（0 审核中 -1 非会员，1 会员）
					 if(res.data.cereBusinessBuyerUser.isvip==0){
							this.flagshow = 0
					 }else if(res.data.cereBusinessBuyerUser.isvip==1){
						 this.flagshow = 1
					 }
					 else if(res.data.cereBusinessBuyerUser.isvip==-1){
						 this.flagshow = -1;
					 }
					 let {vipname,vipphone,vipreason,address,viprefuse,mdname} = res.data.cereBusinessBuyerUser;
					 this.form = {vipname,vipphone,vipreason,address,viprefuse,mdname};
				})
			},
			// 提交
			doSubmit(){
				if(this.flagshow===0){
					uni.showToast({
						title:"已在审核中,无法提交",
						icon:"none"
					})
					return
				}else if(this.flagshow===1){
					uni.showToast({
						title:"您已是会员，无法提交",
						icon:"none"
					})
					return
				}else{
					this.$refs.uForm.validate(valid => {
						if (valid) {
							uni.showLoading({
								title:'提交中'
							})
							this.shopId = uni.getStorageSync('curshopid')
							this.form.id = uni.getStorageSync('userId')
							this.form.shopId = this.shopId;
							this.form.latitude = this.address.latitude;
							this.form.longitude = this.address.longitude;
					
							NET.request(API.applyMember,this.form,'POST').then(res =>{
								uni.hideLoading();
								uni.showToast({
									title:'提交成功',
									duration:2000
								})
								uni.navigateBack()
								setTimeout(()=>{
									uni.removeStorageSync("addresssd")
									
								},1000)
							}).cath(rej=>{
								uni.showToast({
									title:rej.message,
									duration:1000
								})
								setTimeout(()=>{
									uni.navigateBack()
								},1000)
							})
						} else {
							uni.showToast({
								title:'请完善信息!',
								icon:'error'
							})
						}
					});
				}

			},
			
		}
	};
</script>

<style lang="scss">

</style>
