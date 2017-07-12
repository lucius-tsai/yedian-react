import React, { Component } from 'react';
import { connect } from 'react-redux';

import Carousel from '../../components/Carousel';
import Avator from '../../components/Avator';
import Message from '../../components/Message';
import ActionBar from '../../components/ActionBar';
import LoadMore from '../../components/LoadMore';

import './community.scss';
import { getCommunityBanner, getHomePostList, getIndexUserList } from '../../libs/api';

import { loading, loadSuccess, loadFail } from '../../store/actions/appStatus';


let pointY = null, unbind = false;

const f = () => {
  console.log(123123)
}

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
    this._isMounted = true;
    const { loading, loadSuccess, loadFail, dispatch } = this.props;
    loading();
    unbind = false
    Promise.all([getCommunityBanner(), getHomePostList()]).then(data => {
      loadSuccess();
      const messages = [], slides = [];
      data[1] && data[1].code === 200 && data[1].data.forEach(cell => {
        if (cell.postType === 0) {
          messages.push(cell);
        }
      });
      data[0] && data[0].code === 200 && data[0].data.forEach(cell => {
        slides.push(cell);
      });

      console.log(data);

      self._isMounted && self.setState({
        slides,
        messages,
        specialMessages: [],
        userList: []
      });
    }, error => {
      loadFail();
      console.log(error);
    });
  }

  componentWillReceiveProps(nextProps) {
    const { router } = nextProps
    if (this.props.router.location.pathname !== router.location.pathname) {
      unbind = true;
      document.removeEventListener("touchstart", this.handleTouch);
      window.removeEventListener("scroll", this.handleScroll);
      window.removeEventListener("click", f);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  handleScroll() {
    // console.log(this.isMounted);
    // return false;
    const self = this;
    this._isMounted = true;
    const { loading, messages } = self.state;
    const documentHeight = document.body.clientHeight;
    const scrollHeight = window.scrollY;
    const distance = documentHeight - scrollHeight;
    if (distance < 700 && !this.state.loading && pointY < scrollHeight && !unbind) {
      self._isMounted && self.setState({
        loading: true
      });

      getHomePostList().then(res => {
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
            messages: merge
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
  }
  handleTouch() {
    pointY = window.scrollY;
  }
  handleLoad(dom) {
    const self = this;
    const { loading, messages } = this.state;
    document.addEventListener("touchstart", this.handleTouch);
    window.addEventListener("scroll", this.handleScroll);
    window.addEventListener("click", f);
  }

  render() {
    const { slides, messages, userList, loading, specialMessages } = this.state;

    const messagesList = messages.map((cell, index) => {
      return (
        <li className="message-cell" key={index}>
          <Message profile={cell.profile} post={cell} canLink={true} />
        </li>
      )
    });

    const specialMessagesList = specialMessages.map((cell, index) => {
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
            {specialMessagesList}
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
        {
          loading ? <LoadMore /> : ""
        }
        <ActionBar />
      </div>
    )
  }

  componentDidMount() {
    document.title = "Night+--社区";
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
    console.log(12333333)
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