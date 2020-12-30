import React, { Component } from 'react';
import { Link, Route, Switch, withRouter } from 'react-router-dom';
import Logo from '../../assets/img/login-logo.png';
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Banner from '../../assets/img/banner-img.png';
import ZigWhite from '../../assets/img/icon-zigzag-white.png';
// import Zig from '../../assets/img/icon-zigzag.png';
// import Barcode from '../../assets/img/barcode.png';
import './header.scss';
import './custom.scss';
import Visa from '../../assets/img/visa-logo.png';
import MasterCard from '../../assets/img/mastercard-logo.png';
import Jcb from '../../assets/img/jcb-logo.png';
import American from '../../assets/img/americanex-logo.png';
import VisaSecure from '../../assets/img/verif-visa-logo.png';
import MasterCardSecure from '../../assets/img/mastercard-secure-logo.png';
import JcbSecure from '../../assets/img/jcb-secure-logo.png';
import AmericanSecure from '../../assets/img/amex-secure-logo.jpeg';
import Bca from '../../assets/img/bca-logo.png';
import Bni from '../../assets/img/bni-logo.png';
import Mandiri from '../../assets/img/mandiri-logo.png';
import Permata from '../../assets/img/permata-logo.png';
import Indomaret from '../../assets/img/indomaret-logo.png';
import Alfamart from '../../assets/img/alfamart-logo.png';
import Gopay from '../../assets/img/gopay-logo.png';
import Akulaku from '../../assets/img/akulaku-logo.png';
import Home from './page-content/Home';
import Registrasi from './page-content/Registrasi';
import { uAPIlocal } from '../lib/config';
import axios from 'axios';
import Checkout from './page-content/Checkout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faCalendarCheck } from '@fortawesome/free-regular-svg-icons';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            path: this.props.history.location.pathname,
            cabang: null,
            menuMobile: null,
        }
        this.active = this.active.bind(this);
        this.activeMenu = this.activeMenu.bind(this);
    }
    active() {
        this.setState((state, props) => {
            return {
                path: props.location.pathname,
            };
        }, () => console.log(this.state.path))
    }

    activeMenu() {
        this.setState({
            menuMobile: !this.state.menuMobile
        })
    }
    async getCabang() {
        await axios.get(uAPIlocal + '/api/v1/home/cabang')
            .then(function (response) {
                return response.data.results;
            })
            .then(response => {
                // console.log(response)
                this.setState({
                    cabang: response,
                })
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    componentDidMount() {
        // console.log(this.state.path)
        this.getCabang();
    }
    render() {
        const match = this.props.match.path;
        return (
            <div className={"main-body app " + (this.state.menuMobile ? 'active menu-open' : '')}>
                <div className='horizontalMenucontainer'>
                    <div className="main-header nav nav-item hor-header" style={{ marginLeft: 0 }}>
                        <div className="container">
                            <div className="main-header-left ">
                                <Link to='#' onClick={this.activeMenu} className="animated-arrow hor-toggle horizontal-navtoggle"><span></span></Link>
                                <Link to='/' onClick={this.active} className="header-brand" >
                                    <img src={Logo} className="logo-white " alt='Logo' />
                                </Link>

                                <div className="main-header-center  ml-4">
                                    <ul className="header-megamenu-dropdown  nav">
                                        {/* <li className="nav-item active"> */}
                                        <li className={"nav-item " + (this.state.path === '/' ? 'active' : '')}>
                                            <div className="btn-group">
                                                <Link to="/" onClick={this.active} className="btn btn-link" type="button">
                                                    <span>
                                                        Home
                                                    </span>
                                                </Link>
                                            </div>
                                        </li>
                                        {/* <li className="nav-item"> */}
                                        <li className={"nav-item " + (this.state.path === '/registrasi' ? 'active' : '')}>
                                            <div className="btn-group">
                                                <Link to="/registrasi" onClick={this.active} className="btn btn-link" type="button">
                                                    <span>
                                                        Registrasi
                                                    </span>
                                                </Link>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>


                        </div>
                    </div>

                    <div className="sticky">
                        <div className="hor-menu clearfix side-header">
                            <div className="horizontal-mainwrapper container clearfix">
                                <nav className="horizontalMenu clearfix">
                                    <ul className="horizontalMenu-list">
                                        <li className={this.state.path === '/' ? 'active' : ''} aria-haspopup="true">
                                            <Link to="/" onClick={this.active} className={this.state.path === '/' ? 'active' : ''} >
                                                <FontAwesomeIcon icon={faHome} /> Home
                                            </Link>
                                        </li>
                                        <li className={this.state.path === '/' ? 'active' : ''} aria-haspopup="true">
                                            <Link to="/registrasi" onClick={this.active} className={this.state.path === '/registrasi' ? 'active' : ''} >
                                            <FontAwesomeIcon icon={faCalendarCheck} /> Registrasi
                                            </Link>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>


                    <div className='main-content horizontal-content'>
                        <Switch>
                            <Route path="/registrasi/checkout" render={(props) => <Checkout {...props} />}>
                            </Route>
                            <Route path="/registrasi">
                                <Registrasi />
                            </Route>
                            <Route path={match}>
                                <div className='container-fluids'>
                                    <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false} >
                                        {
                                            this.state.cabang ? (
                                                this.state.cabang.map((value, index) => {
                                                    return (
                                                        <div key={index} style={{ maxHeight: '400px' }} >
                                                            <img alt="banner" src={Banner} />
                                                            <div className='mySlider'>
                                                                <h4 >SWAB TEST LOCATION</h4>
                                                                <h3>BIO MEDIKA</h3>
                                                                <h3>{value.branch_name}</h3>
                                                                <img alt="zig-zag" src={ZigWhite} className='zig-zag' />
                                                                <Link to='/registrasi' onClick={this.active} className="btn btn-success btn-block">REGISTRASI</Link>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            ) : null
                                        }
                                    </Carousel>
                                </div>
                                <Home />

                            </Route>

                        </Switch>
                    </div>
                    <div className="main-footer" >
                        <div className="container-fluid pd-t-10-f">
                            <span>Copyright © 2020 LABORATORIUM KLINIK BIO MEDIKA.</span>
                        </div>
                        <div className="container-fluid pd-t-10-f ">
                            <div className="payment-logo grid">
                                <img src={Visa} alt='visa-logo' className="logo" />
                                <img src={MasterCard} alt='mastercard-logo' className="logo" />
                                <img src={Jcb} alt='jcb-logo' className="logo" />
                                <img src={American} alt='american-express-logo' className="logo" />
                                <img src={VisaSecure} alt='visa-secure-logo' className="logo" />
                                <img src={MasterCardSecure} alt='mastercard-secure-logo' className="logo" />
                                <img src={JcbSecure} alt='jcb-secure-logo' className="logo" />
                                <img src={AmericanSecure} alt='american-express-secure-logo' className="logo" />
                                <img src={Bca} alt='bca-logo' className="logo" />
                                <img src={Bni} alt='bni-logo' className="logo" />
                                <img src={Mandiri} alt='mandiri-logo' className="logo" />
                                <img src={Permata} alt='permata-logo' className="logo" />
                                <img src={Gopay} alt='gopay-logo' className="logo" />
                                <img src={Akulaku} alt='akulaku-logo' className="logo" />
                                <img src={Indomaret} alt='indomaret-logo' className="logo" />
                                <img src={Alfamart} alt='alfamart-logo' className="logo" />
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(App);