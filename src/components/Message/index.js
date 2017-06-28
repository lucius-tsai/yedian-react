import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import Avator from '../Avator';
import CTABar from '../CTABar';
import './message.scss';

const defaultProfile = {
  avator: "http://www.wangmingdaquan.cc/tx61/66.jpg",
  username: "towne",
  date: "2017-10-8"
};
const defaultMessage = {
  description: "呃呃呃～算是吧～",
  pictures: [
    "http://onq4xhob0.bkt.clouddn.com/bdc270ac6e5642b880b60b002e3a81a6.jpeg"
  ]
};

class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: defaultProfile,
      message: defaultMessage,
      canLink: false,
      showFollow: true
    };
    this.go = this.go.bind(this);
    this.lazyLoadPictures = this.lazyLoadPictures.bind(this);
  }

  componentWillMount() {
    const {profile, message, canLink, showFollow} = this.props;

    this.setState({
      profile: profile ? profile : defaultProfile,
      message: message ? message : defaultMessage,
      canLink: canLink === true,
      showFollow: showFollow
    });
  }

  componentWillReceiveProps(nextProps) {
    const {profile, message, canLink, showFollow} = nextProps;
    this.setState({
      profile: profile ? profile : defaultProfile,
      message: message ? message : defaultMessage,
      canLink: canLink === true,
      showFollow: showFollow
    })
  }

  go(event, router) {
    console.log(this);
    console.log(event, router);
    if (router) {
    }
  }

  lazyLoadPictures () {
    const currentScrollY = window.scrollY + window.innerHeight - 30;
    for(const i in this.refs) {
      const cell = this.refs[i];
      if(cell.offsetTop < currentScrollY) {
        const originSrc = cell.getAttribute("data-src");
        cell.style.backgroundImage = `url(${originSrc})`;
        delete this.refs[i];
      }
    }
  }

  render() {
    const {profile, message, canLink, showFollow} = this.state;
    const cellWidth = window.innerWidth > 414 ? (414 - 20) * 0.32 : (window.innerWidth - 20) * 0.32;
    let picturesList = "";
    if (message.pictures.length === 1) {
      picturesList = (
        <img src={message.pictures[0]} alt="" data-src={message.pictures[0]}/>
      );
    } else if (message.pictures.length > 1) {
      picturesList = message.pictures.map((cell, index) => {
        return (
          <div className="img-single" key={index} style={{backgroundColor: `#3023AE`, height: `${cellWidth}px`}} ref={`lazyImages-${new Date().getTime()}-${index}`} data-src={cell}>
          </div>
        )
      });
    }
    return (
      <div className="card-message">
        <div className="card-message-top">
          <Avator profile={profile} showFollow={showFollow} model={"default"}/>
        </div>
        {
          !canLink ?
            <div className="card-message-content">
              <h4>{message.description}</h4>
              {
                message.pictures.length > 1 ?
                  <div className="imgs">
                    {picturesList}
                  </div>
                  :
                  <p className="img-single">
                    {picturesList}
                  </p>
              }
              <div className="topics">
                <a href="#">#最浪漫的夜生活#</a>
                <a href="#">#最浪漫的夜生活#</a>
                <span className="city">上海</span>
              </div>
            </div>
            :
            <Link className="card-message-content clearfix" to={{pathname: `${BASENAME}message/123`}}>
              <h4>{message.description}</h4>
              {
                message.pictures.length > 1 ?
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
          <div className={"card-message-bottom"}>
            <CTABar fix={canLink}/>
          </div>
        }

      </div>
    )
  }

  componentDidMount() {
    window.addEventListener("scroll", this.lazyLoadPictures);
    this.lazyLoadPictures();

  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.lazyLoadPictures)
  }
}

const mapStateToProps = state => {
  const {router} = state;
  return {
    router
  }
};

const mapDispatchToProps = (dispatch) => {
  return {}
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Message));
// export default Message;