// const jwtDecode = require("jwt-decode");

/**
 * cookie
 * @param {*} name 
 * @param {*} value 
 * @param {*} options 
 */
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

/**
 * 获取 url search
 * @param {String} name 
 */
export const getQueryString = (name) => {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var rr = window.location.search.substr(1).match(reg);
	if (rr != null) {
		return unescape(rr[2]);
	}
	return null;
}

/**
 * 格式化日期
 * @param {String} format 
 * @param {Date} date 
 */
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

/**
 * 安装微信SDK
 * @param {*} data 
 */
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

/**
 * 获取经纬度
 * @return {Promise}
 */
export const getLocation = () => {
	const sessionData = sessionStorage.getItem('location');
	const cachedData = sessionData ? JSON.parse(sessionData) : null;
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

/**
 * 上传图片压缩处理
 * @param {*} files
 * @return {Promise}
 */
export const minSizeImage = (files) => {
	const p = [];
	for (let index = 0; index < files.length; index++) {
		const file = files[index];
		p.push(new Promise((resolve, reject) => {
			let reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onloadend = function (e) {
				const dataURL = this.result;
				let image = new Image();
				image.src = dataURL;
				image.onload = function () {
					let canvas = document.createElement('canvas');
					let ctxt = canvas.getContext('2d');

					ctxt.drawImage(image, 0, 0);

					const newFile = canvas.toDataURL('image/jpg', 0.5);
					resolve(newFile);
				}
			}
		}));
	}
	return Promise.all(p);
}