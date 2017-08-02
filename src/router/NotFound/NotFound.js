import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import styles from './notfound.scss';


export default class NotFound extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles["not-found"]}>
        <img src={require("./notfound.png")} alt=""/>
      </div>
    )
  }
}