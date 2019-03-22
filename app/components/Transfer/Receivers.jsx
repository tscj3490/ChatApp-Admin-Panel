import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, Table, Pagination } from 'react-bootstrap';
import { Router, Route, Link, History, withRouter } from 'react-router-dom';

import Api from './api'
import config from '../../config'

class Receivers extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            users: [],
            count: 0,
            actionType: 0,

            filterID: '',
            filterName: '',
            filterEmail: '',
            filterPhone: '',
            filterAddress: '',
            filterCity: '',
            filterCountry: '',
            filterDeleted: '',
            filterActivated: '',
            filterDonateAmount: '',
            filterDonateCount: '',
            filterAction: '',
        }
    }

    componentDidMount() {
        Api.getUserList((err, res) => {
            // this.setState({ count: res.total, vendors: res.items })
            if (err == null) {
                console.log('=====', res.result)
                this.setState({ users: res.result })
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
                let content = 'data:text/csv;charset=utf-8, name, image, email, phone, address, city, country, donateAmount, donateCount, deleted, activated, createdBy, updatedBy, createdAt, updatedAt\r\n';
                for (var i = 0; i < this.state.users.length; i++) {
                    let { name, image, email, phone, address, city, country, donateAmount, donateCount, deleted, activated, createdBy, updatedBy, createdAt, updatedAt } = this.state.users[i]
                    let item = [name, image, email, phone, address, city, country, donateAmount, donateCount, deleted, activated, createdBy, updatedBy, createdAt, updatedAt]
                    let row = item.join(",")
                    content += row + "\r\n"
                }
                let encodedUri = encodeURI(content);
                let link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "user.csv");
                document.body.appendChild(link);
                link.click();
                break;
            default:
                break;
        }
    }

    changeFilter(item, e) {
        var obj = {}
        obj[item] = e.target.value
        this.setState(obj)

        setTimeout(() => console.log(this.state.filterName), 100)
    }

    render() {
        return (
            <ContentWrapper>
                <h3>Users
                    <small>You can check users' profile and history</small>
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
                                <th className="text-center">ID
                                    <input style={{ minWidth: 30 }} className="search-box" type="text" value={this.state.filterID} onChange={e => this.changeFilter('filterID', e)} />
                                </th>
                                <th className="text-center">Image
                                    <input style={{ width: 50 }} className="search-box" type="text" onChange={e => this.changeFilter(e)} />
                                </th>
                                <th className="text-center">Name
                                    <input style={{ width: 120 }} className="search-box" type="text" value={this.state.filterName} onChange={e => this.changeFilter('filterName', e)} />
                                </th>
                                <th className="text-center">Email
                                    <input className="search-box" type="text" value={this.state.filterEmail} onChange={e => this.changeFilter('filterEmail', e)} />
                                </th>
                                <th className="text-center">Phone
                                    <input style={{ width: 150 }} className="search-box" type="text" value={this.state.filterPhone} onChange={e => this.changeFilter('filterPhone', e)} />
                                </th>
                                <th className="text-center">Address
                                    <input className="search-box" type="text" value={this.state.filterAddress} onChange={e => this.changeFilter('filterAddress', e)} />
                                </th>
                                <th className="text-center">City
                                    <input style={{ width: 120 }} className="search-box" type="text" value={this.state.filterCity} onChange={e => this.changeFilter('filterCity', e)} />
                                </th>
                                <th className="text-center">Country
                                    <input style={{ width: 120 }} className="search-box" type="text" value={this.state.filterCountry} onChange={e => this.changeFilter('filterCountry', e)} />
                                </th>
                                <th className="text-center">Deleted
                                    <input style={{ width: 60 }} className="search-box" type="text" value={this.state.filterDeleted} onChange={e => this.changeFilter('filterDeleted', e)} />
                                </th>
                                <th className="text-center">Activated
                                    <input style={{ width: 60 }} className="search-box" type="text" value={this.state.filterActivated} onChange={e => this.changeFilter('filterActivated', e)} />
                                </th>
                                <th className="text-center">DonateAmount
                                    <input style={{ width: 100 }} className="search-box" type="text" value={this.state.filterDonateAmount} onChange={e => this.changeFilter('filterDonateAmount', e)} />
                                </th>
                                <th className="text-center">DonateCount
                                    <input style={{ width: 50 }} className="search-box" type="text" value={this.state.filterDonateCount} onChange={e => this.changeFilter('filterDonateCount', e)} />
                                </th>
                                <th className="text-center">Action
                                    <input style={{ width: 50 }} className="search-box" type="text" value={this.state.filterAction} onChange={e => this.changeFilter('filterAction', e)} />
                                </th>
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
                            {this.state.users.map((item, index) =>
                                <tr key={index}>
                                    <td className="text-center">{item.id}</td>
                                    <td className="text-center">
                                        <div className="media">
                                            <img src={config.BACKEND_FILE_URL + item.image} alt="Image" className="img-responsive img-circle" />
                                        </div>
                                    </td>
                                    <td className="text-center">{item.name}</td>
                                    <td className="text-center">{item.email}</td>
                                    <td className="text-center">{item.phone}</td>
                                    <td className="text-center">{item.address}</td>
                                    <td className="text-center">{item.city}</td>
                                    <td className="text-center">{item.country}</td>
                                    <td className="text-center">
                                        {item.deleted == 1 && <span className="label label-success">Undeleted</span>}
                                        {item.deleted == 0 && <span className="label label-default">Deleted</span>}
                                    </td>
                                    <td className="text-center">
                                        {item.activated == 1 && <span className="label label-success">Active</span>}
                                        {item.activated == 0 && <span className="label label-default">Inactive</span>}
                                    </td>

                                    <td className="text-center">{item.donateAmount}</td>
                                    <td className="text-center">{item.donateCount}</td>
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

export default Receivers;
