// 开发环境
const DOMAIN_PREFIX = 'http://192.168.0.31:9007';
// 线上环境
  // const DOMAIN_PREFIX = 'https://zpmxcx.ylbtl.cn/api';
// #ifndef H5
  const WX_API_BASE = DOMAIN_PREFIX // app
// const WX_API_BASE = 'http://3j073r3905.qicp.vip:29544'
// #endif

// #ifdef H5
// const WX_API_BASE = "http://192.168.0.10:9007"                  
   const WX_API_BASE = "https://zpmxcx.ylbtl.cn/api"
   const TERMINAL = 1
// #endif

// // #ifdef APP-PLUS || APP-NVUE
// 	const TERMINAL = 3
// // #endif

// #ifdef APP-PLUS || APP-NVUE
   const TERMINAL = 1
// #endif

// #ifdef MP
	const TERMINAL = 1
// #endif

module.exports = {
	terminal: TERMINAL, // 画布设备 1 小程序，2 H5，3 App 4 电脑
	SettledMerchantPrefix: DOMAIN_PREFIX + '/settled-merchant',	//商家入驻链接
	shareLink: DOMAIN_PREFIX, // 分享地址
	//登录注册
	Verify:      	 	WX_API_BASE + '/app/getCode',        	//  获取短信验证码
	Login:      	 	WX_API_BASE + '/app/login',        				//  手机号验证码登录、注册
	WxLogin:			WX_API_BASE + '/app/wxLogin',			//  微信登录
	AlipayLogin:		WX_API_BASE + '/app/alipayLogin',			//  支付宝登录
	GetSessionKey:		WX_API_BASE + '/app/getSessionKey',			//  获取微信手机号绑定
	SetWxPhone:			WX_API_BASE + '/app/setWxPhone',			//  获取微信手机号绑定
	UpdateWxPhone:		WX_API_BASE + '/app/updateWxPhone',			//  获取微信手机号绑定
	UpdateAliPhone:		WX_API_BASE + '/app/updateAliPhone',		//	获取支付宝小程序手机号绑定
	WxAppLogin:			WX_API_BASE + '/app/wxAppLogin',			// APP微信登录
	
	//分类
	FindCategoryListByDepth:	WX_API_BASE + '/classify/getFirstClassify',  //  查询N级类目和查询子级类目
	
	FindShopCategory:WX_API_BASE+'/shop/getShopClassify',//查询商家分类
	GetProductByGroup:WX_API_BASE+'/product/getGroupSortProduct',//根据分组查询商品

	//商品相关接口
	GetClaasifyProducts :         	WX_API_BASE + '/classify/getClaasifyProducts',          //  商品分类到商品列表
	SearchHistory :         		WX_API_BASE + '/app/getHistory',                 		//  查询最近的N条历史记录
	GgetSearchProducts :         	WX_API_BASE + '/app/getSearchProducts',                 //  商品搜索查询
	DeleteSearch :         			WX_API_BASE + '/app/deleteSearch',                     	//  删除搜索记录
	Getindexdata :         			WX_API_BASE + '/app/index',                     		//  首页数据查询
	GetremenList :					WX_API_BASE + '/product/getRandomSortProduct',		//  获取热门推荐

	QueryProductDetail :    WX_API_BASE + '/product/getById',               //  查询商品详情
	QueryProductSku:     	WX_API_BASE + '/product/getProducts',               //  查询商品sku详情
	getCouponProducts:     	WX_API_BASE + '/coupon/getCouponProducts',               //  优惠券商品列表查询


	QueryMemberAddres :WX_API_BASE + '/receive/getAll',    	//  查询用户所有收货地址
	AddresAdd :        WX_API_BASE + '/receive/save',                   	//  保存收货地址
	AddresDelete :     WX_API_BASE + '/receive/delete',                	//  删除收货地址
	AddresUpdate :     WX_API_BASE + '/receive/update',                	//  更新收货地址
	receiveGetInfo :     WX_API_BASE + '/receive/getById',                	//  修改收货地址查询

	// 评价
	Comment:                    WX_API_BASE + '/order/addComment',                              //  评价
	AdditionalComment:          WX_API_BASE + '/order/addToComment',                    //  追评接口
	MyCommentList:              WX_API_BASE + '/comment/getAll',                 //  查看我的评论列表
	LikeOrUnLikeComment:        WX_API_BASE + '/comment/like',                  //  点赞或取消点赞某个评论


	//我的
	GetDistributor :    WX_API_BASE + '/distributor/getDistributor',         //  我的账户信息查询
	FindCouponList:    WX_API_BASE + '/coupon/getCoupons',         //  我的卡券列表查询
	GetCouponsByshopId:WX_API_BASE+'/coupon/getCouponsByshopId', //获取我的优惠券
	MemberAccountWithdraw:		WX_API_BASE + '/distributor/save',         //  提现申请
	GetUser:		WX_API_BASE + '/user/getUser',         //  个人系信息查询


	// 店铺服务
	GetStore:          WX_API_BASE + '/shop/getShopProducts',              //  根据id查询店铺
	GetStoreShopClassify:          WX_API_BASE + '/shop/getShopClassify',              //  查询店铺分类
	GetShopBanner:          WX_API_BASE + '/shop/getShopBanner',              //  查询店铺banner
	getShopIndex: WX_API_BASE + '/shop/getIndex', // 查询店铺首页
	AddBusinessBuyerUser: WX_API_BASE + '/shop/addBusinessBuyerUser', // 成为商家的客户
	GetStoreNew: WX_API_BASE + '/shop/homePage',  //扫码进入商家，或者默认商家	
	
	

	//用户银行卡相关接口
	QueryBankcardList		:WX_API_BASE + '/bank/getAll',           //  查询用户所有银行卡
	SaveBankcard			:WX_API_BASE + '/bank/save',                   			//  添加银行卡
	UpdateBankcard			:WX_API_BASE + '/bank/update',                   			//  修改银行卡
	DelMemberBankcard		:WX_API_BASE + '/bank/delete',             //  删除用户银行卡
	GetByIdBankcard		:WX_API_BASE + '/bank/getById',             //  根据银行卡ID查询信息

	//  订单相关接口
	FindOrderList :    WX_API_BASE + '/order/getAll',         //  查询订单列表
	Settlement:     WX_API_BASE + '/order/getSettlement',         //  结算查询
	PlaceOrder:     WX_API_BASE + '/order/submit',         //  提交订单
	GetOrderDetail:     WX_API_BASE + '/order/getById',         //  订单详情查询
	CancelOrder:     WX_API_BASE + '/order/cancel',         //  取消订单
	DelOrder:     WX_API_BASE + '/order/delete',         //  删除订单
	ShippingTrace:     WX_API_BASE + '/order/getDilevery',         //  物流信息查询
	payOrder:     WX_API_BASE + '/order/pay',         //  支付成功业务处理接口
	gotoPay:     WX_API_BASE + '/order/gotoPay',         //  小程序支付
	gotoAppPay:     WX_API_BASE + '/order/gotoAppPay',         //  APP立即支付
	gotoH5Pay:     WX_API_BASE + '/order/gotoH5Pay',         //  H5支付
	ConfirmReceive:     WX_API_BASE + '/order/confirm',         //  确认收货
	Orderrefund:     WX_API_BASE + '/order/refund',         //  申请退款
	ReasonEnums:     WX_API_BASE + '/after/getReasonSelect',         //  选择退款原因查询
	ApplyReturnMoney:     WX_API_BASE + '/after/submit',         //  申请售后
	GetHuabeiConfig: WX_API_BASE + '/order/getHuabeiConfig', //查询花呗手续费配置

	//购物车
	ShoppingaddCart: 		WX_API_BASE + '/cart/addCart',         //  加入购物车
	ShoppingCart: 		WX_API_BASE + '/cart/getCart',         //  购物车列表
	UpdateNumberCart: 		WX_API_BASE + '/cart/updateNumber',         //  修改购物车商品数量
	DeleteCart: 		WX_API_BASE + '/cart/delete',         //  删除购物车商品
	SelectedCart: 		WX_API_BASE + '/cart/selected',         //  选中商品

	//优惠券
	ReceiveCoupon: 		WX_API_BASE + '/coupon/takeCoupon',         //  领取优惠券

	//分销中心
	FindSaleStoreList1: 		WX_API_BASE + '/distributor/getDistributorAllByShopId',         //  门店信息查询列表新的
	FindSaleStoreList: 		WX_API_BASE + '/distributor/getDistributorAll',         //  分销中心列表查询
	QuerySalesMainInfo: 		WX_API_BASE + '/distributor/getShopDistributor',         //  店铺分销数据查询
	FindSalesOrderPage: 		WX_API_BASE + '/distributor/getReward',         //  累计奖励查询
	GetNotReward: 		WX_API_BASE + '/distributor/getNotReward',         //  累计未结算奖励查询
	FindSalesCustomerList: 		WX_API_BASE + '/distributor/getBuyers',         //  累计客户查询
	FindSubordinateSalesList: 		WX_API_BASE + '/distributor/getDistributors',         //  累计分销员查询
	FindSalesPromConfig: 		WX_API_BASE + '/distributor/getShopExtension',         //  店铺推广数据查询
	StoreProductList: 		WX_API_BASE + '/distributor/getExtensionProduct',         //  推广商品查询
	FindMySalesPage: 		WX_API_BASE + '/distributor/getDistributorOrder',         //  分销订单查询
	
	HasApply: 		WX_API_BASE + '/distributor/check',         //  验证当前客户是否为分销员
	BindSalesCustomer: 		WX_API_BASE + '/distributor/bind',         //  绑定关系
	getSharePic: 		WX_API_BASE + '/product/getSharePic',         //  分享
	shopGetSharePic: 		WX_API_BASE + '/shop/getSharePic',         //  推广店铺

	//售后
	FindReturnList: 		WX_API_BASE + '/after/getAll',         //  售后列表查询
	CancelRefund: 		WX_API_BASE + '/after/returnRefund',         //  撤销退款
	ReturnDetail: 		WX_API_BASE + '/after/getById',         //  售后详情查询
	CancelReturnGoods:  		WX_API_BASE + '/after/returnGoods',         //  撤销退货
	ShippingCompany:  		WX_API_BASE + '/order/getExpressSelect',         //  选择快递公司查询
	SendReturnGoods:  		WX_API_BASE + '/order/returnExpress',         //  填写退货物流单
	
	//申请分销员
	Apply:  		WX_API_BASE + '/distributor/addDistributor',         // 申请分销员
	
	// 画布模块
	getClassify: WX_API_BASE + '/canvas/getClassify', // 查询分类层级
	getProducts: WX_API_BASE + '/canvas/getProducts', // 选择商品查询
	getCanvas: WX_API_BASE + '/canvas/getCanvas', // 读取画布
	getShops: WX_API_BASE + '/canvas/getShops', // 选择店铺查询
	getCoupons: WX_API_BASE + '/canvas/getCoupons', // 优惠券查询
	takeCoupon: WX_API_BASE + '/coupon/takeCoupon' ,// 领取优惠券
	getShopCoupons: WX_API_BASE + '/canvas/getShopCoupons', // 优惠券查询
	selectCanvasCustomList: WX_API_BASE + '/canvas/selectCanvasCustomList', // 自定义页面查询
	getSeckills: WX_API_BASE + `/renovation/getSeckills`, // 秒杀活动
	getGroupWorks: WX_API_BASE + `/renovation/getGroupWorks`, // 拼团专区
	getDiscounts:WX_API_BASE + `/renovation/getDiscounts`, // 限时折扣

	//服务协议
	Query:		 WX_API_BASE + '/dict/getByName', // 查询分类层级

	DeleteAllSearch:	 WX_API_BASE + '/product/deleteAllSearch', // 清空历史搜索记录

	//消息
	getMessage:		 		 WX_API_BASE + '/notice/getAll',//消息列表查询
	getMessageDateils:		 WX_API_BASE + '/notice/getById',//消息详情
	getNotice:		 WX_API_BASE + '/notice/getGongGaoAll',//公告

	//我的收藏
	getProductCollect:		 WX_API_BASE + '/collect/getAllProduct',//收藏商品查询
	getStoreCollect:		 WX_API_BASE + '/collect/getAllShop',//收藏店铺查询
	cancelCollect:		 	 WX_API_BASE + '/collect/cancel',//取消收藏
	collect:		 		 WX_API_BASE + '/collect/collect',//收藏商品、店铺
	deleteCollect:		 		 WX_API_BASE + '/collect/delete',//批量删除收藏商品、店铺

	//秒杀专区
	addAnswer:		 		 WX_API_BASE + '/seckill/addAnswer',//回答
	addProblem:		 		 WX_API_BASE + '/seckill/addProblem',//提问
	getSeckillList:		     WX_API_BASE + '/seckill/getIndex',//秒杀专区首页数据查询
	getProblems:		 		 WX_API_BASE + '/seckill/getProblems',//商品问答数据查询
	getProblemDetail:		 		 WX_API_BASE + '/seckill/getProblemDetail',//问答详情查询
	//拼团专区
	getGroupSettlement:		 		 WX_API_BASE + '/work/getSettlement',//拼团单结算查询
	getGroupBuyList:		 		 WX_API_BASE + '/work/getIndex',//拼团专区首页数据查询
	getInviteSpell:		 		 WX_API_BASE + '/work/getInvite',//邀请好友拼单查询

	//限时折扣
	getDiscountList:    		     WX_API_BASE + '/discount/getIndex',//专区首页数据查询

	//浏览足迹
	getFootprintList:    		     WX_API_BASE + '/footprint/getAll',//我的足迹查询
	deleteFootprint:    		     WX_API_BASE + '/footprint/delete',//删除足迹

	//我的问答
	getProblemList:    		     WX_API_BASE + '/seckill/getProblem',//我的提问
	getAnswerList:    		     WX_API_BASE + '/seckill/getAnswer',//我的回答
	deleteProblem:    		     WX_API_BASE + '/seckill/deleteProblem',//批量删除提问
	deleteAnswer:    		     WX_API_BASE + '/seckill/deleteAnswer',//批量删除回答

	//分享
	getShare:    		     WX_API_BASE + '/work/getShare',//获取二维码和小程序码
	platform: 				 WX_API_BASE + '/after/platform', // 申请平台介入
	UploadUrl:				 WX_API_BASE + '/file/upload', // 申请平台介入
	
	// vita
	
	personalCheck:  WX_API_BASE + '/check/personalCheck', // 入驻申请
	
	getUserShop: WX_API_BASE +'/footprint/getUserShop',  //浏览历史记录
	
	GetAlwaysIndex:     WX_API_BASE + '/shop/getAlwaysIndex', //常购店铺查询  
	
	applyMember:   WX_API_BASE + '/distributor/applyVip',   //申请会员
	
	getSlideshow : WX_API_BASE + '/shop_banner/getShopBanner',  //获取所有的轮播图
	
	getVideoList : WX_API_BASE + '/shop_banner/getShopVideo',  //获取所有的视频轮播图
	
	getCouponList  :WX_API_BASE + '/coupon/getCouponList' ,  //获取所有的卡券列表
	
	getUserAll : WX_API_BASE + '/app/get_count',  //获取卡券,积分,余额
	
	isShow : WX_API_BASE + '/shop/concealSwitch', //返回0或者1,0就隐藏
	
	getIntegralGoods: WX_API_BASE + '/point_product/getAll', //获取积分商品列表
	
	getGoodsXiang: WX_API_BASE + '/point_product/getById', //获取积分商品列表
	
	duihuanGoods: WX_API_BASE + '/point_product/exchange',  //兑换商品
	
	getRecordList: WX_API_BASE + '/point_detail/getPointAll', //积分明细
	
	getYuList: WX_API_BASE + '/user/getMyBalance', //余额明细
	
	conversionRecord: WX_API_BASE + '/point_exchange/getAll', //积分兑换记录
	
	duihuanwuliu: WX_API_BASE + '/integral_exchange/save', //物流积分兑换
	
	lijifukuan: WX_API_BASE + '/order/obligationPay', //待付款订单的立即付款
	
	integralReceiving: WX_API_BASE + '/point_product/confirm_receipt', //积分商品确认收货
	
	getDefault: WX_API_BASE + '/receive/getDefault', //获取默认地址
	
	getOrderCount: WX_API_BASE + '/order/getOrderCount', //获取订单数量
	
	applyCancel: WX_API_BASE + '/order/applyCancel', //取消订单
	
	getApplyCancel: WX_API_BASE + '/order/getApplyCancel', //根据订单id查询取消详情
	
	getaddressjxs: WX_API_BASE + '/user/getJingxsAddress',  // 获取经销商地点
	
	statuslist: WX_API_BASE + '/distributor/returnVip',  // 获取申请会员信息
	
	getdistributorId: WX_API_BASE + '/distributor/getDistributorId',  // 获取分销会员id
	
	applymemberApp: WX_API_BASE + '/distributor/applyDistributor',  // 申请分销会员
	
	getfxdetail: WX_API_BASE + '/distributor/returnDistributor',  // 获取分销会员详情

	GetAlwayssumdj: WX_API_BASE + '/app/addvisit',// 获取用户点击次数
	
	getzjaddress: WX_API_BASE + '/user/getNearJingxsAddress',// 获取
	
	getorderaddress: WX_API_BASE + '/distributor/getShopOrder',// 线下地址
	
	fzphone: WX_API_BASE + '/shop/getShopUser',// 获取门店负责人电话
	
	FindMySalesPageing: WX_API_BASE + '/distributor/getDistributorOrdering',// 在途订单信息
	
}
