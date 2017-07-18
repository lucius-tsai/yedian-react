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

import { getCommunityBanner, getPostList, getIndexUserList } from '../../libs/api';

import { loading, loadSuccess, loadFail } from '../../store/actions/appStatus';
import { delAll } from '../../store/actions/publish';


let pointY = null;

class Community extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slides: [],
      dynamicMessages: [],
      messages: [],
      userList: [],
      loading: false,
      pagination: {
        pageSize: 5,
        current: 1
      },
      completed: false,
    };
    this.handleLoad = this.handleLoad.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.fetch = this.fetch.bind(this);
    this.pointY = null;
  }

  componentWillMount() {
    const { delAll } = this.props;
    delAll();
  }

  componentWillReceiveProps(nextProps) {

  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  fetch() {
    const self = this;
    const { pagination, messages } = this.state;
    const { loading, loadSuccess, loadFail } = this.props;

    if (messages.length === pagination.total) {
    }

    if (this.state.completed || this.state.loading) {
      return false;
    }
    
    const offset = !(pagination.current - 1) ? pagination.pageSize : (pagination.current - 1) * pagination.pageSize;

    this.setState({
      loading: true,
    }, () => {
      getPostList({
        limit: pagination.pageSize,
        offset
      }).then(res => {
        if (res.code === 200) {

          const list = [], total = res.count;

          const merge = messages.concat(res.data);

          if (merge.length === total) {
            document.removeEventListener("touchstart", this.handleTouch);
            window.removeEventListener("scroll", this.handleScroll);
            self.setState({
              completed: true
            });
          }

          if (!res.data.length) {
            document.removeEventListener("touchstart", this.handleTouch);
            window.removeEventListener("scroll", this.handleScroll);
            self.setState({
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
          
        } else {
          self.setState({
            loading: false
          })
        }
      }, error => {
        self.setState({
          loading: false
        })
      });
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
  handleLoad(dom) {
  }

  render() {
    const { slides, messages, userList, loading, dynamicMessages } = this.state;

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
      <div className="community" ref={this.handleLoad}>
        <div className="banner">
          {
            slides.length ?
              <Carousel slides={slides} element={"div"} enterDelay={1000} leaveDelay={1000} speed={3000} />
              :
              ""
          }
        </div>
        <div className={style.newsTimeLine}>
          <div className={style.title}>
            最新<br />动态
          </div>
          <div className={style.message}>
            <div className="message-cell clearfix">
              {
                dynamicMessages.length ?

                  <DaynimcMessage list={dynamicMessages} enterDelay={1000} leaveDelay={1000} speed={3000} />
                  : ""
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
          loading ? <LoadMore /> : ""
        }
        <ActionBar />
      </div>
    )
  }

  componentDidMount() {
    const self = this;
    this._isMounted = true;

    document.title = "Night+--社区";
    const { messages, pagination } = this.state;
    const { loading, loadSuccess, loadFail } = this.props;

    document.removeEventListener("touchstart", this.handleTouch);
    window.removeEventListener("scroll", this.handleScroll);
    document.addEventListener("touchstart", this.handleTouch);
    window.addEventListener("scroll", this.handleScroll);

    self.setState({
      loading: true
    }, () => {
      Promise.all([getCommunityBanner(), getPostList({
        limit: pagination.pageSize,
        offset: (pagination.current - 1) * pagination.pageSize
      })]).then(data => {
        const messages = [], slides = [], total = data[1].count;
        data[1] && data[1].code === 200 && data[1].data.forEach(cell => {
          if (cell.postType === 0) {
            messages.push(cell);
          } else if (cell.postType === 1) {
            let images = [], description = '';
            cell.defaultComponents && cell.defaultComponents.forEach(item => {
              switch (item.name) {
                case 'component-banner':
                  images = [item.content[0].url];
                  break;
                default:
                  break;
              }
            });
            cell.customizedComponents && cell.customizedComponents.forEach(item => {
              switch (item.name) {
                case 'component-paragraph':
                  description = item.content;
                  break;
                default:
                  break;
              }
            });
            cell.message = { description, images };
            messages.push(cell);
          }
        });

        data[0] && data[0].code === 200 && data[0].data.forEach(cell => {
          slides.push(cell);
        });

        self._isMounted && self.setState({
          slides,
          messages,
          dynamicMessages: messages,
          userList: [],
          loading: false,
          pagination: {
            total,
            pageSize: pagination.pageSize,
            current: (pagination.current + 1)
          }
        });
      }, error => {
        self.setState({
          loading: false
        });
        console.log(error);
      });
    });
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
    router,
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
    delAll: () => {
      dispatch(delAll())
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Community);