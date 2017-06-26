let userApiDomain = null;
let userCoreApiDomain = null;
let commontCoreApiDomain = null;

if (process.env.NODE_ENV === "development") {
    // userApiDomain = "http://user.dev.ye-dian.com";
    // userCoreApiDomain = "http://userCore.dev.ye-dian.com";
    // commontCoreApiDomain = "http://feedback.dev.ye-dian.com";
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

export const API_ROOT = {
    weChatAuth: userApiDomain + "/auth/wechat?",
    getUserInfo: userApiDomain + "/internal/userInfo?_type=UserTimeLine",
    getTopicBanner: `http://${process.env.IP}:4003/`,
    getIndexMessage: `http://${process.env.IP}:4003/community`,
    getIndexUserList: `http://${process.env.IP}:4003/userlist`,
    getMessageInfo: `http://${process.env.IP}:4003/message`,
    getSearch: `http://${process.env.IP}:4003/search`
}

export const enums = {
    1: "test"
}