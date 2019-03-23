import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, Table, Pagination, Modal, DropdownButton, MenuItem, FormControl } from 'react-bootstrap';
import AuthService from '../../authService'
import Cache from '../../utils/Cache'
import UtilService from '../../utils/Utils'
import Config from '../../config'

import Api from './api'

class Payment extends React.Component {

    constructor(props) {
        super(props)

        this.state={

            info: false,
            email: '',
            old_password: '',
            new_password: '',
            error:'',
            mismatch: false,
        }
    }

    componentDidMount(){
        var email = sessionStorage.getItem('email')
        this.setState({email: email})
    }

    onApply(e){
        e.preventDefault()
        e.stopPropagation()
        Api.changePassword({
            email: this.state.email,
            old_password: this.state.old_password,
            new_password: this.state.new_password,
        }, (err, res)=>{
            console.log('err, res', err, res)
            if ( err == null ){
                console.log("success!")
                this.setState({mismatch: false, info: true})
            } else {
                console.log("fail!")
                this.setState({mismatch: true, info: false})
            }
        })
    }

    render() {
        return (
            <ContentWrapper>
                <h3>Settings
                    <small>hello</small>
                </h3>

                <div className="panel panel-default container">
                    <div className="panel-heading">
                        <div className="h4 text-center">Change Password</div>
                    </div>
                    <div className="panel-body">
                        <Row className="pv-lg">
                            <Col lg={2}></Col>
                            <Col lg={8}>
                                <form className="form-horizontal">
                                    <div className="form-group">
                                        <label htmlFor="inputContact1" className="col-sm-3 control-label text-nowrap">Email</label>
                                        <div className="col-sm-9">
                                            <input id="email" type="email" placeholder="" className="form-control"
                                            value={this.state.email} onChange={(e)=>{this.setState({email:e.target.value, mismatch: false})}} required />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="inputContact1" className="col-sm-3 control-label text-nowrap">Old Password</label>
                                        <div className="col-sm-9">
                                            <input id="old_password" type="text" placeholder="" className="form-control"
                                            value={this.state.old_password} onChange={(e)=>{this.setState({old_password:e.target.value, mismatch: false})}} required />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="inputContact2" className="col-sm-3 control-label text-nowrap">New Password</label>
                                        <div className="col-sm-9">
                                            <input id="new_password" type="text" className="form-control" 
                                            value={this.state.new_password} onChange={(e)=>{this.setState({new_password:e.target.value, mismatch: false})}} />
                                        </div>
                                    </div>
                                    
                                    <div className="form-group">
                                        <div className="col-sm-offset-3 col-sm-9">
                                            <button type="submit" className="btn btn-info" style={{width:150}} onClick={(e)=>this.onApply(e)}>Apply</button>
                                        </div>
                                    </div>

                                    <div className="form-group has-feedback">
                                    {this.state.mismatch&&<div className="text-danger text-center">
                                        Email or Old Password is mismatch.<br/>
                                        Please try again correctly!
                                    </div>}
                                    {this.state.info&&<div className="text-danger text-center">
                                        Password have changed successfully!<br/>
                                    </div>}
                                </div>
                                </form>
                            </Col>
                        </Row>
                    </div>
                </div>
            </ContentWrapper>
        );
    }

}

export default Payment;
