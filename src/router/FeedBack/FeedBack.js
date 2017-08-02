import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './feedBack.scss';

class FeedBack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: null
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
    document.title = "NIGHT";
  }

  componentWillReceiveProps(nextProps) {
  }
  render() {
    return (
      <div className="user">
        123
            </div>
    )
  }
  componentWillUnmount() {
  }
}

export default FeedBack;