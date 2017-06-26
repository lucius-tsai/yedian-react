import React, {Component} from 'react';
// import {observer, inject} from 'mobx-react';
import {Link} from 'react-router-dom';
import './launch.scss';

// @inject('authData') @observer
class Launch extends Component {
    constructor(props) {
        super(props);
        this.init();
    }

    init() {
        const {push} = this.props.router;
        setTimeout(() => {
            push("/home");
        }, 1000);
    }

    static render() {
        return (
            <div className="launch">
            </div>
        )
    }
}

export default Launch;