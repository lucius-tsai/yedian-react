
const getHostName = (url) => {
	if (window.sa && window.sa._) {
		const __getHostName = window.sa._.url;
		return __getHostName("hostname", url);
	}
}

/**
 * 
 * @param {*} name 
 * @param {*} props 
 */
export const track = (name, props) => {
	if (!window.sa || !window.sa._ || !window.sa._.info) {
		return false;
	}
	const __trak = window.sa.track;
	const __trakCampaignParams = window.sa._.info.campaignParams;
	const __trakExtend = window.sa._.extend;

	try {
		const utms = __trakCampaignParams();
		__trak(name, __trakExtend(props, utms));

	} catch (error) {
		console.log(error);
	}
}

export const trackPageView = (props) => {
	let referrer = "";
	let referrer_host = "";

	if (location.referrer) {
		referrer = location.referrer;
		referrer_host = getHostName(location.referrer)
	}

	const current = {
		$title: document.title,
		pageName: props.pageName,
		$referrer: referrer,
		$referrer_host: referrer_host,
		$url: location.href,
		$url_path: location.path
	};

	track('$pageview', current);
}

export const trackPageLeave = (props) => {
	let referrer = "";
	let referrer_host = "";

	if (location.referrer) {
		referrer = location.referrer;
		referrer_host = getHostName(location.referrer)
	}

	const current = {
		$title: document.title,
		pageName: props.pageName,
		$referrer: referrer,
		$referrer_host: referrer_host,
		$url: location.href,
		$url_path: location.path,
		pageStayTime: props.pageStayTime
	};

	track('pageLeave', current);
}

export const trackSetProfile = (profile, level) => {
	if (!window.sa || !window.sa._ || !window.sa._.info) {
		return false;
	}
	const __setProfile = window.sa.setProfile;
	const __trakExtend = window.sa._.extend;
	const __getHostName = window.sa._.url;

	try {
		/**
		 * level [0: 首次进入, 1: 非首次进入]
		 */
		if (level === 0) {
			__setProfile(__trakExtend(profile, {
				$first_visit_time: new Date(),
				$first_referrer: document.referrer,
				$first_referrer_host: __getHostName("hostname", document.referrer)
			}));
			Vue.track("new_user", profile);
		} else {
			__setProfile(profile);
		}
	} catch (error) {
		console.log(error);
	}
}

export const trackSetOnceProfile = (profile) => {
	if (!window.sa || !window.sa._ || !window.sa._.info) {
		return false;
	}
	const __setOnceProfile = window.sa.setOnceProfile;
	const __trakExtend = window.sa._.extend;
	const __trakCampaignParams = window.sa._.info.campaignParams;

	try {
		const utms = __trakCampaignParams();
		__setOnceProfile(__trakExtend(profile, utms));

	} catch (error) {
		console.log(error);
	}
}

export const trackLogin = (id) => {
	if (window.sa) {
		const __login = window.sa.login;
		try {
			__login(id);
		} catch (error) {
			console.log(error);
		}
	}
}