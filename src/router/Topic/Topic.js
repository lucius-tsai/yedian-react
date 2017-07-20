import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Carousel from '../../components/Carousel';
import Avator from '../../components/Avator';
import Message from '../../components/Message';
import ActionBar from '../../components/ActionBar';
import LoadMore from '../../components/LoadMore';

import {
  getTopicById,
  getBannerById,
  getPostList
} from '../../libs/api';
import { setShare } from '../../libs/wechat';
import { trackPageView, trackPageLeave, track } from '../../libs/track';

import {
  loading,
  loadSuccess,
  loadFail,
  hideBar,
  showBar,
  deleteUnmount,
  hiddenScrollLoading,
  showScrollLoading
} from '../../store/actions/appStatus';
import { delAll } from '../../store/actions/publish';

import style from './topic.css';
import './topic.scss';

class Topic extends Component {

  constructor(props) {
    super(props);
    this.state = {
      track: {
        pageName: 'community_topic',
        startTime: null,
      },
      slides: [],
      description: '',
      messages: [],
      userList: [],
      pagination: {
        pageSize: 2,
        current: 1
      },
      actionTags: [],
      tags: [],
      tab: 'createdAt',
      loading: false,
      completed: false,
    }
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

  setStateAynsc(state) {
    const self = this;
    return new Promise((resolve, reject) => {
      self.setState(state, resolve);
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

  fetch(reset) {
    const self = this;
    const { pagination, messages, tab } = this.state;
    const { hiddenScrollLoading } = this.props;

    if (this.state.completed || this.state.loading) {
      return false;
    }

    const offset = (pagination.current - 1) * pagination.pageSize;
    this.setStateAynsc({
      loading: true
    }).then(() => {
      getPostList({
        limit: pagination.pageSize,
        offset,
        _tags: JSON.stringify(this.state.tags),
        sort: `-${tab}`
      }).then(res => {
        if (res.code === 200) {
          const total = res.count;
          const merge = reset ? res.data : messages.concat(res.data);

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

          self._isMounted && self.setState({
            messages: merge,
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

  tab(key) {
    const self = this;
    const { pagination } = this.state;
    const { showScrollLoading } = this.props;
    this.setStateAynsc({
      tab: key === 0 ? 'createdAt' : 'likeCount',
      messages: [],
      completed: false,
      pagination: {
        pageSize: pagination.pageSize,
        current: 1
      }
    }).then(() => {
      showScrollLoading();
      self.fetch(true);
    });
  }

  render() {
    const { slides, messages, userList, tab, actionTags, description, loading, completed } = this.state;

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
      <div className="community">
        <div className="banner">
          {
            !!slides.length && <Carousel slides={slides} element={"div"} enterDelay={1000} leaveDelay={1000} speed={3000} />
          }
        </div>
        <div className="topic-info">
          {description}
        </div>
        <div className={style.topicTab}>
          <p className={tab === 'createdAt' ? `${style.tab} ${style.active}` : style.tab} onClick={this.tab.bind(this, 0)}>
            <span>
              最新
            </span>
          </p>
          <p className={tab === 'likeCount' ? `${style.tab} ${style.active}` : style.tab} onClick={this.tab.bind(this, 1)}>
            <span>
              最热
            </span>
          </p>
        </div>
        <div className="topicSetion">
          <ul>
            {messagesList}
          </ul>
        </div>
        {
          loading && <LoadMore />
        }
        {
          completed && <p style={{ textAlign: 'center' }}>没有更多数据了</p>
        }
        <ActionBar position={"bottom"} tags={actionTags} />
      </div>
    )
  }

  componentDidMount() {
    document.title = "Night+--社区";
    this._isMounted = true;
    const self = this;
    const { showScrollLoading, dispatch, hideBar, match, userInfo } = this.props;
    const id = match && match.params && match.params.id ? match.params.id : '';
    const userId = userInfo && userInfo.user && userInfo.user.id ? userInfo.user.id : '';

    hideBar();
    // banner
    const query = `query=query
    {
      view(isDisplayed: true, _id: "${id}"){
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

    getBannerById(query).then(res => {
      if (res.code === 200 && res.data.view.rows.length) {
        const banner = res.data.view.rows[0];
        console.log(banner);
        setShare({
          imgUrl: banner.image,
          link: `${window.location.origin}${BASENAME}topic/${id}?utm_medium=SHARING&utm_campaign=COMMUNITY_TOPIC&utm_source=${id}&utm_content=${userId}`,
          success: (shareType) => {
            track('wechat_share', Object.assign({
              $url: window.location.href,
              type: 'COMMUNITY_TOPIC',
              shareMethod: shareType,
              action_time: new Date()
            }, {}));
          }
        });

        if (banner.topic && banner.topic.id) {
          getTopicById(banner.topic.id).then(res => {
            if (res.code === 200 && res.data.length) {
              self.setStateAynsc({
                slides: [{
                  image: banner.image,
                  topic: banner.topic,
                  postCount: res.data[0].postCount,
                  userCount: res.data[0].userCount,
                  tags: res.data[0].tags
                }],
                description: banner.title,
                actionTags: res.data[0].tags,
                tags: res.data[0].tags.map(cell => {
                  return cell.tag
                })
              }).then(() => {
                showScrollLoading();
                self.fetch();
              });
            }
          }).catch(error => {
          });
        } else {
          self.setState({
            slides: [{
              image: banner.image,
              topic: banner.topic
            }],
            description: banner.title
          })
        }
      }
    }, error => {

    });

  }

  componentWillUnmount() {
    this._isMounted = false;
    const { showBar, router, match } = this.props;
    const pathname = router.location.pathname;
    const reg = new RegExp(`^${BASENAME}publish|${BASENAME}topic|${BASENAME}message`);
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
    userInfo,
    scrollLoading: appStatus.scrollLoading || false
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    showBar: () => {
      dispatch(showBar());
    },
    hideBar: () => {
      dispatch(hideBar());
    },
    loading: () => {
      dispatch(loading());
    },
    loadSuccess: () => {
      dispatch(loadSuccess());
    },
    loadFail: () => {
      dispatch(loadFail());
    },
    showScrollLoading: (cell) => {
      dispatch(showScrollLoading(cell));
    },
    hiddenScrollLoading: () => {
      dispatch(hiddenScrollLoading())
    },
    delAll: () => {
      dispatch(delAll());
    }
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Topic));