import React from 'react';
import { Grid, Row, Col, Panel, Button, Image } from 'react-bootstrap';
import { Router, Route, Link, History } from 'react-router-dom';

import Cache from '../../utils/Cache'
import UtilService from '../../utils/Utils'
import AuthService from '../../authService'

class Login extends React.Component {

    constructor(props) {

        super(props)

        this.state = {
            password: '',
            email: '',
            mismatch: false,
            error: '',
            loading: false,
        }
    } 
    componentWillMount() {
        console.log('will')
        sessionStorage.removeItem('email')
        sessionStorage.removeItem('password')
    }

    onSubmit(e) {        
        e.preventDefault()
        e.stopPropagation() 
        
        this.setState({loading: true, error: ''})
        AuthService.login(this.state.email, this.state.password, (err, res) => {   
              
            this.setState({loading: false})
            if (err == null){
                console.log("true : ")
                Cache.login = true        
                this.props.history.push("dashboard1")
            }else{
                console.log("false : ")
                this.setState({error:'Email or Password is wrong!'})
                this.setState({mismatch: true})
            }
        })
    }

    render() {
        return (
            <div style={{ display: 'flex', height:'100vh', justifyContent: 'center', alignItems: 'center', background:'url(img/home.jpg)', backgroundSize:'cover' }}>
                {/* <Image src="img/bg13.jpg" style={{position:'absolute', width:'100%', height:'100%', objectFit:'center'}}/> */}
                <div style={{width:'100%', height:'100%', backgroundColor:'rgba(255, 255,255, 0.5)', position:'absolute', zIndex:0}}/>
                <div className="block-center wd-xl" style={{zIndex:100}}>
                    { /* START panel */}
                    <div className="panel panel-dark panel-flat">
                        <div className="panel-heading text-center">
                            <a href="#">
                                <img src="img/logo.png" alt="Image" className="block-center img-rounded" width="176" height="176" />
                            </a>
                        </div>
                        <div className="panel-body">
                            <p className="text-center pv">SIGN IN TO CONTINUE.</p>
                            <form role="form" data-parsley-validate="" noValidate className="mb-lg" onSubmit={this.onSubmit.bind(this)} >
                                <div className="form-group has-feedback">
                                    <input id="exampleInputEmail1" type="email" placeholder="Enter email" autoComplete="off" required="required" className="form-control"
                                        value={this.state.email} onChange={(e) => this.setState({ email: e.target.value, mismatch: false })} />
                                    <span className="fa fa-envelope form-control-feedback text-muted"></span>
                                </div>
                                <div className="form-group has-feedback">
                                    <input id="exampleInputPassword1" type="password" placeholder="Password" required="required" className="form-control"
                                        value={this.state.password} onChange={(e) => this.setState({ password: e.target.value, mismatch: false })} />
                                    <span className="fa fa-lock form-control-feedback text-muted"></span>
                                </div>
                                <div className="clearfix">
                                    <div className="checkbox c-checkbox pull-left mt0">
                                        <label>
                                            <input type="checkbox" value="" name="remember" />
                                            <em className="fa fa-check"></em>Remember Me</label>
                                    </div>
                                    <div className="pull-right">
                                        <Link to="recover" className="text-muted">Forgot your password?</Link>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-block btn-primary mt-lg">Login</button>
                                <div className="form-group has-feedback">
                                    {this.state.mismatch&&<div className="text-danger text-center">
                                        Email or Password is mismatch.<br/>
                                        Please try again correctly!
                                    </div>}
                                </div>
                            </form>
                            {/* <p className="pt-lg text-center">Need to Signup?</p>
                            <Link to="register" className="btn btn-block btn-default">Register Now</Link> */}
                        </div>
                    </div>
                    { /* END panel */}
                </div>
            </div>
        );
    }

}

export default Login;
