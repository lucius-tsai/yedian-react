import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

import style from './carousel.scss';
import './carousel.css';
import styleBase from  "../../assets/scss/base";

class Carousel extends Component {
  constructor(props) {
    super(props);
    this.autoRun = this.autoRun.bind(this);
    this.state = {
      currentIndex: 0
    };
    this.timer = null;
    this.hanldeSwiper = this.hanldeSwiper.bind(this);
    this.hanldeSingleClick = this.hanldeSingleClick.bind(this);
  }

  componentWillMount() {
    const { slides } = this.props;
    this.setState({
      single: slides.length === 1,
      num: slides.length,
      slides: slides,
      touchs: false
    });
  }

  componentWillReceiveProps(nextProps) {
    const { slides } = nextProps;
    this.setState({
      single: slides.length === 1,
      num: slides.length,
      slides: slides
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentWillUpdate() {
  }

  autoRun() {
    const { speed, slides } = this.props;
    const self = this, len = slides.length;
    if (len > 1) {
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        let { currentIndex } = self.state;
        let nextIndex = currentIndex + 1;
        nextIndex = nextIndex < len ? nextIndex : 0;
        self.setState({
          currentIndex: nextIndex,
          touchs: false
        })
      }, speed);
    }
  }

  hanldeSwiper(dom) {
    const cellWidth = window.innerWidth > 414 ? 414 : window.innerWidth;
    const { slides, history } = this.props;
    const self = this, len = slides.length;
    let startX, startY, X, Y, prev, next, firstPointTime;
    if (dom && dom.addEventListener) {
      dom.addEventListener("touchstart", (e) => {
        X = 0, Y = 0;
        firstPointTime = new Date().getTime();
        e.preventDefault();
        if (event.targetTouches.length > 1 || event.scale && event.scale !== 1) return;
        const touch = event.targetTouches[0];
        startX = touch.pageX;
        startY = touch.pageY;
        // 
        clearInterval(self.timer);
        prev = this.state.currentIndex - 1 < 0 ? slides.length - 1 : this.state.currentIndex - 1;
        next = this.state.currentIndex + 1 > slides.length - 1 ? 0 : this.state.currentIndex + 1;

        self.refs.transitionGroup.style.display = 'none';
        self.refs.swiperDom.style.display = 'block';
        self.refs.swiperDom.innerHTML = `
          <div class="${style.slide}">
            <div class="${style.pic}" style="background-image: url('${slides[prev].image}');">
              <p class="${style.word}">
                <span>${slides[prev].tags.map((cell, i) => { return i === 0 ? `#${cell.tag}# ` : ` #${cell.tag}#`})}</span>
                <br/>
                <strong>内容${slides[prev].postCount}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;${slides[prev].userCount}人参与</strong>
              </p>
            </div>
          </div>
          <div class="${style.slide}">
            <div class="${style.pic}" style="background-image: url('${slides[this.state.currentIndex].image}');">
              <p class="${style.word}">
                <span>${slides[this.state.currentIndex].tags.map((cell, i) => { return i === 0 ? `#${cell.tag}# ` : ` #${cell.tag}#`})}</span>
                <br/>
                <strong>内容${slides[this.state.currentIndex].postCount}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;${slides[this.state.currentIndex].userCount}人参与</strong>
              </p>
            </div>
          </div>
          <div class="${style.slide}">
            <div class="${style.pic}" style="background-image: url('${slides[next].image}');">
              <p class="${style.word}">
                <span>${slides[next].tags.map((cell, i) => { return i === 0 ? `#${cell.tag}# ` : ` #${cell.tag}#`})}</span>
                <br/>
                <strong>内容${slides[next].postCount}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;${slides[next].userCount}人参与</strong>
              </p>
            </div>
          </div>
        `;
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
        // if (X > -70 && X < 0) {
        self.refs.swiperDom.style.transform = `translateX(${X}px)`;
        // }
      });
      dom.addEventListener("touchend", (e) => {
        e.preventDefault();
        const staySeconds = (new Date().getTime() - firstPointTime);
        if (staySeconds < 400 && Math.abs(X) < 10) {
          if (slides[this.state.currentIndex].action && slides[this.state.currentIndex].action.path) {
            history.push(slides[this.state.currentIndex].action.path);
          } else if (slides[this.state.currentIndex].link) {
            location.href = slides[this.state.currentIndex].link;
            return false;
          }
        }
        let timer = null, step = 4;
        if (X > cellWidth / 2) {
          timer = setInterval(() => {
            X = X + (step * Math.abs(X) / 13 / step);
            self.refs.swiperDom.style.transform = `translateX(${X}px)`;
            if (X > cellWidth) {
              clearInterval(timer);
              self.refs.transitionGroup.removeAttribute("style");
              self.refs.swiperDom.removeAttribute("style");
              self.refs.swiperDom.innerHTML = '';
              self.setState({
                currentIndex: prev,
                touchs: true
              });
              self.autoRun()
            }
          }, 20);
        } else if (X < -(cellWidth / 2)) {
          timer = setInterval(() => {
            X = X - (step * Math.abs(X) / 13 / step);
            self.refs.swiperDom.style.transform = `translateX(${X}px)`;
            if (X < -cellWidth) {
              clearInterval(timer);
              self.refs.transitionGroup.removeAttribute("style");
              self.refs.swiperDom.removeAttribute("style");
              self.refs.swiperDom.innerHTML = '';
              self.setState({
                currentIndex: next,
                touchs: true
              });
              self.autoRun()
            }
          }, 20);
        } else {
          timer = setInterval(() => {
            if (X < 0) {
              X = X + (step * Math.abs(X) / 8 / step);
            } else {
              X = X - (step * Math.abs(X) / 8 / step);
            }
            self.refs.swiperDom.style.transform = `translateX(${X}px)`;
            if (Math.abs(X) < step + 1) {
              clearInterval(timer);
              self.refs.swiperDom.innerHTML = '';
              self.refs.swiperDom.removeAttribute("style");
              self.refs.transitionGroup.removeAttribute("style");
              self.setState({
                currentIndex: this.state.currentIndex,
                touchs: true
              });
              self.autoRun()
            }
          }, 20);
        }
      });
    }
  }

  hanldeSingleClick() {
    const { slides, history } = this.props;
    if (slides[0].action && slides[0].action.path) {
      history.push(slides[0].action.path);
    } else if (slides[0].link) {
      location.href = slides[0].link;
      return false;
    }
  }

  render() {
    const slide = (slides) => {
      const { currentIndex, touchs } = this.state;
      let { element, enterDelay, leaveDelay, animation } = this.props;
      element = element ? element : "div";
      enterDelay = enterDelay ? enterDelay : 1800;
      leaveDelay = leaveDelay ? leaveDelay : 1800;
      animation = animation ? animation : "default";
      if (touchs) {
        enterDelay = leaveDelay = 0;
      }
      return (
        <CSSTransitionGroup
          component={element}
          transitionName={`carousel-${animation}`}
          transitionEnter={!touchs}
          transitionLeave={!touchs}
          transitionEnterTimeout={enterDelay}
          transitionLeaveTimeout={leaveDelay}>
          <div className={style.slide}
            key={currentIndex}>
            <div className={style.pic} style={{ backgroundImage: `url(${slides[currentIndex].image})` }}>
              <p className={style.word}>
                <span>{slides[currentIndex].tags.map((cell, index) => { return index === 0 ? `#${cell.tag}# ` : `, #${cell.tag}#`;})}</span>
                <br/>
                <strong>内容{slides[currentIndex].postCount}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;{slides[currentIndex].userCount}人参与</strong>
              </p>
            </div>
          </div>
        </CSSTransitionGroup>
      )
    };
    const { num, single, slides } = this.state;
    if (slides.length === 0) {
      return (
        <div className={style.carouselBox}></div>
      )
    } else {
      return (
        <div className={style.carouselBox}>
          {
            single ?
              <div className={style.sliderCarousel}>
                <a className={style.slide}>
                  <div className={style.pic} style={{ backgroundImage: `url(${slides[0].image})` }} onClick={this.hanldeSingleClick}>
                    <p className={style.word}>
                      <span>{slides[0].tags.map((cell, index) => { return index === 0 ? `#${cell.tag}# ` : `, #${cell.tag}#`;})}</span>
                      <br/>
                      <strong>内容{slides[0].postCount}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;{slides[0].userCount}人参与</strong>
                    </p>
                  </div>
                </a>
              </div>
              :
              <div className={style.sliderCarousel} ref={this.hanldeSwiper}>
                <div ref="transitionGroup">
                  {slide(slides)}
                </div>
                <div className={`${style.swiper} ${styleBase.clearfix}`} ref="swiperDom"></div>
              </div>
          }
        </div>
      )
    }
  }

  componentDidMount() {
    this.autoRun();
    const { slides } = this.props;
    let carousel = this.refs.carousel;
    if (!carousel) return false;
  }

  componentDidUpdate() {
  }
  clearBinds() {
    this.timer && clearInterval(this.timer);
    this.timer = null;
  }
  componentWillUnmount() {
    this.clearBinds();
  }
}

export default withRouter(Carousel);