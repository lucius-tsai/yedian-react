// const jwtDecode = require("jwt-decode");
export const cookie = (name, value, options) => {
	if (typeof value != "undefined") {
		options = options || {};
		if (value === null) {
			value = "";
			options = Object.assign({}, options);
			options.expires = -1;
		}
		var expires = "";
		if (options.expires && (typeof options.expires == "number" || options.expires.toUTCString)) {
			var date;
			if (typeof options.expires == "number") {
				date = new Date();
				date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
			} else {
				date = options.expires;
			}
			expires = "; expires=" + date.toUTCString();
		}
		var path = options.path ? "; path=" + (options.path) : "";
		var domain = options.domain ? "; domain=" + (options.domain) : "";
		var secure = options.secure ? "; secure" : "";
		document.cookie = [name, "=", encodeURIComponent(value), expires, path, domain, secure].join("");
	} else {
		var cookieValue = null;
		if (document.cookie && document.cookie != "") {
			var cookies = document.cookie.split(";");
			for (var i = 0; i < cookies.length; i++) {
				var cookie = cookies[i].replace(/(^\s*)|(\s*$)/g, "");
				if (cookie.substring(0, name.length + 1) == (name + "=")) {
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					break;
				}
			}
		}
		return cookieValue;
	}
};


export const getQueryString = (name) => {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var rr = window.location.search.substr(1).match(reg);
	if (rr != null) {
		return unescape(rr[2]);
	}
	return null;
}

export const parseDate = (format, date) => {
	if (!(date instanceof Date)) return;
	var o = {
		"M+": date.getMonth() + 1,
		"d+": date.getDate(),
		"h+": date.getHours(),
		"m+": date.getMinutes(),
		"s+": date.getSeconds(),
		"q+": Math.floor((date.getMonth() + 3) / 3),
		"S": date.getMilliseconds()
	};
	if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
}

export const weChatSDKInstall = (data) => {
	if (data && data.appId) {
		wx.config({
			debug: false,
			appId: data.appId,
			timestamp: Number(data.timestamp),
			nonceStr: data.nonceStr,
			signature: data.signature,
			jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "onMenuShareQZone", "getLocation", "openLocation", "closeWindow", "chooseWXPay"]
		});

		wx.ready(function () {
			window.isWXReady = true;

			wx.onMenuShareTimeline(window.shareDataTL);
			wx.onMenuShareAppMessage(window.shareData);
			wx.onMenuShareQQ(window.shareData);
			wx.onMenuShareQZone(window.shareData);
		});

		wx.error(function (res) {
			window.isWXReady = false;
			window.wxErrorMsg = res.errMsg;
		});
	} else {
		alert(data.msg);
	}
}

export const getLocation = () => {
	const sessionData = sessionStorage.getItem('location');
	const	cachedData = sessionData ? JSON.parse(sessionData) : null;
	return new Promise((resolve, reject) => {
		if (cachedData) {
			resolve(cachedData, 'cache')
		} else if (typeof wx !== 'undefined' && window.isWXReady) {
			wx.ready(function () {
				wx.getLocation({
					type: 'gcj02',
					success: function (res) {
						resolve({
							lat: res.latitude,
							lng: res.longitude
						}, 'sdk')
					},
					fail: reject(new Error(), 'sdk'),
					cancel: reject(new Error(), 'sdk')
				});
			});
		} else if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function ({ coords }) {
				resolve({
					lat: coords.latitude,
					lng: coords.longitude
				}, 'geolocation');
			}, err => {
				reject(err, 'geolocation');
			}, {
					enableHighAccuracy: false,
					timeout: 5e3,
					maximumAge: 10e3
				});
		} else {
			reject(new Error(), 'null');
		}
	})
}