import React, { Component } from 'react';
import './index.scss';
import './custom.scss';
import { Link, Redirect, Route, Switch, withRouter } from "react-router-dom";
import Logo from '../../assets/img/login-logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import PostType from './PostType';
import Dashboard from './page-content/Dashboard';

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login: this.props.location.state ? this.props.location.state.login : false,
            detail_login: this.props.location.state ? this.props.location.state.detail_login : null,
            path: this.props.history.location.pathname,
            menuLogout: false,
        }
        this.LogoutClick = this.LogoutClick.bind(this);
        this.HideLogout = this.HideLogout.bind(this);
        this.Logout = this.Logout.bind(this);
        this.active = this.active.bind(this);
    }
    LogoutClick() {
        this.setState({
            menuLogout: !this.state.menuLogout,
        })
    }
    HideLogout() {
        this.setState({
            menuLogout: false,
        });
    }
    Logout() {
        this.setState({
            login: false,
        })
    }
    active() {
        this.setState((state, props) => {
            return {
                path: props.location.pathname,
            };
        }, () => console.log(this.state.path))
    }
    componentDidMount(){
        // console.log(this.state.detail_login)
    }
    render() {
        if (this.state.login === false  || this.state.detail_login === null) {
            return (<Redirect to="/auth" />)
        }
        const match = this.props.match.path;
        return (
            <div className='main-body app'>
                <div className='horizontalMenucontainer'>
                    <div className="main-header nav nav-item hor-header" style={{ marginLeft: 0 }}>
                        <div className="container">
                            <div className="main-header-left ">
                                <Link to='#' className="header-brand" >
                                    <img src={Logo} className="logo-white " alt='Logo' />
                                </Link>

                                <div className="main-header-center  ml-4">
                                    <ul className="header-megamenu-dropdown  nav">
                                        <li className={"nav-item " + (this.state.path === '/admin' ? 'active' : '')}>
                                            <div className="btn-group">
                                                <Link to={`${this.props.match.path}`} onClick={this.active} className="btn btn-link" type="button">
                                                    <span>
                                                        Dashboard
                                                    </span>
                                                </Link>
                                            </div>
                                        </li>
                                        <li className={"nav-item " + (this.state.path === '/admin/cabang' ? 'active' : '')}>
                                            <div className="btn-group">
                                                <Link to={`${this.props.match.path}/cabang`} onClick={this.active} className="btn btn-link" type="button">
                                                    <span>
                                                        Cabang
                                                    </span>
                                                </Link>
                                            </div>
                                        </li>
                                        <li className={"nav-item " + (this.state.path === '/admin/slot' ? 'active' : '')}>
                                            <div className="btn-group">
                                                <Link to={`${this.props.match.path}/slot`} onClick={this.active} className="btn btn-link" type="button">
                                                    <span>
                                                        Slot
                                                    </span>
                                                </Link>
                                            </div>
                                        </li>
                                        <li className={"nav-item " + (this.state.path === '/admin/test-name' ? 'active' : '')}>
                                            <div className="btn-group">
                                                <Link to={`${this.props.match.path}/test-name`} onClick={this.active} className="btn btn-link" type="button">
                                                    <span>
                                                        Test Name
                                                    </span>
                                                </Link>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="main-header-right">
                                <div className="nav nav-item  navbar-nav-right ml-auto">
                                    <div className="main-header-profile ">
                                        {`${this.state.detail_login.firstname} ${this.state.detail_login.lastname}`}
                                    </div>
                                    <div className="main-header-message right-toggle">
                                        <div className="nav-link" onClick={this.LogoutClick} >
                                            <FontAwesomeIcon icon={faBars} className='icon' />
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        this.state.menuLogout ? (
                            <div>
                                <div onClick={this.HideLogout} className="hide-menu-logout"></div>
                                <div className="menu-logout">
                                    <div className="menu" onClick={this.Logout} >
                                        <div className="text-menu" >Logout</div>
                                    </div>
                                </div>
                            </div>
                        ) : null
                    }

                    <div className='main-content horizontal-content'>
                        <div className='container-fluids'>
                            <Switch>
                                <Route path={`${match}/:postType`}>
                                    <PostType detail_login={this.state.detail_login} />
                                </Route>
                                <Route path={match}>
                                    <Dashboard />
                                </Route>
                            </Switch>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Index);