import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, Table, Pagination } from 'react-bootstrap';
import { Router, Route, Link, History, withRouter } from 'react-router-dom';

import Api from './api'
import config from '../../config'

class Administrator extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            administrators: [],
            count: 0,
            actionType: 0,
        }
    }

    componentDidMount() {
        Api.getCustomerList((err, res) => {
            console.log(err, res)
            this.setState({ count: res.total, administrators: res.items })
        })
    }

    deleteItem(index) {
        swal({
            title: "Are you sure?",
            text: "You will not be able to recover this administrator!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
        },
            () => {
                Api.deleteCustomer(this.state.administrators[index].id, (err, res) => {
                    if (err == null) {
                        this.state.administrators.splice(index, 1)
                        this.setState({ administrators: [...this.state.administrators] })
                        swal("Deleted!", "The customer has been deleted.", "success");
                    }
                })
            });
    }



    addAdministrator() {
        this.props.history.push("administrator-edit", { data: null, index: -1 })
    }

    editItem(index) {
        this.props.history.push("administrator-edit", { data: this.state.administrators[index], index: index })
    }

    apply() {
        switch (Number(this.state.actionType)) {
            case 0:
                let content = 'data:text/csv;charset=utf-8, username, firstname, surname, email, city, country, address, mobile_phone, postcode, tex_phone, created_at, updated_at\r\n';
                for (var i = 0; i < this.state.administrators.length; i++) {
                    let { username, firstname, surname, email, city, country, address, mobile_phone, postcode, tex_phone, created_at, updated_at } = this.state.administrators[i]
                    let item = [username, firsname, surname, email, city, country, address, mobile_phone, postcode, tex_phone, created_at, updated_at]
                    let row = item.join(",")
                    content += row + "\r\n"
                }
                let encodedUri = encodeURI(content);
                let link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "customer.csv");
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
                <h3>Administrator
                <small>You can check administrators' profile and history</small>
                </h3>
                { /* START panel */}
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <div role="button" className="pull-right text-muted" onClick={() => this.addAdministrator()}>
                            <em className="fa fa-plus text-muted mr"></em>Add</div>
                            Administrator List
                    </div>
                    { /* START table-responsive */}
                    <Table id="table-ext-1" responsive bordered hover>
                        <thead>
                            <tr>
                                <th>UID</th>
                                <th>Avatar</th>
                                <th>Rating</th>
                                <th>User Name</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>City</th>
                                <th>Actions</th>
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
                            {this.state.administrators.map((item, index) =>
                                <tr key={index}>
                                    <td>{index}</td>
                                    <td>
                                        <div className="media">
                                            <img src={config.BACKEND_FILE_URL + item.profile_pic} alt="Image" className="img-responsive img-circle" />
                                        </div>
                                    </td>
                                    <td>{item.rate}</td>
                                    <td>{item.username}</td>
                                    <td>{item.firsname+' '+item.surname}</td>
                                    <td>{item.email}</td>
                                    <td><div className="text-nowrap">{item.mobile_phone}</div></td>
                                    <td>
                                        {item.city}
                                    </td>
                                    <td className="text-nowrap">
                                        <Button className="btn btn-info fa fa-search btn-sm" onClick={() => this.editItem(index)} />
                                        <Button className="btn btn-danger fa fa-trash btn-sm" onClick={() => this.deleteItem(index)} />
                                    </td>
                                    <td>
                                        <div className="checkbox c-checkbox">
                                            <label>
                                                <input type="checkbox" value={item.checked} onChange={() => {
                                                    this.setState((old) => {
                                                        old.administrators[index].checked = old.administrators[index].checked ? false : true;
                                                    })
                                                }} />
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
                                        <button type="button" className="btn btn-sm btn-default">Search</button>
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

export default Administrator;
