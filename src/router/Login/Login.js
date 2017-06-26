import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import './login.scss';

@inject('authData') @observer class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: {
                email: "test.test.com",
                password: "123456"
            }
        }
        this.submit = this.submit.bind(this);
    }
    submit(event) {
        event.preventDefault();
        let { auth } = this.props.authData;
        auth(this.state.account, this.props.history);
    }
    render() {
        return (
            <div className="login">
                <div className="row">
                    <div className="col s3">&nbsp;</div>
                    <form className="col s6" onSubmit={this.submit}>
                        <div className="row">
                            <div className="input-field col s12">
                                <button>登录</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default Login;