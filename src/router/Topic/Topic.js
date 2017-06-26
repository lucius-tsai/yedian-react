import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Carousel from '../../components/Carousel';
import Avator from '../../components/Avator';
import Message from '../../components/Message';
import ActionBar from '../../components/ActionBar';
import './topic.scss';
import {getTopicBanner, getIndexMessage, getIndexUserList} from '../../libs/api';

import {loading, loadSuccess, loadFail, hideBar, showBar, deleteUnmount} from '../../store/actions/appStatus';

class Topic extends Component {

  constructor(props) {
    super(props);
    this.state = {
      slides: [],
      messages: [],
      userList: []
    }
  }

  componentWillMount() {
    const self = this;
    const {loading, loadSuccess, loadFail, dispatch, hideBar} = this.props;
    hideBar();
    loading();

    Promise.all([getTopicBanner(), getIndexMessage(), getIndexUserList()]).then(data => {
      loadSuccess();
      self.setState({
        slides: data[0].data,
        messages: data[1].data,
        userList: data[2].data
      });
    }, error => {
      loadFail();
      console.log(error);
    });

  }

  componentWillReceiveProps(nextProps) {
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  render() {
    const {slides, messages, userList} = this.state;

    const messagesList = messages.map((cell, index) => {
      return (
        <li className="message-cell" key={index}>
          <Message profile={cell.profile} message={cell.message} canLink={true}/>
        </li>
      )
    });

    const userListStr = userList.map((cell, index) => {
      return (
        <li key={index}>
          <Avator style={"vertical"} profile={cell} size={"small"} model={"followCard"} showFollow={true}/>
        </li>
      )
    });

    return (
      <div className="community">
        <div className="banner">
          {
            slides.length ?
              <Carousel slides={slides} element={"div"} enterDelay={1000} leaveDelay={1000} speed={3000}/>
              :
              ""
          }
        </div>
        <div className="topic-info">
          夜生活泛指人类从黄昏到凌晨时段盛行的活动。夜间活动一般被视为相对于日间劳动等正式活动，夜生活一词也常偏向休闲娱乐性质。
        </div>
        <div className="section">
          <ul>
            {messagesList}
          </ul>
        </div>
        <ActionBar position={"bottom"}/>
      </div>
    )
  }

  componentDidMount() {
    document.title = "Night+--社区";
  }

  componentWillUnmount() {
    const {showBar, router} = this.props;
    const pathname = router.location.pathname;
    const reg = new RegExp(`^${BASENAME}[publish|topic|message]`);
    if(!reg.test(pathname)) {
      showBar();
    }
  }
}

const mapStateToProps = state => {
  const {router, appStatus} = state;
  return {
    router,
    appStatus
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    showBar: () => {
      dispatch(showBar())
    },
    hideBar: () => {
      dispatch(hideBar())
    },
    loading: () => {
      dispatch(loading())
    },
    loadSuccess: () => {
      dispatch(loadSuccess())
    },
    loadFail: () => {
      dispatch(loadFail())
    }
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Topic));