import React, { Component } from 'react';
import { connect } from 'react-redux';

import Carousel from '../../components/Carousel';
import Avator from '../../components/Avator';
import Message from '../../components/Message';
import ActionBar from '../../components/ActionBar';
import './community.scss';
import { getTopicBanner, getIndexMessage, getIndexUserList } from '../../libs/api';

import { loading, loadSuccess, loadFail } from '../../store/actions/appStatus';

class Community extends Component {

  constructor(props) {
    super(props);
    this.state = {
      slides: [],
      messages: [],
      userList: []
    }
    this.handleLoad = this.handleLoad.bind(this);
  }

  componentWillMount() {
    const self = this;
    const { loading, loadSuccess, loadFail, dispatch } = this.props;
    loading();

    Promise.all([getTopicBanner(), getIndexMessage(), getIndexUserList()]).then(data => {
      loadSuccess();
      self.setState({
        slides: data[0].data,
        messages: data[1].data,
        userList: data[2].data
      });
    }, error => {
      loadFail();
      console.log(error);
    });
  }

  componentWillReceiveProps(nextProps) {
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  fetchMessages() {

  }

  handleLoad(dom) {
    const { appStatus, router } = state;
    window.addEventListener("scroll", () => {
      const documentHeight = document.body.clientHeight;
      const scrollHeight = window.scrollY;
      if (documentHeight - scrollHeight < 700) {
        console.log("loading more");
      }
    })
  }


  render() {
    const { slides, messages, userList } = this.state;

    const messagesList = messages.map((cell, index) => {
      return (
        <li className="message-cell" key={index}>
          <Message profile={cell.profile} message={cell.message} canLink={true} />
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
            slides.length ?
              <Carousel slides={slides} element={"div"} enterDelay={1000} leaveDelay={1000} speed={3000} />
              :
              ""
          }
        </div>
        <div className="news-timeLine clearfix">
          <div className="_title">
            最新<br />动态
          </div>
          <div className="_message">
            <Avator size={"sx"} />
          </div>
          <p className="_text">芹菜啊刚刚发布了一条动态</p>
        </div>

        <div className="section">
          <ul>
            {messagesList}
          </ul>
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
        <ActionBar />
      </div>
    )
  }

  componentDidMount() {
    document.title = "Night+--社区";
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

export default connect(mapStateToProps, mapDispatchToProps)(Community);