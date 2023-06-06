<template>
	<view>
		<view>
			<u-form :model="fahuoForm">
				<!-- 快递单号 -->
				<u-form-item>
					<view>发货备注</view>
					<u-input v-model="fahuoForm.deliverFormid" placeholder="请输入发货备注" />
				</u-form-item>
				<!-- <view>请选择快递公司</view> -->
				<u-form-item>
					<view>快递公司</view>
					<u-input v-model="present" placeholder="请选择快递公司" disabled @click="show1 = true" />
					<u-select v-model="show1" :list="newActionSheetList" mode="single-column" @confirm="confirmList">
					</u-select>
				</u-form-item>
				<!-- 确认按钮 -->
				<u-button @click="querenfahuo" type="success">确认</u-button>

			</u-form>
		</view>

	</view>
</template>

<script>
	import {
		orderGetSelect, //查询所有的快递公司
		orderDilevery, //发货接口
	} from '../../api/shopmanage.js'
	export default {
		data() {
			return {
				fahuoForm: {
					deliverFormid: '',
					orderId: 0,
					express: null,
				}, //发货表单
				actionSheetList: [], //快递公司列表
				show1: false, //是否展示下拉列表
				present: '', //选中的快递公司
			}
		},
		computed: {
			newActionSheetList() {	
				const data1 = this.actionSheetList.map(item =>({label: item.dictName,value: item.dictId}))
				console.log(data1)
				return data1
			}
		},
		onLoad(option) {
			this.fahuoForm.orderId = option.orderId
			this.expressageAll()
			console.log(option,'传递进来的参数')
		},
		
		methods: {
			confirmList(e) {
				this.present = e[0].label
				this.fahuoForm.express = e[0].value
				console.log(e, '查看')
			},
			//确认发货
			querenfahuo() {
				uni.showModal({
					content: '请再次确认!',
					confirmText: '确定发货',
					cancelText: '取消',
					success: res => {
						if (res.confirm) {
							orderDilevery(this.fahuoForm).then(res => {
								uni.showToast({
									icon: 'none',
									duration:2000,
									title: '发货成功!'
								})
								this.fahuoForm.deliverFormid = ''
								this.fahuoForm.express = ''
								setTimeout(()=>{
									uni.navigateBack()
								},2000)
								
							})
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
				console.log(this.fahuoForm, '确认发货')
			},
	
			//获取所有的快递公司
			expressageAll() {
				orderGetSelect().then(res => {
					let newAll = res.data.slice(0, 25)
					this.actionSheetList = newAll
					console.log(newAll,'所有的快递公司')
				})
			},
		}
	}
</script>

<style lang="scss">

</style>
