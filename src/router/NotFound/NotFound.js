import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './notfound.scss';


export default class NotFound extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="not-found">
        <img src={require("./notfound.png")} alt=""/>
      </div>
    )
  }
}