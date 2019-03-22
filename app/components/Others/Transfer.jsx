import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, Table, Pagination, Modal, DropdownButton, MenuItem } from 'react-bootstrap';

import Api from './api'
class Transfer extends React.Component {

    constructor(props) {
        super(props)

        this.state = {

            info: '',
        }

    }
    componentDidMount() {
        Api.getPaymentSetting((err, res) => {
            console.log(err, res)
            if (err == null) {
                res.items.map((item, index) => {
                    this.state[item.name] = item.value
                })
                this.forceUpdate()
            }
        })
    }

    onSave(e) {
        e.preventDefault()
        e.stopPropagation()
        Api.postPaymentSetting(this.state, (err, res) => {
            if (err == null) {
                this.setState({ info: 'Saved transfer successfully' })
                setTimeout(() => this.setState({ info: '' }), 3000)
            }
        })
    }
    render() {
        return (
            <ContentWrapper>
                <h3>Transfer
                    <small>You can handle your transfer here</small>
                </h3>
                <div className="panel panel-default container">
                    <div className="panel-heading">
                        <div className="h4 text-center">Transfer Setting</div>
                    </div>
                    <div className="panel-body">
                        <Row className="pv-lg">
                            <Col lg={2}></Col>
                            <Col lg={8}>
                                <form className="form-horizontal">
                                    <div className="form-group">
                                        <label htmlFor="inputContact1" className="col-sm-3 control-label text-nowrap">Monthly</label>
                                        <div className="col-sm-9">
                                            <input id="Monthly" type="text" placeholder="" className="form-control"
                                                value={this.state.monthly} onChange={(e) => { this.setState({ monthly: e.target.value }) }} required />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="inputContact1" className="col-sm-3 control-label text-nowrap">Yearly</label>
                                        <div className="col-sm-9">
                                            <input id="Yearly" type="text" placeholder="" className="form-control"
                                                value={this.state.yearly} onChange={(e) => { this.setState({ yearly: e.target.value }) }} required />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="inputContact2" className="col-sm-3 control-label text-nowrap">Two Yearly</label>
                                        <div className="col-sm-9">
                                            <input id="TwoYearly" type="text" className="form-control"
                                                value={this.state.two_yearly} onChange={(e) => { this.setState({ two_yearly: e.target.value }) }} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="inputContact3" className="col-sm-3 control-label text-nowrap">Paypal Secret Key</label>
                                        <div className="col-sm-9">
                                            <input id="PaypalSecretKey" type="text" className="form-control"
                                                value={this.state.paypal_api} onChange={(e) => { this.setState({ paypal_api: e.target.value }) }} />
                                        </div>
                                    </div>
                                    {this.state.info != '' && <div className="form-group">
                                        <div className="col-sm-offset-3 col-sm-9">
                                            <div style={{ backgroundColor: 'rgb(20,177,248)', borderRadius: 3, color: 'white', padding:10 }}>{this.state.info}</div>
                                        </div>
                                    </div>}
                                    <div className="form-group">
                                        <div className="col-sm-offset-3 col-sm-9">
                                            <button type="submit" className="btn btn-info" style={{ width: 150 }} onClick={(e) => this.onSave(e)}>Save</button>
                                        </div>
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

export default Transfer;
