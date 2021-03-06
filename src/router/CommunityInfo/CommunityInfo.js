import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Message from '../../components/Message';
import VenuesCell from '../../components/VenuesCell';
import Comment from '../../components/Comment';

import { getMessageInfo, getVenues } from '../../libs/api';
import { setShare } from '../../libs/wechat';
import { trackPageView, trackPageLeave, track } from '../../libs/track';
import { os } from '../../libs/uitls';

import {
  loading,
  loadSuccess,
  loadFail,
  hideBar,
  showBar
} from '../../store/actions/appStatus';

import styles from './communityInfo.scss';

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
    this.updateComments = this.updateComments.bind(this);
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

  updateComments(newNum) {
    const { messageInfo } = this.state;
    messageInfo.commentCount = newNum;
    this.setState({
      messageInfo
    });
  }

  render() {
    const { messageInfo, venuesInfo, __showComment } = this.state;
    let venuesID = null;
    messageInfo && messageInfo.affiliates && messageInfo.affiliates.forEach(cell => {
      venuesID = cell.type === 'venues' ? cell.targetId : null;
    });
    return (
      <div className={styles["community-info-box"]}>
        <div className={styles["community-info"]}>
          {
            messageInfo && <Message post={messageInfo} canLink={false} showFollow={true} key={`${messageInfo._id}-${messageInfo.likeCount}-${messageInfo.favoriteCount}-${messageInfo.commentCount}`} />
          }
          {
            venuesInfo &&
            <a href={`${window.location.origin}/dist/?#!/${venuesInfo.type.toLocaleLowerCase()}/${venuesInfo._id}`}>
              <VenuesCell venuesInfo={venuesInfo} />
            </a>
          }
          {
            !messageInfo && 
            <div className={styles.null}>
              <span>加载失败</span>&nbsp;&nbsp;
              <Link to={{ pathname: `${BASENAME}community` }}>去首页看看</Link>
            </div>
          }
        </div>
        {
          messageInfo &&
          <Comment target={messageInfo} updateComments={this.updateComments} />
        }
      </div>
    )
  }

  componentDidMount() {
    this._isMounted = true;
    const self = this;
    document.title = 'NIGHT+';
    document.body.scrollTop = 0;

    const { loading, loadSuccess, loadFail, hideBar, location, match, userInfo } = this.props;
    const id = match && match.params && match.params.id ? match.params.id : '';
    const userId = userInfo && userInfo.user && userInfo.user.id ? userInfo.user.id : '';
    const userName = userInfo && userInfo.user && userInfo.user.displayName ? userInfo.user.displayName : '';

    hideBar();
    loading();

    getMessageInfo(id).then(res => {
      loadSuccess();
      if (res.code === 200 && res.data && res.data.length) {
        // document.title = res.data[0].message.description;
        self._isMounted && self.setState({
          messageInfo: res.data[0]
        }, () => {
          let title = '', imgUrl = window.defaultShareData.imgUrl;
          if (self.state.messageInfo.postedBy && self.state.messageInfo.postedBy._id === userId) {
            title = `${userName}在NIGHT+晒的夜晚生活好新潮，快来看！`;
          } else {
            title = `${userName}发现NIGHT+的夜晚生活好新潮，快来看！`;
          }
          if (self.state.messageInfo.message && self.state.messageInfo.message.images && self.state.messageInfo.message.images[0]) {
            imgUrl = self.state.messageInfo.message.images[0];
          }
          setShare({
            title: title,
            desc: `${self.state.messageInfo.message.description}`,
            imgUrl: imgUrl,
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
                  _id, name, images, type
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
    const reg = new RegExp(`^${BASENAME}topic|${BASENAME}comment`);
    if (!reg.test(pathname)) {
      showBar();
    }
    trackPageLeave({
      pageName: this.state.track.pageName,
      pageStayTime: ((new Date().getTime() - this.state.track.startTime.getTime()) / 1000)
    });
    // hack WeChat white screen
    if (os.isWechat && os.isPhone) {
      document.body.scrollTop = '1px';
    }
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