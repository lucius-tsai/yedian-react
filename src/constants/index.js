let userApiDomain = null; // user infromation core service
let userCoreApiDomain = null; // user buiness information core service
let commontCoreApiDomain = null; // feedback system
let venuesCoreApiDomain = null; // venues sysytem

if (process.env.NODE_ENV === "development") {
	userApiDomain = "http://user.dev.ye-dian.com";
	userCoreApiDomain = "http://userCore.dev.ye-dian.com";
	commontCoreApiDomain = "http://feedback.dev.ye-dian.com";
	venuesCoreApiDomain = "hhttp://venuescore.dev.ye-dian.com";
} else if (process.env.NODE_ENV === "staging") {
	userApiDomain = "http://user.staging.ye-dian.com";
	userCoreApiDomain = "http://userCore.staging.ye-dian.com";
	commontCoreApiDomain = "http://feedback.staging.ye-dian.com";
	venuesCoreApiDomain = "http://venuescore.staging.ye-dian.com";
} else {
	userApiDomain = "http://user.staging.ye-dian.com";
	userCoreApiDomain = "http://userCore.staging.ye-dian.com";
	commontCoreApiDomain = "http://feedback.staging.ye-dian.com";
	venuesCoreApiDomain = "http://venuescore.staging.ye-dian.com";
}

let __API_ROOT = {
	// user
	sendSMS: userApiDomain + "/auth/sms?_type=register",
	smsLogin: userApiDomain + "/auth/user/mobile/smslogin",
	weChatAuth: userApiDomain + "/auth/wechat?",
	getUserInfo: userApiDomain + "/internal/userInfo?_type=User",
	getUserInfoById: userApiDomain + "/internal/users/",
	getWeChatSDKSign: userApiDomain + "/auth/wechat/signature",

	getCommunityBanner: commontCoreApiDomain + "/community/banners",
	getBannerById: commontCoreApiDomain + "/community/banner",

	getIndexUserList: "/api/userlist",

	getTags: commontCoreApiDomain + "/community/tags",
	createTag: commontCoreApiDomain + "/community/tag",

	getVenues: venuesCoreApiDomain + "/public/graphql?",

	getMessage: commontCoreApiDomain + "/community/posts",
	getMessageInfo: commontCoreApiDomain + "/community/post",

	postMessage: commontCoreApiDomain + "/community/post",

	// uploadFile: "http://10.85.108.33:3007/public/file/upload",
	uploadFile: venuesCoreApiDomain + "/public/file/upload",

	getLikes: commontCoreApiDomain + "/users/likes",
	likeMessage: commontCoreApiDomain + "/users/likes",
	delLikeMessage: commontCoreApiDomain + "/users/likes/",

	getFavorites: commontCoreApiDomain + "/users/favorites",
	favoriteMessage: commontCoreApiDomain + "/users/favorites",
	delFavoriteMessage: commontCoreApiDomain + "/users/favorites/",

	getFollwers: commontCoreApiDomain + "/users/follows",

	getTopicById: commontCoreApiDomain + "/community/topic/",

	commentMessage: commontCoreApiDomain + "/users/comments",
	getComments: commontCoreApiDomain + "/users/comments/byTargetId"
}
if (process.env.NODE_ENV === "localhost") {
	// localhost
}

export const API_ROOT = __API_ROOT;
export const enums = {
	1: "test"
}