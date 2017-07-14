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
 * @class Message
 * @extends {Component}
 */
class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: defaultMessage,
      canLink: false,
      showFollow: true
    };

    this.lazyLoadPictures = this.lazyLoadPictures.bind(this);
  }

  componentWillMount() {
    const { post, canLink, showFollow, disabledLink } = this.props;
    this.setState({
      post: post ? post : defaultMessage,
      canLink: canLink === true,
      showFollow: showFollow,
      disabledLink: disabledLink ? disabledLink : false
    });
  }

  componentWillReceiveProps(nextProps) {
    const { post, canLink, showFollow, disabledLink } = nextProps;
    this.setState({
      post: post ? post : defaultMessage,
      canLink: canLink === true,
      showFollow: showFollow,
      disabledLink: disabledLink ? disabledLink : false
    })
  }

  lazyLoadPictures(e) {
    const currentScrollY = window.scrollY + window.innerHeight - 40;
    for (const i in this.refs) {
      const cell = this.refs[i];
      if (cell.offsetTop < currentScrollY) {
        const originSrc = cell.getAttribute("data-src");
        cell.style.backgroundImage = `url(${originSrc})`;
        delete this.refs[i];
      }
    }
    e && e.target && e.target.removeEventListener(e.type, this.lazyLoadPictures);
  }

  render() {
    const { post, canLink, showFollow, disabledLink } = this.state;
    const message = post.message;
    const affiliates = post.affiliates;
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
        <img src={message.images[0]} alt="" data-src={message.images[0]} />
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
          <Avator profile={post.postedBy} showFollow={showFollow} model={"default"} disabledLink={disabledLink} affiliates={affiliates}/>
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
                <p className="img-single">
                  {picturesList}
                </p>
            }
            <div className="topics">
              {
                tags.map(cell => {
                  return (<a key={cell._id}>{`#${cell.tag}#`}</a>)
                })
              }
              <span className="city">上海</span>
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
                <p className="img-single">
                  {picturesList}
                </p>
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
                <p className="img-single">
                  {picturesList}
                </p>
            }
          </a>
        }
        {
          <div className={"card-message-bottom"}>
            <CTABar fix={canLink} post={post} />
          </div>
        }

      </div>
    )
  }

  componentDidMount() {
    const { post } = this.state;
    window.addEventListener("scroll", this.lazyLoadPictures);
    if (post && post.message && post.message.images) {
      this.lazyLoadPictures();
    }
  }

  componentDidUpdate() {
    const { post } = this.state;
    if (post && post.message && post.message.images) {
      this.lazyLoadPictures();
    }
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