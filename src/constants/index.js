let userApiDomain = null;
let userCoreApiDomain = null;
let commontCoreApiDomain = null;
let venuesCoreApiDomain = null;

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

let __API_ROOT = null;

if (process.env.NODE_ENV === "localhost") {
	// localhost
	__API_ROOT = {
		weChatAuth: userApiDomain + "/auth/wechat?",
		getUserInfo: userApiDomain + "/internal/userInfo?_type=User",
		getUserInfoById: userApiDomain + "/internal/users/",
		getWeChatSDKSign: userApiDomain + "/auth/wechat/signature",

		getCommunityBanner: commontCoreApiDomain + "/community/banners",
		getIndexMessage: "/api/community",
		getIndexUserList: "/api/userlist",
		getMessageInfo: "/api/message",
		getSearch: "/api/search",

		getTags: commontCoreApiDomain + "/community/tags",
		createTag: commontCoreApiDomain + "/community/tag",

		getVenues: venuesCoreApiDomain + "/public/graphql?",

		getMessage: commontCoreApiDomain + "/community/posts",
		getMessageInfo: commontCoreApiDomain + "/community/post",

		postMessage: commontCoreApiDomain + "/community/post",
		uploadFile: venuesCoreApiDomain + "/public/file/upload",

		likeMessage: commontCoreApiDomain + "/users/likes",
		delLikeMessage: commontCoreApiDomain + "/users/likes/",
		favoriteMessage: commontCoreApiDomain + "/users/favorites",
		delFavoriteMessage: commontCoreApiDomain + "/users/favorites/",
		commentMessage: commontCoreApiDomain + "/users/comments"
	}
} else {
	__API_ROOT = {
		weChatAuth: userApiDomain + "/auth/wechat?",
		getUserInfo: userApiDomain + "/internal/userInfo?_type=User",
		getUserInfoById: userApiDomain + "/internal/users/",
		getWeChatSDKSign: userApiDomain + "/auth/wechat/signature",
		getCommunityBanner: "/app/mockData/banner.json",
		getIndexMessage: "/app/mockData/community.json",
		getIndexUserList: "/app/mockData/userlist.json",
		getMessageInfo: "/app/mockData/message.json",
		getSearch: "/app/mockData/search.json",
		getTags: commontCoreApiDomain + "/community/tags",
		createTag: commontCoreApiDomain + "/community/tag",
		getVenues: venuesCoreApiDomain + "/public/graphql?",
		getMessage: commontCoreApiDomain + "/community/posts",
		getMessageInfo: commontCoreApiDomain + "/community/post",
		postMessage: commontCoreApiDomain + "/community/post",
		uploadFile: venuesCoreApiDomain + "/public/file/upload",
		likeMessage: commontCoreApiDomain + "/users/likes",
		delLikeMessage: commontCoreApiDomain + "/users/likes/",
		favoriteMessage: commontCoreApiDomain + "/users/favorites",
		delFavoriteMessage: commontCoreApiDomain + "/users/favorites/",
		commentMessage: commontCoreApiDomain + "/users/comments"
	}
}
export const API_ROOT = __API_ROOT;
export const enums = {
	1: "test"
}