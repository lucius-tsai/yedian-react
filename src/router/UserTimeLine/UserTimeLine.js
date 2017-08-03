import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';


import Avator from '../../components/Avator';
import Message from '../../components/Message';
import LoadMore from '../../components/LoadMore';

import { getPostList, getUserInfoById } from '../../libs/api';
import { setShare } from '../../libs/wechat';
import { trackPageView, trackPageLeave, track } from '../../libs/track';


import style from './userTimeLine.scss';

import {
  loading,
  loadSuccess,
  loadFail,
  hiddenScrollLoading,
  showScrollLoading
} from '../../store/actions/appStatus';

import {
  putPostList,
  resetPostList
} from '../../store/actions/posts';

class UserTimeLine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      track: {
        pageName: 'community_user_info',
        startTime: null,
      },
      messages: [],
      pagination: {
        pageSize: 10,
        current: 1
      },
      user: null,
      completed: false,
      loading: false,
    }

    this.fetch = this.fetch.bind(this);
  }

  setStateAynsc(state) {
    return new Promise((resolve, reject) => {
      this.setState(state, resolve);
    });
  }

  componentWillMount() {
    trackPageView({
      pageName: this.state.track.pageName
    });
    this.props.hiddenScrollLoading();
    this.props.resetPostList();
    this.setState({
      track: {
        pageName: this.state.track.pageName,
        startTime: new Date(),
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.scrollLoading && !this.state.completed) {
      this.fetch();
    }
    // const { posts } = this.props;
    // if (nextProps.posts.length != posts.length) {
    // console.log(nextProps.posts);
    this.setState({
      messages: nextProps.posts
    });
    // }
  }

  fetch() {
    const self = this;
    const { pagination, messages, user } = this.state;
    const { hiddenScrollLoading, putPostList, userInfo } = this.props;
    const userId = userInfo && userInfo.user && userInfo.user.id ? userInfo.user.id : '';

    if (this.state.completed || this.state.loading) {
      return false;
    }
    const offset = (pagination.current - 1) * pagination.pageSize;

    if (user && user._id) {
      this.setStateAynsc({
        loading: true
      }).then(() => {
        getPostList({
          userId, 
          _posterId: user._id,
          limit: pagination.pageSize,
          offset: offset,
          sort: '-createdAt'
        }).then(res => {
          if (res.code === 200) {
            const list = [], total = res.count;
            res.data.forEach(cell => {
              if (cell.postType === 0) {
                list.push(cell);
              }
            });
            const merge = messages.concat(list);
            if (merge.length === total || !(total > this.state.pagination.pageSize)) {
              self._isMounted && self.setState({
                completed: true,
                loading: false
              });
            }
            if (!res.data.length) {
              self._isMounted && self.setState({
                completed: true,
                loading: false
              });
            }
            putPostList(merge);
            self._isMounted && self.setState({
              loading: false,
              pagination: {
                total,
                pageSize: pagination.pageSize,
                current: (pagination.current + 1)
              }
            });
          } else {
            self._isMounted && self.setState({
              loading: false
            });
          }
          hiddenScrollLoading();
        }, error => {
          self._isMounted && self.setState({
            loading: false
          });
          hiddenScrollLoading();
        });
      });
    }
  }

  render() {
    const { messages, user, loading, completed } = this.state;
    const messagesList = messages.map((cell, index) => {
      return (
        <li className={style["message-cell"]} key={index}>
          <Message profile={cell.profile} post={cell} canLink={true} showFollow={false} disabledLink={true} />
        </li>
      )
    });
    return (
      <div className={style["user-time-line"]}>
        <div className={style["_top"]}>
          {
            user && <Avator style={"vertical"} profile={user}
              size={"small"} model={"userTimeLine"} showFollow={true} disabledLink={true} />
          }
        </div>
        <div className={style["_messages"]}>
          <ul>
            {messagesList}
          </ul>
        </div>
        {
          loading && <LoadMore />
        }
        {
          completed && <p style={{ textAlign: 'center', margin: '10px auto' }}>没有更多数据了</p>
        }
      </div>
    )
  }

  componentDidMount() {
    const self = this;
    this._isMounted = true;

    document.body.scrollTop = 0;

    const { showScrollLoading, location, match, userInfo } = this.props;
    const userId = userInfo && userInfo.user && userInfo.user.id ? userInfo.user.id : '';
    // loading();
    if (location.state) {
      this.setStateAynsc({
        user: location.state
      }).then(() => {
        setShare({
          title: `${self.state.user.displayName}在NIIGHT+ 晒的夜晚生活好新潮，快来看！`,
          desc: `分享你的夜晚生活，让有趣的灵魂相遇，做夜晚生活达人`,
          imgUrl: self.state.user.headImgUrl,
          link: `${window.location.origin}${BASENAME}user/times/${self.state.user._id}?utm_medium=SHARING&utm_campaign=USER&utm_source=${self.state.user._id}&utm_content=${userId}`,
          success: (shareType) => {
            track('wechat_share', Object.assign({
              $url: window.location.href,
              type: 'COMMUNITY_USER',
              shareMethod: shareType,
              action_time: new Date()
            }, {}));
          }
        });
        document.title = `${self.state.user.displayName}`;
        // showScrollLoading();
        this.fetch();
      });

    } else {
      if (match && match.params && match.params.id) {
        getUserInfoById(match.params.id).then(res => {
          if (res.code === 200) {
            self._isMounted && this.setStateAynsc({
              user: {
                displayName: res.data.displayName,
                _id: res.data.id,
                userType: 'User',
                headImgUrl: res.data.Wechat.headimgurl
              }
            }).then(() => {
              setShare({
                title: `${self.state.user.displayName}在NIIGHT+ 晒的夜晚生活好新潮，快来看！`,
                desc: `分享你的夜晚生活，让有趣的灵魂相遇，做夜晚生活达人`,
                imgUrl: self.state.user.headImgUrl,
                link: `${window.location.origin}${BASENAME}user/times/${self.state.user._id}?utm_medium=SHARING&utm_campaign=USER&utm_source=${self.state.user._id}&utm_content=${userId}`,
                success: (shareType) => {
                  track('wechat_share', Object.assign({
                    $url: window.location.href,
                    type: 'COMMUNITY_USER',
                    shareMethod: shareType,
                    action_time: new Date()
                  }, {}));
                }
              });
              document.title = `${self.state.user.displayName}`;
              // showScrollLoading();
              self.fetch();
            });
          }
        }, error => {

        })
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    // this.props.resetPostList();
    trackPageLeave({
      pageName: this.state.track.pageName,
      pageStayTime: ((new Date().getTime() - this.state.track.startTime.getTime()) / 1000)
    })
  }
}

const mapStateToProps = state => {
  const { appStatus, router, userInfo, posts } = state;
  return {
    router,
    userInfo,
    scrollLoading: appStatus.scrollLoading || false,
    posts: posts.posts || []
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
    showScrollLoading: (cell) => {
      dispatch(showScrollLoading(cell));
    },
    hiddenScrollLoading: () => {
      dispatch(hiddenScrollLoading())
    },
    putPostList: (cell) => {
      dispatch(putPostList(cell))
    },
    resetPostList: () => {
      dispatch(resetPostList())
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(UserTimeLine);