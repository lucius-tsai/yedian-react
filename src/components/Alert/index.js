import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from'./style.scss';

class Alert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
    this.hidden = this.hidden.bind(this);
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
    // if(nextProps.visible) {
      this.setState({
        visible: !!nextProps.visible
      });
    // }
  }

  hidden() {

  }

  render() {
    const { visible } = this.state;
    return (
      <div className={visible ? `${styles.alertBox}` : `${styles.alertBox} ${styles.hidden}`} onClick={this.hidden}>
        <div className={styles.holder}>
          123
        </div>
      </div>
    )
  }

  componentWillUnmount() {
  }
}

export default Alert;