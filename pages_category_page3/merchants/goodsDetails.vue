<template>
	<view class="container" v-show="isShowShangXiang">
		<!-- 商品详情 -->
		<!-- 轮播图加按钮部分 -->
		<view>
			<!-- 轮播图 -->
			<swiper v-if="isImage" class="goodsImgswiper-box" :indicator-dots="true" indicator-active-color='#fff'
				@change='videoChange'>
				<swiper-item v-if="shiping">
					<video :src="myshiping" controls class="goodsImg"></video>
				</swiper-item>
				<swiper-item v-for="(imgItem, index) in detailList.images" :key="index">
					<image class="goodsImg" :src='imgItem'></image>
				</swiper-item>
			</swiper>
			<!-- 视频 -->
			<video v-else style="width: 100%" :src="videoSrc"></video>
		</view>

		<view class="goodgDes-box flex-start flex-column">
			<!-- 价格 -->
			<view v-if="detailList.activityType == 0" class="priceBuyNum-box flex-display flex-sp-between mar-left-30">
				<view>
					<label class="fs26 font-color-FF7800">¥</label>
					<label class="fs38 fs-bold font-color-FF7800 mar-left-10">{{skuPrice}}</label>
					<label class="fs24 font-color-999 discountsPriceLine mar-left-20">¥{{skuOriginalPrice}}</label>
				</view>
				<label class="fs24 font-color-999">销量:{{detailList.number}}</label>

			</view>
			<!-- 抢购页面 -->
			<view v-else class="seckill-box  leftText-warp">
				<view class="flex-display flex-sp-between flex-row font-color-FFF ">
					<!-- 根据不同的值判断什么活动 -->
					<view class="flex-column-plus">
						<!-- 秒杀活动 -->
						<text v-if="detailList.activityType == 2" class="leftText">秒杀活动</text>
						<!-- 限时折扣活动 -->
						<text v-if="detailList.activityType == 3" class="leftText">限时折扣</text>
						<!-- 拼团活动 -->
						<image v-if="detailList.activityType == 1" class="spell-icon"
							src="../../static/images/spellicon.png" mode=""></image>
						<!-- 价格 -->
						<view class="flex-row-plus flex-items-plus mar-left-30 seckill-box-price">
							<label class="28">¥</label>
							<label class="fs42 mar-left-5">{{skuPrice}}</label>
							<label class="fs28 mar-left-10 discountsPriceLine">¥ {{detailList.originalPrice}}</label>
						</view>
					</view>
					<!-- 只要有活动就有倒计时 -->
					<view
						v-if="detailList.activityType == 3 || detailList.activityType == 2 || detailList.activityType == 1"
						class="countdown flex-column-plus">

						<!-- 活动结束倒计时 -->
						<view v-if="timeActivetype" class="flex-column-plus mar-right-20">
							<label class="fs28">距结束还剩：</label>
							<view class="flex-row-plus fs34 flex-items-plus">
								<view class="countdown-box flex-items-plus">{{hou}}</view>:
								<view class="countdown-box flex-items-plus">{{min}}</view>:
								<view class="countdown-box flex-items-plus">{{sec}}</view>
							</view>
						</view>
						<!-- 活动开始倒计时 -->
						<view v-else>
							<!-- 秒杀开始倒计时 -->
							<label v-if="detailList.activityType==2" class="fs28">距开始还有：</label>
							<view v-if="detailList.activityType==2" class="flex-row-plus fs34 flex-items-plus">
								<view class="countdown-box flex-items-plus">{{hou}}</view>:
								<view class="countdown-box flex-items-plus">{{min}}</view>:
								<view class="countdown-box flex-items-plus">{{sec}}</view>
							</view>
							<!--其他-->
							<label v-if="detailList.activityType!=2" class="fs28 mar-right-20">即将开始：{{detailList.startTime}}</label>
						</view>
					</view>
				</view>
			</view>

			<!-- 商品名字 -->
			<view class="goodsName-box overflowNoDot mar-top-30 mar-left-30 mar-bottom-30">
				<label class="goodsName mar-left-20 fs40">{{detailList.productName}}</label>
				<view class="zuhe" v-if="false">
					<view class="d-flex">
						<text>10包精装修外墙腻子粉送1包德高II型瓷砖胶</text>
						<text class="mar-left-20 cred">x2</text>
					</view>
					
					<view class="d-flex">
						<text>30包精装生态（红）腻子粉送1桶德高K11防水砂浆（滚涂）</text>
						<view class="mar-left-20 cred">
							
							<view class="num">
								x2
							</view>
							<view class="zsyuan">
								赠
							</view>
						</view>
						
					</view>
				</view>
			</view>
			<view class="borRig-line-20"></view>
			
			<!-- 福利部分 -->
			<view v-if="detailList.activityType != 2 && detailList.activityType != 3 && detailList.activityType != 1">
				<view v-if="markTools.length>0 || shopMarkTools.length>0" class="activity-box mar-top-10 pad-bot-10"
					@click="couponShowClick" style="border: none;">
					<label class="fs30 font-color-999" style="color: #f43;">优惠</label>
					<view class="activity-content mar-left-30 flex-items flex-sp-between flex-row">
						<view class="fs28 overflow" style="width: 500rpx;">
							<text style="margin-right: 4rpx;" v-for="(item,index) in formatshowyhj(detailList.couponSplicing)">
								<text style="color: #f43;">{{item}}</text><text>；</text>
							</text>
						</view>
						<view class="flex-items">
							<label class="fs24 font-color-00AA49">领券</label>
							<image class="coupon-arrow" src="../../static/img/user/arrow.png"></image>
						</view>
					</view>
				</view>
				<!-- 无福利 -->
				<view v-else class="activity-box pad-bot-10 mar-top-10">
					<label class="fs30 font-color-999">优惠</label>
					<view class="activity-content mar-left-30 flex-items flex-sp-between flex-row">
						<view class="fs28">
							无
						</view>
					</view>
				</view>
			</view>
			
		</view>
		<view class="borRig-line-20"></view>

		<!-- 拼单 -->
		<view v-if="detailList.activityType == 1" class="borRig-line-20"></view>
		<view v-if="detailList.activityType == 1" class="goodsDiscount">
			<view class="questionTit mar-left-30 flex-items flex-row flex-sp-between">
				<label class="">这些人正在拼单</label>
				<view class="allMoreBox">
					<view v-if="threecollageOrders.length>0" class="allMore" @click="openAllBuy">查看全部</view>
					<view v-else class="allMore" @click="openAllBuyTwo">查看全部</view>
					<image class="evaluateAllArrow-icon mar-left-10" src="../../static/img/user/arrow.png"></image>
				</view>
			</view>
			<view class="groupBuy" v-for="(Gitem,index) in threecollageOrders" :key="index">
				<view class="groupBuyList">
					<view class="groupBuyItem">
						<view class="leftAvatar">
							<img :src="Gitem.headImage" alt="">
							<span>{{Gitem.name}}</span>
						</view>
						<view class="rightInfo">
							<view class="groupBuyTime" style="width: 70%;">
								<view class="needPeople flex-row-plus">还差<b>{{Gitem.person}}人</b>拼成</view>
								<view class="endDate">剩余{{timeChange(Gitem.time)}}</view>
							</view>
							<view style="width: 30%;" class="groupBuyBtn" @click="getGroupShow(Gitem.collageId)">和Ta拼
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 关联产品 -->
		<view
			v-if="detailList.relationProduct && detailList.relationProduct.length && detailList.relationProduct.length > 0">
			<view>
				<view style="font-size: 34rpx; font-weight: 700;margin:0rpx 0rpx 20rpx 20rpx;">关联促销</view>
				<scroll-view class="scroll-view_H" scroll-x="true">
					<view class="scroll-view-item_H" v-for="(glitem,index) in detailList.relationProduct" :key='index'
						@click="goodsItemTap(glitem)">
						<u-image width="200rpx" height="200rpx" :src="glitem.image" style="display: inline-block;">
						</u-image>
						<view style="display: inline-block;">
							<view class="myconten">
								<text class="myGoodsName">{{glitem.productName}}</text>
								<text style="position: absolute; top: 80rpx;left: 20rpx;">¥ <text>
										{{glitem.price}}</text></text>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<!-- 关联产品结束 -->

		<!-- 相关秒杀 -->
		<view v-if="zhanshimiaosha.length !== 0" style="margin: 30rpx 0rpx;">
			<view>
				<view style="font-size: 34rpx; font-weight: 700; margin:0rpx 0rpx 20rpx 20rpx;">相关秒杀</view>
				<scroll-view class="scroll-view_H" scroll-x="true">
					<view class="scroll-view-item_H" v-for="(glitem,index) in zhanshimiaosha" :key='index'
						@click="goodsItemTapMiao(glitem)">
						<u-image width="200rpx" height="200rpx" :src="glitem.image" style="display: inline-block;">
						</u-image>
						<view style="display: inline-block;">
							<view class="myconten">
								<text style="position: absolute; top: 20rpx;left: 20rpx;">{{glitem.productName}}</text>
								<text style="position: absolute; top: 80rpx;left: 20rpx;">¥ <text>
										{{glitem.price}}</text></text>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<!-- 秒杀产品结束 -->

		<!-- 规格选择 -->
		<view class="goosDetailshow-box">
			<view class="myjifen">
				<view style="margin-right: 50rpx;" v-show="integral && integral != ''&& integral >0">赠送积分 :
					{{integral * buyNum}}
				</view>
				<view v-show="wuliuIntegral && wuliuIntegral != ''&& wuliuIntegral >0">赠送物流积分 :
					{{wuliuIntegral * buyNum}}
				</view>
			</view>
			<view class="color-box flex-column-plus">
				<!-- 循环规格名 -->
				<view v-for="(attritem,index) in filterProdAttrs(skuProdList.names)" :key="index">
					<!-- 是会员等级这四个字就不展示 -->
					<view v-show="attritem.skuName != '会员等级'">
						<label class="fs24 font-color-999">{{attritem.skuName}}</label>
						<view class="colorName-box">
							<!-- 循环规格值,每个规格值都有一个事件 -->
							<view class="pad-bot-30" v-for="(attrRes, resIndex) in attritem.values" :key="resIndex">
								<view class="colorName" :class="{'colorName-on' :subIndex[index] == resIndex}"
									@click="colorActiveClick(attrRes,index,resIndex,0)">{{attrRes.skuValue}}</view>
							</view>
						</view>
					</view>
				</view>

			</view>
			<view class="goodsNum-box flex-row-plus flex-sp-between" :class="{'bottom-line' :supportHuabei}"
				style="padding: 30upx;">
				<label class="font-color-999 fs24">数量</label>
				<view class="goodsNum">
					<text class="subtract" @click="numSub()">-</text>
					<u-input v-model.number="buyNum" style="display: inline-block; width: 100rpx;" input-align='center'
						type='number' :clearable='false' placeholder='数量' @input='jianting'></u-input>
					<text class="add" @click.stop="numAdd()">+</text>
					<u-modal v-model="show" content="输入的数量不规范" @confirm='myconfirm'></u-modal>
				</view>
			</view>
		</view>

		<view class="borRig-line-20"></view>
		<!-- 宝贝评价 -->
		<view class="evaluate-box flex-start flex-column">
			<view class="evaluate mar-left-30 flex-items flex-row flex-sp-between">
				<label class="fs-bold fs30">宝贝评价 ({{commentListLength}})</label>
				<view v-if="commentListLength>0" @click="commentAll">
					<label class="font-color-999 fs24">查看全部</label>
					<image class="evaluateAllArrow-icon mar-left-10" src="../../static/img/user/arrow.png"></image>
				</view>
			</view>
			<view class="evaluateTag-box" v-if="commentListLength>0">
				<view class="evaluateTag-text">
					全部({{commentListLength}})
				</view>
			</view>
			<view class="evaluate-contentbox mar-top-30" v-for="(commentItem, index) in commentList" :key="index">
				<view class="evaluate-content flex-items flex-row flex-sp-between">
					<view class="flex-items">
						<image class="user-headSmallImg" :src="commentItem.headImage"></image>
						<label class="fs28 mar-left-20">{{commentItem.name}}</label>
					</view>
					<label class="font-color-999 fs22">{{commentItem.createTime}}</label>
				</view>
				<view class="evaluateDes-box">
					<label class="evaluateDes">{{commentItem.comment}}</label>
				</view>
				<view class="item-image-box" v-if="commentItem.image">
					<view v-for="(ItemImg, cindex) in commentImgData(commentItem.image)" :key="cindex">
						<image @click='previewImg(index,cindex)' class="img-item" :src="ItemImg"></image>
					</view>
				</view>
				<view class="item-line"></view>
				<view class="item-like-box">
					<view class="addEvaluate">
						<view>追加评价：{{commentItem.addComment||''}}</view>
						<view class="item-image-box" v-if="commentItem.addImages">
							<view v-for="(itemAddImg, imgIndex) in commentItem.addImages" :key="imgIndex">
								<image @click='previewAddImg(index,imgIndex)' class="img-item" :src="itemAddImg">
								</image>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 宝贝评价end-->

		<!-- 宝贝详情 -->
		<view class="goodsDetails-box">
			<view class="goodsDetails-title">
				<view class="goodsDetails-Line"></view>
				<label class="goodsDetails-text">宝贝详情</label>
				<view class="goodsDetails-Line"></view>
			</view>
			<view class="goodsDetailsimg-box">
				<view class="">
					<rich-text :nodes="sellDescList"></rich-text>
				</view>
			</view>
		</view>

		<!-- 底部按钮 -->
		<view class="buygoods-box">
			<view class="buygoodsBut-box flex-row-plus" :style="{'height':(isIphone==true? 160:130)+'rpx'}">
				<view class="flex-column-plus fu-box" @click="OnlineCustomer">
					<u-icon name="chat" size="48" color="#7B7B7B"></u-icon>
					<label class="fs22">聊天</label>
					<view class="tiao" v-if="weidu != 0">
						{{weidu}}
					</view>
				</view>
				<view class="flex-column-plus mar-left-30 flex-items" @click="goshopCart">
					<image class="store-icon" src="../../static/images/gouwuche.png"></image>
					<label class="fs22">购物车</label>
				</view>
				<view class="flex-column-plus mar-left-30" @click="collectProduct">
					<image v-if="detailList.ifCollect == 1" class="store-icon"
						src="../../static/images/shoucangActive.png"></image>
					<image v-else class="store-icon" src="../../static/images/shoucang2x.png"></image>
					<label class="fs22">收藏</label>
				</view>

				<view class="flex-row-plus offShelf" v-if="detailList.shelveState == 0">
					商品已下架
				</view>
				<view class="flex-row-plus" v-else-if="detailList.activityType == 1">
					<view class="joinShopCartBut" @click="goosDetailshowClick(2, '0')">单独购买</view>
					<view class="buyNowBut" @click="goosDetailshowClick(2, 'groupBuy')">我要开团</view>
				</view>
				<view class="flex-row-plus" v-else>
					<template v-if="detailList.activityType !== 2">
						<button class="joinShopCartBut" @click="goosDetailshowClick(1,null,1)">加入购物车</button>
						<view class="buyNowBut" @click="goosDetailshowClick(2)">立即购买</view>
					</template>
					<!-- 如果是秒杀就不能加入购物车,当时按钮组的渲染只有两种状态,团购跟普通,现在多加了一组按钮组,秒杀  -->
					<template v-else>
						<view class="buyNowBut" @click="goosDetailshowClick(2)"
							style="width: 428upx;border-radius: 40rpx;margin-left: 20rpx;">立即购买</view>
					</template>
				</view>
			</view>
		</view>

		<!-- 回到顶部 -->
		<view class="returnTopService-box">
			<view class="returnTop-box flex-items-plus flex-column" @click="top"
				:style="{'display':(returnTopFalg===true? 'flex':'none')}">
				<image class="returnTopImg" src="../../static/images/returnTopImg.png"></image>
				<label class="fs16">顶部</label>
			</view>
		</view>

		<!-- 商品详情 -->
		<u-popup v-model="goosDetailshowFlag" mode="bottom" border-radius="14">
			<view class="goosDetailshow-box">
				<view class="detailImg-box flex-row-plus">
					<image class="detailImg" :src="skuImg"></image>
					<view class="flex-column-plus mar-left-40">
						<view class="font-color-FF7800">
							<label class="fs24">¥</label>
							<!-- 价格 -->
							<label class="fs36 mar-left-10"
								v-text="detailList.activityType == 1 && btnType == 1 ? skuOriginalPrice : skuPrice"></label>
						</view>
						<label class="fs24 font-color-999 mar-top-20" v-if="integral > 0">赠送积分 {{integral * buyNum}}
						</label>
						<label class="fs24 font-color-999 mar-top-20" v-if="wuliuIntegral > 0">赠送物流积分
							{{wuliuIntegral * buyNum}}
						</label>
						<label class="fs24 mar-top-20">已选</label>
					</view>
				</view>
				<view class="color-box flex-column-plus">
					<!-- 循环规格名 -->
					<view v-for="(attritem,index) in filterProdAttrs(skuProdList.names)" :key="index">
						<!-- 是会员等级这四个字就不展示 -->
						<view v-show="attritem.skuName != '会员等级'">

							<label class="fs24 font-color-999">{{attritem.skuName}}</label>
							<view class="colorName-box">
								<!-- 循环规格值,每个规格值都有一个事件 -->
								<view class="pad-bot-30" v-for="(attrRes, resIndex) in attritem.values" :key="resIndex">
									<!-- 下面的判断是 class 为 colorName view 中的 -->
									<view class="colorName" :class="{'colorName-on' :subIndex[index] == resIndex}"
										@click="colorActiveClick(attrRes,index,resIndex,0)">{{attrRes.skuValue}}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="goodsNum-box flex-row-plus flex-sp-between" :class="{'bottom-line' :supportHuabei}">
					<label class="font-color-999 fs24">数量</label>
					<view class="goodsNum">
						<text class="subtract" @click="numSub()">-</text>
						<u-input v-model.number="buyNum" style="display: inline-block; width: 100rpx;" type='number'
							input-align='center' :clearable='false' placeholder='数量' @input='jianting'></u-input>
						<text class="add" @click.stop="numAdd()">+</text>
						<u-modal v-model="show" content="输入的数量不规范" @confirm='myconfirm'></u-modal>
					</view>
				</view>
				<view class="huabei-box flex-column-plus" v-if="supportHuabei">
					<label class="font-color-999 fs24">花呗分期</label>
					<scroll-view class="fenqi-box" scroll-x="true">
						<view class="huabei-item"
							:class="[{'fenqi-on' :fenqiIndex == 0},{'disabled' :disableFenqiList[0]}]"
							@click="selectFenqi(0)">
							<label class="huabei-period">分3期(含手续费)</label>
							<label class="huabei-money">￥{{fenqiMoneyList[0]}}/期</label>
						</view>
						<view class="huabei-item"
							:class="[{'fenqi-on' :fenqiIndex == 1},{'disabled' :disableFenqiList[1]}]"
							@click="selectFenqi(1)">
							<label class="huabei-period">分6期(含手续费)</label>
							<label class="huabei-money">￥{{fenqiMoneyList[1]}}/期</label>
						</view>
						<view class="huabei-item"
							:class="[{'fenqi-on' :fenqiIndex == 2},{'disabled' :disableFenqiList[2]}]"
							@click="selectFenqi(2)">
							<label class="huabei-period">分12期(含手续费)</label>
							<label class="huabei-money">￥{{fenqiMoneyList[2]}}/期</label>
						</view>
					</scroll-view>
				</view>
				<view v-if="detailList.activityType == 1 && collageId != 0" class="goosDetailbut-box flex-items-plus"
					:style="{'padding-bottom':(isIphone==true? 60:20)+'rpx'}">
					<!-- <button class="joinbuyBut" @click="getGroupSettlement(2)" disabled="">确定</button> -->
					<view class="joinbuyBut" @click="getGroupSettlement(2)">确定</view>
				</view>
				<view v-else-if="detailList.activityType == 1 && ifGroupBuy" class="goosDetailbut-box flex-row-plus"
					:style="{'padding-bottom':(isIphone==true? 60:20)+'rpx'}">
					<view v-if="!ifGroupPro" class="buyNowBut" @click="addFast(1)">单独购买</view>
					<view v-else class="buyNowBut" @click="getGroupSettlement(1)">去拼团</view>
				</view>
				<view v-else class="goosDetailbut-box flex-row-plus"
					:style="{'padding-bottom':(isIphone==true? 60:20)+'rpx'}">
					<!-- 加入购物车 -->
					<view v-if="btnType === 1" class="buyNowBut" @click="addCart">确认</view>
					<view v-else class="buyNowBut" @click="addFast(2)">确认</view>
				</view>
			</view>
		</u-popup>
		<!-- 优惠券弹框 -->
		<u-popup v-model="showActivity" mode="bottom" border-radius="14" close-icon-pos="top-right"
			close-icon-size="20">
			<view class="couponShow-box">
				<view v-if="activeTypeFlag == 0" class="couponShow">
					<view class="title-box">
						<image class="close-btn" @click="onActivityClose" src="../../static/images/close.png"></image>
					</view>
					<view class="activity-coupon-box">
						<view class="content-box">
							<view class="coupon-item" v-for="(mItem, index) in markTools" :key="index">
								<view class="money-box">￥{{mItem.reduceMoney}}</view>
								<view class="info-box">
									<view class="info mar-top-10">满{{mItem.fullMoney}}元可用</view>
									<view class="date fs18 mar-top-20">
										{{getDate(mItem.startTime)}}~{{getDate(mItem.endTime)}}
									</view>
								</view>
								<view class="receive-btn" @click="receiveTap(mItem,0)" v-if="mItem.state==3">立即领取</view>
								<view class="receive-btn received" v-if="mItem.state==0">已领取</view>
							</view>
						</view>
					</view>
				</view>
				<view v-if="activeTypeFlag == 1" class="couponShow">
					<view class="title-box">
						<image class="close-btn" @click="onActivityClose" src="../../static/images/close.png"></image>
					</view>
					<view class="activity-coupon-box">
						<view class="content-box">
							<view class="coupon-item" v-for="(cpItem, index) in shopMarkTools" :key="index">
								<view class="money-box-wai">
									<text class="money-box" v-if="cpItem.couponType == 1">￥{{cpItem.reduceMoney}}</text>
									<text class="money-box"
										v-if="cpItem.couponType == 2">{{cpItem.reduceMoney}}折券</text>
									<text class="money-box" v-if="cpItem.couponType == 3">物品券</text>
								</view>
								<view class="info-box">
									<view class="mar-top-10">{{cpItem.content}}</view>
									<view class="mar-top-20">
										{{getDate(cpItem.startTime)}} ~ {{getDate(cpItem.endTime)}}
									</view>
								</view>
								<view class="receive-btn-box">
									<text class="receive-btn" @click="receiveTap(cpItem,1)"
										v-if="cpItem.state==3">立即领取</text>
									<text class="receive-btn received" v-if="cpItem.state==0">已领取</text>
								</view>
							</view>
						</view>
					</view>
				</view>

				<view class="receive-success" v-if="isShowSuccess">
					<view class="success-box">
						<image class="success-img" src="../../static/images/success_tu.png"></image>
						<view class="text">领取成功</view>
					</view>
				</view>
			</view>
		</u-popup>
		<u-popup class="popupDiscount" v-model="showGroupBuyList" mode="center" border-radius="14"
			close-icon-pos="top-right" close-icon-size="20">
			<view class="popupDiscountTit">这些人正在拼单</view>
			<view class="groupBuy">
				<view class="groupBuyList">
					<scroll-view style="height: 480upx;" scroll-y>
						<view class="groupBuyItem1" v-for="(aitem,index) in detailList.collageOrders" :key="index">
							<view class="leftAvatar">
								<img :src="aitem.headImage" alt="">
								<view class="groupBuyTime">
									<view class="needPeople"><span>{{aitem.name}}</span>还差{{aitem.person}}人</view>
									<view class="endDate">剩余{{timeChange(aitem.time)}}</view>
								</view>
							</view>
							<view class="rightInfo">
								<view class="groupBuyBtn" @click="getGroupShow(aitem.collageId)">去抢购</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</u-popup>
		<wxauth v-bind:showauth="showauth" @after-auth="afterauth" @stop-auth="stopauth"></wxauth>
	</view>
</template>

<script>
	import UButton from "../../uview-ui/components/u-button/u-button";
	import wxauth from '@/components/wxauth.vue'

	import {
		getSjWdMessage, //客户获取未读信息的数量
		getChatUserId, //获取用户id
	} from '@/api/chat.js'
	const NET = require('../../utils/request')
	const API = require('../../config/api')

	import {
		getPhone,
		getCurShopid,
		getCurUserid, // 获取用户id
		setCurShopid, //设置当前店铺
	} from '@/api/common.js'

	export default {
		components: {
			UButton,
			wxauth
		},
		data() {
			return {
				FXUserId:"",  // 分享进来的flag
				isShowShangXiang: false, //控制整个页面
				miaoshaList: [], //秒杀商品的数组
				scrollTop: 0,
				old: {
					scrollTop: 0
				},

				showauth: false,
				show: false,
				value: 0,
				isImage: true, //是否图片 否则显示视频
				screenHeight: 0,
				isIphone: "",
				returnTopFalg: false,
				goosDetailshowFlag: false, //商品详情是否展示
				colorActiveId: 1,
				modelNumActiveId: 1,
				parameterShowFlag: false,
				couponShowFalg: false,
				couponActiveFlag: 1,
				succeedShowFlag: false,
				goodsId: '',
				productId: '',
				skuId: '',
				detailList: {}, //商品详情对象
				skuPermission: false, //控制下单
				skuPrice: 120,
				skuOriginalPrice: 0,
				productCommentTotal: 0,
				commentKeywordVOList: [],
				skuVOList: [],
				attrList: [], //商品详情中的 names 规格数组,会员等级筛选完成
				buyNum: 1,
				storeDTO: {}, //门店信息
				storeId: '',
				id: '',
				storeName: '',
				skuProdId: '',
				productName: '',
				skuImg: '',
				skuNameStr: '',
				attrValueList: [], //names 中的第一个规格里面的所有规格值
				skuProdList: {}, //商品详情对象
				commentList: [],
				commentListLength: 0,
				videoSrc: 'https://mshop.app.qingdaoweichuang.com/video/ys1.mp4', //商品视频
				sellDescList: '<h2>商品详情</h2>',
				couponListLength: 0,
				showActivity: false,
				promotionType: 1,
				commentImgList: [],
				showVOList: [],
				promotionIds: '',
				couponList: [],
				isShowSuccess: false,
				productSkuVOList: [],
				selectArr: [], // 存放被选中的值
				subIndex: [], // 是否选中 因为不确定是多规格还是单规格，所以这里定义数组来判断
				attrItemIdArr: [], //存放被选中的id
				stockNumber: 0, //多少件
				integral: 0, //赠送多少积分
				wuliuIntegral: 0, //赠送多少物流积分
				showGroupBuyList: false,
				threecollageOrders: {}, //拼单数据
				getProblemsList: [], //商品问答数据
				problemsPage: 1,
				problemsPageSize: 2,
				timeActivetype: true,
				hou: "00",
				min: "00",
				sec: "00",
				timeOut: undefined,
				funtimeOut: undefined,
				collageId: 0,
				problemsListLength: 0,
				markTools: [], //平台优惠券
				shopMarkTools: [], //门店优惠券
				activeTypeList: [{
					name: '平台活动'
				}, {
					name: '门店活动'
				}],
				activeTypeFlag: 1,
				shopGroupWorkId: 0,
				ticker: null,
				ifWork: 0, //是否拼团商品单独购买
				shopDiscountId: 0,
				shopSeckillId: 0,
				ifEnable: 0,
				btnType: 1,
				ifGroupBuy: false,
				ifGroupPro: false,
				fenqiIndex: -1,
				disableFenqiList: [false, false, false],
				fenqiMoneyList: ["0.00", "0.00", "0.00"],
				supportHuabei: false,
				salesId: 0, //分销员id
				zhanshimiaosha: [], //展示秒杀的商品,已经过滤好了
				shiping: '', //视频路径
				myshiping: '', //用来渲染的
				isFrom: 0, //是否是秒杀进来的, 0-从商品列表进来的 1-从秒杀活动或者是商品详情中的相关秒杀进来的
				shopPhone: null, //我只需要该店铺的电话
				isTanShow: 1, //他默认就是有弹框的所以是 1 , 0-就不触发弹框,直接购买
				weidu: 0, // 多少条消息未读
				optionskuId:"",
				objoptions:{}
			}
		},
		onLoad(options) {
			// 分享参数
			if(options){
				this.objoptions = options;
			}
			if(options.FXUserId){
			   this.FXUserId = options.FXUserId
			}
			if (options.shopId !== undefined) {
				uni.setStorageSync("fxGoodsShopId", options.shopId)
			}
			if (options.isFXOrder) {
				let {
					isFXOrder,
					FXUserId
				} = options
				let FXInfo = {
					isFXOrder,
					FXUserId
				}
				uni.setStorageSync('FXUserInfo', FXInfo)
			}
			console.log(options, '传递进来的参数')
			//把isFrom 的值附上
			if (options.myfrom != undefined && options.myfrom != '') {
				this.isFrom = parseInt(options.myfrom)
			}
			if(options.skuId){
				//页面传过来的
				this.optionskuId=options.skuId;
			}
			
			this.isIphone = getApp().globalData.isIphone;
			if (getApp().globalData.productShareItem) {
				const item = getApp().globalData.productShareItem
				this.shopId = parseInt(item.shopId)
				uni.setStorageSync('curshopid', this.shopId)
				this.productId = item.productId
				this.skuId = item.skuId
				this.skuProdId = item.skuId
				this.salesId = parseInt(item.salesId)
				getApp().globalData.productShareItem = undefined
			} else {
				this.shopId = parseInt(options.shopId)
				if (this.shopId == 0) {
					this.shopId = getCurShopid('curshopid')
				}
				this.productId = options.productId
				this.skuId = options.skuId
				this.skuProdId = options.skuId
				this.salesId = parseInt(options.salesId)
			}
			this.queryProductDetail();
			
			// 
			// this.bindSalesCustomer(this.salesId, this.shopId)
			this.getProblems(),
			wx.showShareMenu({
				withShareTicket:true,
				//设置下方的Menus菜单，才能够让发送给朋友与分享到朋友圈两个按钮可以点击
				menus:["shareAppMessage","shareTimeline"],
				success(res) {
					 console.log(res,111111111111111111);
				},
			})
			
			
		},		
		onUnload() {
			if (this.timeOut) {
				clearTimeout(this.timeOut)
			}
			if (this.funtimeOut) {
				clearTimeout(this.funtimeOut)
			}
		},
		onShow() {
			// 获取聊天未读信息
			let myuid = uni.getStorageSync('userId')
			getChatUserId({
				shopid: this.shopId,
				userid: myuid
			}).then(res => {
				let myid = res.data.user.userid
				getSjWdMessage(myid).then(res => {
					this.weidu = res.data[0].count
					console.log(res, '第二次请求的结果')
				})
				console.log(res, '聊天的id转换')
			})
		},
		// 分享到朋友
		onShareAppMessage() {
			let distributorId = this.$getstorage("distributorId")??""
			let shopId = getCurShopid('curshopid')
			uni.setStorageSync('curshopid', shopId)
			let userId = getCurUserid() === undefined ? '' : getCurUserid();
			let _t = this;
			return new Promise((reslove,reject)=>{
				 //判断是否登录
				 NET.request(API.GetUser, {}, 'GET').then(res => {
				 	console.log(res,'已登录')
					reslove(
					{
						title: _t.detailList.productName,
						path: `/pages_category_page3/merchants/goodsDetails?salesId=${distributorId}&shopId=${_t.shopId}&productId=${_t.productId}&skuId=${_t.skuId}&myfrom=${_t.isFrom}&isFXOrder=1&FXUserId=${userId}`,
					}
					)
				 	_t.showauth = false; //授权
				 },res => {
				 	console.log(res,'未登录')
					uni.showToast({
						title:"请授权后再次操作!",
						icon:"none",
						duration:2000,
						success(res){
							console.log(res,"9909");
							_t.showauth = true;
						}
					})					 	
				 })
			})
		},
		//分享到朋友圈
		onShareTimeline(res) {
			let distributorId = this.$getstorage("distributorId")??""
			let userId = getCurUserid() === undefined ? '' : getCurUserid();
			let shopId = getCurShopid()
		    return {
				title: '商品',
				query:`FXUserId=${userId}&shopId=${this.objoptions.shopId}&salesId=${distributorId}&productId=${this.objoptions.productId}&skuId=${this.objoptions.skuId}`
				// path: `/pages_category_page3/merchants/goodsDetails?shopId=${shopId}&salesId=${userId}`,
			}
		},
		created() {
			if (this.ticker) { //这一段是防止进入页面出去后再进来计时器重复启动
				clearInterval(this.ticker);
			}
		},
		methods: {
			formatshowyhj(yhj){
				if(yhj && yhj!=""){
					return yhj.split(";");
				}
				return [""];
			},
			//逛店铺
			goStore() {
				uni.navigateTo({
					url: '/pages_category_page1/store/index?storeId=' + this.shopId
				})
			},
			videoChange(e) {
				//console.log(e.target.current,'我需要判断是不是第一个,只有第一个才需要把src赋空')
				if (e.target.current == 0) {
					this.myshiping = this.shiping
				} else {
					this.myshiping = ''
				}

			},
			//获取所有的秒杀商品,是个数组 getIndex?shopId=150
			getShopInfo() {
				let shopId = getCurShopid()
				NET.request(API.getShopIndex + `?shopId=${shopId}`, null,
					'GET').then(res => {
					this.shopPhone = res.data.chargePersonPhone
				
					this.miaoshaList = res.data.shopSeckill
					
						console.log(this.miaoshaList,'查看所有秒杀的商品1')
					let newarr = []
					this.miaoshaList.forEach((item) => {
						let arr = item.seckillProducts
						newarr = newarr.concat(unlink(arr))
					})

					function unlink(arr) {
						for (var i = 0; i < arr.length; i++) {
							for (var j = i + 1; j < arr.length; j++) {
								if (arr[i].productId == arr[j].productId) {
									arr.splice(j, 1);
									j--;
								}
							}
						}
						return arr
					}
					console.log(newarr, '过滤的商品')
					//过滤好的商品再进行判断
					let showGoods = []
					newarr.forEach((item) => {
						console.log(this.detailList.productId, 1221)
						if (this.detailList.productId == item.productId && this.detailList.activityType !=
							2) {
							showGoods.push(item)
						}
					})
					this.zhanshimiaosha = showGoods
				}).catch(function(res) {
					uni.showToast({
						title: '失败',
						icon: "none"
					});
				});
			},

			//关联商品的触发的事件,跳转页面
			goodsItemTap(item) {
				wx.navigateTo({
					url: `./goodsDetails?shopId=${item.shopId}&productId=${item.productId}&skuId=${item.skuId}`
				})
			},
			//相关秒杀的触发的事件,跳转页面
			goodsItemTapMiao(item) {
				wx.navigateTo({
					url: `./goodsDetails?shopId=${item.shopId}&productId=${item.productId}&skuId=${item.skuId}&myfrom=1`
				})
			},
			stopauth() {
				this.showauth = false;
				uni.navigateBack()
				// uni.switchTab({
				// 	url: "/pages/homePage/homePage"
				// })
			},
			afterauth() {
				//授权成功
				this.showauth = false;
				this.queryProductDetail()
				// this.bindSalesCustomer(this.salesId, this.shopId)
				this.getProblems()
			},
			filterProdAttrs(attrs) {
				//权限过滤商品规格
				return attrs;
			},
			previewImg(index, cindex) {
				let img = this.commentList[index].images[cindex]
				wx.previewImage({
					current: img, // 当前显示图片的http链接
					urls: [img] // 需要预览的图片http链接列表
				})
			},
			previewAddImg(index, cindex) {
				let img = this.commentList[index].images[cindex]
				wx.previewImage({
					current: img, // 当前显示图片的http链接
					urls: [img] // 需要预览的图片http链接列表 previewAddImg
				})
			},
			activeTypeActive(index) {
				this.activeTypeFlag = index
			},
			//收藏
			collectProduct() {
				// ifCollect - 0 是未收藏    1-是已经收藏

				if (this.detailList.ifCollect == 1) {
					this.detailList.ifCollect = 0
					uni.showToast({
						title: '取消收藏成功',
						icon: "success"
					})
				} else {
					this.detailList.ifCollect = 1
					uni.showToast({
						title: '收藏成功',
						icon: "success"
					})

				}
				this.collectPro()
			},
			//收藏
			collectPro() {
				NET.request(API.collect, {
					productId: parseInt(this.productId)
				}, 'POST').then(res => {}).catch(res => {
					uni.showToast({
						title: '请先登录',
						icon: "none"
					})
				})
			},
			//取消收藏
			cancelCollectPro() {
				NET.request(API.cancelCollect, {
					ids: [this.productId]
					//ids: [this.detailList.collectId]
				}, 'POST').then(res => {
					this.detailList.ifCollect = 0
					uni.showToast({
						title: '取消收藏成功',
						icon: "success"
					})
				}).catch(res => {
					uni.showToast({
						title: '失败',
						icon: "none"
					})
				})
			},
			//去拼单
			getGroupShow(collageId) {
				this.goosDetailshowFlag = true
				this.collageId = collageId
			},
			//拼团下单
			getGroupSettlement(type) {

				//判断是否登录
				let item = {}
				if (uni.getStorageSync('storage_key')) {
					item = uni.getStorageSync('storage_key');
				}
				if (JSON.stringify(item) == '{}') {
					this.showauth = true;
					return;
				} else if (this.stockNumber < 1) {
					uni.showToast({
						title: '库存不足',
						icon: "none"
					})
				} else {
					let data = {}
					if (type == 1) {
						data = {
							number: this.buyNum,
							productId: this.productId,
							shopId: this.shopId,
							skuId: this.skuProdId,
							shopGroupWorkId: this.shopGroupWorkId,
							type: type
						}
					} else {

						data = {
							collageId: this.collageId,
							number: this.buyNum,
							productId: this.productId,
							shopId: this.shopId,
							skuId: this.skuProdId,
							shopGroupWorkId: this.shopGroupWorkId,
							type: type
						}
					}
					uni.removeStorageSync("skuItemDTOList")
					uni.setStorageSync('skuItemList', data)
					//console.log(uni.getStorageSync("skuItemList"),44444)
					this.goosDetailshowFlag = false
					this.buyNum = 1
					uni.navigateTo({
						url: '../orderModule/orderConfirm?type=100',
					})
				}
			},
			beginTimer() { //这个计时器是每秒减去数组中指定字段的时间
				this.ticker = setInterval(() => {
					for (let i = 0, len = this.detailList.collageOrders.length; i < len; i++) {
						const item = this.threecollageOrders[i];
						if (item.time > 0) {
							item.time = item.time - 1;
						}
					}
				}, 1000);
			},
			timeChange(countDown) {
				var $that = this;
				if (countDown < 0) {
					clearInterval(setInterval(this.timeChange(countDown), 1000)); //当无剩余时间了，就停止执行timeChange函数
				}
				//求天时分秒 leftDate是毫秒
				let leftSecond = $that.fillNumber(countDown % 60);
				let leftMinute = $that.fillNumber((countDown / 60) % 60);
				let leftHours = $that.fillNumber((countDown / (60 * 60)) % 24);
				let leftDay = $that.fillNumber(countDown / (60 * 60) / 24);
				if (leftHours == "00" && leftMinute == "00" && leftSecond == "-1") {
					clearTimeout(this.ticker)
					this.queryProductDetail()
				}
				return leftHours + ":" + leftMinute + ":" + leftSecond;
			},
			fillNumber(num) {
				let number = Math.floor(num); //向下取整
				return number > 9 ? number : "0" + number;
			},
			getfuntime(micro_second) {
				// 总秒数
				let second = Math.floor(micro_second / 1000);
				// 天数
				let day = Math.floor(second / 3600 / 24);
				// 小时
				let hr = Math.floor(second / 3600 % 24);
				// 分钟
				let min = Math.floor(second / 60 % 60);
				// 秒
				let sec = Math.floor(second % 60);
				let outtime = ""
				outtime = hr + ':' + min + ':' + sec
				return outtime
			},
			//时分秒换算
			dateformat(micro_second) {
				// 总秒数
				let second = Math.floor(micro_second / 1000);
				// 天数
				let day = Math.floor(second / 3600 / 24);
				// 小时
				let hr = Math.floor(second / 3600 % 24);
				// 分钟
				let min = Math.floor(second / 60 % 60);
				// 秒
				let sec = Math.floor(second % 60);
				this.hou = hr + day * 24
				this.min = min
				this.sec = sec
			},
			countDown() {
				let timeOut = setTimeout(() => {
					let hou = parseInt(this.hou);
					let min = parseInt(this.min);
					let sec = parseInt(this.sec);

					let netxSec = sec - 1;
					let netxMin = min
					let netxHou = hou;
					if (netxHou == 0 && netxMin == 0 && netxSec == -1) {
						
						
						if(this.timeActivetype == false  && this.detailList.activityType==2){
							//秒杀活动，预热时间结束，页面要刷新
								this.queryProductDetail()
						}else{
							clearTimeout(timeOut)
							uni.switchTab({
								url: '../../pages/homePage/homePage'
							})
							uni.showToast({
								title: "活动结束",
								duration: 2000,
								icon: 'none'
							})
						}
						
					} else {
						if (netxSec == -1) {
							netxSec = 59
							netxMin = netxMin - 1;
						}
						if (netxMin == -1) {
							netxMin = 59
							netxHou = netxHou - 1
						}
						// if (netxHou == -1) {
						//   netxHou = 23
						// }

						this.hou = this.timeFormat(netxHou),
							this.min = this.timeFormat(netxMin),
							this.sec = this.timeFormat(netxSec),
							this.timeOut = timeOut
						this.countDown();
					}
				}, 1000)
			},
			//打电话
			dadianhua() {
				let Phone = getPhone()
				wx.makePhoneCall({
					phoneNumber: Phone,

				})
			},
			timeFormat(param) { //小于10的格式化函数
				return param < 10 ? '0' + param : param;
			},
			goshopCart() {
				uni.switchTab({
					url: '../../pages/tabbar/cart/index'
				})
			},
			twonumansers(answers) {
				let data = answers.slice(0, 1)
				return data
			},
			//商品问答数据
			getProblems() {
				NET.request(API.getProblems, {
					productId: this.productId,
					page: this.problemsPage,
					pageSize: this.problemsPageSize
				}, 'GET').then(res => {
					this.getProblemsList = []
					this.problemsListLength = 0
				}).catch(res => {
					uni.showToast({
						title: '失败',
						icon: "none"
					})
				})
			},
			//查看所有评论
			commentAll() {
				uni.navigateTo({
					url: 'evaluateList?commentList=' + JSON.stringify(this.commentList)
				})
			},
			commentImgData(imgData) {
				let imgDataResult = []
				imgDataResult = imgData.split(",");
				return imgDataResult
			},
			top() { //回到顶部
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
			},
			//加入购物车跟立即购买会显示商品规格弹窗
			goosDetailshowClick(type, ifGroup, i) {
				//this.isTanShow = isTanShow
				if (this.isTanShow || i == 1) {
					this.btnType = type
					this.collageId = 0
					if (ifGroup === 'groupBuy') {
						this.ifGroupBuy = true
					} else {
						this.ifGroupBuy = false
					}
					this.goosDetailshowFlag = true
				} else {
					this.addFast(2)
				}

			},
			//商品参数弹窗
			parameterTruebut() {
				this.parameterShowFlag = false
			},
			parameterShowClick() {
				this.parameterShowFlag = true
			},
			//优惠券
			couponActive(type) {
				this.couponActiveFlag = type
			},
			//优惠券弹窗
			couponShowClick() {
				this.showActivity = true
			},
			//领取成功
			succeedShowClick() {
				this.succeedShowFlag = true
				if (this.succeedShowFlag == true) {
					setTimeout(() => {
						this.succeedShowFlag = false
					}, 1500);
				}
			},
			//颜色选中事件
			colorActiveClick(res, index, resIndex, isTanShow = 1) {
				//下面这个参数,如果在外面就选了规格,就不触发规格选择弹框,直接触发确认按钮,并且,是购买触发,并不是加入购物车
				// 1-弹框  0-不弹框,直接购买
				this.isTanShow = isTanShow

				console.log(res, index, resIndex, "colorActiveClick")
				console.log(this.isTanShow, "我的参数")
				let t = this;
				t.selectArr[index] = res;
				t.subIndex[index] = resIndex;
				t.attrItemIdArr[index] = res.valueCode
				console.log(t.attrItemIdArr, '当前规格')
				t.checkItem();
				t.checkItemDataClick(t.attrItemIdArr)
			},
			//分期选中事件
			selectFenqi(index) {
				if (this.fenqiIndex !== index && !this.disableFenqiList[index]) {
					this.fenqiIndex = index;
				} else {
					this.fenqiIndex = -1;
				}
			},
			checkItem() {
				var self = this;
				var option = self.attrList;
				var result = []; // 定义数组存储被选中的值
				for (let i in option) {
					result[i] = self.selectArr[i] ? self.selectArr[i] : "";
					if (!self.subIndex[i]) {
						self.subIndex[i] = 0
					}
					if (!self.attrItemIdArr[i]) {
						self.attrItemIdArr[i] = option[i].values[0].valueCode
					}
				}
				for (let i in option) {
					var last = result[i]; // 把选中的值存放到字符串last去
					for (let k in option[i].item) {
						result[i] = option[i].item[k].name; // 赋值，存在直接覆盖，不存在往里面添加name值
					}
					result[i] = last; // 还原，目的是记录点下去那个值，避免下一次执行循环时避免被覆盖
				}
				self.$forceUpdate(); // 重绘
			},
			checkItemDataClick(attrItemIdArr) {
				let attrkey = ''
				for (let i = 0; i < attrItemIdArr.length; i++) {
					attrkey += attrItemIdArr[i] + ','
				}
				attrkey = attrkey.substring(0, attrkey.length - 1)
				let mapinfo = this.skuProdList.map
				let choicekey = "";
				for (var key in mapinfo) {
					if (attrkey == key) {
						choicekey = key;
						break;
					}
				}

				if (choicekey && choicekey != "") {
					//有匹配的key
					let key = choicekey;
					this.skuProdId = mapinfo[key].skuId
					//this.skuImg = mapinfo[key].skuImg
					this.skuPrice = mapinfo[key].price //价格
					this.skuOriginalPrice = mapinfo[key].originalPrice
					this.stockNumber = mapinfo[key].stockNumber
					this.integral = mapinfo[key].integral

					this.wuliuIntegral = mapinfo[key].wuliuIntegral
					this.skuPermission = true; //当前选中的规格有权限可以查看
				} else if (attrkey == '') {
					let str = ''
					for (var i in mapinfo) {
						str = i
					}
					let obj = mapinfo[str]
					this.skuProdId = obj.skuId
					//this.skuImg = obj.skuImg
					this.skuPrice = obj.price //价格
					this.skuOriginalPrice = obj.originalPrice
					//console.log(this.skuOriginalPrice,1111)
					this.stockNumber = obj.stockNumber
					this.integral = obj.integral
					this.wuliuIntegral = obj.wuliuIntegral
					this.skuPermission = true; //当前选中的规格有权限可以查看
				} else {
					this.skuPermission = false; //控制下单
					// this.skuPrice = "无权限查看";
				}
				//console.log(attrItemIdArr.length, 'num')
				var currentCode = ''
				for (var i = 0; i < attrItemIdArr.length; i++) {
					if (i === 1 && attrItemIdArr.length > 1) {
						currentCode += ',' + attrItemIdArr[i]
					} else {
						currentCode += attrItemIdArr[i]
					}
				}
				for (let key in this.skuProdList.map) {
					if (key == currentCode) {
						//this.skuImg = this.skuProdList.map[key].image
						this.detailList.originalPrice = this.skuProdList.map[key].originalPrice
						if (this.skuProdList.map[key].activityType == 1) {
							this.ifGroupPro = true
							return false
						} else {
							this.ifGroupPro = false
						}
					}
				}

			},
			//获取商品 sku 详情对象
			getProductSku() {
				NET.request(API.QueryProductSku, {
					shopId: this.shopId,
					skuId: this.skuId,
					productId: this.productId,
					request: this.isFrom
				}, 'GET').then(res => {
					this.skuProdList = res.data
					this.attrList = res.data.names

					this.attrValueList = res.data.names[0].values
					let curvaluecode = "";
					res.data.names.forEach(i => {
						if (i.values && i.values.length > 0) {
							curvaluecode = curvaluecode + "," + i.values[0].valueCode
						}
					})
					if (curvaluecode && curvaluecode != "") {
						curvaluecode = curvaluecode.substring(1);
					}
					let curmapval = res.data.map[curvaluecode];
					//渲染商详之后,规则只有一个,并且就是等级的话,就默认选中该等级
					// this.colorActiveClick(this.attrValueList[0], 0, 0)

					this.skuPrice = curmapval ? curmapval.price : res.data.price
					this.skuOriginalPrice = curmapval ? curmapval.originalPrice : this.dataList.originalPrice
					this.stockNumber = res.data.stockNumber
					this.integral = res.data.integral
					this.wuliuIntegral = res.data.wuliuIntegral
					this.detailList.ifHuabei = res.data.ifHuabei
					this.colorActiveClick(this.skuProdList.names[0].values[0], 0, 0)
				}).catch(res => {

				})
			},
			//大小尺寸选中事件
			modelNumActiveClick(type) {
				this.modelNumActiveId = type
			},
			//获取商品详情
			queryProductDetail() {
				uni.showLoading({
					title: '加载中...'
				})
				NET.request(API.QueryProductDetail, {
						shopId: this.shopId,
						productId: this.productId,
						skuId: this.skuId,
						request: this.isFrom,
						terminal: 1
					},
					"GET").then(res => {
					uni.hideLoading()
					this.detailList = res.data
					uni.setNavigationBarTitle({
						title: this.detailList.productName
					})
					console.log(res.data.images.slice(0, 1), '照片数组')
					this.skuImg = res.data.images.slice(0, 1) // skuImg 之前会变化,现在跟商品图一样
					this.shiping = this.detailList.videoUrl
					this.myshiping = this.detailList.videoUrl
					if (this.isFrom == 0) {
						this.detailList.activityType = 0
					}
					console.log(this.detailList, '商品详情123')
					this.markTools = res.data.markTools //平台优惠券
					this.shopMarkTools = res.data.shopMarkTools //门店优惠券
					//判断活动类型 是否正在进行活动预热
					if (this.detailList.activityType == 1 && this.detailList.ifEnable == 0) {
						this.threecollageOrders = res.data.collageOrders.slice(0, 2)
						this.dateformat(res.data.time)
						this.countDown();
					} else if (this.detailList.activityType == 3 && this.detailList.ifEnable == 0) {
						this.dateformat(res.data.time)
						this.countDown();
					} else if (this.detailList.activityType == 2 && this.detailList.ifEnable == 0) {
						this.dateformat(res.data.time)
						this.countDown();
					} else if (this.detailList.activityType == 2 && this.detailList.ifEnable == 1) {
						//秒杀，开启时间预热
						this.dateformat(res.data.time)
						this.countDown();
					}
					//评价
					this.ifEnable = res.data.ifEnable
					if (this.ifEnable == 0) {
						this.timeActivetype = true
					} else {
						this.timeActivetype = false
					}
					this.commentList = res.data.comments
					this.commentListLength = this.commentList.length
					this.sellDescList = res.data.text.replace(/\<img/gi,
						'<img style="max-width:100%;height:auto" ')
					this.couponListLength = res.data.couponImages.length
					this.showVOList = res.data.couponImages
					this.couponList = res.data.markTools
					this.skuPrice = res.data.price
					this.skuOriginalPrice = res.data.originalPrice
					this.shopGroupWorkId = res.data.shopGroupWorkId
					this.shopDiscountId = res.data.shopDiscountId
					this.shopSeckillId = res.data.shopSeckillId
					if (res.data.attrList && res.data.attrList.length > 0) {
						for (let i = 0; i < res.data.attrList.length; i++) {
							this.subIndex[i] = 0
						}
						this.attrItemIdArr[0] = res.data.attrList[0].attrValueList[0].id
					}
					//获取规格
					this.getProductSku();
					this.beginTimer();
					//获取相关秒杀所需要的数据
					this.getShopInfo();
					// // 获取用户点击次数
					this.isShowShangXiang = true //拿到商详之后,再渲染页面
					return this.detailList
				}).then(v=>{
					if(this.FXUserId){
						this.getsumdj(v.productName,v.productId,"/pages_category_page3/merchants/goodsDetails");
					}
				})
				.catch(res => {
					console.log(res, "queryProductDetail:error")
					uni.hideLoading()
				})

			},
			// 查看全部问答
			seeAllFn(problemId) {
				let data = {
					productId: this.productId,
					img: this.detailList.images[0],
					productName: this.detailList.productName,
					questionlength: this.problemsListLength,
					problemId: problemId
				}
				uni.setStorageSync("seeAllFnData", data)
				uni.navigateTo({
					url: 'qADetail'
				})
			},
			// 查看当前全部回答
			seeAllQa() {
				uni.navigateTo({
					url: 'answerList?productId=' + this.productId + "&img=" + this.detailList.images[0] +
						'&productName=' + this.detailList.productName
			  		})
			},
			// 提问
			goToQuestions() {
				let data = {
					productId: this.productId,
					images: this.detailList.images[0],
					productName: this.detailList.productName,
					questionNumber: this.getProblemsList.length
				}
				uni.navigateTo({
					url: 'putQuestions?data=' + JSON.stringify(data)
				})
			},

			// 数量减
			numSub() {
				if (this.buyNum > 1) {
					this.buyNum = this.buyNum - 1
				} else {
					uni.showToast({
						title: '亲！至少一件哦！',
						icon: "none"
					})
				}
			},
			// 数量加
			numAdd() {
				if (this.buyNum < this.stockNumber) {
					this.buyNum = parseInt(this.buyNum) + 1
				} else {
					uni.showToast({
						title: '库存不足！',
						icon: "none"
					})
				}
			},
			//输入框监听
			jianting(val) {
				if (val > this.stockNumber) {
					this.show = true
				} else {
					this.buyNum = val
				}
			},
			myconfirm() {
				this.buyNum = 1
			},
			//加入购物车
			addCart() {
				//判断是否登录
				let item = {}
				if (uni.getStorageSync('storage_key')) {
					item = uni.getStorageSync('storage_key');
				}
				let shopId = getCurShopid()
				if (JSON.stringify(item) == '{}') {
					this.showauth = true;
					return;
				} else {
					if (this.stockNumber < 1) {
						uni.showToast({
							title: '库存不足',
							icon: "none"
						})
					} else {
						wx.showLoading({
							title: '添加中...',
						})
						NET.request(API.ShoppingaddCart, {
							skuId: this.skuProdId,
							number: this.buyNum,
							shopId,
						}, 'POST').then(res => {
							uni.hideLoading()
							uni.showToast({
								title: '添加成功',
								icon: 'none'
							})
							setTimeout(() => {
								this.goosDetailshowFlag = false
							}, 1500);
							//this.buyNum = 1
						}).catch(res => {
							uni.hideLoading()
							if (res.data.code == 40005) {
								this.showauth = true;
								return;
							}
						})
					}
				}
			},

			OnlineCustomer() {
				const _this = this;
				NET.request(API.GetUser, {}, 'GET').then(res => {
					this.showauth = false;
					let _chatproduct = {
						shopid: getCurShopid(),
						productId: _this.productId,
						skuId: _this.skuId,
						name: _this.detailList.productName,
						cover: _this.detailList.images[0]
					}
					uni.setStorageSync("tempchatproduct", _chatproduct)
					uni.navigateTo({
						url: `../../pages/OnlineCustomer/OnlineCustomer`
					})

				}, res => {
					this.showauth = true;
					return;
				})


			},
			//点赞
			zanTap(index, likeId, actionType) {
				uni.showLoading({
					title: '提交中...',
				})
				NET.request(API.LikeOrUnLikeComment, {
					commentId: likeId,
					ifLike: actionType
				}, 'POST').then(res => {
					uni.hideLoading()
					if (this.commentList[index].ifLike == 1) {
						this.commentList[index].ifLike = 0
						this.commentList[index].likes = this.commentList[index].likes - 1
					} else {
						uni.showToast({
							title: "点赞成功",
							icon: 'none'
						})
						this.commentList[index].likes = this.commentList[index].likes + 1
						this.commentList[index].ifLike = 1
					}
				}).catch(res => {
					uni.hideLoading()
				})
			},
			//关闭优惠券弹窗
			onActivityClose() {
				this.showActivity = false
			},
			getDate(time) {
				if (!time) return '';
				return time.split(' ')[0]
			},
			receiveTap(couponItemInfo, type) {
				uni.showLoading({
					title: '领取中...',
				})
				let ReceiveCoupon
				if (type == 0) {
					ReceiveCoupon = {
						couponId: couponItemInfo.couponId
					}
				} else {
					ReceiveCoupon = {
						shopCouponId: couponItemInfo.shopCouponId
					}
				}
				NET.request(API.ReceiveCoupon, ReceiveCoupon, 'POST').then(res => {
					uni.hideLoading()
					this.isShowSuccess = true
					setTimeout(() => {
						this.isShowSuccess = false
						this.queryProductDetail()
					}, 1500);
					setTimeout(() => {
						this.showActivity = false
					}, 3000);
				}).catch(res => {
					uni.hideLoading()
					uni.showToast({
						title: res.message,
						duration: 1500,
						icon: 'none'
					})
				})
			},
			// 点击分享
			clickShare() {
				// #ifdef APP-PLUS
				var system = 1
				// #endif

				// #ifdef H5
				var system = 3
				// #endif

				// #ifdef MP-WEIXIN
				var system = 2
				// #endif

				// #ifdef MP-ALIPAY
				var system = 4
				// #endif
				uni.showLoading({
					title: '请稍候...'
				})
				console.log(system, 'system')
				NET.request(API.getSharePic, {
					productId: this.detailList.productId,
					shopId: this.detailList.shopId,
					skuId: this.detailList.similarProducts[0].skuId,
					terminal: system
				}, 'GET').then(res => {
					uni.hideLoading()
					// 推广商品
					uni.navigateTo({
						url: `../../pages_category_page1/distributionModule/shareProduct?shareImg=${res.data}&shopId=${this.detailList.shopId}&productId=${this.detailList.productId}&skuId=${this.detailList.similarProducts[0].skuId}`
					});
				}).catch(res => {
					uni.hideLoading()
				})
			},
			//立即购买
			addFast(type) {
				//判断是否登录
				let item = {}
				const _this = this;
				NET.request(API.GetUser, {}, 'GET').then(res => {
					if (_this.skuPermission) {
						if (type == 1) {
							_this.ifWork = 1
						} else {
							_this.ifWork = 0
						}
						if (_this.stockNumber < 1) {
							uni.showToast({
								title: '库存不足',
								icon: "none"
							})
						} else if (parseInt(_this.buyNum) < 1) {
							// console.log(this.buyNum,this.detailList.users,this.stockNumber,99999)
							uni.showToast({
								title: '输入的数量不规范',
								duration: 2000,
								icon: "none"
							})
						} else {
							let list = [{
								ifWork: _this.ifWork,
								shopId: '',
								shopName: '',
								shopDiscountId: null,
								shopSeckillId: null,
								skus: [ //商品明细
									{
										productId: 0,
										skuId: 0,
										productName: "",
										image: "",
										price: 0,
										weight: 0,
										number: 0,
										SKU: "",
										total: 0,
										ifLogistics: 1
									}
								]
							}]
							list[0].shopId = _this.detailList.shopId
							list[0].shopName = _this.detailList.shopName
							list[0].skus[0].productId = _this.skuProdList.productId
							list[0].skus[0].skuId = _this.skuProdId
							list[0].skus[0].productName = _this.skuProdList.productName
							//list[0].skus[0].image = _this.skuImg
							list[0].skus[0].weight = _this.skuProdList.weight
							list[0].skus[0].number = _this.buyNum
							list[0].skus[0].SKU = _this.skuProdList.SKU
							//console.log(type,this.skuOriginalPrice,9999)
							if (type == 1) {
								list[0].skus[0].price = _this.skuOriginalPrice
								if(_this.detailList.activityType == 1 && _this.btnType == 1){
									list[0].skus[0].price = _this.skuOriginalPrice
								}else{
									list[0].skus[0].price = _this.skuPrice
								}
								list[0].skus[0].total =list[0].skus[0].price * _this.buyNum
							} else {
								list[0].skus[0].price = _this.skuPrice
								list[0].skus[0].total = _this.skuPrice * _this.buyNum
							}

							list[0].skus[0].ifLogistics = _this.skuProdList.ifLogistics
							if (_this.shopSeckillId > 0) {
								list[0].shopSeckillId = _this.shopSeckillId
								//秒杀和折扣要替换
								list[0].skus[0].skuId=this.optionskuId;
							}
							//console.log(this.shopDiscountId,555)
							if (_this.shopDiscountId > 0) {
								list[0].skus[0].skuId=this.optionskuId;
								list[0].shopDiscountId = _this.shopDiscountId
							}
							
							uni.setStorageSync('skuItemDTOList', list)
							_this.goosDetailshowFlag = false
							uni.navigateTo({
								url: `/pages_category_page1/orderModule/orderConfirm?type=1&isFrom=${_this.isFrom}`,
							})
							_this.buyNum = 1
						}

					} else {
						uni.showToast({
							// title: '会员等级低,无权限购买',
							title: '请选择规格!',
							duration: 2000,
							icon: "none"
						})
					}
				}, res => {
					this.showauth = true;
					return;
				})
			},
			bindSalesCustomer(salesId, storeId) {
				if (salesId && storeId) {
					//如果已登录，静默绑定客户关系，否则跳转到登录页面
					if (uni.getStorageSync('storage_key')) {
						NET.request(API.BindSalesCustomer, {
							shopId: storeId,
							distributorId: salesId
						}, 'POST').then(res => {
							uni.showToast({
								title: "绑定成功",
								icon: "none"
							})
						}).catch(res => {
							uni.showToast({
								title: res.data.msg,
								icon: "none"
							})
						})
					} else {
						uni.setStorageSync('salesId', salesId)
						uni.setStorageSync("shopId", storeId)
						this.showauth = true;
						return;
					}
				}
			},
			openAllBuy() {
				this.showGroupBuyList = true
			},
			openAllBuyTwo() {
				uni.showToast({
					title: "还没有人拼单，快去拼单吧！",
					icon: "none"
				})
			}
		},
		mounted() {
			// 获取手机的屏幕高度
			uni.getSystemInfo({
				success: (res) => {
					this.screenHeight = res.screenHeight
				}
			})
		},
		onPageScroll: function(e) {
			if (e.scrollTop > 600) {
				this.returnTopFalg = true
			} else {
				this.returnTopFalg = false
			}
		}
	}
</script>

<style lang="scss">
	.leftText-warp {
		position: relative;

		.seckill-box-price {
			padding-top: 60upx;
		}
	}

	.leftText {
		// width: 126upx;
		background: #EF7722;
		border-radius: 6upx 18upx 0 0;
		position: absolute;
		left: 0;
		top: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 2;
		padding-left: 30upx;
		padding-right: 30upx;
		padding-top: 10upx;
		padding-bottom: 10upx;

		.img {
			width: 32upx;
			height: 32upx;
		}

		span {
			font-size: 28upx;
			font-style: italic;
			color: #FFFFFF;
			font-weight: bold;
			font-family: 'YouSheBiaoTiHei';
		}
	}

	.fu-box {
		position: relative;

		.tiao {
			position: absolute;
			top: -5rpx;
			left: 35rpx;
			width: 40rpx;
			height: 40rpx;
			line-height: 40rpx;
			text-align: center;
			border-radius: 50%;
			background-color: red;
			color: #FFFFFF;
		}
	}

	.myjifen {
		margin: 30rpx 0 0 30rpx;
		font-size: 30rpx;
		display: flex;
		flex-direction: row;
		font-weight: 600;
		height: 40rpx;
	}

	.page-section-spacing {}

	.scroll-view_H {
		white-space: nowrap;
	}

	.scroll-view-item {
		height: 200rpx;
	}

	.scroll-view-item_H {
		display: inline-block;
		width: 70%;
		height: 200rpx;

		.myconten {
			position: relative;
			height: 200rpx;

			.myGoodsName {
				position: absolute;
				top: 20rpx;
				left: 20rpx;
				width: 280rpx;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}
		}
	}





	.page {
		background-color: #F7F7F7;
	}

	.tuijian_view {
		padding: 20rpx;

		.title {
			margin-bottom: 20rpx;
		}
	}

	.kill_view {
		padding: 20rpx;

		.title {
			margin-bottom: 20rpx;
		}

		.kill {
			display: flex;
			justify-content: space-between;

			.img {
				width: 155rpx;
				height: 155rpx;
				border-radius: 10rpx;
			}
		}
	}

	.tuijian {
		display: flex;
		padding-bottom: 20rpx;
		border-bottom: 1rpx solid #eee;

		.item {
			width: 50%;
			display: flex;

			.img {
				width: 150rpx;
				height: 150rpx;
				border-radius: 10rpx;
			}

			.cont {
				display: flex;
				flex: 1;
				margin-left: 10rpx;
				flex-direction: column;

				.cont_title {
					color: #333;
				}

				.cont_price {
					span {
						&:last-child {
							font-size: 20rpx;
							color: #999;
							text-decoration: line-through;
						}

						&:first-child {
							font-size: 24rpx;
							color: #00AA49;
						}
					}
				}

				.num {
					margin-top: auto;
					font-size: 24rpx;

					span {
						color: #00AA49;
					}
				}
			}
		}
	}

	.yhj {
		display: flex;
		padding-left: 20rpx;
		border-top: 1rpx solid #EDEDED;

		span {
			margin: auto 0;
		}

		.tags {
			display: flex;
			flex-wrap: wrap;
			padding: 20rpx;

			.tag {
				padding: 2rpx 15rpx;
				border-radius: 10rpx;
				color: #00AA49;
				border: 1rpx solid #00AA49;
				margin-left: 20rpx;
			}
		}
	}
	
	.d-flex{
		display: flex;
		align-items: center;
		text:first-child{
			display: inline-block;
			width:540rpx;
		    overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

	.couponItemimg {
		width: 150upx;
		height: 60upx;
	}

	.tabsbox {
		width: 100%;
		margin-top: 20rpx;
		background-color: #FFFFFF;
	}

	.joinbuyBut {
		width: 690upx;
		height: 80upx;
		border-radius: 40upx 40upx;
		background-image: linear-gradient(135deg, #FFA100 10%, #FF7911 100%);
		color: #FFFEFE;
		font-size: 28upx;
		line-height: 80upx;
		text-align: center;
	}

	.checkimg {
		width: 40upx;
		height: 40upx;
		margin-right: 30upx;
	}

	.container {
		padding-bottom: 180upx;

		.container_btn {
			position: relative;
			display: flex;
			padding: 10rpx 0;

			span {
				padding: 8rpx 20rpx;
				border-radius: 25rpx;
				color: #fff;

				&:last-child {
					background-color: #00AA49;
					margin: auto auto auto 10rpx;
				}

				&:first-child {
					background-color: #018A45;
					margin: auto 10rpx auto auto;
				}
			}
		}

		.arrow-icon {
			width: 24upx;
			height: 24upx;
		}

		.goodsImgswiper-box {
			width: 750upx;
			height: 750upx;

			.goodsImg {
				width: 750upx;
				height: 750upx;
			}
		}

		.share-box {
			width: 200upx;
			height: 60upx;
			background-color: #FFFFFF;
			border-radius: 30upx 0 0 30upx;
			position: absolute;
			top: 30upx;
			right: 0;
			z-index: 99;

			.share-img {
				width: 36upx;
				height: 36upx;
			}
		}

		.goodgDes-box {
			background-color: #FFFFFF;
			width: 100%;

			.priceBuyNum-box {
				width: 677upx;
				margin-top: 30upx;
			}

			.goodsName-box {
				width: 677upx;
				margin-bottom: 30upx;

				.img618-cion {
					width: 70upx;
					height: 36upx;
				}
				
			}
			.zuhe{
				// width: 400upx;
				// overflow: hidden;
				// text-overflow: ellipsis;
				white-space: nowrap;
				margin: 10rpx 0 10rpx 25rpx;
			}

			.discounts-box {
				margin-top: 20upx;

				.discounts-text {
					margin-left: 10upx;
					color: #FF7800;
					background-color: #FFE4CC;
					padding: 6upx 12upx;
					border-radius: 4upx;
				}
			}

			.activity-box {
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: flex-end;
				border-bottom: 1upx solid #F7F7F7;

				.activity-content {

					width: 614upx;
					padding-top: 20upx;

					.activity-text {
						color: #FF7700;
						border: 1upx solid #FF7700;
						padding: 6upx 23upx;
					}

					.coupon-arrow {
						width: 24upx;
						height: 24upx;
						margin-left: 15upx;
					}
				}
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
		.express-box {
			height: 90upx;
			background-color: #FFFFFF;

			.expressSite-icon {
				width: 30upx;
				height: 30upx;
			}
		}

		.chooseSize-box {
			height: 90upx;
			background-color: #FFFFFF;

			.chooseSize-content {
				width: 720upx;
			}
		}

		.evaluate-box {
			background-color: #FFFFFF;
			margin-top: 20upx;

			.evaluate {
				width: 690upx;
				padding: 20upx 0;
				border-bottom: 1upx solid #EDEDED;
			}

			.evaluateTitle-box {
				width: 690upx;
				border-bottom: 1upx solid #EDEDED;
				padding-bottom: 20upx;
			}

			.evaluateAllArrow-icon {
				width: 24upx;
				height: 24upx;
			}

			.evaluateTag-box {
				margin-top: 10upx;
				margin-left: 10upx;
				padding-bottom: 10upx;
				display: flex;
				flex-wrap: wrap;

				.evaluateTag-text {
					background-color: #FFE4CC;
					border-radius: 6upx;
					padding: 16upx 14upx;
					color: #656565;
					margin-left: 20upx;
					margin-top: 20upx;
				}
			}

			.evaluate-contentbox {
				display: flex;
				justify-content: center;
				flex-direction: column;
				margin-left: 30upx;
				// border-bottom: 1upx solid #EDEDED;
				padding-bottom: 50upx;

				.evaluate-content {
					width: 670upx;
					display: flex;
					justify-content: space-between;

					.user-headSmallImg {
						width: 46upx;
						height: 46upx;
						border-radius: 50%;
					}
				}

				.evaluateDes-box {
					width: 670upx;
					margin-top: 30upx;

					.evaluateDes {
						width: 670upx;
					}
				}

				.addEvaluate {
					padding-top: 30upx;
				}
			}
		}

		.questions {
			.questionInfo {
				padding: 0 30upx;
				height: 90upx;
				margin-bottom: 50upx;

				.infoTit {
					font-size: 28upx;
				}

				.putQuestion {
					width: 110upx;
					height: 44upx;
					background: #FFFFFF;
					border: 1px solid #FF7800;
					border-radius: 22upx;
					text-align: center;
					line-height: 44upx;
					font-size: 24upx;
					color: #FF7800;
				}
			}

			.listBox {
				padding: 0 30upx;
				border-bottom: 20upx solid #EEEEEE;

				.itemBox {
					padding-bottom: 30upx;
					border-bottom: 1upx solid #EEEEEE;
					margin-bottom: 30upx;

					&:last-child {
						border-bottom: none;
					}

					.itemAsk {
						display: flex;
						align-items: center;
						margin-bottom: 42upx;

						i {
							font-style: normal;
							width: 38upx;
							height: 38upx;
							line-height: 38upx;
							background: linear-gradient(0deg, #FF7800 0%, #F79D4D 100%);
							border-radius: 4upx;
							display: block;
							margin-right: 30upx;
							font-size: 28upx;
							color: #FFFFFF;
							text-align: center;
						}

						span {
							font-size: 28upx;
							color: #333333;
						}
					}

					.answer {
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-bottom: 30upx;

						.answerBox {
							display: flex;
							align-items: center;

							i {
								font-style: normal;
								width: 38upx;
								height: 38upx;
								line-height: 38upx;
								background: linear-gradient(0deg, #2DB76F 0%, #67C192 100%);
								border-radius: 4upx;
								display: block;
								text-align: center;
								margin-right: 30upx;
								color: #FFFFFF;
							}

							span {
								font-size: 26upx;
								color: #666666;
							}
						}

						.answerBtn {
							width: 130upx;
							height: 44upx;
							line-height: 44upx;
							background: #FFFFFF;
							border: 1px solid #FF7800;
							border-radius: 22upx;
							text-align: center;
							color: #FF7800;
							font-size: 24upx;
						}
					}

					.seeAll {
						margin-left: 68upx;
						font-size: 28upx;
						color: #FF7800;
					}
				}
			}
		}

		.questionTit {
			height: 90upx;
			border-bottom: 1upx solid #EEEEEE;
			margin-right: 35upx;
			color: #333333;
			font-size: 30upx;

			.allMoreBox {
				display: flex;
				align-items: center;
				color: #999999;
				font-size: 24upx;

				.evaluateAllArrow-icon {
					width: 24upx;
					height: 24upx;
				}
			}
		}

		.shopEvaList {
			display: flex;
			padding: 30upx;
			flex-wrap: wrap;
			border-bottom: 20upx solid #EEEEEE;

			.shopEvaItem {
				padding: 0 14upx;
				height: 60upx;
				background: #ffe4cc;
				border-radius: 6upx;
				line-height: 60upx;
				text-align: center;
				font-size: 28upx;
				color: #666666;
				margin: 0 20upx 20upx 0;
			}
		}

		.storeEvaluate-box {
			background-color: #FFFFFF;
			margin-top: 20upx;

			.storeEvaluate {
				width: 690upx;
				padding: 20upx 0;
				border-bottom: 1upx solid #EDEDED;
			}

			.storeEvaluateTag-box {
				margin-top: 10upx;
				margin-left: 10upx;
				padding-bottom: 30upx;
				display: flex;
				flex-wrap: wrap;

				.storeEvaluateTag-text {
					background-color: #FFE4CC;
					border-radius: 6upx;
					padding: 16upx 14upx;
					color: #656565;
					margin-left: 20upx;
					margin-top: 20upx;
				}
			}
		}

		.inStore-box {
			background-color: #FFFFFF;
			margin-top: 20upx;
			padding: 20upx 30upx;

			.inStore-logo {
				width: 70upx;
				height: 70upx;
			}

			.inStore-but {
				border: 1upx solid #999999;
				border-radius: 22upx;
				width: 110upx;
				height: 44upx;
				line-height: 44upx;
				text-align: center;
				font-size: 24upx;
				color: #999999;
			}
		}

		.goodsDetails-box {
			background-color: #FFFFFF;
			margin-top: 20upx;
			padding: 20upx 30upx;

			.goodsDetails-title {
				display: flex;
				flex-direction: row;
				align-items: center;

				.goodsDetails-Line {
					width: 265upx;
					border-bottom: 1upx solid #EDEDED;
				}

				.goodsDetails-text {
					padding: 0 22upx;
				}
			}

			.goodsDetailsimg-box {}
		}

		.priceExplain-box {
			background-color: #FFFFFF;
			margin-top: 20upx;
			padding: 20upx 30upx;

			.priceExplain-title {
				display: flex;
				flex-direction: row;
				align-items: center;

				.priceExplain-Line {
					width: 265upx;
					border-bottom: 1upx solid #EDEDED;
				}

				.priceExplain-text {
					padding: 0 22upx;
				}
			}

			.priceExplain-dot {
				width: 9upx;
				height: 9upx;
				border: 1upx solid #FF7700;
				border-radius: 50%;
				background-color: #FF7700;
			}
		}

		.buygoods-box {
			position: fixed;
			bottom: 0upx;
			box-sizing: border-box;
			z-index: 999;

			.buygoodsBut-box {
				background-color: #FFFFFF;
				width: 750upx;
				padding: 20upx 32upx;
				box-shadow: 0upx 0upx 10upx 1upx #EDEDED;
				box-sizing: border-box;

				.store-icon {
					width: 48upx;
					height: 48upx;
				}

				.joinShopCartBut {
					width: 214upx;
					height: 80upx;
					border-radius: 40upx 0 0 40upx;
					background-color: #1C2229;
					color: #FFFEFE;
					font-size: 28upx;
					line-height: 80upx;
					text-align: center;
					margin-left: 30upx;
					box-sizing: border-box;
				}

				.buyNowBut {
					width: 214upx;
					height: 80upx;
					border-radius: 0 40upx 40upx 0;
					background-color: #00AA49;
					color: #FFFEFE;
					font-size: 28upx;
					line-height: 80upx;
					text-align: center;

				}

				.offShelf {
					background: #b7b7b7;
					border-radius: 50upx;
					width: 360upx;
					margin-left: 50upx;
					line-height: 80upx;
					height: 80upx;
					justify-content: center;
					color: #333333;
				}
			}
		}

		.returnTopService-box {
			position: fixed;
			bottom: 160upx;
			right: 30upx;

			.fs16 {
				font-size: 16upx;
			}

			.returnTop-box {
				width: 90upx;
				height: 90upx;
				border-radius: 50%;
				background-color: #FFFFFF;
				box-shadow: 0upx 0upx 5upx 3upx #999999;

				.returnTopImg {
					width: 36upx;
					height: 36upx;
				}
			}

			.serviceImg-box {
				width: 90upx;
				height: 90upx;
				border-radius: 50%;
				background-color: #FFFFFF;
				box-shadow: 0upx 0upx 5upx 3upx #999999;

				.serviceImg {
					width: 36upx;
					height: 36upx;
					display: block;
					background: url("../../static/images/serviceImg.png") no-repeat center center;
					background-size: contain;
				}
			}
		}

		.goosDetailshow-box {
			.detailImg-box {
				margin-top: 30upx;
				margin-left: 30upx;
				border-radius: 10upx;
				border-bottom: 1upx solid #EDEDED;
				padding-bottom: 20upx;
				width: 690upx;

				.detailImg {
					width: 180upx;
					height: 180upx;
				}
			}

			.color-box {
				padding: 30upx 30upx;
				border-bottom: 1upx solid #EDEDED;
				width: 690upx;

				.colorName-box {
					display: flex;
					flex-wrap: wrap;
					flex-direction: row;
					justify-content: flex-start;
					align-items: center;
					margin-top: 30upx;
					margin-left: -30upx;

					.colorName-on {
						background-color: #b6ffd6;
						color: #00AA49;
						margin-left: 30upx;
						padding: 10upx 32upx;
						border-radius: 28upx;
						border: 1upx solid #00AA49;
						font-size: 26upx;
						text-align: center;
						z-index: 1;
					}

					.colorName {
						background-color: #F5F5F5;
						margin-left: 30upx;
						padding: 10upx 32upx;
						border-radius: 28upx;
						font-size: 26upx;
						z-index: 2;
					}
				}

			}

			.modelNum-box {
				padding: 30upx 30upx;
				border-bottom: 1upx solid #EDEDED;
				width: 690upx;

				.modelNumName-box {
					display: flex;
					flex-wrap: wrap;
					flex-direction: row;
					justify-content: flex-start;
					align-items: center;
					margin-top: 30upx;
					margin-left: -30upx;

					.modelNumName-on {
						background-color: #FFE4D0;
						color: #FF7800;
						margin-left: 30upx;
						padding: 10upx 32upx;
						border-radius: 28upx;
						border: 1upx solid #FF7800;
						font-size: 26upx;
						text-align: center;
					}

					.modelNumName {
						background-color: #F5F5F5;
						margin-left: 30upx;
						padding: 10upx 32upx;
						border-radius: 28upx;
						font-size: 26upx;
					}
				}
			}

			.goodsNum-box {
				padding: 30upx 30upx;
				width: 690upx;
				padding-bottom: 268upx;

				.goodsNum {
					height: 50rpx;
					width: 180rpx;
					display: flex;
					flex-direction: row;
					justify-content: space-around;
					align-items: center;


					text {
						display: inline-block;
						width: 50upx;
						height: 50upx;
						// border: 1upx solid #999999;
						text-align: center;
						line-height: 50upx;
					}

					.subtract {
						border-right: 0upx;
					}

					.add {
						border-left: 0upx;
					}
				}
			}

			.bottom-line {
				border-bottom: 1upx solid #EDEDED;
			}

			.huabei-box {
				padding: 30upx 30upx;
				width: 690upx;

				.fenqi-box {
					margin-top: 15upx;
					width: 120%;

					.huabei-item {
						display: inline-block;
						background: #f3f3f3;
						padding: 16upx 24upx;
						margin: 5upx 10upx;
						border-radius: 15upx;
						text-align: center;
						font-size: 7upx;

						.huabei-period {
							display: block;
						}
					}

					.fenqi-on {
						border: 1px solid #EF7F93;
						color: #EF7F93;
					}

					.disabled {
						color: #cacaca;
					}
				}
			}

			.goosDetailbut-box {
				justify-content: center;

				.joinShopCartBut {
					width: 343upx;
					height: 80upx;
					border-radius: 40upx 0 0 40upx;
					background-color: #FFC300;
					color: #FFFEFE;
					font-size: 28upx;
					line-height: 80upx;
					text-align: center;
					margin-left: 30upx;
				}

				.buyNowBut {
					//加入购物车 确认购买按钮
					width: 343upx;
					height: 80upx;
					border-radius: 40upx;
					background-color: #00AA49;
					color: #FFFEFE;
					font-size: 28upx;
					line-height: 80upx;
					text-align: center;
				}
			}
		}

		.parameterShow-box {
			.parameter-title {
				width: 100%;
				text-align: center;
				padding-bottom: 36upx;
			}

			.parameter-modle {
				width: 690upx;
				padding-bottom: 36upx;
				font-size: 26upx;
			}

			.parameterTruebut-box {
				background-color: #FFFFFF;
				padding: 20upx 0;

				.parameterTruebut {
					width: 690upx;
					height: 80upx;
					background-image: linear-gradient(135deg, #FFA100 10%, #FF7911 100%);
					color: #FFFFFF;
					border-radius: 40upx;
					line-height: 80upx;
					text-align: center;
					font-size: 26upx;
				}
			}
		}

		.couponShow-box {

			.couponShow {
				z-index: 333;
				height: 1000upx;
				margin-top: 60rpx;

				.couponTitle-box {
					width: 100%;
				}

				.coupon-title-active {
					color: #FFFFFF;
					border-bottom: 2upx solid #FFFFFF;
					padding-bottom: 30upx;
				}

				.usableCoupon-content {
					padding: 30upx 0;

					.usableCoupon-box {
						width: 690upx;
						height: 140upx;
						border-radius: 10upx;
						background-color: #FFE9D8;

						.immediateUse-but {
							color: #FFFFFF;
							border-radius: 30upx;
							padding: 0 40upx;
							border-left: 3upx solid #EBD7C7;
							height: 140upx;
							border-radius: 60upx;
							line-height: 140upx;
							font-weight: bold;
						}
					}
				}
			}

		}

		.succeedShow-box {
			position: absolute;
			top: 220upx;
			left: 185upx;

			.succeedShow {
				background-color: #7F7F7F;
				width: 380upx;
				height: 280upx;
				border-radius: 10upx;
				opacity: 0.8;

				.couponSucceedImg {
					width: 200upx;
					height: 130upx;
				}
			}
		}
	}

	.activity-box {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
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

	// #ifdef MP-ALIPAY
	.title-box .close-btn {
		width: 30upx;
		height: 30upx;
		top: 10upx;
		right: 10upx;
	}

	// #endif

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
		color: #005500;
	}

	.label-lingqu {
		width: 100%;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
	}

	.coupon-item {
		width: 690upx;
		height: 200upx;
		border-radius: 10upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-top: 20upx;
		flex-shrink: 0;
		background-color: rgba(220, 220, 220, 0.5);

		// 左边
		.money-box-wai {
			width: 200upx;
			height: 200upx;
			box-sizing: border-box;
			display: flex;
			justify-content: center;
			align-items: center;

			.money-box {
				width: 180rpx;
				height: 140rpx;
				border-right: 10rpx rgba(147, 147, 147, 0.5) dotted;
				text-align: center;
				line-height: 130rpx;
				color: #005500;
				font-size: 30rpx;
				font-weight: 600;
			}
		}

		// 中间部分
		.info-box {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			color: #005500;
			font-size: 30rpx;
		}

		// 右边按钮
		.receive-btn-box {
			width: 100rpx;
			height: 200rpx;
			background: rgba(0, 170, 73, 1.0);
			box-shadow: 0px 0px 5upx 0px rgba(102, 102, 102, 0.35);
			border-bottom-right-radius: 10upx;
			border-top-right-radius: 10upx;
			display: flex;
			justify-content: center;
			align-items: center;

			.receive-btn {
				width: 60rpx;
				line-height: 40rpx;
				font-size: 28rpx;
				color: #FFFFFF;

				.received {
					background: #f1f1f1;
					color: #999;
				}
			}
		}
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
		z-index: 8888;
	}

	.item-image-box {
		width: 700upx;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.img-item {
		width: 223upx;
		height: 223upx;
		border-radius: 10upx;
		margin-right: 10upx;
		margin-top: 10upx;
	}

	.item-line {
		width: 690upx;
		height: 1px;
		background: rgba(238, 238, 238, 1);
		margin-top: 20upx;
	}

	.item-like-box {
		display: flex;
		flex-direction: row;
		width: 690upx;
		align-items: center;
		justify-content: space-between;
	}

	.like-box {
		display: flex;
		flex-direction: row;
		padding-top: 30upx;
		align-items: center;
		justify-content: flex-end;
		margin-right: 50upx;
	}

	.like-img {
		width: 36upx;
		height: 36upx;
	}

	.like-num {
		font-size: 28upx;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		margin-left: 30upx;
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

	.seckill-box {
		width: 100%;
		height: 138rpx;
		background-repeat: no-repeat;
		background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAu4AAACKCAYAAAD158+vAAAACXBIWXMAAAsTAAALEwEAmpwYAAA4JmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMwNjcgNzkuMTU3NzQ3LCAyMDE1LzAzLzMwLTIzOjQwOjQyICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNSAoV2luZG93cyk8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMjItMDEtMTFUMjI6MzA6NDIrMDg6MDA8L3htcDpDcmVhdGVEYXRlPgogICAgICAgICA8eG1wOk1vZGlmeURhdGU+MjAyMi0wMS0xMVQyMjozMzoyMyswODowMDwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDx4bXA6TWV0YWRhdGFEYXRlPjIwMjItMDEtMTFUMjI6MzM6MjMrMDg6MDA8L3htcDpNZXRhZGF0YURhdGU+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgICAgIDxwaG90b3Nob3A6Q29sb3JNb2RlPjM8L3Bob3Rvc2hvcDpDb2xvck1vZGU+CiAgICAgICAgIDx4bXBNTTpJbnN0YW5jZUlEPnhtcC5paWQ6NzA4Y2Q4OGUtNTdmNi1hMzRmLWI5NGItNDI5YjRkNGU0YjJjPC94bXBNTTpJbnN0YW5jZUlEPgogICAgICAgICA8eG1wTU06RG9jdW1lbnRJRD54bXAuZGlkOjcwOGNkODhlLTU3ZjYtYTM0Zi1iOTRiLTQyOWI0ZDRlNGIyYzwveG1wTU06RG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD54bXAuZGlkOjcwOGNkODhlLTU3ZjYtYTM0Zi1iOTRiLTQyOWI0ZDRlNGIyYzwveG1wTU06T3JpZ2luYWxEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06SGlzdG9yeT4KICAgICAgICAgICAgPHJkZjpTZXE+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPmNyZWF0ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDo3MDhjZDg4ZS01N2Y2LWEzNGYtYjk0Yi00MjliNGQ0ZTRiMmM8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMjItMDEtMTFUMjI6MzA6NDIrMDg6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1IChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgIDwvcmRmOlNlcT4KICAgICAgICAgPC94bXBNTTpIaXN0b3J5PgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpYUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOllSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT42NTUzNTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+NzUwPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjEzODwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+dWUp0gAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAACYklEQVR42uzWMQEAAAQAMMKJJ60A1HBsKZbTtQEAALyW4g4AAOIOAACIOwAAiDsAACDuAACAuAMAgLgDAADiDgAAiDsAAIg7AAAg7gAAIO4AAIC4AwAA4g4AAOIOAACIOwAAIO4AACDuAACAuAMAAOIOAADiDgAAiDsAAIg7AAAg7gAAgLgDAIC4AwAA4g4AAIg7AACIOwAAIO4AACDuAACAuAMAAOIOAADiDgAAiDsAACDuAAAg7gAAgLgDAADiDgAA4g4AAIg7AACIOwAAIO4AAIC4AwCAuAMAAOIOAACIOwAAiDsAACDuAAAg7gAAgLgDAADiDgAA4g4AAIg7AAAg7gAAIO4AAIC4AwAA4g4AAOIOAACIOwAAiDsAACDuAACAuAMAgLgDAADiDgAAiDsAAIg7AAAg7gAAIO4AAIC4AwAA4g4AAOIOAACIOwAAIO4AACDuAACAuAMAAOIOAADiDgAAiDsAAIg7AAAg7gAAgLgDAIC4AwAA4g4AAIg7AACIOwAAIO4AACDuAACAuAMAAOIOAADiDgAAiDsAACDuAAAg7gAAgLgDAADiDgAA4g4AAIg7AACIOwAAIO4AAIC4AwCAuAMAAOIOAACIOwAAiDsAACDuAAAg7gAAgLgDAADiDgAA4g4AAIg7AAAg7gAAIO4AAIC4AwAA4g4AAOIOAACIOwAAiDsAACDuAACAuAMAgLgDAADiDgAAiDsAAIg7AAAg7gAAIO4AAIC4AwAA4g4AAOIOAACIOwAAIO4AACDuAACAuAMAAOIOAADiDgAAiDsAAIg7AADwywEAAP//AwDX9H5CA0OGnQAAAABJRU5ErkJggg==');
		background-size: 100% 138rpx;

		.seckill-icon {
			width: 174rpx;
			height: 64rpx;
			background-size: contain;
		}

		.discount-icon {
			width: 224rpx;
			height: 64rpx;
			background-size: contain;
		}

		.spell-icon {
			width: 196rpx;
			height: 64rpx;
			background-size: contain;
		}

		.countdown {
			display: flex;
			align-items: flex-end;
			justify-content: center;
		}

		.countdown-box {
			padding: 0 8rpx;
			height: 48rpx;
			color: #F8282B;
			background-color: #FFFFFF;
			margin: 10rpx 10rpx;
		}
	}

	.goodsDiscount {
		.groupBuy {
			.groupBuyList {
				.groupBuyItem {
					padding: 0 30upx;
					height: 116upx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					border-bottom: 1upx solid #EEEEEE;

					.leftAvatar {
						display: flex;
						align-items: center;
						width: 50%;

						img {
							width: 72upx;
							height: 72upx;
							margin-right: 10upx;
							border-radius: 50%;
						}
					}

					.rightInfo {
						display: flex;
						align-items: center;
						width: 50%;

						.groupBuyTime {
							.needPeople {
								font-size: 26upx;
								color: #333333;
								margin-bottom: 10upx;

								b {
									color: #FF7800;
								}
							}

							.endDate {
								color: #666666;
							}
						}

						.groupBuyBtn {
							width: 140upx;
							height: 60upx;
							line-height: 60upx;
							background: linear-gradient(247deg, #F71622, #FE6F52);
							border: 1upx solid #FF736C;
							border-radius: 8upx;
							text-align: center;
							color: #FFFFFF;
						}
					}
				}
			}
		}
	}

	.popupDiscount {
		padding-bottom: 70upx;

		.popupDiscountTit {
			font-size: 36upx;
			color: #333333;
			height: 105upx;
			line-height: 105upx;
			text-align: center;
			border-bottom: 1upx solid #EEEEEE;
		}

		.groupBuy {
			padding-bottom: 80upx;

			.groupBuyList {
				.groupBuyItem1 {
					padding: 0 30upx;
					height: 116upx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					border-bottom: 1upx solid #EEEEEE;

					.leftAvatar {
						display: flex;
						align-items: center;

						img {
							width: 72upx;
							height: 72upx;
							margin-right: 10upx;
							border-radius: 50%;
						}

						.groupBuyTime {
							margin-right: 80upx;
							margin-bottom: 10upx;
							width: 320upx;

							.needPeople {
								font-size: 26upx;
								color: #666666;

								span {
									color: #333333;
									padding-right: 10upx;
								}
							}

							.endDate {
								color: #666666;
							}
						}
					}

					.rightInfo {
						display: flex;
						align-items: center;

						.groupBuyBtn {
							width: 140upx;
							height: 60upx;
							line-height: 60upx;
							background: linear-gradient(247deg, #F71622, #FE6F52);
							border: 1upx solid #FF736C;
							border-radius: 8upx;
							text-align: center;
							color: #FFFFFF;
						}
					}
				}
			}
		}
	}
</style>
