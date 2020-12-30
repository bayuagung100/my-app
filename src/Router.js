import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import App from './components/pasien/App';
import Admin from './components/admin/index';
import Login from './components/admin/Login'
import Checkout from './components/pasien/page-content/Checkout';
import Finish from './components/pasien/page-content/Finish';
function Router() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={App} />
                <Route path="/registrasi" component={App} />
                <Route path="/registrasi/checkout" component={App} />
                <Route path="/payment/finish" component={Finish} />
            </Switch>

            <Switch>
                <Route path='/admin' component={Admin} />
                <Route path='/auth' component={Login} />
            </Switch>
        </BrowserRouter>
    );
}


export default Router;