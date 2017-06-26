
import Home from './Home';
// import App from './App';
import Launch from './Launch';
import Login from './Login';

export const createRoutes = (store) => ({
    path: '/',
    IndexRoute: Launch,
    // component: App,
    Route: {
        path: '/home',
        component: Launch,
            childRoutes: [
            Login(),
            Home()
        ]
    }
});

export default createRoutes;