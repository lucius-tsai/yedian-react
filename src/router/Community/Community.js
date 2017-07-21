import React, { Component } from 'react';
import { connect } from 'react-redux';

import Carousel from '../../components/Carousel';
import DaynimcMessage from '../../components/DaynimcMessage';
import Avator from '../../components/Avator';
import Message from '../../components/Message';
import ActionBar from '../../components/ActionBar';
import LoadMore from '../../components/LoadMore';

import './community.scss';
import style from './community.css';

import { getCommunityBanner, getPostList, getIndexUserList, getTopicById } from '../../libs/api';
import { trackPageView, trackPageLeave } from '../../libs/track';
import { reSetShare } from '../../libs/wechat';

import { loading, loadSuccess, loadFail, hiddenScrollLoading, showScrollLoading } from '../../store/actions/appStatus';
import { delAll } from '../../store/actions/publish';


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
    const { delAll } = this.props;
    delAll();
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
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  fetch() {
    const self = this;
    const { pagination, messages } = this.state;
    const { hiddenScrollLoading } = this.props;

    if (this.state.completed || this.state.loading) {
      return false;
    }

    const offset = (pagination.current - 1) * pagination.pageSize;

    this.setState({
      loading: true,
    }, () => {
      getPostList({
        isFollow: true,
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

          self._isMounted && self.setState({
            messages: merge,
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

  pollingPost () {
    const self = this;
    clearInterval(this.pollingPostTimer);
    this.pollingPostTimer = setInterval(() => {
      getPostList({
        isFollow: true,
        limit: 10,
        offset: 0,
        sort: '-createdAt'
      }).then(res => {
        if(res.code === 200 && res.data.length) {
          if (!this.state.messages.length) {
            self._isMounted && self.setState({
              messages: res.data
            });
          } else if(this.state.messages[0]._id !== res.data[0]._id) {
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

  render() {
    const { slides, messages, userList, loading, dynamicMessages, completed } = this.state;

    const messagesList = messages.map((cell, index) => {
      return (
        <li className="message-cell" key={index}>
          <Message profile={cell.profile} post={cell} canLink={true} showFollow={true} />
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
      <div className="community" ref={this.handleLoad}>
        <div className="banner">
          {
            !!slides.length && <Carousel slides={slides} element={"div"} enterDelay={1000} leaveDelay={1000} speed={3000} />
          }
        </div>
        <div className={style.newsTimeLine}>
          <div className={style.title}>
            最新<br />动态
          </div>
          <div className={style.message}>
            <div className="message-cell clearfix">
              {
                !!dynamicMessages.length && <DaynimcMessage list={dynamicMessages} enterDelay={1000} leaveDelay={1000} speed={3000} />
              }
            </div>
          </div>
        </div>
        <div className="section section-follow">
          <ul className="follow-list clearfix" style={{ width: `${userList.length * 137 - 7}px` }}>
            {userListStr}
          </ul>
        </div>
        <div className="section">
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

    // document.title = "Night+--社区";
    const { messages, pagination } = this.state;
    const { loading, loadSuccess, loadFail, showScrollLoading } = this.props;

    reSetShare();

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
    showScrollLoading();
    self.fetch();
  }

  componentWillUnmount() {
    this._isMounted = false;
    clearInterval(this.pollingPostTimer);
    clearInterval(this.pollingDynamicMessagesTimer);
    trackPageLeave({
      pageName: this.state.track.pageName,
      pageStayTime: ((new Date().getTime() - this.state.track.startTime.getTime()) / 1000)
    });
  }
}

const mapStateToProps = state => {
  const { appStatus, router } = state;
  return {
    router,
    scrollLoading: appStatus.scrollLoading || false,
    loading: appStatus.loading || false
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
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Community);