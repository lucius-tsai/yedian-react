import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import './userTimeLine.scss';

import Avator from '../../components/Avator';
import Message from '../../components/Message';

import { getHomePostList, getUserInfoById } from '../../libs/api';
import { loading, loadSuccess, loadFail } from '../../store/actions/appStatus';


let pointY = null, unbind = false;

class UserTimeLine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      loading: false,
      pagination: {
        pageSize: 10,
        current: 1
      },
      user: null
    }
    this.fetch = this.fetch.bind(this);
  }

  componentWillMount() {
    const self = this;
    this._isMounted = true;
    const { loading, loadSuccess, loadFail, location, match } = this.props;
    // loading();
    if(location.state) {
      this.setState({
        user: location.state
      });
    } else {
      if(match && match.params && match.params.id) {
        getUserInfoById(match.params.id).then(res => {
          if(res.code === 200) {
            self._isMounted && self.setState({
              user: {
                displayName: res.data.displayName,
                _id: res.data.id,
                userType: 'User',
                headImgUrl: res.data.Wechat.headimgurl
              }
            });
          }
        }, error => {

        })
      }
      
      // this.setState({
      //   user: {
      //     displayName: 'test',
      //     _id: 'xxx'
      //   }
      // });
    }
    this.fetch();
  }

  fetch() {
    const self = this;
    const { pagination, messages } = this.state;
    const { loading, loadSuccess, loadFail } = this.props;
    getHomePostList({
      limit: pagination.pageSize,
      offset: (pagination.current - 1) * pagination.pageSize
    }).then(res => {
      if (res.code === 200) {
        const list = [];
        res.data.forEach(cell => {
          if (cell.postType === 0) {
            list.push(cell);
          }
        });
        const merge = messages.concat(list);
        // console.log(res)
        !unbind && self._isMounted && self.setState({
          loading: false,
          messages: merge,
          pagination: {
            pageSize: 10,
            current: pagination.current++
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
  }

  render() {
    const { messages, user } = this.state;
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
      </div>
    )
  }

  componentDidMount() {
    document.title = "Night+--社区";
    this._isMounted = true;
    document.body.scrollTop = 0;
  }

  componentWillUnmount() {
    this._isMounted = false;
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