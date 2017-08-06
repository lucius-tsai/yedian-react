import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import Avator from '../Avator';
import CTABar from '../CTABar';

// lightGallery
import 'lightgallery.js';
import 'lightgallery.js/src/css/lightgallery';

const defaultMessage = {
  description: "not found error",
  pictures: []
};

import {
  deletePost
} from '../../libs/api.js';

import {
  putPostList
} from '../../store/actions/posts';


import styles from './message.scss';
import styleBase from "../../assets/scss/base";

/**
 * [社区消息组件]
 * post 消息对象
 * canLink 消息卡片是否可以点击
 * showFollow 是否可以关注
 * @class Message
 * @extends {Component}
 */
class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: defaultMessage,
      canLink: false,
      showFollow: false,
      __showComment: false
    };

    this.lazyLoadPictures = this.lazyLoadPictures.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    const { post, canLink, showFollow, disabledLink, __showComment } = this.props;
    this.setState({
      post: post ? post : defaultMessage,
      canLink: canLink === true,
      showFollow: showFollow,
      disabledLink: disabledLink ? disabledLink : false,
      __showComment
    });
  }

  componentWillReceiveProps(nextProps) {
    const { post, canLink, showFollow, disabledLink, __showComment } = nextProps;
    this.setState({
      post: post ? post : defaultMessage,
      canLink: canLink === true,
      showFollow: showFollow,
      disabledLink: disabledLink ? disabledLink : false,
      __showComment
    })
  }

  lazyLoadPictures(e) {
    const cellWidth = window.innerWidth > 414 ? (414 - 20) : (window.innerWidth - 20);
    const currentScrollY = window.scrollY + window.innerHeight - 40;
    for (const i in this.refs) {
      const cell = this.refs[i];
      if (cell.offsetTop < currentScrollY) {
        const originSrc = cell.getAttribute("data-src");
        let image = new Image();
        image.src = originSrc;
        image.onload = function () {
          cell.style.backgroundImage = `url(${originSrc})`;
          cell.style.backgroundColor = 'transparent';
          if (cell && cell.dataset && cell.dataset.origin === 'single') {
            cell.style.height = `${cellWidth * image.height / image.width}px`;
          }
        }
        delete this.refs[i];
      }
    }
  }

  deletePost(cb) {
    // return false;
    const { post } = this.state;
    const { posts, putPostList } = this.props;
    const localPosts = Object.assign({}, JSON.parse(JSON.stringify({ o: posts }))).o;
    deletePost(post._id).then(res => {
      if (res.code === 200) {
        localPosts.every((cell, index) => {
          if (post._id === cell._id) {
            localPosts.splice(index, 1);
            return false;
          } else {
            return true;
          }
        });
        putPostList(localPosts);
        cb && cb();
      }
    }, error => {
      cb && cb();
    });
  }

  handleClick(ref) {
    const self = this;
    const className = ref && ref.className;
    ref && ref.addEventListener && ref.addEventListener('click', (e) => {
      if (e && e.target && e.target.dataset && e.target.dataset.origin === 'delete') {
        ref.className = `${ref.className} bounceOutRight animated`;
      }
    });

    ref && ref.addEventListener && ref.addEventListener('webkitAnimationEnd', (e) => {
      self.deletePost(() => {
        self.lazyLoadPictures();
        ref.className = className;
      });
    });
  }

  render() {
    const { post, canLink, showFollow, disabledLink, __showComment } = this.state;
    const { __parentOpenComment } = this.props;
    let message = null;
    const affiliates = post.affiliates;

    if (post && post.postType === 0) {
      message = post.message;
    } else if (post && post.postType === 1) {
      /**
       * 正对商家活动，特殊处理
       */
      message = {};
      post.defaultComponents && post.defaultComponents.forEach(cell => {
        switch (cell.name) {
          case 'component-banner':
            message.images = [cell.content[0].url];
            break;
          default:
            break;
        }
      });

      post.customizedComponents && post.customizedComponents.forEach(cell => {
        if (cell.name === 'component-paragraph') {
          message.description = cell.content;
        }
      });
    }

    const tags = post.tags;
    const query = '?fromwhere=community';

    if (!message) {
      return (<div></div>)
    }
    const cellWidth = window.innerWidth > 414 ? (414 - 20) * 0.32 : (window.innerWidth - 20) * 0.32;
    let picturesList = "";
    const random = () => {
      return Math.floor(Math.random() * 255);
    }
    if (message.images && message.images.length === 1) {
      picturesList = (
        <div className={styles['single']} data-origin='single' style={{ height: `${cellWidth * 12 / 7}px`, backgroundColor: `rgb(${random()}, ${random()}, ${random()})` }} ref={`lazyImages-${new Date().getTime()}`} data-src={message.images[0]}>
        </div>
      );
    } else if (message.images && message.images.length > 1) {
      picturesList = message.images.map((cell, index) => {
        return (
          <div data-origin='picture' className={styles["img-single"]} key={`${post._id}${index}`} style={{ backgroundColor: `rgb(${random()}, ${random()}, ${random()})`, height: `${cellWidth}px` }} ref={`lazyImages-${new Date().getTime()}-${index}`} data-src={cell}>
          </div>
        )
      });
    }
    return (
      <div className={styles["card-message"]} ref={this.handleClick} key={post._id}>
        <div className={styles["card-message-top"]}>
          <Avator profile={post.postedBy} date={post.createdAt} showFollow={showFollow} model={"default"} disabledLink={disabledLink} affiliates={affiliates} />
        </div>
        {
          !canLink && <div className={styles["card-message-content"]}>
            <h4>{message.description}</h4>
            {
              message.images.length > 1 ?
                <div className={styles["imgs"]} id="lightgallery">
                  {picturesList}
                </div>
                :
                <div className={styles["img-single"]}>
                  {picturesList}
                </div>
            }
            <div className={styles["topics"]}>
              {
                tags.map(cell => {
                  return (<a key={cell._id}>{`#${cell.tag}#`}</a>)
                })
              }
              {/* <span className="city">上海</span> */}
            </div>
          </div>
        }
        {
          canLink && post.postType === 0 && <Link className={`${styles['card-message-content']} ${styleBase['clearfix']}`} to={{ pathname: `${BASENAME}message/${post._id}`, state: { id: post._id } }}>
            <h4>{message.description}</h4>
            {
              message.images && message.images.length > 1 ?
                <div className={styles["imgs"]}>
                  {picturesList}
                </div>
                :
                <div className={styles["img-single"]}>
                  {picturesList}
                </div>
            }
          </Link>
        }
        {
          canLink && post.postType === 1 && <a className={`${styles['card-message-content']} ${styleBase['clearfix']}`} href={`${location.origin}/dist/?#!/venues/event/${post._id}${query}`}>
            <h4>{message.description}</h4>
            {
              message.images && message.images.length > 1 ?
                <div className={styles["imgs"]}>
                  {picturesList}
                </div>
                :
                <div className={styles["img-single"]}>
                  {picturesList}
                </div>
            }
          </a>
        }
        {
          <div className={styles["card-message-bottom"]}>
            <CTABar fix={canLink} post={post} __showComment={__showComment} />
          </div>
        }
      </div>
    )
  }

  componentDidMount() {
    const { post, canLink } = this.state;
    window.addEventListener("scroll", this.lazyLoadPictures);
    this.lazyLoadPictures();
    !canLink && lightGallery(document.getElementById('lightgallery'), {
      mode: 'lg-fade',
      cssEasing : 'cubic-bezier(0.25, 0, 0.25, 1)',
      fullScreen: true,
      download: false
    });
  }

  componentDidUpdate() {
    const { post } = this.state;
    this.lazyLoadPictures();
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.lazyLoadPictures)
  }
}

const mapStateToProps = state => {
  const { posts } = state;
  return {
    posts: posts.posts || []
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    putPostList: (cell) => {
      dispatch(putPostList(cell))
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Message);
// export default Message;