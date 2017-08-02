/**
 * Created by townmi on 17/6/26.
 */
import React, { Component } from 'react';

import styles from './loadmore.scss';
import styleIcons from  "../../icons/scss/ionicons";

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
      <div className={styles["load-more"]}>
        <div className={styleIcons['ion-loading']} data-icon></div>
      </div>
    )
  }
}