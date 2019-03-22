import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, Table, Pagination } from 'react-bootstrap';
import { Router, Route, Link, History, withRouter } from 'react-router-dom';

import Api from './api'
import config from '../../config'

class TransferHistory extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            transactions: [],
            count: 0,
            actionType: 0,
        }
    }

    componentDidMount() {
        Api.getTransactions({
                from: '',
                to: '',
                userId: 13,
        }, (err, res) => {
            if (err == null) {
                console.log('=====', res.result)
                this.setState({ transactions: res.result })
            }
        })
    }

    deleteItem(index) {
        swal({
            title: "Are you sure?",
            text: "You will not be able to recover this user!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
        },
            () => {
                Api.deleteUser(this.state.users[index].id, (err, res) => {
                    if (err == null) {
                        this.state.users.splice(index, 1)
                        this.setState({ users: [...this.state.users] })
                        swal("Deleted!", "The user has been deleted.", "success");
                    }
                })
            });
    }

    addUser(isNew) {
        this.props.history.push("user-edit", { data: {}, index: -1, isNew: isNew })
    }

    editItem(index, isNew) {
        this.props.history.push("user-edit", { data: this.state.users[index], index: index, isNew: isNew })
    }
    
    apply() {
        switch (Number(this.state.actionType)) {
            case 0:
                let content = 'data:text/csv;charset=utf-8, type, transactionId, sender, sendAmount, sendCurrency, receiver, receiverAmount, receiverCurrency, deleted, createdBy, updatedBy, createdAt, updatedAt\r\n';
                for (var i = 0; i < this.state.users.length; i++) {
                    let { type, transactionId, sender, sendAmount, sendCurrency, receiver, receiverAmount, receiverCurrency, deleted, createdBy, updatedBy, createdAt, updatedAt } = this.state.users[i]
                    let item = [type, transactionId, sender, sendAmount, sendCurrency, receiver, receiverAmount, receiverCurrency, deleted, createdBy, updatedBy, createdAt, updatedAt]
                    let row = item.join(",")
                    content += row + "\r\n"
                }
                let encodedUri = encodeURI(content);
                let link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "transfer history.csv");
                document.body.appendChild(link);
                link.click();
                break;
            default:
                break;
        }
    }


    render() {
        return (
            <ContentWrapper>
                <h3>Transfer History
                    <small>You can check transfer history</small>
                </h3>
                { /* START panel */}
                <div className="panel panel-default">
                    {/* <div className="panel-heading">
                        <div role="button" className="pull-right text-muted" onClick={() => this.addUser()}>
                            <em className="fa fa-plus text-muted mr"></em>Add</div>
                        User List
                    </div> */}
                    { /* START table-responsive */}
                    <Table id="table-ext-1" responsive bordered hover>
                        <thead>
                            <tr>
                                <th className="text-center">Type</th>
                                <th className="text-center">TransactionID</th>
                                <th className="text-center">Sender</th>
                                <th className="text-center">Send Amount</th>
                                <th className="text-center">Send Currency</th>

                                <th className="text-center">Receiver</th>
                                <th className="text-center">Receive Amount</th>
                                <th className="text-center">Receive Currency</th>
                                <th className="text-center">Deleted</th>
                                <th className="text-center">CreatedBy</th>
                                <th className="text-center">UpdatedBy</th>
                                <th className="text-center">CreatedAt</th>
                                <th className="text-center">UpdatedAt</th>
                                <th data-check-all="data-check-all">
                                    <div data-toggle="tooltip" data-title="Check All" className="checkbox c-checkbox">
                                        <label>
                                            <input type="checkbox" />
                                            <em className="fa fa-check"></em>
                                        </label>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.transactions.map((item, index) =>
                                <tr key={index}>
                                    <td className="text-center">{item.type}</td>
                                    <td className="text-center">{item.transactionId}</td>
                                    {/* <td className="text-center">
                                        <div className="media">
                                            <img src={config.BACKEND_FILE_URL + item.image} alt="Image" className="img-responsive img-circle" />
                                        </div>
                                    </td> */}
                                    <td className="text-center">{item.sender}</td>
                                    <td className="text-center">{item.sendAmount}</td>
                                    <td className="text-center">{item.sendCurrencyId}</td>
                                    <td className="text-center">{item.receiver}</td>
                                    <td className="text-center">{item.receiverAmount}</td>
                                    <td className="text-center">{item.receiverCurrencyId}</td>
                                    <td className="text-center">
                                        {item.deleted == 1 && <span className="label label-success">Undeleted</span>}
                                        {item.deleted == 0 && <span className="label label-default">Deleted</span>}
                                    </td>                                  

                                    <td className="text-center">{item.createdBy}</td>
                                    <td className="text-center">{item.updatedBy}</td>
                                    <td className="text-center">{item.createdAt}</td>
                                    <td className="text-center">{item.updatedAt}</td>
                                    {/* <td><div className="text-nowrap">{item.mobile_phone}</div></td> */}
                                    <td className="text-nowrap">
                                        <Button className="btn btn-info fa fa-edit btn-sm" onClick={() => this.editItem(index)} />
                                        <Button className="btn btn-danger fa fa-trash btn-sm" onClick={() => this.deleteItem(index)} />
                                    </td>
                                    <td>
                                        <div className="checkbox c-checkbox">
                                            <label>
                                                <input type="checkbox" />
                                                <em className="fa fa-check"></em>
                                            </label>
                                        </div>
                                    </td>
                                </tr>
                            )}

                        </tbody>
                    </Table>
                    <div className="panel-footer">
                        <Row>
                            <Col lg={2}>
                                <div className="input-group">
                                    <input type="text" placeholder="Search" className="input-sm form-control" />
                                    <span className="input-group-btn">
                                        <button type="button" style={{marginLeft: 5}} className="btn btn-sm btn-default">Search</button>
                                    </span>
                                </div>
                            </Col>
                            <Col lg={8}></Col>
                            <Col lg={2}>
                                <div className="input-group pull-right">
                                    <select className="input-sm form-control" value={this.state.actionType} onChange={(e) => {
                                        this.setState({ actionType: e.target.value })
                                    }}>
                                        <option value="0">Export</option>
                                        <option value="1">Delete</option>
                                        <option value="2">Clone</option>
                                    </select>
                                    <span className="input-group-btn">
                                        <button className="btn btn-sm btn-default" onClick={() => this.apply()}>Apply</button>
                                    </span>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>

            </ContentWrapper>
        );
    }

}

export default TransferHistory;
