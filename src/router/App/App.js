import React, { Component } from 'react';
import {
  Redirect,
  Switch,
  Route,
  withRouter
} from 'react-router-dom';
import { connect } from 'react-redux';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

// routes
import Community from '../Community/';
import CommunityInfo from '../CommunityInfo/';
import Publish from '../Publish/';
import Search from '../Search/';
import Topic from '../Topic/';
import UserTimeLine from '../UserTimeLine/';
import Login from '../Login/';
import NotFound from '../NotFound/NotFound';

// components
import TabBar from '../../components/TabBar';
import Loading from '../../components/Loading';
import './app.scss';

// apis
import { getUserInfo, getFollwers } from '../../libs/api';
import { cookie, getLocation, deleteAllCookies } from "../../libs/uitls";
import { trackLogin, trackSetProfile, trackSetOnceProfile } from '../../libs/track';

// redux-actions
import { setLocation } from '../../store/actions/appStatus';
import {
  getVenuesFollowers,
  getVenuesFollowersFail,
  getUserFollowers,
  getUserFollowersFail,
  setUserFollowers,
  setVenuesFollowers
} from '../../store/actions/followers';
import { getUserInfoLoading, getUserInfoSuccess, getUserInfoFail } from '../../store/actions/userInfo';


class Bootstrap extends Component {
  constructor(props) {
    super(props);
    const token = cookie('js_session');

    this.state = {
      redirectPath: (!token && process.env.NODE_ENV !== "localhost") ? 'login' : 'community',
      loading: false,
      hideBar: false,
      router: null,
      lastRouter: null
    }
  }

  componentWillMount() {
  }

  shouldComponentUpdate(nextProps, nextState) {
    // const { userInfo, } = this.props;
    // console.log(this.props);
    return true;
  }

  componentWillReceiveProps(nextProps) {
    const { router } = this.state;
    this.setState({
      loading: nextProps.loading,
      hideBar: nextProps.hideBar,
      router: nextProps.router,
      lastRouter: router,
      userInfo: nextProps.userInfo
    });
  }

  getUserInfo() {
    const {
      getUserInfoLoading,
      getUserInfoSuccess,
      getUserInfoFail
    } = this.props;
    getUserInfoLoading();

    getUserInfo().then(res => {
      if (res.code === 200) {
        getUserInfoSuccess(res.data);
        /**
         * 登陆成功 && 获取用户基础信息 && 监测介入
         */
        let profile = {
          userId: res.data.id,
          $province: res.data.Wechat.province,
          $city: res.data.Wechat.city,
          $name: res.data.displayName,
          mobile: res.data.mobile
        };
        trackLogin(res.data.id);
        trackSetProfile(profile, res.data.level);
        trackSetOnceProfile({});

        localStorage.setItem('react_user', JSON.stringify(res.data));
      } else {
        getUserInfoFail()
      }
    }).catch(error => {
      getUserInfoFail()
      const msg = error.message;
      console.log(msg);
      if (/403/g.test(msg)) {
        deleteAllCookies();
        window.location.reload();
      }
    });
  }

  setLocation() {
    const {
      setLocation
    } = this.props;

    getLocation().then(res => {
      if (res && res.lat && res.lng) {
        setLocation(res);
      }
    }, error => {
      console.log(error)
    });
  }

  setVenuesFollowers() {
    const {
      setVenuesFollowers,
      getVenuesFollowers,
      getVenuesFollowersFail,
      followers
    } = this.props;
    if (followers && followers.venuesFollowers) {
      return false;
    }
    getVenuesFollowers();

    getFollwers({
      type: 'VENUES'
    }).then(res => {
      if (res.code === 200) {
        setVenuesFollowers(res.data);
      } else {
        getVenuesFollowersFail();
      }
    }, error => {
      getVenuesFollowersFail();
    });
  }

  setUserFollowers() {
    const {
      setUserFollowers,
      getUserFollowers,
      getUserFollowersFail,
      followers
    } = this.props;
    if (followers && followers.userFollowers) {
      return false;
    }
    getUserFollowers();
    getFollwers({
      type: 'USER'
    }).then(res => {
      if (res.code === 200) {
        setUserFollowers(res.data);
      } else {
        getUserFollowersFail();
      }
    }, error => {
      getUserFollowersFail();
    });
  }

  render() {
    let key = "app";
    const { loading, hideBar, router, lastRouter, userInfo, redirectPath } = this.state;
    const pathname = router && router.location.pathname;
    const lastPathname = lastRouter && lastRouter.location.pathname;
    const cellWidth = window.innerWidth > 414 ? 414 : window.innerWidth;

    switch (`${pathname}${lastPathname}`) {
      case `${BASENAME}search${BASENAME}publish`:
        key = "app-left-to-right";
        break;
      case `${BASENAME}publish${BASENAME}search`:
        key = "app-right-to-left";
        break;
      default:
        key = "app";
        break;
    }
    if (userInfo && userInfo.loading) {
      return (<Loading />)
    } else {
      return (
        <div>
          <Route render={({ location }) => (
            <div className={hideBar ? `${key} no-tab-bar` : key} style={{ width: `${cellWidth}px` }}>
              <Route exact path={BASENAME} render={() => (
                <Redirect to={`${BASENAME}${redirectPath}`} />
              )} />
              <Route exact path="/" render={() => (
                <Redirect to={`${BASENAME}${redirectPath}`} />
              )} />
              <TabBar hidden={hideBar} />
              <CSSTransitionGroup
                component='div'
                transitionName={key}
                transitionEnterTimeout={300}
                transitionLeaveTimeout={300}
              >
                <Switch key={location.key} location={location}>
                  <Route exact path={`${BASENAME}community`} component={Community} name="community" />
                  <Route exact path={`${BASENAME}message/:id`} component={CommunityInfo} name="message" />
                  <Route exact path={`${BASENAME}publish`} component={Publish} name="publish" />
                  <Route exact path={`${BASENAME}search`} component={Search} name="search" />
                  <Route exact path={`${BASENAME}topic/:id`} component={Topic} name="topic" />
                  <Route exact path={`${BASENAME}user/times/:id`} component={UserTimeLine} name="userTimeLine" />
                  <Route exact path={`${BASENAME}login`} component={Login} name="login" />
                  <Route path={`${BASENAME}*`} component={NotFound} name="notFound" />
                </Switch>
              </CSSTransitionGroup>
              {
                loading ? <Loading /> : ""
              }
            </div>
          )} />
        </div>
      )
    }
  }

  componentDidMount() {
    const {
      loading,
      userInfo,
      setLocation,
      setUserFollowers,
      setVenuesFollowers,
      history
    } = this.props;

    const token = cookie('js_session');
    if (token) {
      if (!userInfo.user) {
        this.getUserInfo();
        this.setLocation();
        this.setUserFollowers();
        this.setVenuesFollowers();
      }
    } else {
      history.push(`${BASENAME}login`, {
        redirectUri: window.location.pathname
      });
    }
  }
  componentDidUpdate() {
    /**
     * 检查基础数据是否已经加载
     */
    const { userInfo, followers, gps } = this.props;
    const token = cookie('js_session');
    if (token) {
     if (!(userInfo && userInfo.user && userInfo.user.id) && !userInfo.loading) {
        this.getUserInfo();
      }
      if (!(followers && followers.userFollowers) && !followers.loadingUserFollowers) {
        this.setUserFollowers();
      }
      if (!(followers && followers.venuesFollowers) && !followers.loadingVenuesFollowers) {
        this.setVenuesFollowers();
      }
    }
  }

  componentWillUnmount() {
  }
}

const mapStateToProps = state => {
  const { appStatus, router, userInfo, followers } = state;
  return {
    loading: appStatus.loading || false,
    hideBar: appStatus.hideBar || false,
    gps: appStatus.gps || null,
    userInfo,
    router,
    followers
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserInfoLoading: () => {
      dispatch(getUserInfoLoading())
    },
    getUserInfoSuccess: (cell) => {
      dispatch(getUserInfoSuccess(cell))
    },
    getUserInfoFail: (cell) => {
      dispatch(getUserInfoFail(cell));
    },
    setLocation: (cell) => {
      dispatch(setLocation(cell));
    },
    getUserFollowers: (cell) => {
      dispatch(getUserFollowers(cell));
    },
    getUserFollowersFail: (cell) => {
      dispatch(getUserFollowersFail(cell));
    },
    setUserFollowers: (cell) => {
      dispatch(setUserFollowers(cell));
    },
    getVenuesFollowers: (cell) => {
      dispatch(getVenuesFollowers(cell));
    },
    getVenuesFollowersFail: (cell) => {
      dispatch(getVenuesFollowersFail(cell));
    },
    setVenuesFollowers: (cell) => {
      dispatch(setVenuesFollowers(cell));
    }
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Bootstrap));