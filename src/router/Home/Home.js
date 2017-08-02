import React, { Component } from 'react';
// import {observer, inject} from 'mobx-react';
import { Link } from 'react-router-dom';
import './home.scss';

// @inject('authData', 'homeStore') @observer
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: null
        };
        this.refresh = this.refresh.bind(this);
    }

    componentWillMount() {
        // const self = this;
        // const {account, auth} = this.props.authData;
        // const {push} = this.props.router;
        // if (!account) {
        //     auth(() => {
        //         self.setState({
        //             account: account
        //         });
        //     }, () => {
        //         // push("/login");
        //     });
        // } else {
        //     this.setState({
        //         account: account
        //     });
        // }
    }

    componentDidMount() {
        document.title = "NIGHT";
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
        // console.log(account)
    }

    render() {
        const { account } = this.state;
        // console.log(this.state);
        return (
            <div className="user">
                <div>{account}</div>
                <div onClick={this.refresh}>123</div>
            </div>
        )
    }

    componentWillUnmount() {
    }
}

export default Home;