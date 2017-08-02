let userApiDomain = null; // user infromation core service
let userCoreApiDomain = null; // user buiness information core service
let commontCoreApiDomain = null; // feedback system
let venuesCoreApiDomain = null; // venues sysytem
let cmsCoreApiDomain = null; // CMS sysytem

if (process.env.NODE_ENV === "development") {
	userApiDomain = "//user.dev.ye-dian.com";
	userCoreApiDomain = "//userCore.dev.ye-dian.com";
	commontCoreApiDomain = "//feedback.dev.ye-dian.com";
	venuesCoreApiDomain = "//venuescore.dev.ye-dian.com";
	cmsCoreApiDomain = "//cmscore.dev.ye-dian.com";

} else if (process.env.NODE_ENV === "staging") {
	userApiDomain = "//user.staging.ye-dian.com";
	userCoreApiDomain = "//userCore.staging.ye-dian.com";
	commontCoreApiDomain = "//feedback.staging.ye-dian.com";
	venuesCoreApiDomain = "//venuescore.staging.ye-dian.com";
	cmsCoreApiDomain = "//cmscore.staging.ye-dian.com";
} else {
	userApiDomain = "//user.prod-v1.ye-dian.com";
	userCoreApiDomain = "//userCore.prod-v1.ye-dian.com";
	commontCoreApiDomain = "//feedback.prod-v1.ye-dian.com";
	venuesCoreApiDomain = "//venuescore.prod-v1.ye-dian.com";
	cmsCoreApiDomain = "//cmscore.prod-v1.ye-dian.com";
}

let __API_ROOT = {
	// 登录/注册 发短信验证码
	sendSMS: userApiDomain + "/auth/sms?_type=register",
	// 短信登录
	smsLogin: userApiDomain + "/auth/user/mobile/smslogin",
	// 微信授权登录
	weChatAuth: userApiDomain + "/auth/wechat?",
	// 获取用户信息
	getUserInfo: userApiDomain + "/internal/userInfo?_type=User",
	// 通过用户ID获取用户信息
	getUserInfoById: userApiDomain + "/internal/users/",
	// 注册微信SDK
	getWeChatSDKSign: userApiDomain + "/auth/wechat/signature",
	// 获取社区banner列表
	getCommunityBanner: cmsCoreApiDomain + "/public/graphql?",
	// 通过bannerID获取banner详情
	getBannerById: cmsCoreApiDomain + "/public/graphql?",
	// 
	getIndexUserList: "/api/userlist",
	// 获取标签列表
	getTags: commontCoreApiDomain + "/community/tags",
	// 创建标签
	createTag: commontCoreApiDomain + "/community/tag",
	// 获取商家详情
	getVenues: venuesCoreApiDomain + "/public/graphql?",
	// 获取po文列表
	getMessage: commontCoreApiDomain + "/community/posts",
	// 获取po文详情
	getMessageInfo: commontCoreApiDomain + "/community/post",
	// 发布新po文
	postMessage: commontCoreApiDomain + "/community/post",
	// 上传文件(图片)
	// uploadFile: "http://10.85.108.33:3007/public/file/upload",
	uploadFile: venuesCoreApiDomain + "/public/file/upload",

	/********************************************************************************** */
	/**
	 * Feedback 三要素 like favorite comment
	 */
	getLikes: commontCoreApiDomain + "/users/likes",
	likeMessage: commontCoreApiDomain + "/users/likes",
	delLikeMessage: commontCoreApiDomain + "/users/likes/",

	getFavorites: commontCoreApiDomain + "/users/favorites",
	favoriteMessage: commontCoreApiDomain + "/users/favorites",
	delFavoriteMessage: commontCoreApiDomain + "/users/favorites/",

	getFollwers: commontCoreApiDomain + "/users/follows",
	creatFollow: commontCoreApiDomain + "/users/follows",
	deleteFollow: commontCoreApiDomain + "/users/follows",
	/********************************************************************************** */

	deletePost: commontCoreApiDomain + "/community/post",
	infrom: commontCoreApiDomain + "/users/comment/inform",
	commentMessage: commontCoreApiDomain + "/users/comments",
	getComments: commontCoreApiDomain + "/users/comments/byTargetId",
	deleteComment: commontCoreApiDomain + "/users/comment",
	likeComment: commontCoreApiDomain + "/users/comments/like",
	deleteLikeComment: commontCoreApiDomain + "/users/comments/like",
	/**
	 * 
	 */
	getTopicById: commontCoreApiDomain + "/community/topic/",
}
if (process.env.NODE_ENV === "localhost") {
	// localhost
}

export const API_ROOT = __API_ROOT;
export const enums = {
	1: "test"
}