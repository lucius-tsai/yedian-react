import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Carousel from '../../components/Carousel';
import Avator from '../../components/Avator';
import Message from '../../components/Message';
import ActionBar from '../../components/ActionBar';
import LoadMore from '../../components/LoadMore';

import { getTopicById, getCommunityBanner, getPostList } from '../../libs/api';
import { loading, loadSuccess, loadFail, hideBar, showBar, deleteUnmount } from '../../store/actions/appStatus';
import { delAll } from '../../store/actions/publish';

import style from './topic.css';
import './topic.scss';

class Topic extends Component {

  constructor(props) {
    super(props);
    this.state = {
      slides: [],
      messages: [],
      userList: [],
      loading: false,
      pagination: {
        pageSize: 5,
        current: 1
      },
      actionTags: [],
      tags: [],
      tab: 'new',
      completed: false,
    }
    this.handleScroll = this.handleScroll.bind(this);
    this.pointY = null;
  }

  componentWillMount() {
    const { delAll } = this.props;
    delAll();
  }

  setStateAynsc(state) {
    const self = this;
    return new Promise((resolve, reject) => {
      self.setState(state, resolve);
    });
  }

  componentWillReceiveProps(nextProps) {
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  fetch(reset) {
    const self = this;
    const { pagination, messages } = this.state;
    const { loading, loadSuccess, loadFail } = this.props;

    if (messages.length === pagination.total) {
    }

    if (this.state.completed || this.state.loading) {
      return false;
    }


    reset && loading();

    const offset = (pagination.current - 1) * pagination.pageSize;

    this.setStateAynsc({
      loading: true
    }).then(() => {
      getPostList({
        limit: pagination.pageSize,
        offset
      }).then(res => {
        if (res.code === 200) {
          const list = [], total = res.count;
          const merge = reset ? res.data : messages.concat(res.data);

          if (merge.length === total) {
            document.removeEventListener("touchstart", this.handleTouch);
            window.removeEventListener("scroll", this.handleScroll);
            self.setState({
              completed: true,
              loading: false
            });
          }

          if (!res.data.length) {
            document.removeEventListener("touchstart", this.handleTouch);
            window.removeEventListener("scroll", this.handleScroll);
            self.setState({
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
          self.setState({
            loading: false
          })
        }
        reset && loadSuccess();
      }, error => {
        self.setState({
          // loading: false
        });
        reset && loadFail();
      });
    });
  }

  tab(key) {
    const self = this;
    const { pagination } = this.state;
    this.setStateAynsc({
      tab: key === 0 ? 'new' : 'hottopic',
      messages: [],
      completed: false,
      pagination: {
        pageSize: pagination.pageSize,
        current: 1
      }
    }).then(() => {
      self.fetch(true);
      document.removeEventListener("touchstart", this.handleTouch);
      window.removeEventListener("scroll", this.handleScroll);
      document.addEventListener("touchstart", this.handleTouch);
      window.addEventListener("scroll", this.handleScroll);
    });
  }

  handleScroll(e) {
    const self = this;
    const documentHeight = document.body.clientHeight;
    const scrollHeight = window.scrollY;
    const distance = documentHeight - scrollHeight;

    if (distance < 700 && !this.state.loading && self.pointY < scrollHeight) {
      self.fetch();
    }

    setImmediate(() => {
      self.pointY = scrollHeight;
    });
  }
  handleTouch(e) {
    self.pointY = window.scrollY;
  }

  render() {
    const { slides, messages, userList, tab, actionTags, loading } = this.state;

    const messagesList = messages.map((cell, index) => {
      return (
        <li className="message-cell" key={index}>
          <Message profile={cell.profile} post={cell} canLink={true} />
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
            slides.length ?
              <Carousel slides={slides} element={"div"} enterDelay={1000} leaveDelay={1000} speed={3000} />
              :
              ""
          }
        </div>
        <div className="topic-info">
          夜生活泛指人类从黄昏到凌晨时段盛行的活动。夜间活动一般被视为相对于日间劳动等正式活动，夜生活一词也常偏向休闲娱乐性质。
        </div>
        <div className={style.topicTab}>
          <p className={tab === 'new' ? `${style.tab} ${style.active}` : style.tab} onClick={this.tab.bind(this, 0)}>
            <span>
              最新
            </span>
          </p>
          <p className={tab !== 'new' ? `${style.tab} ${style.active}` : style.tab} onClick={this.tab.bind(this, 1)}>
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
          loading ? <LoadMore /> : ""
        }
        <ActionBar position={"bottom"} tags={actionTags} />
      </div>
    )
  }

  componentDidMount() {
    document.title = "Night+--社区";
    this._isMounted = true;
    const self = this;
    const { loading, loadSuccess, loadFail, dispatch, hideBar, match } = this.props;
    const id = match && match.params && match.params.id ? match.params.id : '';
    // alert(2);
    document.removeEventListener("touchstart", this.handleTouch);
    window.removeEventListener("scroll", this.handleScroll);
    document.addEventListener("touchstart", this.handleTouch);
    window.addEventListener("scroll", this.handleScroll);

    hideBar();
    // loading();

    getTopicById(id).then(res => {
      if (res.code === 200 && res.data.length) {
        self.setStateAynsc({
          actionTags: res.data[0].tags,
          tags: res.data[0].tags.map(cell => {
            return cell.tag
          })
        });
      }
    }).catch(error => {

    });
    this.fetch();

    // Promise.all([getCommunityBanner(), getPostList()]).then(data => {
    //   loadSuccess();
    //   self._isMounted && self.setState({
    //     slides: data[0].data,
    //     messages: data[1].data
    //   });
    // }, error => {
    //   loadFail();
    //   console.log(error);
    // });
  }

  componentWillUnmount() {
    this._isMounted = false;
    const { showBar, router, match } = this.props;
    const pathname = router.location.pathname;
    const reg = new RegExp(`^${BASENAME}publish|${BASENAME}topic|${BASENAME}message`);
    if (!reg.test(pathname)) {
      showBar();
    }
  }
}

const mapStateToProps = state => {
  const { router, appStatus } = state;
  return {
    router,
    appStatus
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
    delAll: () => {
      dispatch(delAll());
    }
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Topic));