export default (store) => ({
	path: '/login',
	getComponent(nextState, cb) {
		require.ensure([], (require) => {
			const Login = require('./Login').default;
			cb(null, Login)
		})
	},
	onEnter(nextState, replace, wrappedNext) {
		console.log(nextState, replace, wrappedNext);
		wrappedNext();
	}
})