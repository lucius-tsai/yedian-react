import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Message from '../../components/Message';
import VenuesCell from '../../components/VenuesCell';
import Comment from '../../components/Comment';
import './communityInfo.scss';
import { getMessageInfo } from '../../libs/api';

import { loading, loadSuccess, loadFail, hideBar, showBar } from '../../store/actions/appStatus';

class CommunityInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messageInfo: {}
    }
  }

  componentWillMount() {
    const self = this;
    this._isMounted = true;
    const { loading, loadSuccess, loadFail, hideBar, location } = this.props;
    // console.log(this.props)
    const id = location && location.state && location.state.id ? location.state.id : '';
    hideBar();
    loading();
    getMessageInfo(id).then(res => {
      loadSuccess();
      if (res.code === 200) {
        self._isMounted && self.setState({
          messageInfo: res.data[0]
        });
      } else {

      }
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
    const { messageInfo } = this.state;
    let venuesID = null;
    messageInfo && messageInfo.affiliates && messageInfo.affiliates.forEach(cell => {
      venuesID = cell.type === 'venues' ? cell.targetId : null;
    });
    return (
      <div className="community-info-box">
        <div className="community-info">
          {
            messageInfo ?
              <Message profile={messageInfo.profile} post={messageInfo} canLink={false} />
              : ""
          }
          {
            venuesID ?
              <a href={`http://staging-app.ye-dian.com/dist/?#!/ktv/${venuesID}`}>
                <VenuesCell />
              </a>
              : ""
          }
        </div>
        <Comment />
      </div>
    )
  }

  componentDidMount() {
    document.title = "Night+--呃呃呃～算是吧～";
    this._isMounted = true;
  }

  componentWillUnmount() {
    const { showBar, router } = this.props;
    this._isMounted = false;
    const pathname = router.location.pathname;
    if (pathname !== `${BASENAME}topic`) {
      showBar();
    }
  }
}

const mapStateToProps = state => {
  const { router, appStatus } = state;
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