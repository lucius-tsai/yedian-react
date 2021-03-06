import React, { Component } from 'react';
import { connect } from 'react-redux';

import Carousel from '../../components/Carousel';
import DaynimcMessage from '../../components/DaynimcMessage';
import Avator from '../../components/Avator';
import Message from '../../components/Message';
import ActionBar from '../../components/ActionBar';
import LoadMore from '../../components/LoadMore';

import {
  getCommunityBanner,
  getPostList,
  getIndexUserList,
  getTopicById
} from '../../libs/api';
import { trackPageView, trackPageLeave } from '../../libs/track';
import { cookie } from '../../libs/uitls';
import { reSetShare } from '../../libs/wechat';

import {
  putPostList,
  resetPostList
} from '../../store/actions/posts';
import {
  loading,
  loadSuccess,
  loadFail,
  hiddenScrollLoading,
  showScrollLoading
} from '../../store/actions/appStatus';
import { delAll } from '../../store/actions/publish';

import styles from './community.scss';

class Community extends Component {
  constructor(props) {
    super(props);
    this.state = {
      track: {
        pageName: 'community_index',
        startTime: null,
      },
      slides: [],
      dynamicMessages: [],
      messages: [],
      userList: [],
      pagination: {
        pageSize: 10,
        current: 1
      },
      completed: false,
      loading: false,
    };

    this.fetch = this.fetch.bind(this);
    this.pollingPostTimer = null;
    this.pollingDynamicMessagesTimer = null;
  }

  componentWillMount() {
    const { delAll, hiddenScrollLoading, resetPostList } = this.props;
    delAll();
    hiddenScrollLoading();
    resetPostList();
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
    if (nextProps.scrollLoading && !this.state.completed) {
      this.fetch();
    }
    this.setState({
      messages: nextProps.posts
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  fetch() {
    const self = this;
    const { pagination, messages } = this.state;
    const { hiddenScrollLoading, userInfo, putPostList } = this.props;
    const userId = userInfo && userInfo.user && userInfo.user.id ? userInfo.user.id : '';

    if (this.state.completed || this.state.loading) {
      return false;
    }

    const offset = (pagination.current - 1) * pagination.pageSize;

    this.setState({
      loading: true,
    }, () => {
      getPostList({
        isFollow: true,
        userId,
        sort: '-createdAt',
        limit: pagination.pageSize,
        offset
      }).then(res => {
        if (res.code === 200) {
          const total = res.count;
          const merge = messages.concat(res.data);

          if (merge.length === total || !(total > this.state.pagination.pageSize)) {
            self._isMounted && self.setState({
              completed: true
            });
          }

          if (!res.data.length) {
            self._isMounted && self.setState({
              completed: true
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
          self.pollingPost();
        } else {
          self._isMounted && self.setState({
            loading: false
          })
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

  pollingPost() {
    const self = this;
    const { userInfo } = this.props;
    const userId = userInfo && userInfo.user && userInfo.user.id ? userInfo.user.id : '';
    clearInterval(this.pollingPostTimer);
    this.pollingPostTimer = setInterval(() => {
      getPostList({
        isFollow: true,
        userId,
        limit: 10,
        offset: 0,
        sort: '-createdAt'
      }).then(res => {
        if (res.code === 200 && res.data.length) {
          if (!this.state.messages.length) {
            self._isMounted && self.setState({
              messages: res.data
            });
          } else if (this.state.messages[0]._id !== res.data[0]._id) {
            const newMsg = [];
            res.data.every(cell => {
              newMsg.push(cell);
              if (cell._id === this.state.messages[0]._id) {
                return false;
              }
            });

            const { messages } = this.state;
            const len = messages.length;
            newMsg.reverse().forEach(cell => {
              messages.unshift(cell);
            });
            if (this.state.completed) {
              self._isMounted && self.setState({
                messages
              });
            } else {
              messages.splice(len);
              self._isMounted && self.setState({
                messages
              });
            }
          }
        }
      });
    }, 20e3);
  }

  pollingDynamicMessages() {
    const self = this;
    clearInterval(this.pollingDynamicMessagesTimer);
    this.pollingDynamicMessagesTimer = setInterval(() => {
      getPostList({
        limit: 10,
        offset: 0,
        sort: '-createdAt'
      }).then(res => {
        if (res.code === 200 && res.data.length) {
          if (!this.state.dynamicMessages.length) {
            self._isMounted && self.setState({
              dynamicMessages: res.data
            });
          } else if (this.state.dynamicMessages[0]._id !== res.data[0]._id) {
            const newMsg = [];
            res.data.every(cell => {
              newMsg.push(cell);
              if (cell._id === this.state.dynamicMessages[0]._id) {
                return false;
              }
            });
            const { dynamicMessages } = this.state;
            newMsg.reverse().forEach(cell => {
              dynamicMessages.unshift(cell);
            });

            if (dynamicMessages.length > 10) {
              dynamicMessages.splice(10);
            }
            self._isMounted && self.setState({
              dynamicMessages
            });
          }
        }
      });
    }, 20e3);
  }

  showGuide() {
    if (cookie('new_user_guide')) {
      return false;
    }

    let body = document.getElementsByTagName('body')[0];

    body.setAttribute('new_user_guide', 'guide');
    let btn = document.createElement('a');
    
    btn.setAttribute('new_user_guide_click', 'guide');
    btn.setAttribute('href', 'javascript:;');
    body.appendChild(btn);

    btn.addEventListener('click', (e) => {
      body.removeAttribute("new_user_guide");
    });

    cookie('new_user_guide',  'dot', { path: '/', expires: 35600 });
  }

  render() {
    const { slides, messages, userList, loading, dynamicMessages, completed } = this.state;
    const bannerHeight = window.innerWidth > 414 ? 414 / 2 : (window.innerWidth / 2);
    const messagesList = messages.map((cell, index) => {
      return (
        <li className={styles["message-cell"]} key={index}>
          <Message profile={cell.profile} post={cell} canLink={true} showFollow={false} />
        </li>
      )
    });

    const userListStr = userList.map((cell, index) => {
      return (
        <li key={index}>
          <Avator style={"vertical"} profile={cell} size={"small"} model={"followCard"} showFollow={true} />
        </li>
      )
    });

    return (
      <div className={styles["community"]} ref={this.handleLoad}>
        <div className={styles["banner"]} style={{height: `${bannerHeight}px`}}>
          {
            !!slides.length && <Carousel slides={slides} element={"div"} enterDelay={1000} leaveDelay={1000} speed={3000} />
          }
        </div>
        <div className={styles.newsTimeLine}>
          <div className={styles.title}>
            最新<br />动态
          </div>
          <div className={styles.message}>
            <div className={`${styles["message-cell"]} ${styles["clearfix"]}`}>
              {
                !!dynamicMessages.length && <DaynimcMessage list={dynamicMessages} enterDelay={1000} leaveDelay={1000} speed={3000} />
              }
            </div>
          </div>
        </div>
        {/* <div className={`${styles["section"]} ${styles["section-follow"]}`}>
          <ul className={`${styles["follow-list"]} ${styles["clearfix"]}`} style={{ width: `${userList.length * 137 - 7}px` }}>
            {userListStr}
          </ul>
        </div> */}
        <div className={styles['section']}>
          <ul>
            {messagesList}
          </ul>
        </div>
        {
          loading && <LoadMore />
        }
        {
          completed && <p style={{ textAlign: 'center', marginTop: '10px' }}>没有更多数据了</p>
        }
        <ActionBar />
      </div>
    )
  }

  componentDidMount() {
    const self = this;
    this._isMounted = true;
    document.title = "NIGHT+";
    document.body.scrollTop = 0;

    const { messages, pagination } = this.state;
    const { loading, loadSuccess, loadFail, showScrollLoading } = this.props;


    reSetShare();
    this.showGuide();
    // 拉取banner
    const query = `query=query
    {
      view(isDisplayed: true, sectionType: "community-banner"){
        count,
        rows {
          _id,
          title,
          viewType,
          url,
          image,
          articleId,
          subTitle,
          topic {
            id,
            topicName
          }
        }
      }
    }`;

    getCommunityBanner(query).then(res => {
      if (res.code === 200) {
        const bannerList = res.data.view.rows;
        const loadTopic = [];
        bannerList.forEach(cell => {
          loadTopic.push(getTopicById(cell.topic.id));
        });
        Promise.all(loadTopic).then(data => {
          const slides = [];
          bannerList.forEach((cell, index) => {
            const tags = data[index].code === 200 && data[index].data.length ? data[index].data[0] : null;
            slides.push({
              image: cell.image,
              topic: cell.topic,
              link: cell.url,
              tags: tags && tags.tags,
              postCount: data[index].data[0].postCount,
              userCount: data[index].data[0].userCount,
              action: {
                path: `${BASENAME}topic/${cell._id}`
              }
            });
          });
          self.setState({
            slides
          });
        }, error => {
          self.setState({
            slides: res.data
          });
        });

      }
    }, error => {
    });

    // 拉取最新发布
    getPostList({
      limit: 10,
      offset: 0,
      sort: '-createdAt'
    }).then(res => {
      if (res.code === 200) {
        self._isMounted && self.setState({
          dynamicMessages: res.data
        });
        self.pollingDynamicMessages();
      }
    }, error => {

    });
    // showScrollLoading();
    self.fetch();
  }

  componentWillUnmount() {
    this._isMounted = false;
    // this.props.resetPostList();
    clearInterval(this.pollingPostTimer);
    clearInterval(this.pollingDynamicMessagesTimer);
    trackPageLeave({
      pageName: this.state.track.pageName,
      pageStayTime: ((new Date().getTime() - this.state.track.startTime.getTime()) / 1000)
    });

    let body = document.getElementsByTagName('body')[0];
    body.removeAttribute("new_user_guide");
  }
}

const mapStateToProps = state => {
  const { appStatus, router, userInfo, posts } = state;
  return {
    userInfo,
    router,
    scrollLoading: appStatus.scrollLoading || false,
    loading: appStatus.loading || false,
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
    delAll: () => {
      dispatch(delAll())
    },
    putPostList: (cell) => {
      dispatch(putPostList(cell))
    },
    resetPostList: () => {
      dispatch(resetPostList())
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Community);