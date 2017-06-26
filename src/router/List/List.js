import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {Link} from 'react-router-dom';
import './list.scss';

// @inject('authData', 'homeStore') @observer
class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: null
        };
        this.refresh = this.refresh.bind(this);
    }

    componentWillMount() {
        console.log(this.props);
        const self = this;
    }

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps);
    }

    shouldComponentUpdate(nextProps, nextState) {
        // const {account} = this.props.authData;
        return true;
    }

    refresh() {
        // const {refresh, account} = this.props.authData;
        console.log(account)
    }

    render() {
        const {account} = this.state;
        // console.log(this.state);
        return (
            <div className="list">
                <div>{account}</div>
                <div onClick={this.refresh}>123</div>
            </div>
        )
    }

    componentWillUnmount() {
    }
}

export default List;