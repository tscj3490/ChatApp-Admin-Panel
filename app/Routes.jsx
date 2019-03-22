import React from 'react';
import { BrowserRouter, withRouter, Switch, Route, Redirect, Miss } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import Base from './components/Layout/Base';
import BasePage from './components/Layout/BasePage';
import BaseHorizontal from './components/Layout/BaseHorizontal';


import Donation from './components/Donation/Donation';
import DonationEdit from './components/Donation/DonationEdit';

import Team from './components/Team/Team';
import TeamEdit from './components/Team/TeamEdit';

import User from './components/User/User';
import UserEdit from './components/User/UserEdit';
import VendorOrder from './components/User/VendorOrder';
import VendorService from './components/User/VendorService';
import VendorReview from './components/User/VendorReview';

import Administrator from './components/User/Administrator';
import AdministratorEdit from './components/User/AdministratorEdit';
import CustomerOrder from './components/User/CustomerOrder';
import CustomerReview from './components/User/CustomerReview';

import Devices from './components/Service/Devices';
import Makes from './components/Service/Makes';
import Models from './components/Service/Models';
import Services from './components/Service/Services';

import Login from './components/Pages/Login';
import Register from './components/Pages/Register';
import Recover from './components/Pages/Recover';
import Lock from './components/Pages/Lock';
import NotFound from './components/Pages/NotFound';
import Error500 from './components/Pages/Error500';
import Maintenance from './components/Pages/Maintenance';

import Settings from './components/Others/Settings'
import Wallet from './components/Others/Wallet'
import TransferHistory from './components/Transfer/TransferHistory'
import Currencies from './components/Transfer/Currencies'
import CurrenciesEdit from './components/Transfer/CurrenciesEdit'
import Receivers from './components/Transfer/Receivers'

import Cache from './utils/Cache'
import AuthService from './authService'

// List of routes that uses the page layout
// listed here to Switch between layouts
// depending on the current pathname
const listofPages = [
    '/login',
    '/register',
    '/recover',
    '/lock',
    '/notfound',
    '/error500',
    '/maintenance'
];

const Routes = ({ location }) => {
    const currentKey = location.pathname.split('/')[1] || '/';
    const timeout = { enter: 500, exit: 500 };

    // Animations supported
    //      'rag-fadeIn'
    //      'rag-fadeInUp'
    //      'rag-fadeInDown'
    //      'rag-fadeInRight'
    //      'rag-fadeInLeft'
    //      'rag-fadeInUpBig'
    //      'rag-fadeInDownBig'
    //      'rag-fadeInRightBig'
    //      'rag-fadeInLeftBig'
    //      'rag-zoomBackDown'
    const animationName = 'rag-fadeIn'

    if (listofPages.indexOf(location.pathname) > -1) {
        return (
            // Page Layout component wrapper
            <BasePage>
                <Switch location={location}>
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                    <Route path="/recover" component={Recover} />
                    <Route path="/lock" component={Lock} />
                    <Route path="/notfound" component={NotFound} />
                    <Route path="/error500" component={Error500} />
                    <Route path="/maintenance" component={Maintenance} />
                </Switch>
            </BasePage>
        )
    }
    else {
        return (
            // Layout component wrapper
            // Use <BaseHorizontal> to change layout
            <Base>
                <TransitionGroup>
                    <CSSTransition key={currentKey} timeout={timeout} classNames={animationName}>
                        <div>
                            <Switch location={location}>
                                {/* User */}
                                <Route path="/users" render={(props) => (!AuthService.isLogin() ? (<Redirect to="/login" />) : (<User {...props} />))} />
                                <Route path="/user-edit" render={(props) => (!AuthService.isLogin() ? (<Redirect to="/login" />) : (<UserEdit {...props} />))} />
                                <Route path="/vendor-service" render={(props) => (!AuthService.isLogin() ? (<Redirect to="/login" />) : (<VendorService {...props} />))} />
                                <Route path="/vendor-order" render={(props) => (!AuthService.isLogin() ? (<Redirect to="/login" />) : (<VendorOrder {...props} />))} />
                                <Route path="/vendor-review" render={(props) => (!AuthService.isLogin() ? (<Redirect to="/login" />) : (<VendorReview {...props} />))} />

                                <Route path="/administrators" render={(props) => (!AuthService.isLogin() ? (<Redirect to="/login" />) : (<Administrator {...props} />))} />
                                <Route path="/administrator-edit" render={(props) => (!AuthService.isLogin() ? (<Redirect to="/login" />) : (<AdministratorEdit {...props} />))} />
                                <Route path="/customer-order" render={(props) => (!AuthService.isLogin() ? (<Redirect to="/login" />) : (<CustomerOrder {...props} />))} />
                                <Route path="/customer-review" render={(props) => (!AuthService.isLogin() ? (<Redirect to="/login" />) : (<CustomerReview {...props} />))} />

                                {/* Donation */}
                                <Route path="/donation" component={Donation} />
                                <Route path="/donation-edit" render={(props) => (!AuthService.isLogin() ? (<Redirect to="/login" />) : (<DonationEdit {...props} />))} />

                                {/* Team */}
                                <Route path="/teams" component={Team} />
                                <Route path="/team-edit" render={(props) => (!AuthService.isLogin() ? (<Redirect to="/login" />) : (<TeamEdit {...props} />))} />

                                {/* Transfer */}
                                <Route path="/transfer history" render={(props) => (!AuthService.isLogin() ? (<Redirect to="/login" />) : (<TransferHistory {...props} />))} />
                                <Route path="/currencies" render={(props) => (!AuthService.isLogin() ? (<Redirect to="/login" />) : (<Currencies {...props} />))} />
                                <Route path="/currencies-edit" render={(props) => (!AuthService.isLogin() ? (<Redirect to="/login" />) : (<CurrenciesEdit {...props} />))} />
                                <Route path="/receivers" render={(props) => (!AuthService.isLogin() ? (<Redirect to="/login" />) : (<Receivers {...props} />))} />

                                {/* Others */}
                                <Route path="/wallet" render={(props) => (!AuthService.isLogin() ? (<Redirect to="/login" />) : (<Wallet {...props} />))} />
                                <Route path="/transfer" render={(props) => (!AuthService.isLogin() ? (<Redirect to="/login" />) : (<Transfer {...props} />))} />
                                <Route path="/settings" render={(props) => (!AuthService.isLogin() ? (<Redirect to="/login" />) : (<Settings {...props} />))} />


                                <Redirect to="/dashboard" />
                            </Switch>
                        </div>
                    </CSSTransition>
                </TransitionGroup>
            </Base>
        )
    }
}

export default withRouter(Routes);