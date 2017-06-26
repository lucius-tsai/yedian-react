export default (store) => ({
    path: '/',
    name: 'home',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            const Home = require('./Home').default;
            cb(null, Home)
        })
    },
    onEnter(nextState, replace, wrappedNext) {
        wrappedNext();
    }
})