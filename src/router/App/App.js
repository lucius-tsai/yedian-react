import React, {Component} from 'react';
import {
  Redirect,
  Switch,
  Route
} from 'react-router-dom';
import {connect} from 'react-redux';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

import Community from '../Community/Community';
import CommunityInfo from '../CommunityInfo/CommunityInfo';
import Publish from '../Publish/Publish';
import Search from '../Search/Search';
import Topic from '../Topic/Topic';
import UserTimeLine from '../UserTimeLine/UserTimeLine';
import NotFound from '../NotFound/NotFound';


import TabBar from '../../components/TabBar';
import Loading from '../../components/Loading';
import './app.scss';

class Bootstrap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      hideBar: false,
      router: null,
      lastRouter: null
    }
  }

  componentWillMount() {
    const {loading} = this.props;
    this.setState({
      loading: loading
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentWillReceiveProps(nextProps) {
    const {router} = this.state;
    this.setState({
      loading: nextProps.loading,
      hideBar: nextProps.hideBar,
      router: nextProps.router,
      lastRouter: router
    });
  }

  componentDidMount() {
  }

  render() {
    let key = "app";
    const {loading, hideBar, router, lastRouter} = this.state;
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
    return (
      <div>
        <Route render={({location}) => (
          <div className={hideBar ? `${key} no-tab-bar` : key} style={{width: `${cellWidth}px`}}>
            <Route exact path={BASENAME} render={() => (
              <Redirect to={`${BASENAME}community`}/>
            )}/>
            <Route exact path="/" render={() => (
              <Redirect to={`${BASENAME}community`}/>
            )}/>
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
                <Route exact path={`${BASENAME}community`} component={Community} name="community"/>
                <Route exact path={`${BASENAME}message/:id`} component={CommunityInfo} name="message"/>
                <Route exact path={`${BASENAME}publish`} component={Publish} name="publish"/>
                <Route exact path={`${BASENAME}search`} component={Search} name="search"/>
                <Route exact path={`${BASENAME}topic`} component={Topic} name="topic"/>
                <Route exact path={`${BASENAME}user/times`} component={UserTimeLine} name="userTimeLine"/>
                <Route path={`${BASENAME}*`} component={NotFound} name="notFound"/>
              </Switch>
            </CSSTransitionGroup>
            {
              loading ? <Loading /> : ""
            }
          </div>
        )}/>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {appStatus, router} = state;
  return {
    loading: appStatus.loading || false,
    hideBar: appStatus.hideBar || false,
    router
  }
};

const mapDispatchToProps = (dispatch) => {
  return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(Bootstrap);