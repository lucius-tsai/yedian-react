import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Avator from '../Avator';
import CTABar from '../CTABar';
import './message.scss';

const defaultMessage = {
  description: "呃呃呃～算是吧～",
  pictures: [
    "http://onq4xhob0.bkt.clouddn.com/bdc270ac6e5642b880b60b002e3a81a6.jpeg"
  ]
};

/**
 * [社区消息组件]
 * post 消息对象
 * canLink 消息卡片是否可以点击
 * showFollow 是否可以关注
 * __showComment 子组件CTABar 是否显示评论输入框
 * @class Message
 * @extends {Component}
 */
class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: defaultMessage,
      canLink: false,
      showFollow: true,
      __showComment: false
    };

    this.lazyLoadPictures = this.lazyLoadPictures.bind(this);
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
          if (cell.getAttribute('class') === 'single') {
            cell.style.height = `${cellWidth * image.height / image.width}px`;
          }
        }
        delete this.refs[i];
      }
    }
  }

  render() {
    const { post, canLink, showFollow, disabledLink, __showComment } = this.state;
    const { __parentOpenComment } = this.props;
    let message = null;
    const affiliates = post.affiliates;

    if (post && post.postType === 0) {
      message = post.message;
    } else if (post && post.postType === 1) {
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
        <div className='single' style={{ height: `${cellWidth * 12 / 7}px`, backgroundColor: `rgb(${random()}, ${random()}, ${random()})` }} ref={`lazyImages-${new Date().getTime()}`} data-src={message.images[0]}>
        </div>
      );
    } else if (message.images && message.images.length > 1) {
      picturesList = message.images.map((cell, index) => {
        return (
          <div className="img-single" key={`${post._id}${index}`} style={{ backgroundColor: `rgb(${random()}, ${random()}, ${random()})`, height: `${cellWidth}px` }} ref={`lazyImages-${new Date().getTime()}-${index}`} data-src={cell}>
          </div>
        )
      });
    }
    return (
      <div className="card-message">
        <div className="card-message-top">
          <Avator profile={post.postedBy} showFollow={showFollow} model={"default"} disabledLink={disabledLink} affiliates={affiliates} />
        </div>
        {
          !canLink && <div className="card-message-content">
            <h4>{message.description}</h4>
            {
              message.images.length > 1 ?
                <div className="imgs">
                  {picturesList}
                </div>
                :
                <div className="img-single">
                  {picturesList}
                </div>
            }
            <div className="topics">
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
          canLink && post.postType === 0 && <Link className="card-message-content clearfix" to={{ pathname: `${BASENAME}message/${post._id}`, state: { id: post._id } }}>
            <h4>{message.description}</h4>
            {
              message.images && message.images.length > 1 ?
                <div className="imgs">
                  {picturesList}
                </div>
                :
                <div className="img-single">
                  {picturesList}
                </div>
            }
          </Link>
        }
        {
          canLink && post.postType === 1 && <a className="card-message-content clearfix" href={`${location.origin}/dist/?#!/venues/event/${post._id}${query}`}>
            <h4>{message.description}</h4>
            {
              message.images && message.images.length > 1 ?
                <div className="imgs">
                  {picturesList}
                </div>
                :
                <div className="img-single">
                  {picturesList}
                </div>
            }
          </a>
        }
        {
          <div className={"card-message-bottom"}>
            <CTABar fix={canLink} post={post} __showComment={__showComment} />
          </div>
        }
      </div>
    )
  }

  componentDidMount() {
    const { post } = this.state;
    window.addEventListener("scroll", this.lazyLoadPictures);
    this.lazyLoadPictures();
  }

  componentDidUpdate() {
    const { post } = this.state;
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.lazyLoadPictures)
  }
}

// const mapStateToProps = state => {
//   const { router } = state;
//   return {
//     router
//   }
// };

// const mapDispatchToProps = (dispatch) => {
//   return {}
// };

// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Message));
export default Message;