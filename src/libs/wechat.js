/**
 * 默认分享信息
 */
window.defaultShareData = {
  title: "生活不止于白天，用NIGHT+，点亮你的精彩夜生活。",
  desc: "一键关注，让最新、最潮、最有style的夜晚好去处变得触手可及。",
  titleTL: "生活不止于白天，用NIGHT+，点亮你的精彩夜生活。",
  link: location.href.replace("?fromTabBar=1", ""),
  imgUrl: `${window.location.origin}${require('../assets/images/logo.png')}`,
  success: function (res) {
    let action = res.errMsg.split(":")[0];
    if (window.shareData.successCallback) window.shareData.successCallback(action);
  }
};

window.shareData = Object.assign({}, window.defaultShareData);
window.shareDataTL = Object.assign({}, window.defaultShareData, { title: window.defaultShareData.titleTL });

/**
 * 安装微信SDK
 * @param {*} data 
 */
export const weChatSDKInstall = (data) => {
  if (data && data.appId) {
    window.wx.config({
      debug: false,
      appId: data.appId,
      timestamp: Number(data.timestamp),
      nonceStr: data.nonceStr,
      signature: data.signature,
      jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "onMenuShareQZone", "getLocation", "openLocation", "closeWindow", "chooseWXPay"]
    });

    window.wx.ready(function () {
      window.isWXReady = true;

      window.wx.onMenuShareTimeline(window.shareDataTL);
      window.wx.onMenuShareAppMessage(window.shareData);
      window.wx.onMenuShareQQ(window.shareData);
      window.wx.onMenuShareQZone(window.shareData);
    });

    window.wx.error(function (res) {
      window.isWXReady = false;
      window.wxErrorMsg = res.errMsg;
    });
  } else {
    alert(data.msg);
  }
}

export const setShare = (data) => {

  let successCallback = data.success;
  delete data.success;

  if (data.imgUrl && data.imgUrl.indexOf("http") !== 0) data.imgUrl = location.origin + data.imgUrl;
  // console.log(data);
  Object.assign(window.shareData, data, { successCallback });
  Object.assign(window.shareDataTL, data, { title: data.titleTL || data.title });
  
}

export const reSetShare = () => {
  Object.assign(window.shareData, window.defaultShareData, { successCallback: null });
  Object.assign(window.shareDataTL, window.defaultShareData, { title: window.defaultShareData.titleTL });
}