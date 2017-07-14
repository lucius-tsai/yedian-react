import React, { Component } from 'react';
import {
  Redirect,
  Switch,
  Route
} from 'react-router-dom';
import { connect } from 'react-redux';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

// routes
import Community from '../Community/Community';
import CommunityInfo from '../CommunityInfo/CommunityInfo';
import Publish from '../Publish/Publish';
import Search from '../Search/Search';
import Topic from '../Topic/Topic';
import UserTimeLine from '../UserTimeLine/UserTimeLine';
import Login from '../Login/Login';
import NotFound from '../NotFound/NotFound';

// components
import TabBar from '../../components/TabBar';
import Loading from '../../components/Loading';
import './app.scss';

// apis
import { getUserInfo, getLocation } from '../../libs/api';
import { cookie } from "../../libs/uitls";

// redux-actions

import { setLocation } from '../../store/actions/appStatus';
import { getUserInfoLoading, getUserInfoSuccess } from '../../store/actions/userInfo';


class Bootstrap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectPath: 'community',
      loading: false,
      hideBar: false,
      router: null,
      lastRouter: null
    }
  }

  componentWillMount() {
    const { loading, userInfo, getUserInfoLoading, getUserInfoSuccess, setLocation } = this.props;
    const token = cookie('js_session');
    if (!token && process.env.NODE_ENV !== "localhost") {
      this.setState({
        redirectPath: 'login'
      });
    } else {
      if (!userInfo.user) {
        getUserInfoLoading();
        getUserInfo().then(res => {
          if (res.code === 200) {
            getUserInfoSuccess(res.data);
            localStorage.setItem('react_user', JSON.stringify(res.data));
          }
        }, error => {
          if (error.status === 403 && error.responseJSON && error.responseJSON.exp === "token expired") {
            // console.log(12313);
          }
          console.log(error);
        });
        getLocation().then(res => {
          if(res && res.lat && res.lng) {
            setLocation(res);
          }
        }, error => {
          console.log(error)
        });
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
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
    if(userInfo && userInfo.loading) {
      return (<Loading />)
    }
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
            {
              hideBar ? "" : <TabBar />
            }
            <CSSTransitionGroup
              component="div"
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

  componentDidMount() {
  }

}

const mapStateToProps = state => {
  const { appStatus, router, userInfo } = state;
  return {
    loading: appStatus.loading || false,
    hideBar: appStatus.hideBar || false,
    userInfo,
    router
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
    setLocation: (cell) => {
      dispatch(setLocation(cell));
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Bootstrap);