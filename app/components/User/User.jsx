import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, Table, Pagination } from 'react-bootstrap';
import { Router, Route, Link, History, withRouter } from 'react-router-dom';

import Api from './api'
import config from '../../config'

class User extends React.Component {

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
            filterAvatar: '',
            filterRole: '',
            filterTeam: '',
            filterCode: '',
            filterDeleted: '',
            filterIsverified: '',
            filterUpdated: '',
            filterAction: '',
        }
    }

    componentDidMount() {
        Api.getUserList((err, res) => {
            if (err == null && res.error == null) {
                this.setState({ users: res.items })
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
                    if (err == null && res.error == null) {
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

    search() {
        if (this.state.searchString == '') {
            Api.getUserList((err, res) => {
                if (err == null && res.error == null) {
                    this.setState({ users: res.items })
                }
            })
            return;
        }

        var name = '',
            phone = '',
            address = '',
            city = '',
            country = '';
        switch (Number(this.state.actionType)) {
            case 0:
                name = this.state.searchString;
                break;
            case 1:
                phone = this.state.searchString;
                break;
            case 2:
                address = this.state.searchString;
                break;
            case 3:
                city = this.state.searchString;
                break;
            case 4:
                country = this.state.searchString;
                break;
            default:
                break;
        }
        Api.searchUser({
            name: name,
            phone: phone,
            address: address,
            city: city,
            country: country,
        }, (err, res) => {
            console.log(err, res)
            if (err == null && res.error == null) {
                this.setState({ users: res.result })
            }
        })

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
                    { /* START table-responsive */}
                    {/* <div className="panel-footer">
                        <Row>
                            <Col lg={2} >
                                <div className="input-group">
                                    <input type="text" placeholder="Search" className="input-sm form-control" />
                                    <span className="input-group-btn" >
                                        <button type="button" style={{ marginLeft: 5 }} className="btn btn-sm btn-default" onClick={() => this.search()}>Search</button>
                                    </span>
                                </div>
                            </Col>
                            <Col lg={8}></Col>
                            <Col lg={2}>
                                <div className="input-group pull-right">
                                    <select className="input-sm form-control" value={this.state.actionType} onChange={(e) => {
                                        this.setState({ actionType: e.target.value })
                                    }}>
                                        <option value="0">Name</option>
                                        <option value="1">Phone</option>
                                        <option value="2">Address</option>
                                        <option value="3">City</option>
                                        <option value="4">Country</option>
                                        <option value="5">DonateAmount</option>
                                        <option value="6">DonateCount</option>
                                    </select>
                                </div>
                            </Col>
                        </Row>
                    </div> */}
                    <Table id="table-ext-1" responsive bordered hover>
                        <thead>
                            <tr>
                                <th className="text-center">ID
                                    {/* <input style={{ minWidth: 30 }} className="search-box" type="text" value={this.state.filterID} onChange={e => this.changeFilter('filterID', e)} /> */}
                                </th>
                                <th className="text-center">Name</th>
                                <th className="text-center">Email</th>   
                                <th className="text-center">Phone</th>                             
                                <th className="text-center">Avatar</th>                                
                                <th className="text-center">Role</th>
                                <th className="text-center">Team</th>
                                <th className="text-center">Company</th>
                                <th className="text-center">Code</th>
                                <th className="text-center">Deleted</th>
                                <th className="text-center">IsVerified</th>
                                <th className="text-center">UpdatedAt</th>
                                <th className="text-center">Action</th>
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
                            {!!this.state.users && this.state.users.map((item, index) =>
                                <tr key={index}>
                                    <td className="text-center">{item.id}</td>                                    
                                    <td className="text-center">{item.name}</td>
                                    <td className="text-center">{item.email}</td>
                                    <td className="text-center">{item.phone}</td>
                                    <td className="text-center">
                                        <div className="media">
                                            <img src={config.BACKEND_FILE_URL + item.avatar} alt="Image" className="img-responsive img-circle" />
                                        </div>
                                    </td>
                                    <td className="text-center">{item.role}</td>
                                    <td className="text-center">{item.team_name}</td>
                                    <td className="text-center">{item.company_name}</td>
                                    <td className="text-center">{item.code}</td>
                                    <td className="text-center">
                                        {item.deleted == 1 && <span className="label label-success">Undeleted</span>}
                                        {item.deleted == 0 && <span className="label label-default">Deleted</span>}
                                    </td>
                                    <td className="text-center">
                                        {item.activated == 1 && <span className="label label-success">Verified</span>}
                                        {item.activated == 0 && <span className="label label-default">Unverified</span>}
                                    </td>

                                    <td className="text-center">{item.updated_at}</td>
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
                </div>

            </ContentWrapper>
        );
    }

}

export default User;
