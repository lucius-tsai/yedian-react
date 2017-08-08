import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

import Avator from '../Avator';
import './style.css';
import styles from  './style.scss';

export default class DaynimcMessage extends Component {
  constructor(props) {
    super(props);
    this.autoRun = this.autoRun.bind(this);
    this.state = {
      currentIndex: 0
    };
    this.timer = null;
  }

  componentWillMount() {
    const { list } = this.props;
    this.setState({
      num: list.length,
      list: list
    });
  }

  componentWillReceiveProps(nextProps) {
    const { list } = nextProps;
    this.setState({
      num: list.length,
      list: list
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentWillUpdate() {
  }

  autoRun() {
    const { speed, list } = this.props;
    const self = this, len = list.length;
    if (len > 1) {
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        let { currentIndex } = self.state;
        let nextIndex = currentIndex + 1;
        nextIndex = nextIndex < len ? nextIndex : 0;
        self.setState({
          currentIndex: nextIndex
        })
      }, speed);
    }
  }

  render() {
    const textWidth = window.innerWidth ? window.innerWidth - 110 : 414 - 110;
    const query = '?fromwhere=community';
    const slide = (list) => {
      const { currentIndex } = this.state;
      let { element, enterDelay, leaveDelay, animation } = this.props;
      element = element ? element : "div";
      enterDelay = enterDelay ? enterDelay : 1800;
      leaveDelay = leaveDelay ? leaveDelay : 1800;
      animation = animation ? animation : "fade";
      return (
        <CSSTransitionGroup
          component={element}
          transitionName={`daynimc-${animation}`}
          transitionEnter={true}
          transitionLeave={true}
          transitionEnterTimeout={enterDelay}
          transitionLeaveTimeout={leaveDelay}>
          <div className={`${styles['message-animate-cell']} ${styles['clearfix']}`} key={currentIndex}>
            <Avator size={"sx"} profile={list[currentIndex].postedBy} affiliates={list[currentIndex].affiliates} showFollow={false}/>
            {
              list[currentIndex].postType === 0 ?
                <Link to={{ pathname: `${BASENAME}message/${list[currentIndex]._id}`, state: { id: list[currentIndex]._id } }} className={styles['_text']} style={{ width: `${textWidth}px` }}>{`${list[currentIndex].postedBy.displayName}刚刚发布了一条动态`}</Link>
                :
                <a href={`${location.origin}/dist/?#!/venues/event/${list[currentIndex]._id}${query}`} className={styles['_text']} style={{ width: `${textWidth}px` }}>{`${list[currentIndex].postedBy.displayName}刚刚发布了一条动态`}</a>
            }
          </div>
        </CSSTransitionGroup>
      )
    };
    const { num, list } = this.state;
    if (list.length === 0) {
      return (
        <div></div>
      )
    } else {
      return (
        <div>
          {slide(list)}
        </div>
      )
    }
  }

  componentDidMount() {
    this.autoRun();
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