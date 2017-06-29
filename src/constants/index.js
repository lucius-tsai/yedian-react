let userApiDomain = null;
let userCoreApiDomain = null;
let commontCoreApiDomain = null;

if (process.env.NODE_ENV === "development") {
    userApiDomain = "http://user.staging.ye-dian.com";
    userCoreApiDomain = "http://userCore.dev.ye-dian.com";
    commontCoreApiDomain = "http://feedback.dev.ye-dian.com";
} else if (process.env.NODE_ENV === "staging") {
    userApiDomain = "http://user.staging.ye-dian.com";
    userCoreApiDomain = "http://userCore.dev.ye-dian.com";
    commontCoreApiDomain = "http://feedback.dev.ye-dian.com";
} else {
    userApiDomain = "http://user.staging.ye-dian.com";
    userCoreApiDomain = "http://userCore.dev.ye-dian.com";
    commontCoreApiDomain = "http://feedback.dev.ye-dian.com";
}

// localhost
// export const API_ROOT = {
//     weChatAuth: userApiDomain + "/auth/wechat?",
//     getUserInfo: userApiDomain + "/internal/userInfo?_type=UserTimeLine",
//     getTopicBanner: "/api/",
//     getIndexMessage: "/api/community",
//     getIndexUserList: "/api/userlist",
//     getMessageInfo: "/api/message",
//     getSearch: "/api/search"
// }

export const API_ROOT = {
    weChatAuth: userApiDomain + "/auth/wechat?",
    getUserInfo: userApiDomain + "/internal/userInfo?_type=UserTimeLine",
    getTopicBanner: "/app/mockData/banner.json",
    getIndexMessage: "/app/mockData/community.json",
    getIndexUserList: "/app/mockData/userlist.json",
    getMessageInfo: "/app/mockData/message.json",
    getSearch: "/app/mockData/search.json"
}

export const enums = {
    1: "test"
}