<template>
	<view class="page">
		<view class="page-padding">
			<u-form :model="form" ref="uForm">
				<u-form-item :required="true" :label-position="labelPosition" label="原密码" prop="password"
					label-width="150">
					<u-input v-model="form.password" placeholder="请输入原密码" />
				</u-form-item>
				<u-form-item :required="true" :label-position="labelPosition" label="新密码" prop="newPassword"
					label-width="150">
					<u-input :border="border" placeholder="请输入新密码" v-model="form.newPassword" type="number"></u-input>
				</u-form-item>
			</u-form>


		</view>
		<button type="default" class="btnSty" @click="doSubmit">修改密码</button>
	</view>
</template>

<script>
	import {
		updatePassword, //修改密码
	} from '@/api/shopmanage.js'
	export default {
		data() {
			return {
				form: {
					"password": "",
					"newPassword": "",
				},
				rules: {
					password: [{
						required: true,
						message: '请输入原密码',
						trigger: 'blur,change'
					}],
					newPassword: [{
						required: true,
						message: '请输入新密码',
						trigger: 'blur,change'
					}],
				},
			};
		},
		onLoad(option) {

		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			doSubmit() {
				const _this = this;
				_this.$refs.uForm.validate(valid => {
					if (valid) {
						updatePassword(_this.form).then(res => {
							uni.removeStorageSync("account")
							uni.removeStorageSync("password")
							uni.showToast({
								title: '修改成功',
								icon: 'none',
								duration: 1500
							})
							setTimeout(() => {
								uni.navigateBack()
							}, 1500)
							// setTimeout(()={
							// 	uni.navigateBack()
							// },1500)
						}).catch(rej => {
							uni.showToast({
								title: rej.message,
								icon: 'none',
								duration: 1500
							});
						})
						console.log(_this.form)
					} else {
						console.log('验证失败');
					}
				});
			},
			//绑定账户


		}
	};
</script>

<style scoped lang="scss">
	.page {}

	.page-padding {
		padding: 50rpx;


	}

	.btnSty {
		background-color: #00aa00;
		color: #FFFFFF;
		position: absolute;
		left: 50%;
		bottom: 50rpx;
		width: 650rpx;
		text-align: center;
		transform: translateX(-50%);

	}
</style>
