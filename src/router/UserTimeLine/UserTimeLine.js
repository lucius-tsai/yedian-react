import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import './userTimeLine.scss';

import Avator from '../../components/Avator';
import Message from '../../components/Message';

import { getHomePostList } from '../../libs/api';
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
    const { loading, loadSuccess, loadFail, location } = this.props;
    // loading();
    this.setState({
      user: location.state
    });
    this.fetch();
    // getIndexMessage().then(data => {
    //   loadSuccess();
    //   self.setState({
    //     messages: data.data
    //   });
    // }, error => {
    //   loadFail();
    //   console.log(error);
    // });
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
        !unbind && self.setState({
          loading: false,
          messages: merge,
          pagination: {
            pageSize: 10,
            current: pagination.current++
          }
        });
      } else {
        self.setState({
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
          <Message profile={cell.profile} post={cell} canLink={true} showFollow={false} />
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