<template>
	<view class="page">
		<view class="page-padding">
			<u-form :model="form" ref="uForm">
				<u-form-item :required="true" :label-position="labelPosition" label="姓名" prop="cardName"
					label-width="150">
					<u-input v-model="form.cardName" placeholder="请输入姓名" />
				</u-form-item>
				<u-form-item :required="true" :label-position="labelPosition" label="收款账户" prop="bank"
					label-width="150">
					<u-input type="select" @click="this.showbank=true" v-model="form.bankName" placeholder="请选择收款账户" />
					<u-select @confirm="confirmSelectBank" v-model="showbank" :list="banklist"></u-select>
				</u-form-item>
				<u-form-item :required="true" :label-position="labelPosition" label="收款账号" prop="cardNumber"
					label-width="150">
					<u-input v-model="form.cardNumber" placeholder="请输入收款账号" />
				</u-form-item>
				<u-form-item :required="true" :label-position="labelPosition" label="手机号码" prop="phone"
					label-width="150">
					<u-input :border="border" placeholder="请输入手机号" v-model="form.phone" type="number"></u-input>
				</u-form-item>
				<u-form-item :required="true" :label-position="labelPosition" label="验证码" prop="code" label-width="150">
					<u-input :border="border" placeholder="请输入验证码" v-model="form.code" type="text"></u-input>
					<u-button slot="right" type="success" size="mini" @click="getCode">{{codeTips}}</u-button>
				</u-form-item>
			</u-form>
		</view>
		<u-verification-code seconds="60" ref="uCode" @change="codeChange"></u-verification-code>
		<view class="bottom-btn-block">
			<view class="btn1" @click="doSubmit">{{btntxt}}</view>
		</view>
	</view>
</template>

<script>
	import {
		getBankOption, //获取银行卡列表
		bindBank,  //绑定账户
		getSmsCode,
		getBank, //获取绑定的银行卡
		updateBank  //更改账户
	} from '../../../api/shopmanage.js'
	export default {
		data() {
			return {
				form: {
					"bank": 0, //所属银行
					"bankName": "",
					"cardName": "",
					"cardNumber": "",
					"code": "",
					"phone": "",
					"shopId": 0
				},
				rules: {
					bankName: [{
						required: true,
						message: '请选择收款账户',
						// 可以单个或者同时写两个触发验证方式
						trigger: 'blur,change'
					}],
					cardName: [{
						required: true,
						message: '请输入姓名',
						// 可以单个或者同时写两个触发验证方式
						trigger: 'blur,change'
					}],
					cardNumber: [{
						required: true,
						message: '请输入收款账号',
						// 可以单个或者同时写两个触发验证方式
						trigger: 'blur,change'
					}],
					phone: [{
						required: true,
						message: '请输入手机号',
						// 可以单个或者同时写两个触发验证方式
						trigger: 'blur,change'
					}],
					code: [{
						required: true,
						message: '请获取验证码',
						// 可以单个或者同时写两个触发验证方式
						trigger: 'blur,change'
					}],
				},
				showbank: false,
				banklist: [],
				labelPosition: 'left',
				codeTips: '获取验证码',
				btntxt: "绑定账户",
			};
		},
		onLoad(option) {
			this.form.shopId = option.shopId;
			this.bindBankSelect();
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			bindData() {
				const _this = this;
				getBank().then(res => {
					let _d = res.data;
					if(_d.bankCard && _d.bankCard != ''){
						_this.form.cardNumber = _d.bankCard;
						_this.form.bankName = _d.bankName;
						_this.form.cardName = _d.collectionNme;
						_this.btntxt = "更换账户";
						_this.banklist.forEach(i => {
							if (i.label == _d.bankName) {
								_this.form.bank = i.value;
							}
						})
					}
	
				})
			},
			//获取下拉框
			bindBankSelect() {
				getBankOption().then(res => {
					let _d = res.data;
					let _dic = [];
					const _this = this;
					_d.forEach(i => {
						_dic.push({
							value: i.dictId,
							label: i.dictName
						})
					})
					_this.banklist = _dic;
					//根据银行卡名字绑定银行id，所以在这里加载
					this.bindData();
				})
			},
			confirmSelectBank(e) {
				let _selectval = e[0];
				this.form.bank = _selectval.value;
				this.form.bankName = _selectval.label;
			},
			bindOption() {
				getBank().then(res => {
					let newRes = res.map((item, index, arr) => {
						item.text = res.cardName
					})
					console.log(newRes)
					this.cardList = newRes
				})
			},
			codeChange(text) {
				this.codeTips = text;
			},
			// 获取验证码
			getCode() {
				if (this.$refs.uCode.canGetCode) {
					let _phone = this.form.phone;
					if (_phone == undefined || _phone == "") {
						uni.showToast({
							title: "请填写手机号",
							icon: "none"
						})
						return;
					}
					getSmsCode(_phone).then(res => {
						// 通知验证码组件内部开始倒计时
						this.$refs.uCode.start();
					})
				} else {
					this.$u.toast('倒计时结束后再发送');
				}
			},
			doSubmit() {
				const _this = this;
				_this.$refs.uForm.validate(valid => {
					if (valid) {
						if (_this.btntxt == "绑定账户") {
							//绑定账号
							_this._doBind();
						} else {
							//更换账户
							_this._doUpdate();
						}
					} else {
						console.log('验证失败');
					}
				});
			},
			//绑定账户
			_doBind() {
				const _this = this;
				bindBank(_this.form).then(res => {
					uni.showToast({
						title: "绑定成功",
						duration:1500
					})
					setTimeout(()=>{
						uni.navigateBack()
					},1500)
				})
			},
			//更改账户
			_doUpdate() {
				const _this = this;
				updateBank(_this.form).then(res => {
					uni.showToast({
						title: "绑定成功",
						duration:1500
					})
					setTimeout(()=>{
						uni.navigateBack()
					},1500)
				})
			}
		}
	};
</script>

<style scoped lang="scss">

</style>
