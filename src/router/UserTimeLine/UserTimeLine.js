import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import './userTimeLine.scss';

import Avator from '../../components/Avator';
import Message from '../../components/Message';
import LoadMore from '../../components/LoadMore';

import { getPostList, getUserInfoById } from '../../libs/api';
import { loading, loadSuccess, loadFail } from '../../store/actions/appStatus';

class UserTimeLine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      loading: false,
      pagination: {
        pageSize: 3,
        current: 1
      },
      user: null,
      completed: false
    }
    
    this.handleScroll = this.handleScroll.bind(this);
    this.fetch = this.fetch.bind(this);
    this.pointY = null;
  }

  setStateAynsc(state) {
    return new Promise((resolve, reject) => {
      this.setState(state, resolve);
    });
  }

  componentWillMount() {

  }

  fetch() {
    const self = this;
    const { pagination, messages, user } = this.state;
    const { loading, loadSuccess, loadFail } = this.props;

    if (messages.length === pagination.total) {

    }

    if (this.state.completed || this.state.loading) {
      return false;
    }
    const offset = (pagination.current - 1) * pagination.pageSize;

    if (user && user._id) {
      this.setStateAynsc({
        loading: true
      }).then(() => {
        getPostList({
          _posterId: user._id,
          limit: pagination.pageSize,
          offset: offset
        }).then(res => {
          if (res.code === 200) {
            const list = [], total = res.count;;
            res.data.forEach(cell => {
              if (cell.postType === 0) {
                list.push(cell);
              }
            });
            const merge = messages.concat(list);
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
              loading: false,
              messages: merge,
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
        }, error => {
          self._isMounted && self.setState({
            loading: false
          });
        });
      });
    }
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
    const { messages, user, loading } = this.state;
    const messagesList = messages.map((cell, index) => {
      return (
        <li className="message-cell" key={index}>
          <Message profile={cell.profile} post={cell} canLink={true} showFollow={false} disabledLink={true} />
        </li>
      )
    });
    return (
      <div className="user-time-line">
        <div className="_top">
          {
            user ?
              <Avator style={"vertical"} profile={user}
                size={"small"} model={"userTimeLine"} showFollow={true} disabledLink={true} />
              : ''
          }
        </div>
        <div className="_messages">
          <ul>
            {messagesList}
          </ul>
        </div>
        {
          loading ? <LoadMore /> : ""
        }
      </div>
    )
  }

  componentDidMount() {
    const self = this;
    this._isMounted = true;

    document.title = "Night+--社区";
    document.body.scrollTop = 0;

    document.removeEventListener("touchstart", this.handleTouch);
    window.removeEventListener("scroll", this.handleScroll);
    document.addEventListener("touchstart", this.handleTouch);
    window.addEventListener("scroll", this.handleScroll);

    const { loading, loadSuccess, loadFail, location, match } = this.props;
    // loading();
    if (location.state) {
      this.setStateAynsc({
        user: location.state
      }).then(() => {
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
              this.fetch();
            });
          }
        }, error => {

        })
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    document.removeEventListener("touchstart", this.handleTouch);
    window.removeEventListener("scroll", this.handleScroll);
  }
}

const mapStateToProps = state => {
  const { appStatus, router } = state;
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
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(UserTimeLine);