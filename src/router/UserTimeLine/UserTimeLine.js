import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

import './userTimeLine.scss';

import Avator from '../../components/Avator';
import Message from '../../components/Message';

import {getIndexMessage} from '../../libs/api';
import {loading, loadSuccess, loadFail} from '../../store/actions/appStatus';

class UserTimeLine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    }
  }

  componentWillMount() {
    const self = this;
    const {loading, loadSuccess, loadFail, dispatch} = this.props;
    loading();

    getIndexMessage().then(data => {
      loadSuccess();
      self.setState({
        messages: data.data
      });
    }, error => {
      loadFail();
      console.log(error);
    });

  }

  render() {
    const {messages} = this.state;
    const messagesList = messages.map((cell, index) => {
      return (
        <li className="message-cell" key={index}>
          <Message profile={cell.profile} message={cell.message} canLink={true} showFollow={false}/>
        </li>
      )
    });
    return (
      <div className="user-time-line">
        <div className="_top">
          <Avator style={"vertical"} profile={{avator: "http://www.wangmingdaquan.cc/tx61/66.jpg", username: "towne"}}
                  size={"small"} model={"userTimeLine"} showFollow={true}/>
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
  const {appStatus, router} = state;
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