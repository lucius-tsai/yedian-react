import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from'./style.scss';

class userCenter extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {

  }

  render() {
    return (
      <div className={styles.userCenter}>
        123
      </div>
    )
  }

  componentWillUnmount() {
  }
}

export default userCenter;