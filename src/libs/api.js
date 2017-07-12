import axios from "axios";
import { API_ROOT } from "../constants/";
import { cookie } from "./uitls";

// axios.defaults.withCredentials = true;

const _instance = () => {
	let js_session = cookie("js_session");

	if (process.env.NODE_ENV === "localhost") {
		js_session = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0OTk5MjY1MzYsImlzcyI6IjM0MjQ3MzkwLTY1ZjAtMTFlNy05YjRhLWRkNDViMTgxNWUyZSIsImlhdCI6MTQ5OTg0MDEzNn0.0b5DSlpE1gkki0v-WUVxfyariC2pmHDYaa-t22EuzEk";
	} else {
		// js_session = cookie("js_session");
	}
	if (js_session) {
		if (process.env.NODE_ENV === "development") { // eslint-disable-line
			return axios.create({
				timeout: 5000,
				headers: { "Authorization": `Bearer ${js_session}` }
			});
		}
		return axios.create({
			timeout: 5000,
			headers: { "Authorization": `Bearer ${js_session}` }
		});
	}
	return axios.create({
		timeout: 5000
	});
};
/**
 * 拦截
 * @param {Function} task 
 * @return {Promise}
 */
const __promiseTask = (task) => {
	return new Promise(function (resolve, reject) {
		task.then((res) => {
			/**
			 * res status AJAX 状态
			 * [200 success]
			 * []
			 * []
			 */
			if (res.status === 200) {
				/**
				 * res.data.code [API 返回数据状态]
				 */
				if (res.data && res.data.code === 200) {
					resolve(res.data);
				} else {
					reject(res);
				}
			} else {
				reject(res);
			}
		}, error => {
			reject(error);
		});
	});
};

/**
 * 用户登陆&&信息等
 */

export const weChatAuth = () => {
	let redirectUrl = location.href;
	return location.replace(API_ROOT.weChatAuth + "success=" + encodeURIComponent(redirectUrl) + "&failure=" + encodeURIComponent(redirectUrl));
};

export const getUserInfo = () => {
	return __promiseTask(_instance().get(API_ROOT.getUserInfo));
};

/**
 * 获取HOME页面 Banner列表
 */
export const getCommunityBanner = () => {
	return __promiseTask(_instance().get(API_ROOT.getCommunityBanner));
};

/**
 * 获取HOME页面 消息列表
 */
export const getIndexMessage = () => {
	return __promiseTask(_instance().get(API_ROOT.getIndexMessage));
};

/**
 * 获取HOME页面推送 大V 列表
 */
export const getIndexUserList = () => {
	return __promiseTask(_instance().get(API_ROOT.getIndexUserList));
};

/**
 * 获取消息详情
 */
export const getMessageInfo = () => {
	return __promiseTask(_instance().get(API_ROOT.getMessageInfo));
};

export const getSearch = () => {
	return __promiseTask(_instance().get(API_ROOT.getSearch));
};



export const getTags = (query) => {
	return __promiseTask(_instance().get(API_ROOT.getTags + query));
}

export const creatTag = (data) => {
	return __promiseTask(_instance().post(API_ROOT.createTag, data));
}


export const getHomePostList = (data) => {
	return __promiseTask(_instance().get(API_ROOT.getMessage, data));
}

export const getVenues = (query) => {
	return __promiseTask(_instance().get(`${API_ROOT.getVenues}${query}`));
}

export const postMessage = (data) => {
	return __promiseTask(_instance().post(API_ROOT.postMessage, data));
}

export const uploadFile = (data) => {
	return __promiseTask(_instance().post(API_ROOT.uploadFile, data));
}