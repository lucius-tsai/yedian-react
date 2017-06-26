import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import Message from '../../components/Message';
import VenuesCell from '../../components/VenuesCell';
import Comment from '../../components/Comment';
import './communityInfo.scss';
import {getMessageInfo} from '../../libs/api';

import {loading, loadSuccess, loadFail, hideBar, showBar} from '../../store/actions/appStatus';

class CommunityInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messageInfo: {}
    }
  }

  componentWillMount() {
    const self = this;
    const {loading, loadSuccess, loadFail, hideBar} = this.props;
    hideBar();
    loading();
    getMessageInfo().then(res => {
      loadSuccess();
      self.setState({
        messageInfo: res.data
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
    const {messageInfo} = this.state;
    return (
      <div className="community-info-box">
        <div className="community-info">
          <Message profile={messageInfo.profile} message={messageInfo.message} canLink={false}/>
          <a href={`http://staging-app.ye-dian.com/dist/?#!/ktv/59281d23b5e3cf15cd65a88c`}>
            <VenuesCell />
          </a>
        </div>
        <Comment />
      </div>
    )
  }

  componentDidMount() {
    document.title = "Night+--呃呃呃～算是吧～";
  }

  componentWillUnmount() {
    const {showBar, router} = this.props;
    const pathname = router.location.pathname;
    if (pathname !== `${BASENAME}topic`) {
      showBar();
    }
  }
}

const mapStateToProps = state => {
  const {router, appStatus} = state;
  return {
    router
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    loading: () => {
      dispatch(loading())
    },
    loadSuccess: () => {
      dispatch(loadSuccess())
    },
    loadFail: () => {
      dispatch(loadFail())
    },
    hideBar: () => {
      dispatch(hideBar())
    },
    showBar: () => {
      dispatch(showBar())
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(CommunityInfo);