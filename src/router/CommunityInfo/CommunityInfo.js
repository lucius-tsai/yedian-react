import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Message from '../../components/Message';
import VenuesCell from '../../components/VenuesCell';
import Comment from '../../components/Comment';

import { getMessageInfo, getVenues } from '../../libs/api';
import { setShare } from '../../libs/wechat';
import { trackPageView, trackPageLeave, track } from '../../libs/track';

import { loading, loadSuccess, loadFail, hideBar, showBar } from '../../store/actions/appStatus';

import './communityInfo.scss';

class CommunityInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      track: {
        pageName: 'community_info',
        startTime: null,
      },
      messageInfo: null,
      venuesInfo: null,
    }
  }

  componentWillMount() {
    trackPageView({
      pageName: this.state.track.pageName
    });
    this.setState({
      track: {
        pageName: this.state.track.pageName,
        startTime: new Date(),
      }
    });
  }

  componentWillReceiveProps(nextProps) {
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  render() {
    const { messageInfo, venuesInfo, __showComment } = this.state;
    let venuesID = null;
    messageInfo && messageInfo.affiliates && messageInfo.affiliates.forEach(cell => {
      venuesID = cell.type === 'venues' ? cell.targetId : null;
    });
    return (
      <div className="community-info-box">
        <div className="community-info">
          {
            messageInfo && <Message post={messageInfo} canLink={false} showFollow={true} />
          }
          {
            venuesInfo &&
            <a href={`http://staging-app.ye-dian.com/dist/?#!/ktv/${venuesInfo._id}`}>
              <VenuesCell venuesInfo={venuesInfo} />
            </a>
          }
        </div>
        {
          messageInfo &&
          <Comment target={messageInfo} />
        }
      </div>
    )
  }

  componentDidMount() {
    this._isMounted = true;
    const self = this;

    document.title = "Night+--呃呃呃～算是吧～";
    document.body.scrollTop = 0;

    const { loading, loadSuccess, loadFail, hideBar, location, match, userInfo } = this.props;
    const id = match && match.params && match.params.id ? match.params.id : '';
    const userId = userInfo && userInfo.user && userInfo.user.id ? userInfo.user.id : '';

    hideBar();
    loading();

    getMessageInfo(id).then(res => {
      loadSuccess();
      if (res.code === 200 && res.data && res.data.length) {
        self._isMounted && self.setState({
          messageInfo: res.data[0]
        }, () => {
          setShare({
            imgUrl: self.state.messageInfo.message.images[0],
            link: `${window.location.origin}${BASENAME}message/${id}?utm_medium=SHARING&utm_campaign=POST&utm_source=${id}&utm_content=${userId}`,
            success: (shareType) => {
              track('wechat_share', Object.assign({
                $url: window.location.href,
                type: 'COMMUNITY_POST',
                shareMethod: shareType,
                action_time: new Date()
              }, {}));
            }
          });
        });

        res.data[0].affiliates && res.data[0].affiliates.forEach(cell => {
          if (cell.type === 'venues') {
            const query = `query=query
            {
              venues(isValid: 1, isDeleted: 0, _id: "${cell.targetId}"){
                count,
                rows{
                  _id, name, images
                }
              }
            }`
            getVenues(encodeURI(query)).then(res => {
              if (res.code === 200 && res.data.venues.count === 1) {
                const venuesInfo = res.data.venues.rows[0];
                self._isMounted && self.setState({
                  venuesInfo
                });
              }
            }, error => {

            })
          }
        });
      }
    }, error => {
      loadFail();
      console.log(error);
    });
  }

  componentWillUnmount() {
    const { showBar, router } = this.props;
    this._isMounted = false;
    const pathname = router.location.pathname;
    const reg = new RegExp(`^${BASENAME}topic`);
    if (!reg.test(pathname)) {
      showBar();
    }
    trackPageLeave({
      pageName: this.state.track.pageName,
      pageStayTime: ((new Date().getTime() - this.state.track.startTime.getTime()) / 1000)
    });
  }
}

const mapStateToProps = state => {
  const { router, appStatus, userInfo } = state;
  return {
    router,
    userInfo
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