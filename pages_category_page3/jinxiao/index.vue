<template>
	<view class="container">
		<!-- 顶部搜索框 -->
		<inputs @getpop="getpop" :jinxiao="jinxiao" />
		<!-- 物流商的表格 -->
		<wllist v-if="jinxiao===0"/>
		<!-- 经销商的表格  -->
		<jxtable v-if="jinxiao===1"/>
		<u-popup v-model="show" mode="center" border-radius="14" width="443px" height="232px">
			<view>
				<u-form :model="form" ref="uForm" label-width="100px" :rules="rules">
					<u-form-item label="经销商" prop="name" required :label-style="{fontSize:'14px'}">
						<selectint :list="jxlist" :place="'请输入经销商'" />
					</u-form-item>
					<u-form-item label="订单" :label-style="{fontSize:'14px'}">
						<selectint :list="ddlist" :place="'请输入订单'" />
					</u-form-item>
					<u-form-item label="商品" :label-style="{fontSize:'14px'}"><u-input v-model="form.intro"
							:clearable="false" /></u-form-item>
					<u-form-item label="商品数量" :label-style="{fontSize:'14px'}"><u-input v-model="form.pronum"
							:clearable="false" /></u-form-item>
					<u-form-item label="送货时间" :label-style="{fontSize:'14px'}"><u-input v-model="form.sex"
							:clearable="false" /></u-form-item>
				</u-form>
				<view class="d-flex">
					<u-button plain class="mybtns" @click="show=false">取消</u-button>
					<u-button type="success" class="mybtns" @click="submit">提交</u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import inputs from "./components/ints.vue";
	import wllist from "./components/wllist.vue";
	import jxtable from "./components/jxlist.vue";
	import selectint from "../../component/inputsels/index.vue"
	export default {
		name: "jinxiao",
		components: {
			inputs,
			wllist,
			selectint,
			jxtable
		},
		onLoad(options) {
			if (options.jinxiao == 1) {
				this.jinxiao = 1;
				this.updatetitle("经销商");
			} else {
				this.jinxiao = 0;
				this.updatetitle("物流商");
			}
		},
		data() {
			return {
				form: {},
				jxlist: [{
						name: "经销商A"
					},
					{
						name: "经销商B"
					},
				], // 经销商列表
				ddlist: [{
						name: "订单1"
					},
					{
						name: "订单2"
					},
				],
				show: false,
				jinxiao: "",
				rules: {
					name: [{
						required: true,
						message: '请输入姓名',
						// 可以单个或者同时写两个触发验证方式
						trigger: 'blur,change'
					}],
					intro: [{
						min: 5,
						message: '简介不能少于5个字',
						trigger: 'change'
					}]
				},
				flag:""
			}
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		onUnload() {
			// 过渡页防止横屏样式错乱
			uni.navigateTo({
				url: '/pages_category_page3/test/index',
				animationType: 'none',
				animationDuration: 0
			})
		},
		methods: {
			// 提交
			submit() {
				this.$refs.uForm.validate(vaild => {
					if (vaild) {
						console.log(vaild, "99999");
						this.show = false;
					}
				})

			},
			// 修改页面标题
			updatetitle(title) {
				uni.setNavigationBarTitle({
					title: title,
					success: () => {
						console.log('修改标题成功')
					},
					fail: () => {
						console.log('修改标题失败')
					},
					complete: () => {
						console.log('修改标题结束')
					},
				})
			},
			getpop(e) {
				this.show = e;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100vw;
		min-height: 100vh;
		padding: 10px 10px 10px 50px;
		font-size: 14px;
	}

	/deep/.u-mode-center-box {
		padding: 20px 20px;
	}

	/deep/.u-form-item {
		display: flex;
		padding: 10px 0 !important;
		font-size: 14px;
		color: #303133;
		box-sizing: border-box;
		line-height: 35px !important;
		flex-direction: column;
	}

	/deep/.u-input {
		border: 1rpx solid #ccc;
		border-radius: 5px;
		padding: 0 10px 5px 10px !important;
		height: 34px;
		line-height: 34px;
		margin-right: 10px;

		input {
			font-size: 14px;
			min-height: 34px !important;
		}
	}

	/deep/.u-input__right {
		font-size: 10px !important;
	}

	.d-flex {
		display: flex;
		justify-content: space-between;
		height: 30px;
	}

	.mybtns {
		width: 182px;
		margin-right: 10px;

		/deep/button {
			font-size: 15px;
			height: 40px;
			line-height: 40px;
		}
	}

	/deep/.u-form-item__message.data-v-006449ec {
		font-size: 12px;
		line-height: 12px;
	}
</style>