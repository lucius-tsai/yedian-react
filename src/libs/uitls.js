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