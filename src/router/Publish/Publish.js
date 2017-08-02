/**
 * Created by townmi on 17/6/4.
 */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import VenuesCell from '../../components/VenuesCell';
import Tag from '../../components/Tag';

import {
  hideBar,
  showBar,
  deleteUnmount
} from '../../store/actions/appStatus';
import {
  addPictures,
  addTag,
  removeTag,
  removeVenues,
  saveDescription
} from '../../store/actions/publish';

import { postMessage, uploadFile } from '../../libs/api';
import { minSizeImage } from '../../libs/uitls';
import { reSetShare } from '../../libs/wechat';
import { trackPageView, trackPageLeave } from '../../libs/track';

import styles from './publish.scss';
import styleIcons from "../../icons/scss/ionicons";

class Publish extends Component {
  constructor(props) {
    super(props);
    this.state = {
      track: {
        pageName: 'community_publish',
        startTime: null,
      },
      show: true,
      description: '',
      tags: [],
      venues: null,
      tmpImages: [],
			canSubmit: false
    };
    this.submit = this.submit.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.removeTag = this.removeTag.bind(this);
    this.handleRemoveVenues = this.handleRemoveVenues.bind(this);
    this.input = this.input.bind(this);
    this.blur = this.blur.bind(this);
  }

  componentWillMount() {
    const { hideBar, publish, appStatus, router, addTag } = this.props;
    if (router && router.action === 'PUSH' && router.location && router.location.state && router.location.state.tags) {
      if (publish.tags) {
        addTag(publish.tags.concat(router.location.state.tags));
      } else {
        addTag(router.location.state.tags);
      }
    }
    hideBar();
    this.setState({
      tags: publish.tags,
      description: publish.publish,
      venues: publish.venues,
      tmpImages: publish.pictures ? publish.pictures : []
    });

    trackPageView({
      pageName: this.state.track.pageName
    });
    this.setState({
      track: {
        pageName: this.state.track.pageName,
        startTime: new Date(),
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    let canSubmit = false;
    if (nextProps.publish.tags && nextProps.publish.tags.length && nextProps.publish.description) {
      canSubmit = true;
    }
    this.setState({
      tags: nextProps.publish.tags,
      venues: nextProps.publish.venues,
      description: nextProps.publish.description,
      canSubmit
    });
  }

  submit(e) {
    e.preventDefault();
    let post = {};
    const { description, tags, venues, tmpImages } = this.state;
    const { history } = this.props;

    if (!description || !tags || !tags.length) {
      return alert('信息不全！');
    }

    post.postType = 0;
    post.message = {
      images: tmpImages,
      description: description
    }

    post.tags = tags.map(cell => {
      return {
        tag: cell.tag
      }
    });

    if (venues) {
      post.affiliates = [{
        type: 'venues',
        targetId: venues._id
      }];
    }

    postMessage(post).then(res => {
      if (res.code === 200) {
        history.goBack();
      }
    }, error => {
      console.log(error);
    })
  }

  handleFileUpload(e) {
    const { addPictures } = this.props;
    const { tmpImages } = this.state;
    const files = e.target.files;

    if ((files.length + tmpImages.length) > 9) {
      alert('最多上传9张图片');
      return false;
    }

    // let fd = new FormData();
    // for (let index = 0; index < files.length; index++) {
    //   const file = files[index];
    //   fd.append("file", file);
    // }

    // uploadFile(fd).then(res => {
    //   if (res.code === 200) {
    //     const tmp = tmpImages.concat(res.data);
    //     this.setState({
    //       tmpImages: tmp
    //     });
    //     addPictures(tmp);
    //   }
    // }, error => {
    //   console.log(error);
    // })
    // return false;

    minSizeImage(files).then(data => {
      console.log(data)
      let fd = new FormData();
      data.forEach(cell => {
        fd.append("file", cell);
      });
      uploadFile(fd).then(res => {
        if (res.code === 200) {
          const tmp = tmpImages.concat(res.data);
          this.setState({
            tmpImages: tmp
          });
          addPictures(tmp);
        }
      }, error => {
        console.log(error);
      })
    })

  }

  previewImage(file, e) {
    // const reader = new FileReader();
    // reader.onload = (function (pic) {
    //   return function (e) {
    //     if (pic) {
    //       pic.style.backgroundImage = `url(${e.target.result})`;
    //     }
    //   };
    // })(e);
    // reader.readAsDataURL(file);
  }
  loadPage() {

  }

  input(e) {
		const input = e.target.value.trim();
    this.setState({
      description: input,
      canSubmit: input.length > 0 && this.state.tags && this.state.tags.length
    });
  }
  blur(e) {
    const { saveDescription } = this.props;
    saveDescription(e.target.value);
  }

  handleRemoveVenues(dom) {
    const self = this;
    let startX, startY, X, Y;
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
          dom.className = `${styles['venues-holder']} ${styles['show-remove']}`
        } else {
          dom.removeAttribute("style");
          dom.className = styles["venues-holder"]
        }

        /**
         * 处理 删除venues
         */
        if (e && e.target && e.target.dataset && e.target.dataset.origin === 'delete') {
          const { removeVenues } = self.props;
          return removeVenues();
        }
      });
    }
  }

  removeTag(index) {
    const { tags } = this.state;
    const { removeTag } = this.props;
    tags.splice(index, 1);
    removeTag(tags);
  }

  handleClickImage(ref) {
    const className = ref && ref.className;
    ref && ref.addEventListener && ref.addEventListener('click', (e) => {
      e.stopPropagation();
      const pictures = document.querySelectorAll('div[data-picture]');
      pictures.forEach(cell => {
        cell.parentNode.className = styles['pic-box'];
      });
      let parent = ref.parentNode;
      parent.className = /active/g.test(parent.className) ? styles['pic-box'] : `${styles['pic-box']} ${styles['active']}`;
    }, false);
  }

  removePicture(index, e) {
    const { tmpImages } = this.state;
    const { addPictures } = this.props;
    const newTmpImages = Object.assign({}, JSON.parse(JSON.stringify({ o: tmpImages.splice(index, 1) }))).o;
    addPictures(newTmpImages);
  }

  handleResetImages() {
    const pictures = document.querySelectorAll('div[data-picture]');
    pictures.forEach(cell => {
      cell.parentNode.className = styles['pic-box'];
    });
  }

  render() {
    const { show, description, tags, venues, tmpImages, showRomeVenues, canSubmit } = this.state;

    return (
      <div className={styles.publish} style={show ? { display: "block" } : { display: "none" }}>
        <form action="" className={styles["publish-form"]} ref={this.loadPage}>
          <textarea value={description} cols="30" rows="10" placeholder="Show出你的夜生活～" onChange={this.input} onBlur={this.blur}></textarea>
          <div className={styles["pics-box"]}>
            {
              tmpImages && tmpImages.map((cell, index) => {
                return (
                  <div className={styles['pic-box']} key={index}>
                    <div className={styles.pic} style={{ backgroundImage: `url(${cell})` }} ref={this.handleClickImage} data-picture></div>
                    <i onClick={this.removePicture.bind(this, index)} data-icon>×</i>
                  </div>
                );
              })
            }
            {
              tmpImages && tmpImages.length < 9 && <div className={styles["file"]}>
                <input type="file" multiple accept='image/*' onChange={this.handleFileUpload} />
              </div>
            }
          </div>
          <div className={styles["select"]}>
            <p className={styles["_cell"]}>
              <Link to={{ pathname: `${BASENAME}search`, state: { type: "venues" } }}>
                <i className={`${styles['icon']} ${styleIcons['ion-venues-address']}`}></i> <span>所在地点</span> <em>选择商家</em> <i className={styleIcons['ion-angle-right']}></i>
              </Link>
            </p>
            {
              venues &&
              <div className={styles["venues-box"]}>
                <div className={styles["venues-holder"]} ref={this.handleRemoveVenues}>
                  <VenuesCell simple={true} venuesInfo={venues} />
                  <div className={styles["remove"]} onClick={this.removeVenue}>
                    <span className={styles["remove"]} data-origin='delete'>删除</span>
                  </div>
                </div>
              </div>
            }
          </div>
          <div className={styles["select"]}>
            <p className={styles["_cell"]}>
              <Link to={{ pathname: `${BASENAME}search`, state: { type: "tags" } }}>
                <i className={styleIcons['ion-topic']}></i> <span>添加话题</span>  <em>更多话题</em> <i className={styleIcons['ion-angle-right']}></i>
              </Link>
            </p>
            <div className={styles["tags-box"]}>
              {
                tags && !!tags.length && tags.map((cell, index) => {
                  return <Tag word={cell.tag} cell={cell} remove={this.removeTag.bind(this, index)} key={cell._id} />
                })
              }
            </div>
          </div>
          <button className={styles["publish-submit"]} onClick={this.submit} disabled={!canSubmit}>发布</button>
        </form>
      </div>
    )
  }

  componentDidMount() {
    reSetShare();
    document.title = "NIGHT+";
    document.addEventListener('click', this.handleResetImages);
  }

  componentDidUpdate() {
    if (this.refs && this.refs.removeVenue && this.refs.removeVenue.addEventListener) {
      // console.log(this.refs.removeVenue);
      this.refs.removeVenue.removeEventListener("click", this.removeVenue);
      this.refs.removeVenue.addEventListener("click", this.removeVenue);
    }

  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleResetImages);
    const { showBar, appStatus, deleteUnmount, router, match } = this.props;
    const pathname = router.location.pathname;
    const reg = new RegExp(`^${BASENAME}topic|${BASENAME}search`);
    if (!reg.test(pathname)) {
      showBar();
    }
    trackPageLeave({
      pageName: this.state.track.pageName,
      pageStayTime: ((new Date().getTime() - this.state.track.startTime.getTime()) / 1000)
    });
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
    saveDescription: (cell) => {
      dispatch(saveDescription(cell))
    },
    addTag: (cell) => {
      dispatch(addTag(cell));
    },
    removeTag: (cell) => {
      dispatch(removeTag(cell))
    },
    removeVenues: () => {
      dispatch(removeVenues())
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Publish);