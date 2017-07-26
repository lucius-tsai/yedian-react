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
 * 清空所有cookie
 */
export const deleteAllCookies = () => {
	var cookies = document.cookie.split(";");
	for (var i = 0; i < cookies.length; i++) {
		var cookie = cookies[i];
		var eqPos = cookie.indexOf("=");
		var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
		document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
		document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
	}
}

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
 * 获取经纬度
 * @return {Promise}
 */
export const getLocation = () => {
	const sessionData = sessionStorage.getItem('location');
	const cachedData = sessionData ? JSON.parse(sessionData) : null;
	return new Promise((resolve, reject) => {
		if (cachedData) {
			resolve(cachedData, 'cache')
		} else if (typeof window.wx !== 'undefined' && window.isWXReady) {
			window.wx.ready(function () {
				window.wx.getLocation({
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
			console.log(`run navigator geolocation`);
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
	const p = [], MAX_HEIGHT = 500;
	for (let index = 0; index < files.length; index++) {
		const file = files[index];
		p.push(new Promise((resolve, reject) => {
			let reader = new FileReader();
			// console.log(reader, file);
			reader.readAsDataURL(file);
			reader.onloadend = function (e) {
				// console.log(this)
				const dataURL = this.result;
				let image = new Image();
				image.src = dataURL;
				image.onload = function () {
					console.log(image);
					let originalWidth = image.width, originalHeight = image.height;

					if (image.height > MAX_HEIGHT) {
						originalWidth = (MAX_HEIGHT / image.height) * originalWidth;
						originalHeight = MAX_HEIGHT;
					}
					let canvas = document.createElement('canvas');

					let ctxt = canvas.getContext('2d');
					ctxt.clearRect(0, 0, canvas.width, canvas.height);

					canvas.width = originalWidth;
					canvas.height = originalHeight;

					ctxt.drawImage(image, 0, 0, originalWidth, originalHeight);
					const minRate = (9 - Math.floor(file.size / 1024 / 100));
					const rate = minRate > 6 ? minRate * 0.1 : 0.6;
					console.log(rate);
					const newFile = canvas.toDataURL('image/jpeg', rate);
					resolve(newFile);
				}
			}
		}));
	}
	return Promise.all(p);
}

/**
 * 浏览器版本
 * @return {Object}
 */
export const os = (() => {
	var ua = navigator.userAgent,
		isWindowsPhone = /(?:Windows Phone)/.test(ua),
		isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
		isAndroid = /(?:Android)/.test(ua),
		isFireFox = /(?:Firefox)/.test(ua),
		isChrome = /(?:Chrome|CriOS)/.test(ua),
		isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
		isPhone = /(?:iPhone)/.test(ua) && !isTablet,
		isPc = !isPhone && !isAndroid && !isSymbian;
	return {
		isTablet: isTablet,
		isPhone: isPhone,
		isAndroid: isAndroid,
		isPc: isPc
	};
})();

/**
 * 浏览器通知
 * @param {Object} notice
 */
export const notification = (notice) => {
	const Notification = window.Notification || window.mozNotification || window.webkitNotification;
	if (!Notification) {
		return false;
	}
	Notification.requestPermission((status) => {
		//status默认值'default'等同于拒绝 'denied' 意味着用户不想要通知 'granted' 意味着用户同意启用通知
		if (status === "granted") {
			const notify = new Notification(
				notice.title,
				{
					dir: 'auto',
					lang: 'zh-CN',
					tag: notice.id, //实例化的notification的id
					icon: notice.icon, //通知的缩略图,//icon 支持ico、png、jpg、jpeg格式
					body: notice.msg //通知的具体内容
				}
			);
			notify.onclick = function () {
				//如果通知消息被点击,通知窗口将被激活
				window.focus();
			},
				notify.onerror = function () {
					console.log("HTML5桌面消息出错！！！");
				};
			notify.onshow = function () {
				setTimeout(function () {
					notify.close();
				}, 2000)
			};
			notify.onclose = function () {
				console.log("HTML5桌面消息关闭！！！");
			};
		}
	});
}