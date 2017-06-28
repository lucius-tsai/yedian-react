/**
 * Created by townmi on 17/6/4.
 */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './publish.scss';

import VenuesCell from '../../components/VenuesCell';
import Tag from '../../components/Tag';

import { hideBar, showBar, deleteUnmount } from '../../store/actions/appStatus';
import { addPictures, removeTopic, removeVenues } from '../../store/actions/publish';

class Publish extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      topics: [],
      venues: null,
      tmpImages: []
    };
    this.submit = this.submit.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.removeTopic = this.removeTopic.bind(this);
    this.handleRemoveVenues = this.handleRemoveVenues.bind(this);
  }

  componentWillMount() {
    const { hideBar, publish, appStatus, router } = this.props;

    hideBar();
    this.setState({
      topics: publish.topics,
      venues: publish.venues,
      tmpImages: publish.pictures ? publish.pictures : []
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      topics: nextProps.publish.topics,
      venues: nextProps.publish.venues,
    })
  }

  submit() {
  }

  handleFileUpload(e) {
    const { addPictures } = this.props;
    const { tmpImages } = this.state;
    let fd = new FormData();
    const files = e.target.files;
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      fd.append("files", file);
      tmpImages.push(file)
    }
    this.setState({
      tmpImages: tmpImages
    });
    addPictures(tmpImages);
  }

  previewImage(file, e) {
    const reader = new FileReader();
    reader.onload = (function (pic) {
      return function (e) {
        if (pic) {
          pic.style.backgroundImage = `url(${e.target.result})`;
        }
      };
    })(e);
    reader.readAsDataURL(file);
  }
  loadPage() {

  }
  handleRemoveVenues(dom) {
    const self = this;
    let startX, startY, X, Y;
    console.log(dom);
    if (!dom) return false;
    if (dom.addEventListener) {
      dom.addEventListener("touchstart", (e) => {
        e.preventDefault();
        if (event.targetTouches.length > 1 || event.scale && event.scale !== 1) return;
        const touch = event.targetTouches[0];
        startX = touch.pageX;
        startY = touch.pageY;
      });
      dom.addEventListener("touchmove", (e) => {
        e.preventDefault();
        if (event.targetTouches.length > 1 || event.scale && event.scale !== 1) return;
        const touch = event.targetTouches[0];
        const moveEndX = touch.pageX;
        const moveEndY = touch.pageY;
        X = moveEndX - startX;
        Y = moveEndY - startY;
        // console.log(X, Y)
        if (X > -70 && X < 0) {
          dom.style.transform = `translateX(${X}px)`;
        }
      });
      dom.addEventListener("touchend", (e) => {
        e.preventDefault();
        
        if (X < -35) {
          dom.removeAttribute("style");
          dom.className = "venues-holder show-remove"
        } else {
          dom.removeAttribute("style");
          dom.className = "venues-holder"
        }

        /**
         * 处理 删除venues
         */
        if(e.target && e.target.className === "remove") {
          const { removeVenues } = self.props;
          return removeVenues();
        }
      });
    }
  }

  removeTopic(index) {
    const { topics } = this.state;
    const { removeTopic } = this.props;
    topics.splice(index, 1);
    removeTopic(topics);
  }

  removeVenue() {
    console.log(123);
  }

  render() {
    const { show, topics, venues, tmpImages, showRomeVenues } = this.state;
    const tmpImageStr = tmpImages.map((cell, index) => {
      return (
        <div className="pic" key={index} ref={this.previewImage.bind(this, cell)}></div>
      );
    });

    return (
      <div className="publish" style={show ? { display: "block" } : { display: "none" }}>
        <form action="" className="publish-form" ref={this.loadPage}>
          <textarea name="" id="" cols="30" rows="10" placeholder="Show出你的夜生活～"></textarea>
          <div className="pics-box">
            {tmpImageStr}
            <div className="file">
              <input type="file" multiple accept='image/*' onChange={this.handleFileUpload} />
            </div>
          </div>
          <div className="select">
            <p className="_cell">
              <Link to={{ pathname: `${BASENAME}search`, state: { type: "venues" } }}>
                <i className="icon ion-venues-address"></i> <span>所在地点</span> <i className="icon ion-angle-right"></i>
              </Link>
            </p>
            {
              venues ?
                <div className="venues-box">
                  <div className="venues-holder" ref={this.handleRemoveVenues}>
                    <VenuesCell simple={true} />
                    <div className="remove" onClick={this.removeVenue}>
                      <span className="remove">删除</span>
                    </div>
                  </div>
                </div>
                : ""
            }
          </div>
          <div className="select">
            <p className="_cell">
              <Link to={{ pathname: `${BASENAME}search`, state: { type: "topic" } }}>
                <i className="icon ion-topic"></i> <span>添加话题</span> <i className="icon ion-angle-right"></i>
              </Link>
            </p>
            <div className="tags-box">
              {
                topics ? topics.map((cell, index) => {
                  return <Tag word={cell.topic} cell={cell} remove={this.removeTopic.bind(this, index)} key={index} />
                })
                  : ""
              }
            </div>
          </div>
          <button className="publish-submit" onClick={this.submit}>发布</button>
        </form>
      </div>
    )
  }

  componentDidUpdate() {
    if(this.refs && this.refs.removeVenue && this.refs.removeVenue.addEventListener) {
      console.log(this.refs.removeVenue);
      this.refs.removeVenue.removeEventListener("click", this.removeVenue);
      this.refs.removeVenue.addEventListener("click", this.removeVenue);
    } 
  }

  componentWillUnmount() {
    const { showBar, appStatus, deleteUnmount, router } = this.props;
    if (router.location.pathname !== `${BASENAME}topic`) {
      showBar();
    }
  }
}

const mapStateToProps = state => {
  const { appStatus, router, publish } = state;
  return {
    router,
    publish,
    appStatus
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    hideBar: () => {
      dispatch(hideBar())
    },
    showBar: () => {
      dispatch(showBar())
    },
    addPictures: (cell) => {
      dispatch(addPictures(cell))
    },
    removeTopic: (cell) => {
      dispatch(removeTopic(cell))
    },
    removeVenues: () => {
      dispatch(removeVenues())
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Publish);