import React, {Component} from 'react';
import {connect} from 'react-redux';

import Carousel from '../../components/Carousel';
import Avator from '../../components/Avator';
import Message from '../../components/Message';
import ActionBar from '../../components/ActionBar';
import LoadMore from '../../components/LoadMore';

import './community.scss';
import {getTopicBanner, getIndexMessage, getIndexUserList} from '../../libs/api';

import {loading, loadSuccess, loadFail} from '../../store/actions/appStatus';


let pointY = null;

class Community extends Component {

  constructor(props) {
    super(props);
    this.state = {
      slides: [],
      specialMessages: [],
      messages: [],
      userList: [],
      loading: false
    };
    this.handleLoad = this.handleLoad.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentWillMount() {
    const self = this;
    const {loading, loadSuccess, loadFail, dispatch} = this.props;
    loading();

    Promise.all([getTopicBanner(), getIndexMessage(), getIndexUserList()]).then(data => {
      loadSuccess();
      self.setState({
        slides: data[0].data,
        messages: data[1].data,
        specialMessages: data[1].data,
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

  handleScroll() {
    const self = this;
    const {loading, messages} = self.state;
    const documentHeight = document.body.clientHeight;
    const scrollHeight = window.scrollY;
    const distance = documentHeight - scrollHeight;
    if (distance < 700 && !self.state.loading && pointY < scrollHeight) {
      self.setState({
        loading: true
      });
      console.log("loading more");
      getIndexMessage().then(res => {
        const merge = messages.concat(res.data);
        // console.log(res)
        self.setState({
          loading: false,
          messages: merge
        });
      }, error => {

      });
    }
  }

  handleLoad(dom) {
    const self = this;
    const {loading, messages} = this.state;
    document.addEventListener("touchstart", (e) => {
      pointY = window.scrollY;
    });

    window.addEventListener("scroll", this.handleScroll);

    document.addEventListener("touchend", (e) => {
      // pointY = window.scrollY;
    });
  }


  render() {
    const {slides, messages, userList, loading, specialMessages} = this.state;

    const messagesList = messages.map((cell, index) => {
      return (
        <li className="message-cell" key={index}>
          <Message profile={cell.profile} message={cell.message} canLink={true}/>
        </li>
      )
    });

    const specialMessagesList = specialMessages.map((cell, index) => {
      return (
        <li className="message-cell" key={index}>
          <Message profile={cell.profile} message={cell.message} canLink={true}/>
        </li>
      )
    });

    const userListStr = userList.map((cell, index) => {
      return (
        <li key={index}>
          <Avator style={"vertical"} profile={cell} size={"small"} model={"followCard"} showFollow={true}/>
        </li>
      )
    });

    return (
      <div className="community" ref={this.handleLoad}>
        <div className="banner">
          {
            slides.length ?
              <Carousel slides={slides} element={"div"} enterDelay={1000} leaveDelay={1000} speed={3000}/>
              :
              ""
          }
        </div>
        <div className="news-timeLine clearfix">
          <div className="_title">
            最新<br />动态
          </div>
          <div className="_message">
            <Avator size={"sx"}/>
          </div>
          <p className="_text">芹菜啊刚刚发布了一条动态</p>
        </div>

        <div className="section">
          <ul>
            {specialMessagesList}
          </ul>
        </div>
        <div className="section section-follow">
          <ul className="follow-list clearfix" style={{width: `${userList.length * 137 - 7}px`}}>
            {userListStr}
          </ul>
        </div>
        <div className="section">
          <ul>
            {messagesList}
          </ul>
        </div>
        {
          loading ? <LoadMore/> : ""
        }
        <ActionBar />
      </div>
    )
  }

  componentDidMount() {
    document.title = "Night+--社区";
  }

  componentWillUnmount() {
    const self = this;
    document.removeEventListener("touchstart", () => {
    });
    window.removeEventListener("scroll", this.handleScroll);
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

export default connect(mapStateToProps, mapDispatchToProps)(Community);