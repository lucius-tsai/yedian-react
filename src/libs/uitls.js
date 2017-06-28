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

// export const cacheAuth = () => {
//     if (!cookie("operator_js_session")) {
//         localStorage.removeItem("accountInfo-operator");
//         return false;
//     } else {
//         try {
//             let decoded = jwtDecode(cookie("operator_js_session"));
//             if (new Date() > new Date(decoded.exp * 1000)) {
//                 cookie("operator_js_session", "", { path: "/operator", expires: -1 });
//                 localStorage.removeItem("accountInfo-operator");
//                 return false;
//             }
//         } catch (err) {
//             cookie("operator_js_session", "", { path: "/operator", expires: -1 });
//             localStorage.removeItem("accountInfo-operator");
//             return false;
//         }
//     }
//     const local = localStorage.getItem("accountInfo-operator");
//     if (!local) {
//         return false;
//     }
//     try {
//         const accountInfo = JSON.parse(localStorage.getItem("accountInfo-operator"));
//         return accountInfo.id ? true : false;
//     } catch (error) {
//         return false;
//     }
// };