import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import imgLogin from '../../assets/img/login-logo.png';
import imgLoginGls from '../../assets/img/login-gls.png';
import './login.scss';
import { uAPIlocal } from '../lib/config';
import axios from 'axios';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            login: false,
        }
        this.SignIn = this.SignIn.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    SignIn() {
        this.setState({
            login: true,
        })
    }
    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    async onSubmit(e) {
        e.preventDefault();
        await axios.post(uAPIlocal + '/api/v1/auth', {
            username: this.state.username,
            password: this.state.password
        })
            .then(response => {
                return response.data;

            })
            .then(JsonData => {
                // console.log(JsonData)
                const status = JsonData.status;
                if (status !== 200) {
                    this.setState({
                        message: JsonData.results
                    })
                } else {
                    this.setState({
                        login: true,
                        detail_login: JsonData.results[0]
                    })
                }

            })
            .catch(function (error) {
                console.log(error);
            });
    }
    render() {
        if (this.state.login === true) {
            return (<Redirect to={{
                pathname: "/admin",
                state: {
                    login: this.state.login,
                    detail_login: this.state.detail_login
                }
            }} />)
        }
        return (
            <div className="login-page my-auto page page-h">
                <div className="main-signin-wrapper">
                    <div className="main-card-signin d-md-flex wd-100p">
                        <div className="wd-md-50p login d-none d-md-block page-signin-style p-5 text-white">
                            <div className="my-auto authentication-pages">
                                <div>
                                    <img src={imgLogin} className=" m-0 mb-4" alt="logo" />
                                    <h3 className="mb-4">Online Registration</h3>
                                    <h1 className="mb-5">RAPID TEST COVID-19</h1>
                                    <img src={imgLoginGls} className=" m-0 mb-4" alt="icon-gelas" />
                                </div>
                            </div>
                        </div>
                        <div className="p-5 wd-md-50p">
                            <div className="main-signin-header">
                                <h2>Welcome back!</h2>
                                <h4>Please sign in to continue</h4>
                                {
                                    this.state.message ? (
                                        <div className="alert alert-danger alert-dismissible">{this.state.message}</div>
                                    ) : null
                                }
                                <form onSubmit={this.onSubmit}>
                                    {/* <form onSubmit={this.SignIn}> */}
                                    <div className="form-group">
                                        <label>Username</label>
                                        <input type="text" className="form-control" placeholder="Enter username" name="username" value={this.state.username} onChange={this.onChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Password</label>
                                        <input type="password" className="form-control" placeholder="Enter your password" name="password" value={this.state.password} onChange={this.onChange} required />
                                    </div>
                                    <button type="submit" className="btn btn-main-primary btn-block">Sign In</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login;