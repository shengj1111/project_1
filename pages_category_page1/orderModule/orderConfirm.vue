<template>
	<!-- 提交订单 -->
	<view>
		<view class="order-submission">
			<!-- 配送和自提 -->
			<view class="bg"></view>
			<!-- <view class="allAddress" :style="systemStore ? '' : 'padding-top: 0.2*100rpx'"> -->
			<view class="allAddress">
				<view class="nav">
					<!-- <view class="item" :class="shipping_type === 0 ? 'on' : 'on2'" @click="addressType(0)">
						卖家配送</view> -->
					<!-- <view class="item" :class="shipping_type === 1 ? 'on' : 'on2'" @click="addressType(1)">买家自提</view> -->
				</view>
			</view>
			<view class="info">
				<u-icon name="info-circle" color="#fff"></u-icon>
				<span style="margin-left: 10rpx;">配送费需与门店协商（整车配送除外）</span>
			</view>

			<!-- 卖家配送 -->
			<view v-if="shipping_type === 0">
				<view class="addAddress flex">
					<view class="address-box" @click="addAddressTap">
						<image src="../../static/images/orderAddress.png" class="address-img"></image>
						<view class="address-r" v-if="userAddressInfo.receiveName">
							<view class="address-name-box">
								<text>{{userAddressInfo.receiveName}}</text>
								<text class="phone">{{userAddressInfo.receivePhone}}</text>
							</view>
							<view class="address-info">
								<text>{{userAddressInfo.receiveAdress}}</text>
							</view>
							<view class="address-info">
								<text>{{userAddressInfo.address}}</text>
							</view>
						</view>
						<view class="address-r" v-else>
							<text>你还没有收货地址哦，点击这里添加</text>
						</view>
						<view class="addressRight">
							<u-icon name="arrow-right"></u-icon>
						</view>
					</view>
				</view>

				<!-- 店铺信息 -->
				<view class="addAddress flex" style="margin-top: 20rpx;">
					<view class="addressLeft" @click="addressLeft()">
						<!-- <view class="moren" style="width: 200rpx;">门店信息</view> -->
						<view class="addressTop flex">
							<!-- <view class="address">{{shopXinxi.shopName}}</view> -->
							<view class="address">{{shopXinxi.shopAdress}}</view>
						</view>
						<view class="addressBottom">
							<view class="name">{{shopXinxi.chargePersonName}}</view>
							<view class="tel" @click="dadianhua">{{shopXinxi.chargePersonPhone}}</view>
						</view>
					</view>
				</view>
				<!-- 商品列表 -->
				<view class="slist">
					<view class="order-list-box">
						<view class="item" v-for="(item, sIndex) in settlement.shops" :key="item.shopId">
							<view class="order-info-box">
								<view class="order-info">
									<view class="order-info-item" v-for="(cItem, index) in item.skus"
										:key="cItem.productId">
										<image :src="cItem.image" class="product-img"></image>
										<view class="info-box">
											<text class="product-name">{{cItem.productName}}</text>
											<view class="product-sku">
												<view v-for="(vItem, index) in cItem.values">
													<label class="mar-left-20" v-if="vItem != '游客'">{{vItem}}</label>
												</view>
											</view>
											<view class="price-sku-box">
												<view class="product-price"><text class="fuhao">￥</text>{{cItem.price}}
												</view>
												<view class="product-num">x {{cItem.number}}</view>
											</view>
										</view>
									</view>

								</view>

								<!-- 赠送积分 -->
								<view class="discount-item1" v-if="item.integral > 0 || item.wuliuIntegral > 0">
									<view class="discount-label" v-if="item.integral && item.integral > 0">赠送积分 :
										{{item.integral}}
									</view>
									<view class="discount-info-box flex-items">
										<view v-if="item.wuliuIntegral && item.wuliuIntegral > 0">
											赠送物流积分 : {{item.wuliuIntegral}}
										</view>
									</view>
								</view>
								
								
								<view class="discount-item1" v-if="item.shopCoupons.length>0 && showcoupon"
									@click="showShopCoupons(item,sIndex)">
									<view class="discount-label">门店优惠</view>
									<view class="discount-info-box flex-items">
										<view class="discount-info2"
											v-if="item.currentCoupon && item.currentCoupon.couponType == 1">
											-￥{{item.currentCoupon.reduceMoney}}</view>
										<view class="discount-info2"
											v-if="item.currentCoupon && item.currentCoupon.couponType == 2">
											{{item.currentCoupon.reduceMoney}}折券
										</view>
										<image class="discount-img" src="../../static/images/arrowRight.png"></image>
									</view>
								</view>


								<view class="discount-item1-my"
									v-if="item.shopCoupons.length>0 && showcoupon &&item.currentCoupon.couponType == 3">
									<view class="discount-label-my">{{item.currentCoupon.content}}</view>
									<view class="discount-info-box ">
										<image class="discount-img-shop-my" :src="item.currentCoupon.giftpic"></image>
									</view>
								</view>

								<view class="order-total-box">
									<text class="total-num">共{{item.number}}件</text>
									<text class="total-num ml10">总计</text>
									<text class="total-price ml10"
										v-if="item.total > 0">¥{{parseFloat(item.total).toFixed(2)}}</text>
									<text class="total-price ml10" v-else>¥0.00</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 商品列表 -->

			</view>
			<!-- 卖家配送结束 -->
			<!-- 买家自提 -->
			<view v-if="shipping_type === 1">
				<view class="addAddress flex marF">
					<view class="addressLeft">
						<view class="moren" style="width: 170rpx;">请选择提货地址</view>
						<view class="addressTop" @click="$toUrl('/pages_category_page1/address/index')">
							<view class="address">{{addressobj.address }}</view>
							<view class="name">{{addressobj.mdname}}</view>
							<view class="name" style="display: block;">{{addressobj.vipname }}</view>
							<view class="tel name" @click="dadianhua">{{addressobj.vipphone}}</view>
							<!-- || site -->
						</view>
						<view class="addressLeft-icon">
							<u-icon name="arrow-right" color="#dedede" size="32"></u-icon>
						</view>
						<view class="addressBottom">
							<view class="address">配送方式:</view>
							<checkbox-group @change="changeps" class="pstype">
								  <view v-for="(item,index) in pslist">
									   <!-- :checked="" -->
									   <text>{{item.name}}</text><radio :checked="index==flagindex" :value="item.value"></radio>
								  </view>		
							 </checkbox-group>
							<!-- || shopkeeper -->
							
							 <!-- || shopkeeperPhone -->
						</view>
						<view class="" v-if="flagindex==1" @click="addAddressTap">
							<view class="moren" style="width: 170rpx;">请选择配送地址</view>
							<view class="addressTop" v-if="userAddressInfo.receiveName">
								<!-- <view class="address">{{shopXinxi.shopName}}</view> -->
								<view class="address">{{userAddressInfo.receiveAdress }}{{userAddressInfo.address? '('+userAddressInfo.address+')' :"" }}</view>
								<view class="name">{{userAddressInfo.receiveName }}</view>
								<view class="tel" @click="dadianhua">{{userAddressInfo.receivePhone}}</view>
								<!-- || site -->
							</view>
							<view class="address-r" v-else>
								<text>你还没有收货地址哦，点击这里添加</text>
							</view>
							<view class="addressLeft-icon">
								<u-icon name="arrow-right" color="#dedede" size="32"></u-icon>
							</view>
						</view>
						
						
					<!-- 	<view class="" v-if="flagindex==1">
							<view class="moren" style="width: 170rpx;">请选择配送地址</view>
							<view class="address-box box1" @click="addAddressTap">
								<view class="address-r" v-if="userAddressInfo.receiveName">
									<view class="address-name-box">
										<text>{{userAddressInfo.receiveName}}</text>
										<text class="phone">{{userAddressInfo.receivePhone}}</text>
									</view>
									<view class="address-info">
										<text>{{userAddressInfo.receiveAdress}}</text>
									</view>
									<view class="address-info">
										<text>{{userAddressInfo.address}}</text>
									</view>
								</view>
								
								<view class="addressRight">
									<u-icon name="arrow-right"></u-icon>
								</view>
							</view>
						</view>
						 -->
						<!-- <view class="addAddress flex" v-if="flagindex==1">
							<view class="addressLeft" @click="addressLeft()">
								<view class="addressTop flex">
									<view class="address">{{shopXinxi.shopAdress}}</view>
									<view class="name">{{shopXinxi.chargePersonName}}</view>
									<view class="tel" @click="dadianhua">{{shopXinxi.chargePersonPhone}}</view>
								</view>
								<view class="addressBottom">
									
								</view>
							</view>
						</view> -->
					</view>
					
				</view>

				<!-- 商品列表 -->
				<view class="slist">
					<view class="order-list-box">
						<view class="item" v-for="(item, sIndex) in settlement.shops" :key="item.shopId">
							<view class="order-info-box">
								<view class="order-info">
									<view class="order-info-item" v-for="(cItem, index) in item.skus"
										:key="cItem.productId">
										<image :src="cItem.image" class="product-img"></image>
										<view class="info-box">
											<text class="product-name">{{cItem.productName}}</text>
											<!-- 组合商品 -->
										       <zuhe v-if="false"/>
											<!-- /组合商品 -->
											<view class="product-sku">
												<view v-for="(vItem, index) in cItem.values">
													<label class="mar-left-20">{{vItem}}</label>
												</view>
											</view>
											<view class="price-sku-box">
												<view class="product-price"><text class="fuhao">￥</text>{{cItem.price}}
												</view>
												<view class="product-num">x {{cItem.number}}</view>
											</view>
										</view>
									</view>
								</view>
								<!-- 赠送积分 -->
								<view class="discount-item1" v-if="item.integral > 0 || item.wuliuIntegral > 0">
									<view class="discount-label" v-if="item.integral && item.integral > 0">赠送积分 :
										{{item.integral}}
									</view>
									<view class="discount-info-box flex-items">
										<view v-if="item.wuliuIntegral && item.wuliuIntegral > 0">
											赠送物流积分 : {{item.wuliuIntegral}}
										</view>
									</view>
								</view>

								<!-- 门店优惠 -->
								<view class="discount-item1" v-if="item.shopCoupons.length>0 && showcoupon "
									@click="showShopCoupons(item,sIndex)">
									<view class="discount-label">门店优惠</view>
									<view class="discount-info-box flex-items">
										<view class="discount-info2"
											v-if="item.currentCoupon && item.currentCoupon.couponType == 1">
											-￥{{item.currentCoupon.reduceMoney}}</view>
										<view class="discount-info2"
											v-if="item.currentCoupon && item.currentCoupon.couponType == 2">
											{{item.currentCoupon.reduceMoney}}折券
										</view>
										<image class="discount-img" src="../../static/images/arrowRight.png"></image>
									</view>
								</view>
								
								<view class="discount-item1-my"
									v-if="item.shopCoupons.length>0 && showcoupon &&item.currentCoupon.couponType == 3">
									<view class="discount-label-my">{{item.currentCoupon.content}}</view>
									<view class="discount-info-box ">
										<image class="discount-img-shop-my" :src="item.currentCoupon.giftpic"></image>
									</view>
								</view>
								<view class="order-total-box">
									<text class="total-num">共{{item.number}}件</text>
									<text class="total-num ml10">总计</text>
									<text class="total-price ml10"
										v-if="item.total > 0">¥{{parseFloat(item.total).toFixed(2)}}</text>
									<text class="total-price ml10" v-else>¥0.00</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 商品列表结束 -->
			</view>
			<!-- 买家自提结束 -->
		</view>
		
		<view style="margin-bottom: 20rpx;" class="zbfh">
			<view class="pay-type-img">
				<image class="discount-img" src="../../static/images/extendGoodsIcon.png"
					mode="widthFix" />
			</view>
			<label class="pay-type-label" ref="radiofh">暂不发货</label>
			<radio class="pay-type-radio-item" style="transform:scale(0.7)" value="10"
				:checked="fhcheck" @click="funfh" />
		</view>
		
		<view class="content">
			<view class="pay-type-item">

				<checkbox-group @change='myfuxuan' v-if="isdikou">
					<view class="pay-type-radio">
						<view>
							<view class="pay-type-img">
								<image class="pay-type-img-inner" src="../../static/images/yu.png" mode="widthFix" />
							</view>
							<label class="pay-type-label">混合支付 余额:{{myyue}}</label>
							<checkbox class="pay-type-radio-item" style="transform:scale(0.7)" :checked='true' />
						</view>
					</view>
					<!-- 余额抵扣输入 -->
					<view class="yuedikou" v-if="isdikou">
						<view>余额抵扣: {{myyue}} 还需要其他支付方式补齐剩余金额 </view>
					</view>
				</checkbox-group>

			</view>

			<view class="pay-type-item">

				<radio-group @change="payTypeChange">

					<view class="pay-type-radio" v-if="showWechatPayType">
						
						
						<view style="margin-bottom: 40rpx;" v-if="!isdikou">
							<view class="pay-type-img">
								<image class="pay-type-img-inner" src="../../static/images/yu.png" mode="widthFix" />
							</view>
							<label class="pay-type-label">余额支付 余额:{{myyue}}</label>
							<radio class="pay-type-radio-item" style="transform:scale(0.7)" value="4"
								:checked="paymentMode == 4" />
						</view>

						<view style="margin-bottom: 40rpx;">
							<view class="pay-type-img">
								<image class="pay-type-img-inner" src="../../static/images/wechat_pay.png"
									mode="widthFix" />
							</view>
							<label class="pay-type-label">微信支付<text
									style="font-size: 24rpx;color: red;">(收取千分之六手续费)</text></label>
							<radio class="pay-type-radio-item" style="transform:scale(0.7)" value="1"
								:checked="paymentMode == 1" />
						</view>

						<view style="margin-bottom: 40rpx;">
							<view class="pay-type-img">
								<image class="pay-type-img-inner" src="../../static/images/xianxia.png"
									mode="widthFix" />
							</view>
							<label class="pay-type-label">其他支付</label>
							<radio class="pay-type-radio-item" style="transform:scale(0.7)" value="5"
								:checked="paymentMode == 5" />

						</view>
						
						
					</view>
					<view class="pay-type-radio" v-if="showAlipayPayType">
						<view class="pay-type-img">
							<image class="pay-type-img-inner" src="../../static/images/alipay.png" mode="widthFix" />
						</view>
						<label class="pay-type-label">支付宝支付</label>
						<radio class="pay-type-radio-item" style="transform:scale(0.7)" value="2"
							:checked="paymentMode == 2" />
					</view>
					<view class="pay-type-radio" v-if="showHuabeiPayType">
						<view class="pay-type-img">
							<image class="pay-type-img-inner" src="../../static/images/huabei.png" mode="widthFix" />
						</view>
						<label class="pay-type-label">花呗分期</label>
						<radio class="pay-type-radio-item" style="transform:scale(0.7)" value="3"
							:checked="paymentMode == 3" />
						<view class="huabei-detail" v-if="huabeiDetail" @click="showHuabeiDetail">
							<view>
								<label class="fenqi-wenzi">花呗分期</label>
								<label class="fenqi-charge-fee">手续费 ￥{{chargeFee|clip2Decimal}}</label>
							</view>
							<label class="fenqi-amount">分期总额 ￥{{ (totalprice - reduceMoney) | clip2Decimal }}</label>
							<img class="fenqi-modal" src="../../static/images/arrowRight.png" />
						</view>
					</view>
				</radio-group>
			</view>
			<!-- 备注 -->
			<view class="myorder-submission">
				<view style="margin-bottom: 20rpx;font-weight: 600;">订单备注</view>
				<u-input v-model="remark" type="textarea" :auto-height="true" placeholder="请输入订单备注" border />
			</view>
			<view class="order-flow-box">
				<view class="flow-word">交易流程：</view>
				<view class="flow-word mt25">
					<text>1、填写收货信息并完成支付</text>
					<text>2、双方根据物品的交易方式进行交易</text>
					<text>3、拿到物品，交易结束</text>
				</view>
				<!--        实付款不含邮费，涉及邮寄双方协定好费用，提醒发起人修改价格再完成支付；-->
				<view class="flow-word mt50">注：应国家邮政总局的要求，即日起涉及到个人快递包裹必须收件人实名制，否则将影响到收寄配送。请避免使用「先生，男士，小姐，女士，昵称」等模糊称谓。
				</view>
			</view>
		</view>
		<!-- 合计 -->
		<view class="order-confirm-box" style="padding-bottom:30upx;">
			<text class="num-box">共{{totalCount}}件，<text class="total">合计：</text>
				<text v-if="(totalprice - reduceMoney)>0"
					class="price">¥{{ (totalprice - reduceMoney).toFixed(2) }}</text>
				<text v-else class="price">¥0.00</text>
			</text>
			<!-- active 当有地址时按钮加上active选中的样式-->
			<text :class="[submitActive ? 'btn active' : 'btn']" @click="submitOrder">提交订单</text>

		</view>
		<!-- 活动弹框 -->
		<u-popup class="activity-con" v-model="isShowDiscount" mode="bottom" border-radius="14"
			close-icon-pos="top-right" close-icon-size="20">
			<view class="activity-box" style="height: 1000rpx;">
				<view class="title-box">
					<image class="close-btn" @click="onDiscountClose" src="../../static/images/close.png"></image>
				</view>
				<view class="activity-coupon-box">
					<scroll-view scroll-y="true" style="height: 900rpx;">
						<view class="content-box">
							<view v-if="usableListLength">
								<view class="label-lingqu">可用优惠券列表</view>
								<view class="coupon-item" v-for="(usableItem, index) in settlement.coupons" :key="index"
									@click="couponItemTap(index,usableItem)">
									<view class="money-box">￥{{usableItem.reduceMoney}}</view>
									<view class="info-box">
										<view class="info">{{usableItem.content}}</view>
										<view class="date" style="font-size:22upx;  margin-top: 20upx;">
											<!-- {{getDate(usableItem.startTime)}}至{{getDate(usableItem.endTime)}} -->
											{{getDate(usableItem.endTime)}}
										</view>
									</view>
									<image class="check-img" src="../../static/images/selectActive.png"
										v-if="couponCheckedindex == index"></image>
									<image class="check-img" src="../../static/images/selectEmpty.png" v-else></image>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</u-popup>
		<u-popup class="activity-con" v-model="isShopCoupons" mode="bottom" border-radius="14"
			close-icon-pos="top-right" close-icon-size="20">
			<view class="activity-box">
				<view class="title-box">
					<image class="close-btn" @click="onshopClose" src="../../static/images/close.png"></image>
				</view>
				<view class="activity-coupon-box">
					<scroll-view scroll-y="true" style="height: 900rpx;">
						<view class="content-box">
							<view v-if="shopCouponsLength">
								<view class="label-lingqu">可用优惠券列表</view>
								<view class="coupon-item" v-for="(sItem, index) in shopCouponslist.shopCoupons"
									:key="sItem.id" @click="shopCouponItemTap(index,sItem)">
									<view class="money-box" v-if="sItem.couponType == 1">￥{{sItem.reduceMoney}}</view>
									<view class="money-box" v-if="sItem.couponType == 2">{{sItem.reduceMoney}}折券</view>
									<view class="money-box" v-if="sItem.couponType == 3">物品券</view>
									<view class="info-box">
										<!-- <view class="info">满{{sItem.fullMoney}}元可用 <text v-if="sItem.couponType == 3">,{{sItem.giftname}}</text></view> -->
										<view class="info" style="font-size:30rpx;">{{sItem.content}}</view>
										<view class="date" style="font-size:30rpx;">
											<!-- {{getDate(sItem.startTime)}}至{{getDate(sItem.endTime)}} -->
											{{getDate(sItem.endTime)}}
										</view>
									</view>
									<image class="check-img" src="../../static/images/selectActive.png"
										v-if="selectCouponIdList.indexOf(sItem.id) >= 0"></image>
									<image class="check-img" src="../../static/images/selectEmpty.png" v-else></image>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</u-popup>
		<u-popup class="huabei-popup" v-model="showHuabeiPopup" mode="bottom" border-radius="14"
			close-icon-pos="top-right" close-icon-size="20">
			<view class="huabei-box">
				<radio-group @change="huabeiPeriodChange" v-model="huabeiPeriod">
					<view class="period-radio">
						<view class="period-amount">
							<label class="period-each">￥ {{fenqiFeeList[0]|clip2Decimal}}x3期</label>
							<label class="period-each-charge">手续费￥{{chargeFeeList[0]|clip2Decimal}}/期</label>
						</view>
						<radio class="period-type-radio-item" style="transform:scale(0.7)" :checked="huabeiPeriod == 3"
							value="3" />
					</view>
					<view class="period-radio">
						<view class="period-amount">
							<label class="period-each">￥ {{fenqiFeeList[1]|clip2Decimal}}x6期</label>
							<label class="period-each-charge">手续费￥{{chargeFeeList[1]|clip2Decimal}}/期</label>
						</view>
						<radio class="period-type-radio-item" style="transform:scale(0.7)" :checked="huabeiPeriod == 6"
							value="6" />
					</view>
					<view class="period-radio">
						<view class="period-amount">
							<label class="period-each">￥ {{fenqiFeeList[2]|clip2Decimal}}x12期</label>
							<label class="period-each-charge">手续费￥{{chargeFeeList[2]|clip2Decimal}}/期</label>
						</view>
						<radio class="period-type-radio-item" style="transform:scale(0.7)" :checked="huabeiPeriod == 12"
							value="12" />
					</view>
				</radio-group>
			</view>
			<view class="huabei-confirm">
				<view class="fenqi-total-amount">
					<label class="fenqi-all">分期总额 ￥{{ (totalprice - reduceMoney)|clip2Decimal }}</label>
					<label class="charge-fee-all">手续费 ￥{{ chargeFee|clip2Decimal }}</label>
				</view>
				<view class="fenqi-confirm">
					<text class="btn active" @click="showHuabeiPopup=false">确认</text>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	import {
		clearlogin,
		getlogininfo,
		getCurShopid,
		getCurUserid
	} from '@/api/common.js'
	import zuhe from "@/component/zuhe/index.vue"
import { Login } from '../../config/api'
	// #ifdef H5
	var jweixin = require('jweixin-module')
	// #endif
	export default {
		components:{
			zuhe
		},
		data() {
			return {
				flagindex:0, // 配送方式
				pslist:[
					{
					  name:"自提",
					  value:1	  
					},
					{
					  name:"配送",
					   value:0	 
					}
				], // 配送方式
				fhcheck:false, // 暂不发货的验证
				//dikoujin: '', //抵扣金额
				myreceiveId: 0, //这个地址id是传进来的,先保存一份,点击配送方式切换的时候,会用上
				remark: '', //下单备注
				// 买家、卖家
				shipping_type: 1,  // 卖家
				checked: false, //卖家配送 积分抵扣
				site: '', //门店地址
				shopkeeper: '', //门店负责人名字
				shopkeeperPhone: '', //门店负责人电话
				//结束
				pickupWay: 1,
				couponActiveShowFalg: false,
				settlement: {},
				type: 0,
				skuItemDTOList: [],
				userAddressInfo: {}, //地址对象
				isShowDiscount: false,
				isShopCoupons: false,
				usableListLength: 0,
				shopCouponsLength: 0,
				shopCouponslist: [],
				promotionInfoDTO: {
					couponId: 0,
					ifAdd: 1
				},

				reduceMoney: 0,
				couponCheckedindex: null,
				shopcouponCheckedindex: -1,
				submitActive: true,
				distributionPrice: 0, //运费
				totalprice: 0, //合计
				receiveId: '', //地址id
				couponCheckedType: false,
				shopCouponCheckedType: true,
				totalCount: 0,
				skuItemList: {},
				shopGroupWorkId: 0,
				sumitType: '', //订单商品的种类 普通下单传null 1-发起拼团 2-参与拼团 3-秒杀活动 4-限时折扣活动
				collageId: null,
				couponIfAdd: true,
				couponsList: [], //优惠券列表
				shopCouIndex: 0, //优惠券index
				shopIndex: 0,
				shopCheckedType: true,
				discountPrice: 0,
				shopCouponIdinfo: 0,
				selectShopCoupon: [], // 已选择门店优惠券
				selectCouponIdList: [], // 已选门店优惠券ID
				chargeFee: 0, //花呗分期手续费，如果是商户支付手续费，则为0，否则默认计算3期手续费
				huabeiDetail: true,
				showHuabeiPopup: false,
				huabeiChargeType: 0,
				huabeiFeerateList: [],
				paymentMode: 0, //支付方式 1-微信支付 2-支付宝支付 3-花呗分期 4-余额支付 5-线下支付
				huabeiPeriod: 3, //选择的花呗分期数 有 3 6 12 3种选项，默认是3
				chargeFeeList: [], //花呗每期的手续费
				fenqiFeeList: [], //花呗每期的支付额
				showWechatPayType: false,
				showAlipayPayType: false,
				showHuabeiPayType: false,
				isFrom: null, //是否是秒杀进来的, 0-从商品列表进来的 1-从秒杀活动或者是商品详情中的相关秒杀进来的
				shopXinxi: {}, //该店铺的信息
				myyue: '', //余额
				yuedeductPrice: '', //抵扣余额
				isdikou: false, //是否显示余额抵扣
				showcoupon:true,
				addressobj:{}  // 经销商默认地址
			}
		},  
		onLoad(options) {
			console.log(options, '传进来的参数');
			if(options.flagindex){
				 this.flagindex = options.flagindex
			}
			// 获取最近的门店地址
			this.isFrom = parseInt(options.isFrom)
			this.type = options.type
			if (options.receiveId) {
				this.myreceiveId = options.receiveId //在外面先保存一份
				this.receiveId = options.receiveId
			}
			this.decidePayType()
			//this.shopSite()
			//获取店铺信息
			this.initShop();
			wx.showShareMenu({
				withShareTicket:true,
				//设置下方的Menus菜单，才能够让发送给朋友与分享到朋友圈两个按钮可以点击
				menus:["shareAppMessage","shareTimeline"]
			})
		}, 
		//分享到朋友圈
		onShareTimeline(res) {
			let distributorId = this.$getstorage("distributorId")??""
			let userId = getCurUserid() === undefined ? '' : getCurUserid();
			let shopId = getCurShopid()
		    return {
				title: '购买宝贝',
				query:`type=${this.type}&isFrom=${this.isFrom}&FXUserId=${userId}&shopId=${shopId}&salesId=${distributorId}`
				// path: `/pages/tabbar/user/index?shopId=${shopId}&salesId=${userId}`,
			}
		},
		// 分享到朋友
		onShareAppMessage() {
			let distributorId = this.$getstorage("distributorId")??""
			let userId = getCurUserid() === undefined ? '' : getCurUserid();
			let shopId = getCurShopid()
			return {
				title: '购买宝贝',
				path: `/pages_category_page1/orderModule/orderConfirm?type=${this.type}&isFrom=${this.isFrom}&FXUserId=${userId}&shopId=${shopId}&salesId=${distributorId}`,
			}
		},
		onShow() {
			// 拿更改的默认地址
			this.addressobj = uni.getStorageSync("dataaddress") || {};
			// 
			if(Object.keys(this.addressobj).length===0){
				this.getzjaddress();
			}
			// 把余额拿到
			let shopId = getCurShopid();
			NET.request(API.getUserAll,{
				shopId
			}, 'GET').then(res => {
				this.myyue = res.data.price
				console.log(res.data, '我的余额')
			})

			if (uni.getStorageSync("skuItemDTOList") != "") {
				this.skuItemDTOList = uni.getStorageSync('skuItemDTOList')
				if (this.skuItemDTOList[0].shopDiscountId > 0) {
					this.sumitType = 4
					this.showcoupon=false;
				} else if (this.skuItemDTOList[0].shopSeckillId > 0) {
					this.sumitType = 3
					this.showcoupon=false;
				}
				this.getSettlement(false)
			} else if (uni.getStorageSync("skuItemList") != "") {
				this.skuItemList = uni.getStorageSync("skuItemList")
				console.log(this.skuItemList, 999)
				this.shopGroupWorkId = this.skuItemList.shopGroupWorkId
				this.sumitType = this.skuItemList.type
				this.collageId = this.skuItemList.collageId
				this.getSettlement(true)
			}
		},
		onBackPress(e) {
			if (e.from === 'navigateBack') {
				return false;
			}
			this.back();
			return true
		},
		methods: {
			// 获取最近地址
			getzjaddress(){
				let _t = this;
				uni.getLocation({
					success(e){
						  let shopId = getCurShopid();
						  let data = {
							shopId,
							latitude: e.latitude,
							longitude: e.longitude
						}
						NET.request(API.getzjaddress,data,"post").then(res=>{
							_t.addressobj = res.data;
							 console.log(res,"配送地址配送地址配送地址配送地址");
						})
					}
				})
			},
			// 配送方式
			changeps(e){
				this.flagindex = this.flagindex==1 ? 0 : 1;
			},
			// 暂不发货
			funfh(){
				this.fhcheck = !this.fhcheck
			},
			myfuxuan() {
				this.isdikou = !this.isdikou
				this.yuedeductPrice = 0
				this.paymentMode = 1
				console.log(this.myyue, '余额')
			},
			//打电话
			dadianhua() {
				let Phone = this.shopXinxi.chargePersonPhone
				wx.makePhoneCall({
					phoneNumber: Phone,
				})
			},
			//获取商店信息
			initShop() {
				let shopId = getCurShopid()
				NET.request(API.GetStoreNew, {
					shopId
				}, 'GET').then(res => {
					this.shopXinxi = res.data
					console.log(this.shopXinxi, '商店信息!!')
					let {
						chargePersonName,
						chargePersonPhone,
						shopAdress
					} = res.data
					this.site = shopAdress
					this.shopkeeper = chargePersonName
					this.shopkeeperPhone = chargePersonPhone
				})
			},
			addressType(index) {
				this.shipping_type = index;
				if (index == 0) {
					//配送
					this.receiveId = this.myreceiveId
					this.pickupWay = 0
				} else {
					//自提
					this.receiveId = null
					this.pickupWay = 1
				}
				console.log(this.pickupWay, 998898)
			},
			//结束
			back() {
				if (this.type == 2 || this.type) {
					uni.switchTab({
						url: '../../pages/tabbar/cart/index'
					})
				} else {
					uni.navigateBack({
						delta: 1
					});
				}
			},
			// 获取订单信息
			getSettlement(isGroup) {
				let myshopId = getCurShopid()
				uni.showLoading({
					title: '加载中...',
				})
				let _url = '',
					_data = ''
				// 是否是拼团
				if (isGroup) {
					_url = API.getGroupSettlement
					_data = this.skuItemList
				} else {
					_url = API.Settlement
					_data = {
						type: this.type,
						shops: this.skuItemDTOList,
						receiveId: this.receiveId,
						shopId: myshopId,
						request: this.isFrom
					}
				}
				console.log(_data, '_data')
				NET.request(_url, _data, 'POST').then(res => {
					uni.hideLoading()
					this.settlement = res.data
					this.couponsList = res.data.coupons
					this.huabeiChargeType = res.data.huabeiChargeType
					if (this.huabeiChargeType == 2) {
						this.huabeiFeerateList = res.data.huabeiFeerateList
					} else {
						this.huabeiFeerateList = [0, 0, 0]
					}
					let shopLen = this.settlement.shops.length
					let shoptotal = 0,
						skuTotalNum = 0,
						skutotal = 0,
						isskutotal = 0,
						isskuTotalNum = 0,
						skustotal = 0;
					for (let s = 0; s < shopLen; s++) {
						this.settlement.shops[s].skus.forEach((value, index) => {
							value['totalNum'] = value.total
						})
						this.settlement.shops[s].total += this.settlement.shops[s].distribution.distributionPrice
						console.log(this.settlement.shops[s].total, '11111')
						if (this.settlement.shops[s].shopCoupons.length > 0) {
							if (this.settlement.shops[s].shopCoupons[0].couponType == 1) {
								// 满减 拿到第一张符合的券
								let _shopCoupons = this.settlement.shops[s].shopCoupons,
									curCoupon = ''
								for (let i = 0; i < _shopCoupons.length; i++) {
									if (this.settlement.shops[s].total > this.settlement.shops[s].shopCoupons[i]
										.reduceMoney) {
										this.settlement.shops[s].total = this.settlement.shops[s].total - this
											.settlement.shops[s].shopCoupons[i].reduceMoney
										this.settlement.shops[s]['currentCoupon'] = this.settlement.shops[s]
											.shopCoupons[i]
										this.shopCouponIdinfo = this.settlement.shops[s].shopCoupons[i].id
										this.selectShopCoupon.push(this.settlement.shops[s].shopCoupons[i])
										this.selectCouponIdList.push(this.settlement.shops[s].shopCoupons[i].id)
										break
									}
								}
							} else {
								// 折扣 默认第一张券
								let skuLen = this.settlement.shops[s].skus.length
								for (let k = 0; k < skuLen; k++) {
									let idsLen = this.settlement.shops[s].shopCoupons[0].ids.length
									for (let i = 0; i < idsLen; i++) {
										if (this.settlement.shops[s].skus[k].productId == this.settlement.shops[s]
											.shopCoupons[0].ids[i]) {
												if(this.settlement.shops[s].shopCoupons[0].couponType!=3){
													skustotal = this.settlement.shops[s].skus[k].totalNum * (this
														.settlement.shops[s].shopCoupons[0].reduceMoney /
														10)
													this.settlement.shops[s].skus[k].total = skustotal
												}else{
													//物品券
													
												}
											
										}
									}
									shoptotal += this.settlement.shops[s].skus[k].total
									this.settlement.shops[s].total = shoptotal.toFixed(2)
								}
								this.selectShopCoupon.push(this.settlement.shops[s].shopCoupons[0])
								this.selectCouponIdList.push(this.settlement.shops[s].shopCoupons[0].id)
								this.settlement.shops[s]['currentCoupon'] = this.settlement.shops[s].shopCoupons[0]
								if (this.settlement.shops[0].shopCoupons && this.settlement.shops[0].shopCoupons
									.length > 0) {
									this.shopCouponIdinfo = this.settlement.shops[0].shopCoupons[0].id
								}
							}
						}
					}
					//获取地址
					if (uni.getStorageSync('receiveItem')) {
						console.log(22222)
						let receiveItem = uni.getStorageSync('receiveItem')
						this.userAddressInfo = receiveItem
						this.receiveId = receiveItem.receiveId
					} else if (res.data.receive) {
						this.receiveId = res.data.receive.receiveId
						this.userAddressInfo = res.data.receive
					}
					uni.removeStorageSync('receiveItem')
					this.usableListLength = res.data.coupons.length
					console.log(this.settlement, 'settlement')
					console.log(this.selectCouponIdList, 'selectCouponIdList')
					this.getTotal()
				},res=>{
					setTimeout(function(){
						uni.hideLoading()
						uni.navigateBack()
					},1000)
				}).catch(res => {
					uni.hideLoading()
				})
			},
			addAddressTap() {
				uni.navigateTo({
					url: '../../pages_category_page2/userModule/address?type=1',
				})
			},
			getDate(time) {
				if (!time) return '';
				return time.split(' ')[0]
			},
			// 平台优惠券选择
			couponItemTap(index, usableItem) {
				if (this.couponCheckedindex === index) {
					let promotionInfoDTO = {}
					if (usableItem.couponId) {
						promotionInfoDTO['couponId'] = 0
						promotionInfoDTO['ifAdd'] = 1
					}
					this.promotionInfoDTO = promotionInfoDTO
					this.reduceMoney = 0
					this.couponCheckedindex = null
					this.couponCheckedType = false
					this.isShowDiscount = false
					this.getTotal()
				} else {
					console.log(usableItem.reduceMoney, 'item')
					let moneySum = 0
					let shopslen = this.settlement.shops.length
					for (let i = 0; i < shopslen; i++) {
						moneySum += this.settlement.shops[i].total
					}
					if (usableItem.reduceMoney >= moneySum) {
						uni.showToast({
							title: '不可使用大于等于合计金额的优惠劵！',
							icon: 'none'
						})
						return false
					}
					let promotionInfoDTO = {}
					if (usableItem.couponId) {
						promotionInfoDTO['couponId'] = usableItem.couponId
						promotionInfoDTO['ifAdd'] = usableItem.ifAdd
					}
					this.promotionInfoDTO = promotionInfoDTO
					this.reduceMoney = usableItem.reduceMoney
					this.couponCheckedindex = index
					this.couponCheckedType = true
					this.isShowDiscount = false
					this.getTotal()
				}
			},
			// 门店优惠券选择
			shopCouponItemTap(index, sItem) {
				// 取消选择优惠券
				console.log(this.selectShopCoupon, 'Youhui')
				for (let i = 0; i < this.selectShopCoupon.length; i++) {
					let skusTotal = 0
					this.settlement.shops[this.shopIndex].skus.forEach((value, index) => {
						console.log(value.totalNum, 'total')
						skusTotal += value.totalNum
					})
					if (this.settlement.shops[this.shopIndex].distribution.distributionPrice > 0) {
						skusTotal += this.settlement.shops[this.shopIndex].distribution.distributionPrice
					}
					this.settlement.shops[this.shopIndex].total = skusTotal
					this.settlement.shops[this.shopIndex].currentCoupon = {}
					this.shopcouponCheckedindex = 99999999
					this.shopCouponCheckedType = false
					this.isShopCoupons = false
					this.settlement.shops[this.shopIndex].currentCoupon.shopCouponId = 0
					this.getTotal()
					if (this.selectShopCoupon[i].id === sItem.id) {
						console.log(666)
						this.selectCouponIdList.splice(i, 1)
						this.selectShopCoupon.splice(i, 1)
						return false
					}
					this.selectCouponIdList.splice(i, 1)
					this.selectShopCoupon.splice(i, 1)
				}
				if (sItem.couponType === 1 && this.settlement.shops[this.shopIndex].total < sItem.reduceMoney) {
					uni.showToast({
						title: '不可使用大于商品金额的优惠劵！',
						icon: 'none'
					})
				} else {
					// 选择优惠券
					if (this.selectCouponIdList.indexOf(sItem.id) === -1) {
						if (this.promotionInfoDTO.couponId !== 0) {
							if (sItem.ifAdd == 0) {
								uni.showToast({
									title: '此券不可与平台券叠加！',
									icon: 'none'
								})
								return false
							}
						}
						if (sItem.couponType == 1) {
							console.log(sItem.reduceMoney, this.totalprice, this.reduceMoney, 'test111')
							if (sItem.reduceMoney >= (this.totalprice - this.reduceMoney)) {
								console.log(2)
								uni.showToast({
									title: '优惠券优惠金额不能大于等于合计金额！',
									icon: 'none'
								})
								return false
							}
						}
						for (let i = 0; i < this.selectShopCoupon.length; i++) {
							if (this.selectShopCoupon[i].id === this.settlement.shops[this.shopIndex].currentCoupon.id) {
								this.selectCouponIdList.splice(i, 1)
								this.selectShopCoupon.splice(i, 1)
							}
						}
						this.shopcouponCheckedindex = index
						this.shopCouponCheckedType = true
						this.isShopCoupons = false
						this.shopCouponIdinfo = sItem.id
						this.settlement.shops[this.shopIndex].currentCoupon = sItem
						this.selectCouponIdList.push(sItem.id)
						this.selectShopCoupon.push(sItem)
						let shoptotal = 0
						let skustotal = 0
						let sum = 0
						this.settlement.shops[this.shopIndex].skus.forEach((value, index) => {
							console.log(value.totalNum, 'total')
							sum += value.totalNum
						})
						if (this.settlement.shops[this.shopIndex].distribution.distributionPrice > 0) {
							sum += this.settlement.shops[this.shopIndex].distribution.distributionPrice
						}
						this.settlement.shops[this.shopIndex].total = sum
						this.shopCouIndex = index
						console.log(this.shopIndex, this.shopCouIndex)
						if (sItem.couponType == 1) {
							this.settlement.shops[this.shopIndex].total = this.settlement.shops[this.shopIndex].total -
								sItem.reduceMoney
							console.log(this.settlement.shops[this.shopIndex].total, 's1')
						} else if (sItem.couponType == 2) {
							let skuLen = this.settlement.shops[this.shopIndex].skus.length
							console.log(skuLen, 121200000)
							for (let k = 0; k < skuLen; k++) {
								let idsLen = this.settlement.shops[this.shopIndex].shopCoupons[this.shopCouIndex].ids
									.length
								for (let i = 0; i < idsLen; i++) {
									if (this.settlement.shops[this.shopIndex].skus[k].productId === this.settlement.shops[
											this.shopIndex].shopCoupons[this.shopCouIndex].ids[i]) {
										skustotal = this.settlement.shops[this.shopIndex].skus[k].totalNum * (this
											.settlement.shops[this.shopIndex].shopCoupons[
												this.shopCouIndex].reduceMoney / 10)
										this.settlement.shops[this.shopIndex].skus[k].total = skustotal
										console.log(skustotal)
									}
								}
								// console.log(typeof this.settlement.shops[this.shopIndex].skus[k].total, 'shoptotal22')
								shoptotal += this.settlement.shops[this.shopIndex].skus[k].total
								this.settlement.shops[this.shopIndex].total = parseFloat(shoptotal.toFixed(2))
							}
						}
						this.getTotal()
					}
				}
			},
			getTotal() {
				this.totalprice = 0
				this.totalCount = 0
				let allNum = 0
				let shopslen = this.settlement.shops.length
				for (let i = 0; i < shopslen; i++) {
					this.totalprice += parseFloat(this.settlement.shops[i].total)
					allNum += this.settlement.shops[i].totalNum
					this.totalCount += this.settlement.shops[i].number
				}
				if (this.totalprice - this.reduceMoney > 0) {
					this.discountPrice = allNum - this.totalprice + this.reduceMoney
				} else {
					this.discountPrice = allNum
				}
				this.discountPrice = this.discountPrice.toFixed(2)
				this.discountPrice = parseFloat(this.discountPrice)
				this.recalcHuabei()
				// console.log(this.totalprice - this.reduceMoney, 'dis')
			},
			recalcHuabei() {
				if (this.paymentMode == 3) {
					this.fenqiFeeList[0] = (this.totalprice - this.reduceMoney) * (1 + this.huabeiFeerateList[0] / 100) / 3
					this.fenqiFeeList[1] = (this.totalprice - this.reduceMoney) * (1 + this.huabeiFeerateList[1] / 100) / 6
					this.fenqiFeeList[2] = (this.totalprice - this.reduceMoney) * (1 + this.huabeiFeerateList[2] / 100) /
						12

					this.chargeFeeList[0] = (this.totalprice - this.reduceMoney) * (this.huabeiFeerateList[0] / 100) / 3
					this.chargeFeeList[1] = (this.totalprice - this.reduceMoney) * (this.huabeiFeerateList[1] / 100) / 6
					this.chargeFeeList[2] = (this.totalprice - this.reduceMoney) * (this.huabeiFeerateList[2] / 100) / 12

					var index = 0;
					if (this.huabeiPeriod == 6) {
						index = 1
					} else if (this.huabeiPeriod == 12) {
						index = 2
					}
					this.chargeFee = ((this.totalprice - this.reduceMoney) * (this.huabeiFeerateList[index] / 100))
						.toFixed(2)
				}
			},
			// 显示门店优惠券
			showShopCoupons(item, sIndex) {
				console.log(item, 'item')
				if (item.shopCoupons.length > 0) {
					this.isShopCoupons = true
					this.shopCouponslist = item
					this.shopCouponsLength = item.shopCoupons.length
					this.shopIndex = sIndex
					console.log(this.selectCouponIdList.indexOf(item.shopCoupons[0].id), '测试')
				} else {
					uni.showToast({
						title: '暂无可用优惠券',
						icon: 'none'
					})
				}
			},
			onDiscountClose() {
				this.isShowDiscount = false
			},
			onshopClose() {
				this.isShopCoupons = false
			},

			payTypeChange(event) {
				this.paymentMode = event.target.value;
			
				if (this.paymentMode == 4 && (this.totalprice - this.reduceMoney) > this.myyue) {
					this.yuedeductPrice = this.myyue
					this.isdikou = true
				}
			},
			huabeiPeriodChange(event) {
				this.huabeiPeriod = event.target.value
				var feeRate = this.huabeiFeerateList[2]
				if (this.huabeiPeriod == 3) {
					feeRate = this.huabeiFeerateList[0]
				} else if (this.huabeiPeriod == 6) {
					feeRate = this.huabeiFeerateList[1]
				}
				console.log('feeRate: ', feeRate)
				this.chargeFee = ((this.totalprice - this.reduceMoney) * feeRate / 100).toFixed(2)
			},
			showHuabeiDetail() {
				this.showHuabeiPopup = true
			},
			//提交订单
			submitOrder() {
				let flagaddressobj = this.addressobj;
				if(!flagaddressobj.address){
					uni.showToast({
						title: '提货地址不能为空',
						duration: 1500,
						icon: 'none'
					})
					return
				}else if(!flagaddressobj.vipname){
					uni.showToast({
						title: '提货联系人不能为空',
						duration: 1500,
						icon: 'none'
					})
					return
				}else if(!flagaddressobj.vipphone){
					uni.showToast({
						title: '提货联系电话不能为空',
						duration: 1500,
						icon: 'none'
					})
					return
				}
				
				// 排除他小于 0 
				if (this.myyue < 0) {
					uni.showToast({
						title: '抵扣金额输入错误!',
						duration: 1500,
						icon: 'none'
					})
					return
				}
				// 再排除大于订单的情况
				// 订单金额 
				if (this.myyue >= (this.totalprice - this.reduceMoney).toFixed(2)) {
				 	// this.myyue = 0;
				}
				
				// 判断有没有选择支付方式
				if (this.paymentMode === 0) {
				 	uni.showToast({
				 		title: '请选择支付方式',
				 		icon: 'none'
				 	})
				 	return
				}

				//下面的 if 的作用是,把微信支付拿出来,他是没有弹框的,天哥说的
				if (this.paymentMode == 1) {
					// 微信支付
					if (this.paymentMode === 0) {
						uni.showToast({
							title: '请选择支付方式',
							icon: 'none'
						})
					} else {
						console.log('卖家配送')
						//配送照常代码

						if (this.userAddressInfo.receiveName || this.pickupWay == 1) {
							uni.showLoading({
								title: '订单提交中...',
							})
							let couponIdinfo = 0
							if (this.promotionInfoDTO.couponId) {
								couponIdinfo = this.promotionInfoDTO.couponId
							}
							let price = 0
							if (this.totalprice - this.reduceMoney > 0) {
								price = this.totalprice - this.reduceMoney
							} else {
								price = 0
							}
							let shopId = uni.getStorageSync("curshopid");
							let noFXUserInfo = {
								isFXOrder: 0,
								FXUserId: '',
							}
						
							console.log(uni.getStorageSync('FXUserInfo') === '','不是分享订单')
							
							let FXInfo = uni.getStorageSync('FXUserInfo') === '' ? noFXUserInfo : uni
								.getStorageSync('FXUserInfo');
					        let iszbfh = this.fhcheck == false ? 1 : 0
							let data = {
								isFXOrder: FXInfo.isFXOrder,
								fxUserId: FXInfo.FXUserId,
								shopId,
								shopDiscountId: null,
								collageId: this.collageId,
								type: this.sumitType,
								shopGroupWorkId: null,
								receiveId: this.receiveId,
								couponId: couponIdinfo,
								price: price,
								remark: this.remark,
								shops: [],
								discountPrice: this.discountPrice,
								shopSeckillId: null,
								// pickupWay: this.pickupWay,
								pickupWay:this.flagindex==1?0:1,
								state: 1,
								iszbfh,
								deliveryAddress:this.addressobj.address,
								deliveryUserId:this.addressobj.buyerUserId,
								deliveryName:this.addressobj.vipname,
								deliveryPhone:this.addressobj.vipphone
								// receiveAdress:this.addressobj.address,
								// receiveType:'tihuo'
							}
							
							if (this.shopGroupWorkId > 0) {
								data.shopGroupWorkId = this.shopGroupWorkId
							}
							if (this.skuItemDTOList != '') {
								if (this.skuItemDTOList[0].shopDiscountId > 0) {
									data.shopDiscountId = this.skuItemDTOList[0].shopDiscountId
								} else if (this.skuItemDTOList[0].shopSeckillId > 0) {
									data.shopSeckillId = this.skuItemDTOList[0].shopSeckillId
								}
							}
							let datashopslen = this.settlement.shops.length
							for (let n = 0; n < datashopslen; n++) {
								let shopsobj = {}
								shopsobj["shopId"] = this.settlement.shops[n].shopId
								shopsobj["distribution"] = {}
								shopsobj["skus"] = []
								if (this.settlement.shops[n].currentCoupon) {
									shopsobj["id"] = this.settlement.shops[n].currentCoupon.id
								}
								data.shops.push(shopsobj)
								data.shops[n].distribution.distributionPrice = this.settlement.shops[n]
									.distribution
									.distributionPrice
								let dataskuslen = this.settlement.shops[n].skus.length
								for (let m = 0; m < dataskuslen; m++) {
									let skusobj = {}
									skusobj["skuId"] = this.settlement.shops[n].skus[m].skuId
									skusobj["number"] = this.settlement.shops[n].skus[m].number
									skusobj["ifLogistics"] = this.settlement.shops[n].skus[m]
										.ifLogistics
									skusobj["selected"] = this.settlement.shops[n].skus[m].selected
									data.shops[n].skus.push(skusobj)
								}
							}
							// #ifdef H5
							data.paymentMode = 1
							data.subPaymentMode = 3
							// #endif

							// #ifdef MP-WEIXIN
							if (this.paymentMode == 1) {
								data.paymentMode = 1
								data.subPaymentMode = 1
							} else if (this.paymentMode == 4) {
								data.paymentMode = 4
								data.subPaymentMode = 1
							} else {
								data.paymentMode = 5
								data.subPaymentMode = 1
							}
							// #endif
							// #ifdef APP-PLUS
							if (this.paymentMode == 1) {
								data.paymentMode = 1
								data.subPaymentMode = 1
							} else if (this.paymentMode == 4) {
								data.paymentMode = 4
								data.subPaymentMode = 1
							} else {
								data.paymentMode = 5
								data.subPaymentMode = 1
							}
							// #endif
							// #ifdef MP-ALIPAY
							data.paymentMode = 2
							data.subPaymentMode = 1
							// #endif
							console.log(data, '请求参数3333')

							//下面就是发请求,在这里修改 type
							if (this.isFrom == 0) {
								data.type = null
							}
							data.yuedeductPrice = this.yuedeductPrice

							NET.request(API.PlaceOrder, data, 'POST').then(res => {
								let submitResult = res.data
								let shopId = uni.getStorageSync("curshopid");

								submitResult.shopId = shopId

								console.log(submitResult, '测试')
								submitResult.type = 1
								submitResult.paymentMode = data.paymentMode
								// #ifdef H5
								let ua = navigator.userAgent.toLowerCase();
								//  5h支付
								NET.request(API.gotoH5Pay, submitResult, 'POST').then(res => {
									//console.dir(res)
									location.replace(res.data.mwebUrl)
									// window.location.replace(url)
								}).catch(err => {
									this.submitActive = true
									uni.hideLoading()
									uni.showToast({
										title: '账户余额不足',
										icon: 'none'
									})
								})
								// }
								// #endif
								// #ifdef MP-ALIPAY
								submitResult.huabeiPeriod = this.huabeiPeriod
								submitResult.paymentMode = this.paymentMode
								this.aliPay(submitResult)
								// #endif

								// #ifdef MP-WEIXIN
								if (this.paymentMode != 5 && this.paymentMode != 4) {

									NET.request(API.gotoPay, submitResult, 'POST').then(
										res => {
											console.dir(res)
											uni.requestPayment({
												privider: 'wxpay',
												timeStamp: res.data.timeStamp,
												nonceStr: res.data.nonceStr,
												package: res.data.package,
												signType: res.data.signType,
												paySign: res.data.paySign,
												success: function(payRes) {
													uni.showToast({
														icon: 'none',
														title: '支付成功'
													})

													uni.redirectTo({
														url: 'index?type=0'
													})
												},
												fail: function(err) {

													uni.showToast({
														icon: 'none',
														duration: 1000,
														title: '支付取消'
													})
													setTimeout(() => {
														uni.redirectTo({
															url: 'index?type=0'
														})
													}, 1000)
												}
											})
										}).catch(err => {
										uni.hideLoading()
										uni.showToast({
											title: '账户余额不足',
											icon: 'none'
										})
									})

								} else {
									uni.hideLoading()
									uni.showToast({
										icon: 'none',
										title: '支付成功'
									})
									uni.redirectTo({
										url: 'index?type=0'
									})
								}

								// #endif
								// #ifdef APP-PLUS
								console.log(submitResult, 'app-submitResult')
								NET.request(API.gotoAppPay, submitResult, 'POST').then(res => {
									console.log(res, 'res有没有data')
									let str = res.data.package
									var index = str.lastIndexOf("\=");
									str = str.substring(index + 1, str.length);
									var obj = {
										appid: res.data.appId,
										noncestr: res.data.nonceStr,
										package: 'Sign=WXPay',
										prepayid: str,
										timestamp: res.data.timeStamp,
										sign: 'MD5',
										partnerid: res.data.partnerId
									}
									console.log(res.data, '111')
									console.log(obj, '111')
									uni.requestPayment({
										provider: 'wxpay',
										orderInfo: obj,
										success: function(payRes) {
											uni.showToast({
												icon: 'none',
												title: '支付成功'
											})
											uni.redirectTo({
												url: 'index?type=0'
											})
										},
										fail: function(err) {
											console.log(err)
											uni.showToast({
												icon: 'none',
												title: '支付取消'
											})
										}
									})
								}).catch(err => {
									uni.hideLoading()
									uni.showToast({
										title: '账户余额不足',
										icon: 'none'
									})
								})
								// #endif
							}).catch(res => {
								let str = res.message

								if (str == undefined || str == '') {
									str = '提交失败'
								}
								uni.hideLoading()
								uni.showToast({
									title: str,
									icon: 'none'
								})
							})

						} else {
							uni.showToast({
								icon: 'none',
								title: '请设置一个默认地址'
							})
						}

					}

				} else {
					//这里是除了微信支付都走这里
					uni.showModal({
						content: '是否支付',
						confirmText: '确定支付',
						cancelText: '取消支付',
						success: res => {
							if (res.confirm) {
								console.log('这里是除了微信支付都走这里')
								//配送照常代码
							 	if (this.userAddressInfo.receiveName || this.pickupWay == 1) {
									uni.showLoading({
										title: '订单提交中...',
									})
									let couponIdinfo = 0
									if (this.promotionInfoDTO.couponId) {
										couponIdinfo = this.promotionInfoDTO.couponId
									}
									let price = 0
									if (this.totalprice - this.reduceMoney > 0) {
										price = this.totalprice - this.reduceMoney
									} else {
										price = 0
									}
									let shopId = uni.getStorageSync("curshopid");
									console.log(uni.getStorageSync('FXUserInfo') === '','是不是分享订单')
									let noFXUserInfo = {
										isFXOrder: 0,
										FXUserId: '',
									}
									let FXUserInfo = {
										isFXOrder: 1,
										FXUserId: 1087,
									}
									let FXInfo = uni.getStorageSync('FXUserInfo') === '' ?
										noFXUserInfo : uni.getStorageSync('FXUserInfo');
										 let iszbfh = this.fhcheck == false ? 1 : 0
									let data = {
										isFXOrder: FXInfo.isFXOrder,
										fxUserId: FXInfo.FXUserId,
										shopId,
										shopDiscountId: null,
										collageId: this.collageId,
										type: this.sumitType,
										shopGroupWorkId: null,
										receiveId: this.receiveId,
										couponId: couponIdinfo,
										price: price,
										remark: this.remark,
										shops: [],
										discountPrice: this.discountPrice,
										shopSeckillId: null,
										// pickupWay: this.pickupWay,
										pickupWay: this.flagindex==1?0:1,
										state: 1,
										iszbfh,
										deliveryUserId:this.addressobj.buyerUserId,  // 提货点参数
										deliveryAddress:this.addressobj.address,
									    deliveryName:this.addressobj.vipname,
									    deliveryPhone:this.addressobj.vipphone
									}
									
									if (this.shopGroupWorkId > 0) {
										data.shopGroupWorkId = this.shopGroupWorkId
									}
									if (this.skuItemDTOList != '') {
										if (this.skuItemDTOList[0].shopDiscountId > 0) {
											data.shopDiscountId = this.skuItemDTOList[0].shopDiscountId
										} else if (this.skuItemDTOList[0].shopSeckillId > 0) {
											data.shopSeckillId = this.skuItemDTOList[0].shopSeckillId
										}
									}
									console.log(1234567)
									let datashopslen = this.settlement.shops.length
									for (let n = 0; n < datashopslen; n++) {
										let shopsobj = {}
										shopsobj["shopId"] = this.settlement.shops[n].shopId
										shopsobj["distribution"] = {}
										shopsobj["skus"] = []
										if (this.settlement.shops[n].currentCoupon) {
											shopsobj["id"] = this.settlement.shops[n].currentCoupon.id
										}
										data.shops.push(shopsobj)
										data.shops[n].distribution.distributionPrice = this.settlement
											.shops[n]
											.distribution
											.distributionPrice
										let dataskuslen = this.settlement.shops[n].skus.length
										for (let m = 0; m < dataskuslen; m++) {
											let skusobj = {}
											skusobj["skuId"] = this.settlement.shops[n].skus[m].skuId
											skusobj["number"] = this.settlement.shops[n].skus[m].number
											skusobj["ifLogistics"] = this.settlement.shops[n].skus[m]
												.ifLogistics
											skusobj["selected"] = this.settlement.shops[n].skus[m].selected
											data.shops[n].skus.push(skusobj)
										}
									}
									console.log(1234567)
									
									// #ifdef H5
									data.paymentMode = 1
									data.subPaymentMode = 3
									// #endif

									// #ifdef MP-WEIXIN
									if (this.paymentMode == 1) {
										data.paymentMode = 1
										data.subPaymentMode = 1
									} else if (this.paymentMode == 4) {
										data.paymentMode = 4
										data.subPaymentMode = 1
									} else {
										data.paymentMode = 5
										data.subPaymentMode = 1
									}
									// #endif

									// #ifdef APP-PLUS
									if (this.paymentMode == 1) {
										data.paymentMode = 1
										data.subPaymentMode = 1
									} else if (this.paymentMode == 4) {
										data.paymentMode = 4
										data.subPaymentMode = 1
									} else {
										data.paymentMode = 5
										data.subPaymentMode = 1
									}
									// #endif

									// #ifdef MP-ALIPAY
									data.paymentMode = 2
									data.subPaymentMode = 1
									// #endif

									// uni.hideLoading()
									console.log(data, '请求参数1111')

									//下面就是发请求,在这里修改 type
									if (this.isFrom == 0) {
										data.type = null
									}

									data.yuedeductPrice = this.yuedeductPrice
									NET.request(API.PlaceOrder, data, 'POST').then(res => {
										let submitResult = res.data
										let shopId = uni.getStorageSync("curshopid");

										submitResult.shopId = shopId

										console.log(submitResult, '测试')
										submitResult.type = 1
										submitResult.paymentMode = data.paymentMode
										// #ifdef H5
										let ua = navigator.userAgent.toLowerCase();
										// if (ua.match(/MicroMessenger/i) == "micromessenger") {
										//   this.payRequest(submitResult)
										// }else{
										//  5h支付
										NET.request(API.gotoH5Pay, submitResult, 'POST').then(
											res => {
												//console.dir(res)
												location.replace(res.data.mwebUrl)
												// window.location.replace(url)
											}).catch(err => {
											this.submitActive = true
											uni.hideLoading()
											uni.showToast({
												title: '账户余额不足',
												icon: 'none'
											})
										})
										// }
										// #endif
										// #ifdef MP-ALIPAY
										submitResult.huabeiPeriod = this.huabeiPeriod
										submitResult.paymentMode = this.paymentMode
										this.aliPay(submitResult)
										// #endif

										// #ifdef MP-WEIXIN
										if (this.paymentMode != 5 && this.paymentMode != 4) {

											NET.request(API.gotoPay, submitResult, 'POST').then(
												res => {
													console.dir(res)
													uni.requestPayment({
														privider: 'wxpay',
														timeStamp: res.data.timeStamp,
														nonceStr: res.data.nonceStr,
														package: res.data.package,
														signType: res.data.signType,
														paySign: res.data.paySign,
														success: function(payRes) {
															console.log('啥支付777')
															uni.showToast({
																icon: 'none',
																title: '支付成功',
																duration:2000
															})
															setTimeout(()=>{
																uni.redirectTo({
																	url: 'index?type=0'
																})
															},2000)
													
														},
														fail: function(err) {

															uni.showToast({
																icon: 'none',
																title: '支付取消'
															})
														}
													})
												}).catch(err => {
												uni.hideLoading()
												uni.showToast({
													title: '账户余额不足',
													icon: 'none'
												})
											})

										} else {
											console.log('小程序支付成功,887766')
											uni.hideLoading()
											uni.showToast({
												icon: 'none',
												title: '支付成功',
												duration:2000
											})
											setTimeout(()=>{
												uni.redirectTo({
													url: 'index?type=0'
												})
											},2000)
									
										}

										// #endif
										// #ifdef APP-PLUS
										console.log(submitResult, 'app-submitResult')
										NET.request(API.gotoAppPay, submitResult, 'POST').then(
											res => {
												console.log(res, 'res有没有data')

												let str = res.data.package
												var index = str.lastIndexOf("\=");
												str = str.substring(index + 1, str.length);
												var obj = {
													appid: res.data.appId,
													noncestr: res.data.nonceStr,
													package: 'Sign=WXPay',
													prepayid: str,
													timestamp: res.data.timeStamp,
													sign: 'MD5',
													partnerid: res.data.partnerId
												}
												console.log(res.data, 'app支付111')
												console.log(obj, 'app支付111')
												uni.showToast({
													icon: 'none',
													title: '支付成功',
													duration:2000
												})
												setTimeout(()=>{
													uni.redirectTo({
														url: 'index?type=0'
													})
												},2000)
												// uni.requestPayment({
												// 	provider: 'wxpay',
												// 	orderInfo: obj,
												// 	success: function(payRes) {
												// 		uni.showToast({
												// 			icon: 'none',
												// 			title: '支付成功',
												// 			duration:2000
												// 		})
												// 		setTimeout(()=>{
												// 			uni.redirectTo({
												// 				url: 'index?type=0'
												// 			})
												// 		},2000)
												
												// 	},
												// 	fail: function(err) {
												// 		console.log(err)
												// 		uni.showToast({
												// 			icon: 'none',
												// 			title: '支付取消'
												// 		})
												// 	}
												// })
											}).catch(err => {
											uni.hideLoading()
											uni.showToast({
												title: '账户余额不足',
												icon: 'none'
											})
										})
										// #endif
									}).catch(res => {
										let str = res.message
										if (str == undefined || str == '') {
											str = '提交失败'
										}
										uni.hideLoading()
										uni.showToast({
											title: str,
											icon: 'none'
										})
									})
								} else {
									uni.showToast({
										icon: 'none',
										title: '请设置一个默认地址'
									})
								}
							} else if (res.cancel) {
								uni.showToast({
									title: '已取消支付',
									duration: 2000,
									icon: 'none'
								});
								// 下面是取消支付也要调接口,传值有限制 state: 0   
								let couponIdinfo = 0
								if (this.promotionInfoDTO.couponId) {
									couponIdinfo = this.promotionInfoDTO.couponId
								}
								let price = 0
								if (this.totalprice - this.reduceMoney > 0) {
									price = this.totalprice - this.reduceMoney
								} else {
									price = 0
								}
								let shopId = uni.getStorageSync("curshopid");
								let data = {
									shopId,
									shopDiscountId: null,
									collageId: this.collageId,
									type: this.sumitType,
									shopGroupWorkId: null,
									receiveId: this.receiveId,
									couponId: couponIdinfo,
									price: price,
									remark: this.remark,
									shops: [],
									discountPrice: this.discountPrice,
									shopSeckillId: null,
									// pickupWay: this.pickupWay,
									pickupWay: this.flagindex==1?0:1,
									state: 0
								}
								if (this.shopGroupWorkId > 0) {
									data.shopGroupWorkId = this.shopGroupWorkId
								}
								if (this.skuItemDTOList != '') {
									if (this.skuItemDTOList[0].shopDiscountId > 0) {
										data.shopDiscountId = this.skuItemDTOList[0].shopDiscountId
									} else if (this.skuItemDTOList[0].shopSeckillId > 0) {
										data.shopSeckillId = this.skuItemDTOList[0].shopSeckillId
									}
								}
								let datashopslen = this.settlement.shops.length
								for (let n = 0; n < datashopslen; n++) {
									let shopsobj = {}
									shopsobj["shopId"] = this.settlement.shops[n].shopId
									shopsobj["distribution"] = {}
									shopsobj["skus"] = []
									if (this.settlement.shops[n].currentCoupon) {
										shopsobj["id"] = this.settlement.shops[n].currentCoupon.id
									}
									data.shops.push(shopsobj)
									data.shops[n].distribution.distributionPrice = this.settlement
										.shops[n]
										.distribution
										.distributionPrice
									let dataskuslen = this.settlement.shops[n].skus.length
									for (let m = 0; m < dataskuslen; m++) {
										let skusobj = {}
										skusobj["skuId"] = this.settlement.shops[n].skus[m].skuId
										skusobj["number"] = this.settlement.shops[n].skus[m].number
										skusobj["ifLogistics"] = this.settlement.shops[n].skus[m]
											.ifLogistics
										skusobj["selected"] = this.settlement.shops[n].skus[m].selected
										data.shops[n].skus.push(skusobj)
									}
								}
								// #ifdef H5
								data.paymentMode = 1
								data.subPaymentMode = 3
								// #endif

								// #ifdef MP-WEIXIN
								if (this.paymentMode == 1) {
									data.paymentMode = 1
									data.subPaymentMode = 1
								} else if (this.paymentMode == 4) {
									data.paymentMode = 4
									data.subPaymentMode = 1
								} else {
									data.paymentMode = 5
									data.subPaymentMode = 1
								}
								// #endif
								// #ifdef APP-PLUS
								if (this.paymentMode == 1) {
									data.paymentMode = 1
									data.subPaymentMode = 1
								} else if (this.paymentMode == 4) {
									data.paymentMode = 4
									data.subPaymentMode = 1
								} else {
									data.paymentMode = 5
									data.subPaymentMode = 1
								}
								// #endif
								// #ifdef MP-ALIPAY
								data.paymentMode = 2
								data.subPaymentMode = 1
								// #endif
								console.log(data, '请求参数222')

								//下面就是发请求,在这里修改 type
								if (this.isFrom == 0) {
									data.type = null
								}
								data.yuedeductPrice = this.yuedeductPrice
								NET.request(API.PlaceOrder, data, 'POST').then(res => {
									let submitResult = res.data
									let shopId = uni.getStorageSync("curshopid");

									submitResult.shopId = shopId

									console.log(submitResult, '测试')
									submitResult.type = 1
									submitResult.paymentMode = data.paymentMode
									// #ifdef H5
									let ua = navigator.userAgent.toLowerCase();
									//  5h支付
									NET.request(API.gotoH5Pay, submitResult, 'POST').then(
										res => {
											//console.dir(res)
											location.replace(res.data.mwebUrl)
											// window.location.replace(url)
										}).catch(err => {
										this.submitActive = true
										uni.hideLoading()
										uni.showToast({
											title: '账户余额不足',
											icon: 'none'
										})
									})
									// }
									// #endif
									// #ifdef MP-ALIPAY
									submitResult.huabeiPeriod = this.huabeiPeriod
									submitResult.paymentMode = this.paymentMode
									this.aliPay(submitResult)
									// #endif

									// #ifdef MP-WEIXIN
									if (this.paymentMode != 5 && this.paymentMode != 4) {

										NET.request(API.gotoPay, submitResult, 'POST').then(
											res => {
												console.dir(res)
												uni.requestPayment({
													privider: 'wxpay',
													timeStamp: res.data.timeStamp,
													nonceStr: res.data.nonceStr,
													package: res.data.package,
													signType: res.data.signType,
													paySign: res.data.paySign,
													success: function(payRes) {
														uni.showToast({
															icon: 'none',
															title: '支付成功',
															duration:2000
														})
														setTimeout(()=>{
															uni.redirectTo({
																url: 'index?type=0'
															})
														},2000)
														// uni.showToast({
														// 	icon: 'none',
														// 	title: '支付成功'
														// })
														// uni.redirectTo({
														// 	url: 'index?type=0'
														// })
													},
													fail: function(err) {

														uni.showToast({
															icon: 'none',
															title: '支付取消'
														})
													}
												})
											}).catch(err => {
											uni.hideLoading()
											uni.showToast({
												title: '账户余额不足',
												icon: 'none'
											})
										})

									} else {
										uni.hideLoading()
										// uni.showToast({
										// 	icon: 'none',
										// 	title: '支付成功'
										// })
										uni.redirectTo({
											url: 'index?type=0'
										})
									}

									// #endif
									// #ifdef APP-PLUS
									console.log(submitResult, 'app-submitResult')
									NET.request(API.gotoAppPay, submitResult, 'POST').then(
										res => {
											console.log(res, '余额支付,线下支付,进入了app的条件编译')

											let str = res.data.package
											var index = str.lastIndexOf("\=");
											str = str.substring(index + 1, str.length);
											var obj = {
												appid: res.data.appId,
												noncestr: res.data.nonceStr,
												package: 'Sign=WXPay',
												prepayid: str,
												timestamp: res.data.timeStamp,
												sign: 'MD5',
												partnerid: res.data.partnerId
											}
											console.log(res.data, '111')
											console.log(obj, '111')
											uni.requestPayment({
												provider: 'wxpay',
												orderInfo: obj,
												success: function(payRes) {
										
													uni.showToast({
														icon: 'none',
														title: '支付成功',
														duration:2000
													})
													setTimeout(()=>{
														uni.redirectTo({
															url: 'index?type=0'
														})
													},2000)
												
												},
												fail: function(err) {
													console.log(err)
													uni.showToast({
														icon: 'none',
														title: '支付取消'
													})
												}
											})
										}).catch(err => {
										uni.hideLoading()
										uni.showToast({
											title: '账户余额不足',
											icon: 'none'
										})
									})
									// #endif
								}).catch(res => {
									let str = res.message

									if (str == undefined || str == '') {
										str = '提交失败'
									}
									uni.hideLoading()
									uni.showToast({
										title: str,
										icon: 'none'
									})
								})
								// else if 结束,本来只用弹出已经取消支付,现在还需要调接口
							
							}

						}
					})
					//这里是除了微信支付都走这里  结束 end
				}

			},

			// H5支付微信内置浏览器支付
			// #ifdef H5
			payRequest(payInfo) {
				payInfo.paymentMode = 1
				NET.request(API.gotoPay, payInfo, 'POST').then(res => {
					jweixin.config({
						debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
						appId: res.data.appId, // 必填，公众号的唯一标识
						timestamp: res.data.timeStamp, // 必填，生成签名的时间戳
						nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
						signature: res.data.paySign, // 必填，签名，见附录1
						jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
					});
					jweixin.ready(function() {
						jweixin.checkJsApi({
							jsApiList: ['chooseWXPay'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
							success: function(res) {
							},
							fail: function(res) {
							}
						});
						jweixin.chooseWXPay({
							timestamp: res.data
								.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
							nonceStr: res.data.nonceStr, // 支付签名随机串，不长于 32 位
							package: res.data
								.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
							signType: res.data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
							paySign: res.data.paySign, // 支付签名
							success: function(res) {
								// 支付成功后的回调函数
								uni.showToast({
									icon: 'none',
									title: '支付成功'
								})
								uni.redirectTo({
									url: 'index?type=0'
								})
							},
							cancel: function(r) {
								uni.showToast({
									icon: 'none',
									title: '取消支付'
								})
							},
							fail: function(res) {
								uni.showToast({
									icon: 'none',
									title: '账户余额不足'
								})
							}
						});
					});
					jweixin.error(function(res) {
						console.log('error')
						console.log(res)
						uni.showToast({
							icon: 'none',
							title: '支付失败了',
							duration: 3000
						});
					});
				}).catch(err => {})
			},
			// #endif


			// 小程序支付
			aliPay(payInfo) {
				NET.request(API.gotoPay, payInfo, 'POST').then(res => {
					console.log('alipay gotoPay-----------')
					console.dir(res)
					uni.requestPayment({
						provider: 'alipay',
						orderInfo: res.data.tradeNo,
						success: function(payRes) {
							if (payRes.resultCode == '6001') {
								uni.showToast({
									icon: 'none',
									title: '取消支付'
								})
								uni.redirectTo({
									url: 'index?type=0'
								})
							}
							if (payRes.resultCode == '9000') {
								uni.showToast({
									icon: 'none',
									title: '支付成功',
									duration:2000
								})
								setTimeout(()=>{
									uni.redirectTo({
										url: 'index?type=0'
									})
								},2000)
							}
						},
						fail: function(err) {
							uni.showToast({
								icon: 'none',
								title: '支付取消'
							})
						}
					});
				}).catch(err => {
					uni.hideLoading()
					uni.showToast({
						title: '账户余额不足',
						icon: 'none'
					})
				})
			},

			decidePayType() {
				// #ifdef H5 || MP-WEIXIN || APP-PLUS
				this.showWechatPayType = true
				this.paymentMode = 1
				// #endif

				// #ifdef MP-ALIPAY
				this.showAlipayPayType = true
				this.showHuabeiPayType = true
				this.paymentMode = 2
				// #endif
			}
		},
		filters: {
			clip2Decimal(value) {
				if (value === undefined || value === null) {
					return "0.00"
				}
				return (parseInt(value * 100) / 100).toFixed(2)
			}
		}
	}
</script>

<style lang="scss">
	.yuedikou {
		padding-bottom: 20rpx;

		.dikou {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			padding-top: 20rpx;
		}
	}

	page {
		background-color: #F7F7F7;
	}

	.myorder-submission {
		width: 700rpx;
		margin: 0 auto;
		background-color: #F7F7F7;
		padding-bottom: 20rpx;
	}

	.order-submission {
		width: 700rpx;
		margin: 0 auto;
		//padding-bottom: 150rpx;
		padding-bottom: 20rpx;

		.allAddress {
			margin-top: 0.2 * 100rpx;
			height: 55rpx;
			line-height: 55rpx;

			.nav {
				text-align: center;
				margin: 0;
				box-sizing: border-box;
				border-radius: 35rpx;
				display: inline-block;
				position: relative;

				&::after {
					content: "";
					position: absolute;
					left: 0;
					right: 0;
					top: 0;
					bottom: 0;
					background-color: #018A45;
					z-index: 0;
					border-radius: 35rpx;
				}

				.item {
					display: inline-block;
					padding: 0 20rpx;
					border-radius: 35rpx;
					position: relative;
					z-index: 5;
					line-height: 55rpx;
					background-color: tran;
				}

				.item.on {
					background-color: #fff;
					color: #018A45;
					font-weight: bold;
				}

				.item.on2 {
					background-color: #018A45;
					color: #ddd;
				}

			}

			.line {
				width: 7.1 * 100rpx;
				margin: 0 auto;
			}
		}
	}

	.bg {
		background-color: #00AA49;
		height: 240rpx;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		z-index: -1;
	}

	.info {
		padding: 20rpx 0;
		color: #fff;
		margin-bottom: 20rpx;
	}

	.addAddress {
		background-color: #fff;
		border-radius: 10rpx;
		padding: 20rpx;
		width: 100%;
        display: flex;
		align-items: center;
		.moren,
		.address,
		.name,
		.tel {
			display: inline-block;
		}
		
		.addressLeft {
			width: 620rpx;
            .addAddress{
				padding-left: 0rpx;
			}
			.box1{
				margin-left: 10rpx;
				margin-top: 10rpx;
				padding: 0;
			}
			.addressLeft-icon{
				float: right;
				margin-top: -30px;
			}
			.moren {
				color: #FFF;
				font-size: 22rpx;
				width: 80rpx;
				height: 40rpx;
				line-height: 40rpx;
				text-align: center;
				border-radius: 10rpx;
				background-color: #00AA49;
			}

			.addressTop {
				margin-top: 10rpx;
				align-items: center;



				.address {
					font-size: 26rpx;
					height: 40rpx;
					line-height: 40rpx;
					font-weight: bold;
					margin-left: 10rpx;

					width: 100%;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
				
				.name{
					margin-left: 10rpx;
				}
			}

			.addressBottom {
				position: relative;
				z-index: 999;
				margin-top: 20rpx;
                display: flex;
				.pstype{
					display: flex;
					width: 250rpx;
					justify-content: space-between;
					margin-left: 20rpx;
					view{
						text{
							line-height: 48rpx;
							margin-right: 10rpx;
						}
					}
				}
				.address{
					font-size: 26rpx;
					font-weight: bold;
					margin-left: 10rpx;
					line-height: 48rpx;
				}
				.name,
				.tel {
					color: #999;
					font-size: 26rpx;
				}

				.tel {
					margin-left: 10rpx;
				}
			}

		}

		.addressRight {
			width: 25rpx;
			margin: auto 0 auto auto;
		}
	}
	
	.marF{
		margin-top: -80rpx;
	}

	.slist {
		background-color: #fff;
		border-radius: 10rpx;
		margin-top: 20rpx;
		padding: 10rpx 20rpx;
	}

	.shopping {
		border-bottom: 1rpx solid #eee;

		&:last-child {
			border: none;
		}

		.image {
			flex: 1;
			width: 120rpx;
			height: 120rpx;
			margin: 20rpx 20rpx 20rpx 0;

			image {
				width: 100%;
				height: 100%;
				border-radius: 10rpx;
			}
		}

		.info {
			flex: 4;
			flex-direction: column;
			display: flex;
			justify-content: space-around;

			.shopName {
				color: #333;
			}

			.price_div {
				display: flex;
			}

			.price {
				color: red;
			}
		}

		.num {
			display: inline-block;
			margin-left: 25rpx;
			color: #333;
			font-size: 25rpx;
		}

		.num_money {
			margin-left: auto;
			color: #999;
		}
	}

	.jifen {
		background-color: #fff;
		border-radius: 10rpx;
		margin-top: 20rpx;
		padding: 0 20rpx;

		.pointsDeduction {
			padding: 20rpx 0;
			border-bottom: 1rpx solid #eee;

			.desc {
				font-size: 20rpx;
				flex: 1;
				text-align: center;
			}
		}
	}

	.pointsDeduction {
		display: flex;
		justify-content: space-between;

		.right {
			margin-left: auto;

			.text {
				color: #999;
			}
		}
	}


	// 结束
	.content {
		padding: 0 30upx 198upx;
		box-sizing: border-box;
	}

	.address-box {
		margin-top: 20upx;
		background: #fff;
		border-radius: 10upx;
		width: 100%;
		padding: 30upx;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.address-box .address-img {
		width: 70upx;
		height: 70upx;
		margin-right: 20upx;
	}

	.address-box .address-r {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		font-size: 28upx;
		color: #333;
	}

	.arrow-right-img {
		width: 24upx;
		height: 24upx;
		margin-left: 20upx;
	}

	.address-name-box {
		font-size: 30upx;
		color: #333;
	}

	.phone {
		font-size: 24upx;
		color: #999;
		margin-left: 20upx;
	}

	.address-info {
		font-size: 28upx;
		color: #333;
		margin-top: 15upx;
	}

	.order-list-box {
		margin-top: 20upx;
	}

	.order-list-box .item {
		margin-bottom: 20upx;
		background: #fff;
		border-radius: 10upx;
	}

	.order-list-top {
		height: 96upx;
		padding: 0 30upx;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #eee;
	}

	.top-l {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.shop-img {
		width: 34upx;
		height: 34upx;
		margin-right: 10upx;
	}

	.shop-name {
		font-size: 30upx;
		color: #333;
		font-weight: bold;
	}

	.arrow-img {
		margin-left: 15upx;
		width: 24upx;
		height: 24upx;
	}

	.order-info-box {
		padding: 0 30upx;
		box-sizing: border-box;
	}

	.order-info {
		border-bottom: 1px solid #eee;
	}

	.order-info-item {
		display: flex;
		flex-direction: row;
		padding: 20upx 0;
	}

	.product-img {
		width: 180upx;
		height: 180upx;
		border-radius: 10upx;
		margin-right: 30upx;
	}

	.info-box {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

	}

	.product-name {
		font-size: 26upx;
		color: #333;
		height: 68upx;
		line-height: 34upx;
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: break-all;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.price-sku-box {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.product-sku {
		font-size: 24upx;
		font-weight: 500;
		color: #999;
		margin-left: -20upx;
		width: 100%;
		display: flex;
		flex-direction: row;
	}

	.product-price {
		font-size: 28upx;
		color: #333;
		font-weight: 400;
	}

	.product-price .fuhao {
		font-size: 28upx;
	}

	.product-num {
		font-size: 28upx;
		color: #999;
		font-weight: 400;
	}

	.delivery-way-box {
		display: flex;
		flex-direction: column;
	}

	.delivery-way-box .item {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		font-size: 26upx;
		color: #333;
	}

	.delivery-way-box .item .way {
		color: #999;
		margin-left: 30upx;
	}

	.order-total-box {
		padding: 20upx 0;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
	}

	.total-num {
		font-size: 26upx;
		color: #333;
	}

	.total-price {
		font-size: 26upx;
		color: #ff7911;
	}

	.ml10 {
		margin-left: 10upx;
	}

	.order-flow-box {
		display: flex;
		flex-direction: column;
	}

	.flow-word {
		font-size: 24upx;
		color: #999;
		display: flex;
		flex-direction: column;
	}

	.mt25 {
		margin-top: 20upx;
	}

	.mt50 {
		margin-top: 30upx;
		margin-bottom: 20upx;
	}

	.order-confirm-box {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background: #fff;
		padding: 30upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		z-index: 999;
	}

	.num-box {
		font-size: 30upx;
		color: #999;
	}

	.num-box .total {
		color: #333;
	}

	.num-box .price {
		color: #ff7911;
		font-weight: bold;
	}

	.order-confirm-box .btn {
		width: 216upx;
		height: 80upx;
		line-height: 80upx;
		background: #eee;
		border-radius: 40upx;
		font-size: 28upx;
		color: #999;
		text-align: center;
	}

	.order-confirm-box .btn.active {
		background: linear-gradient(90deg, rgba(0, 222, 89, 1.0), rgba(0, 170, 73, 1));
		color: #fff;
	}

	.discount-item1 {
		width: 100%;
		height: 98upx;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		background: white;

		.discount-img {
			width: 24upx;
			height: 24upx;
			margin-left: 20upx;
		}

		.discount-img-shop {
			width: 120rpx;
			height: 120rpx;
			margin-left: 20upx;
		}
	}

	.discount-item1-my {
		width: 100%;
		height: 98upx;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		background: white;

		.discount-label-my {
			flex: 1;
		}

		.discount-img-shop-my {
			width: 120rpx;
			height: 120rpx;
			margin-left: 20upx;
		}
	}

	.discount-item {
		width: 100%;
		height: 98upx;
		box-sizing: border-box;
		margin: 30upx 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 0 30upx;
		background: white;
	}

	.pay-type-item {
		.pay-type-radio {
			background-color: white;
			border-bottom: 1upx solid #EDEDED;
			margin-bottom: 20upx;
			padding: 24upx 20upx 24upx 20upx;

			.pay-type-img {
				display: inline-block;

				.pay-type-img-inner {
					width: 50upx;
					height: 50upx;
					vertical-align: middle;
				}
			}

			.pay-type-label {
				vertical-align: middle;
				margin-left: 30upx;
			}

			.pay-type-radio-item {
				float: right;
				margin-right: 20upx;
				width: 50upx;
				height: 50upx;
			}

			.huabei-detail {
				margin-top: 20upx;

				.fenqi-wenzi {
					display: inline-block;
					margin-left: 64upx;
				}

				.fenqi-amount {
					display: block;
					margin-left: 64upx;
					margin-top: 14upx;
					color: #BABBBC;
				}

				.fenqi-charge-fee {
					float: right;
					margin-right: 68upx;
					color: #BABBBC;
				}

				.fenqi-modal {
					width: 40upx;
					height: 40upx;
					margin-left: 20upx;
					float: right;
					position: relative;
					top: -80upx;
				}
			}
		}
	}

	.period-radio {
		margin: 30upx;
		width: 95%;
		border-bottom: 1px solid #EFEFEF;

		.period-amount {
			display: inline-block;

			.period-each-charge {
				display: inline-block;
				margin-top: 12upx;
				margin-left: 6upx;
				font-size: 26upx;
				color: #b7b7b7;
				margin-bottom: 13upx;
			}
		}

		.period-each {
			display: block;
		}

		.period-type-radio-item {
			float: right;
		}
	}

	.huabei-confirm {
		height: 120upx;
		padding: 0upx 108upx 0upx 32upx;

		.fenqi-all {
			display: inline-block;
			width: 100%;
		}

		.fenqi-total-amount {
			float: left;
		}

		.fenqi-confirm {
			float: right;
			width: 160upx;
			padding: 0upx 20upx;

			.btn {
				width: 216upx;
				height: 80upx;
				line-height: 80upx;
				border-radius: 40upx;
				font-size: 28upx;
				text-align: center;
				background: linear-gradient(90deg, rgba(255, 162, 0, 1), rgba(255, 121, 17, 1));
				color: #fff;
				display: inline-block;
				margin-right: 66upx;
			}
		}
	}

	.discount-info-box {
		display: flex;
		flex-direction: row;
	}

	.discount-label,
	.discount-info1 {
		font-size: 26upx;
		color: #333;
	}

	.discount-info2 {
		color: rgba(255, 162, 0, 1);
	}

	.discount-img {
		width: 40upx;
		height: 40upx;
		margin-left: 20upx;
	}

	.discount-img-shop {
		width: 120rpx;
		height: 120rpx;
		margin-left: 20upx;
	}

	.activity-con {
		.activity-box {
			display: flex;
			flex-direction: column;
			width: 100%;
			height: 1000upx;
		}

	}
.d-flex{
		display: flex;
		align-items: center;
		font-weight: normal;
		text:first-child{
			display: inline-block;
			width:340rpx;
		    overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
	.cred{
		display: flex;
		color: #f43;
		position: relative;
		.zsyuan{
			position: absolute;
			top: -7rpx;
			right: -28rpx;
			font-size: 18rpx;
			width: 30rpx;
			height: 30rpx;
			background-color: #f43;
			color: #fff;
			border: 1rpx solid #ccc;
			border-radius: 50%;
			text-align: center;
		}
	}
	.activity-box .title-box {
		width: 100%;
		height: 100upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		position: relative;
		border-bottom: solid 1px #EEEEEE;
	}

	.activity-coupon-box {
		display: flex;
		flex-direction: column;
		width: 100%;
		overflow: auto;
		flex: 1;
	}

	.title-box .close-btn {
		width: 100upx;
		height: 100upx;
		box-sizing: border-box;
		padding: 30upx;
		position: absolute;
		top: 0;
		right: 0;
	}

	.content-box {
		width: 100%;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		padding: 30upx;
	}

	.tag-box {
		width: 100%;
		box-sizing: border-box;
		height: 80upx;
		line-height: 80upx;
		font-size: 28upx;
		font-weight: 500;
		color: #FF7911;
	}

	.label-lingqu {
		width: 100%;
		font-size: 28upx;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
	}

	.coupon-item1 {
		width: 690upx;
		height: 120upx;
		// background: rgba(255, 233, 216, 1);
		background: url(../../static/images/couponItem1.png) no-repeat;
		background-size: 690upx 120upx;
		border-radius: 10upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 20upx;
		color: #FFFFFF;
		flex-shrink: 0
	}

	.coupon-item2 {
		width: 690upx;
		height: 120upx;
		// background: rgba(255, 233, 216, 1);
		background: url(../../static/images/couponItem2.png) no-repeat;
		background-size: 690upx 120upx;
		border-radius: 10upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 20upx;
		color: rgba(255, 121, 17, 1);
		flex-shrink: 0
	}

	.un-coupon-item {
		color: #bbb;
	}

	.money-box {
		width: 180upx;
		box-sizing: border-box;
		padding-left: 30upx;
		font-size: 40upx;
		font-weight: 500;

	}

	.info-box {
		width: 300upx;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		font-size: 24upx;
		font-weight: bold;
	}


	.receive-success {
		width: 100%;
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		z-index: 9999;
	}

	.success-box {
		width: 380upx;
		height: 280upx;
		background: rgba(0, 0, 0, 0.5);
		border-radius: 10upx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.success-box .success-img {
		width: 200upx;
		height: 130upx;
	}

	.success-box .text {
		font-size: 28upx;
		margin-top: 50upx;
		font-weight: 400;
		color: rgba(255, 255, 255, 1);
	}

	.check-img {
		width: 40upx;
		height: 40upx;
		margin-right: 30upx;
	}

	.mt30 {
		margin-top: 30upx;
	}

	.activity-con {
		.activity-box {
			display: flex;
			flex-direction: column;
			width: 100%;
			height: 1000upx;
		}

	}

	.activity-box .title-box {
		width: 100%;
		height: 100upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		position: relative;
		border-bottom: solid 1px #EEEEEE;
	}

	.activity-coupon-box {
		display: flex;
		flex-direction: column;
		width: 100%;
		overflow: auto;
		flex: 1;
	}

	.title-box .close-btn {
		width: 100upx;
		height: 100upx;
		box-sizing: border-box;
		padding: 30upx;
		position: absolute;
		top: 0;
		right: 0;
	}

	.content-box {
		width: 100%;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		padding: 30upx;
	}

	.tag-box {
		width: 100%;
		box-sizing: border-box;
		height: 80upx;
		line-height: 80upx;
		font-size: 28upx;
		font-weight: 500;
		color: #FF7911;
	}

	.label-lingqu {
		width: 100%;
		font-size: 28upx;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
	}

	.coupon-item {
		width: 690upx;
		height: 180upx;
		background: rgba(0, 170, 73, 0.5);
		border-radius: 10upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 20upx;
		color: #FFFFFF;
		flex-shrink: 0
	}

	.un-coupon-item {
		color: #bbb;
	}

	.money-box {
		width: 180upx;
		box-sizing: border-box;
		padding-left: 30upx;
		font-size: 40upx;
		font-weight: 500;

	}

	.info-box {
		width: 300upx;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		font-size: 24upx;
		font-weight: bold;
	}
	
	.zbfh{
		background-color: white;
		width: 697rpx;
		height: 100upx;
		padding: 24rpx 20rpx 24rpx 20rpx;
		margin: 0 auto;
		.pay-type-img,.pay-type-label{
			float: left;
		}
		.pay-type-img{
			.discount-img{
				margin-left: 7rpx !important;
			}
		}
		.pay-type-label{
			margin-left: 40rpx;
		}
		.pay-type-radio-item{
			float: right;
			margin-right: 16upx;
		}

	}
	
</style>
