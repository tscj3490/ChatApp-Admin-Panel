import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, Table, Pagination } from 'react-bootstrap';
import { Router, Route, Link, History, withRouter } from 'react-router-dom';

import Api from './api'
import config from '../../config'
import Spinner from 'react-spinner'

class Currencies extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            fee: '',

            result: null,
            fromCurrency: "USD",
            toCurrency: "GBP",
            amount: 1,
            currencies: [],
            currencyMap: [],

            rates: [],
            isWaiting: false,
          
        }

    }
    componentDidMount() {
        let currencyList = []
        this.setState({ isWaiting: true })
        Api.getCurrencies((err, res) => {
            if (err == null && res.error == null) {
                this.setState({currencies:res.result})
            }
        })

        Api.getExchangeRate(this.state.fromCurrency, (err, res) => {
            if (err == null) {
                this.setState({ isWaiting: false, rates: res.rates })
            }
        })

    }

    // Updates the states based on the dropdown that was changed
    selectHandler(event) {
        // if (event.target.name === "from") {
        this.setState({ isWaiting: true, fromCurrency: event.target.value })
        Api.getExchangeRate(event.target.value, (err, res) => {
            if (err == null) {
                this.setState({ isWaiting: false, rates: res.rates })
            }
        })
        // }

    }

    addCurrency(isNew) {
        this.props.history.push("currencies-edit", { data: {}, index: -1, isNew: isNew })
    }

    editItem(index, isNew) {
        this.props.history.push("currencies-edit", { data: this.state.currencies[index], index: index, isNew: isNew })
    }

    deleteItem(index) {
        swal({
            title: "Are you sure?",
            text: "You will not be able to recover this currency!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
        },
            () => {
                Api.deleteCurrency(this.state.currencies[index].id, (err, res) => {
                    if (err == null && res.error == null) {
                        this.state.currencies.splice(index, 1)
                        this.setState({currencies:[...this.state.currencies]})
                        swal("Deleted!", "The currency has been deleted.", "success");
                    }
                })
            });
    }

    render() {      
        return (
            <ContentWrapper>
                <h3>Currency Setting
                    <small>You can handle your currency setting here</small>
                </h3>
                <div className="panel panel-default container">
                    <div className="panel-heading">
                        <div className="h4 text-center">Currency Setting</div>
                    </div>
                    <div className="panel-body">
                        {/* <Row className="pv-lg"> */}
                        <Col lg={7}>
                            <Col lg={1}></Col>
                            <Col lg={10}>
                                <form className="form-horizontal">
                                    <div className="form-group">
                                        <label htmlFor="inputContact1" className="col-sm-4 control-label text-nowrap">Exchange Fee</label>
                                        <div className="col-sm-8">
                                            <input id="fee" type="text" placeholder="" className="form-control"
                                                value={this.state.fee} onChange={(e) => { this.setState({ fee: e.target.value }) }} required />
                                        </div>
                                    </div>
                                </form>
                                <div className="panel panel-default" style={{ height: 600, overflowX: 'auto' }}>
                                    <div className="panel-heading">
                                        <div role="button" className="pull-right text-muted" onClick={() => this.addCurrency(true)}>
                                            <em className="fa fa-plus text-muted mr"></em>Add
                                        </div>
                                    </div>
                                    <Table id="table-ext-1" bordered hover>
                                        <thead>
                                            <tr>
                                                <th className="text-center">Name</th>
                                                <th className="text-center">Rate</th>
                                                <th className="text-center">Symbol</th>
                                                <th className="text-center">Image</th>
                                                <th className="text-center">Flag</th>
                                                <th className="text-center">Description</th>
                                                <th className="text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.currencies.map((item, index) => 
                                                    <tr key={index}>
                                                        <td>{item.name}</td>
                                                        <td>{item.rate}</td>
                                                        <td>{item.symbol}</td>
                                                        <td>
                                                            <div className="media">
                                                                <img src={item.image} alt="Image" className="img-responsive" />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="media">
                                                                <img src={item.flag} alt="Image" className="img-responsive" />
                                                            </div>
                                                        </td>
                                                        <td>{item.description}</td>
                                                        <td className="text-nowrap">
                                                            <Button className="btn btn-info fa fa-edit btn-sm" onClick={() => this.editItem(index, false)} />
                                                            <Button className="btn btn-danger fa fa-trash btn-sm" onClick={() => this.deleteItem(index)} />
                                                        </td>
                                                    </tr>
                                             )}
                                        </tbody>
                                    </Table>
                                </div>
                            </Col>
                        </Col>
                        <Col lg={5}>
                            <Col lg={1}></Col>
                            <Col lg={9}>
                                <div className="form-group">
                                    <form className="form-horizontal">
                                        {/* <h2><span>Currency </span> Converter <span role="img" aria-label="money">&#x1f4b5;</span> </h2> */}
                                        <label htmlFor="inputContact1" className="col-sm-4 control-label text-nowrap">Base Currency</label>
                                        <div className="col-sm-8">
                                            <select className="input-sm form-control" value={this.state.fromCurrency} onChange={(e) => this.selectHandler(e)}>
                                                {this.state.currencies.map((item, index) => {
                                                    return (
                                                        <option key={index} value={item.name}>{item.name}</option>
                                                    )
                                                })}

                                            </select>
                                        </div>
                                    </form>

                                </div>

                                <div className="panel panel-default" style={{ height: 600, overflowX: 'auto' }}>
                                    {this.state.isWaiting && <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center' }}>
                                        <div style={{ width: 100, height: 40 }}><Spinner /></div>
                                        <span>Fetching data from back end...</span>
                                    </div>}
                                    <Table id="table-ext-1" bordered hover>
                                        <thead>
                                            <tr>
                                                <th className="text-center">Currency Name</th>
                                                <th className="text-center">Exchange Rate</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.keys(this.state.rates).map((item, index) =>
                                                <tr key={index}>
                                                    <td className="text-center">{item}</td>
                                                    <td className="text-center">{this.state.rates[item]}</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </Col>
                        </Col>
                        {/* </Row> */}

                    </div>
                </div>
            </ContentWrapper >
        );
    }

}

export default Currencies;
