<template>
	<view class="page">
		<tabcenter :current="currents"/>
		<view class="page-padding">
			<u-form :model="form" ref="uForm" :rules="rules"> 
				<u-form-item label-width="150" label="会员名称" prop="vipname" :required="true" :label-position="labelPosition">
					<u-input v-model="form.vipname" placeholder="请输入会员名称" />
				</u-form-item>
				<u-form-item label-width="150" label="联系方式" prop="vipphone" :required="true" :label-position="labelPosition">
					<u-input v-model="form.vipphone" placeholder="请输入联系方式" />
				</u-form-item>
				
				<u-form-item v-if="form.isdis==-1" label-width="150" label="拒绝理由" prop="" :label-position="labelPosition">
					<u-input type="textarea" v-model="form.disrefuse" disabled placeholder=" "/>
				</u-form-item>
				
				<u-form-item v-if="form.isdis" label-width="150" label="审核状态" prop=""  :label-position="labelPosition">
					{{ (form.isdis==0 && form.isdis!="") ? "审核中" : form.isdis==1 ? "已同意" :form.isdis==-1 ? "已拒绝" : ""}}
				</u-form-item>
			</u-form>
		</view>
		<view class="bottom-btn-block" v-if="form.isdis==-1 || !form.isdis">
			<view class="btn1" @click="doSubmit">提交申请</view>
		</view>
	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api');
import tabcenter from "../tabcenter/index.vue"
	export default {
		data(){
			return {
				labelPosition: 'top',
				form:{
					
				},
				currents:1,
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
					},
					{
						min:11,
						max:11,
						message: '联系方式为11位数', 
						trigger: 'change'
					}
					],
				},
			}
		},
		components:{
			tabcenter
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		onLoad() {
			console.log("onloadonload");
		},
		onShow(){
			this.fxid = uni.getStorageSync("distributorId");
			this.getstatus();
		},
		onUnload() {},
		methods:{
			// 查询会员状态
			getstatus(){
				let shopId = uni.getStorageSync("curshopid");
				console.log(this.form.vipname,"9999");
				NET.request(API.getfxdetail,{shopId},'POST').then(res=>{
					    let data = {
							vipname:res.data.name,
							vipphone:res.data.phone,
							isdis:res.data.isdis,
							disrefuse:res.data.disrefuse
						}
					    this.form = data;
				})
			},
		  // 申请分销会员
		  doSubmit(){
			  if(this.form.isdis==0 && this.form.isdis!=""){
			  	 uni.showToast({
			  	 	title:"分销会员审核中,无法提交",
					icon:"none"
			  	 })
				 return
			  }else if(this.form.isdis===1){
				  uni.showToast({
				  	title:"您已是分销会员,无法提交",
					icon:"none"
				  })
				  return
			  }else{
			  this.$refs.uForm.validate((vaild)=>{
				  if(vaild){
					  this.form.buyerUserId = "";
					  this.form.applyTime = "";
					  this.form.createTime = "";
					  this.form.isdis = "";
					  this.form.shopId = uni.getStorageSync("curshopid")??"";
					  NET.request(API.applymemberApp,{...this.form},"POST").then(res=>{
						   uni.showToast({
							title:"申请成功!"
						   }),
						   setTimeout(()=>{
							    uni.navigateBack()
						   },400)
						  
					  })
				  }
			  })
			  }
			 
		  }	
		}
	}
</script>

<style>
</style>