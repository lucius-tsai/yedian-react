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
import FeedBack from '../FeedBack/';
import Comment from '../Comment';
import NotFound from '../NotFound/';

// components
import TabBar from '../../components/TabBar';
import Loading from '../../components/Loading';

// apis
import { getUserInfo, getFollwers } from '../../libs/api';
import { cookie, getLocation, deleteAllCookies } from "../../libs/uitls";
import { trackLogin, trackSetProfile, trackSetOnceProfile } from '../../libs/track';

// redux-actions
import {
  setLocation,
  showScrollLoading
} from '../../store/actions/appStatus';
import {
  getVenuesFollowers,
  getVenuesFollowersFail,
  getUserFollowers,
  getUserFollowersFail,
  setUserFollowers,
  setVenuesFollowers
} from '../../store/actions/followers';
import {
  getUserInfoLoading,
  getUserInfoSuccess,
  getUserInfoFail
} from '../../store/actions/userInfo';

import './app.css';
import "../../assets/scss/animate.css";

class Bootstrap extends Component {
  constructor(props) {
    super(props);
    const token = cookie('js_session');
    // console.log(location.pathname);
    this.state = {
      redirectPath: `${BASENAME}community`,
      loading: false,
      hideBar: true,
      router: null,
      lastRouter: null
    }

    this.pointY = null;
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentWillMount() {
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   // const { userInfo, } = this.props;
  //   // console.log(this.props);
  //   // return true;
  // }

  componentWillUpdate() {
    if (window.location.pathname === `${BASENAME}login`) {
      // this.setState({
      //   hideBar: true
      // });
    }
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

  handleScroll(e) {
    const self = this;
    const { showScrollLoading } = this.props;
    const documentHeight = document.body.clientHeight;
    const scrollHeight = window.scrollY;
    const distance = documentHeight - scrollHeight;
    if (distance < 700 && !this.props.scrollLoading && self.pointY < scrollHeight) {
      showScrollLoading();
    }
    setImmediate(() => {
      self.pointY = scrollHeight;
    });
  }
  handleTouch(e) {
    self.pointY = window.scrollY;
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
          $province: res.data.Wechat && res.data.Wechat.province,
          $city: res.data.Wechat && res.data.Wechat.city,
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
    if (pathname === `${BASENAME}comment`) {
      key = 'app-bottom-to-top';
    }
    // alert(key)
    if (userInfo && userInfo.loading) {
      return (<Loading />)
    } else {
      return (
        <div>
          <Route render={({ location }) => (
            <div className={hideBar ? `${key} no-tab-bar` : key} style={{ width: `${cellWidth}px` }}>
              <Route exact path={BASENAME} render={() => (
                <Redirect to={redirectPath} />
              )} />
              <Route exact path="/" render={() => (
                <Redirect to={redirectPath} />
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
                  <Route exact path={`${BASENAME}feedback`} component={FeedBack} name="feedback" />
                  <Route exact path={`${BASENAME}comment`} component={Comment} name="comment" />
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
      setUserFollowers,
      setVenuesFollowers,
      history
    } = this.props;
    const token = cookie('js_session');
    this.setLocation();
    if (token) {
      if (!userInfo.user) {
        this.getUserInfo();
        // this.setUserFollowers();
        // this.setVenuesFollowers();
      }
    } else {
      history.push(`${BASENAME}login`, {
        redirectUri: window.location.pathname
      });
    }
    // 全局处理SPA下拉滚动加载数据
    document.addEventListener("touchstart", this.handleTouch);
    window.addEventListener("scroll", this.handleScroll);
    document.getElementById("app").style.background = '#F5F5F5';

  }
  componentDidUpdate() {
    /**
     * 检查基础数据是否已经加载
     */
    const { userInfo, gps } = this.props;
    const token = cookie('js_session');
    if (token) {
      if (!(userInfo && userInfo.user && userInfo.user.id) && !userInfo.loading) {
        this.getUserInfo();
      }
      // if (!(followers && followers.userFollowers) && !followers.loadingUserFollowers) {
      //   this.setUserFollowers();
      // }
      // if (!(followers && followers.venuesFollowers) && !followers.loadingVenuesFollowers) {
      //   this.setVenuesFollowers();
      // }
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
    scrollLoading: appStatus.scrollLoading || false,
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
    },
    showScrollLoading: (cell) => {
      dispatch(showScrollLoading(cell));
    }
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Bootstrap));