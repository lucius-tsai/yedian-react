/**
 * Created by townmi on 17/6/26.
 */
import React, { Component } from 'react';
import './loadmore.scss';

export default class Loading extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
  }
  componentWillUnmount() {
  }
  render() {
    return (
      <div className="load-more">
        <div className="icon ion-loading"></div>
      </div>
    )
  }
}