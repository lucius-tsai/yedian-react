import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import './loading.scss';

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
            <div className="loading">
                <div className="_holder">
                    <div className="icon ion-loading"></div>
                    <p className="text">正在加载…</p>
                </div>
            </div>
        )
    }
}