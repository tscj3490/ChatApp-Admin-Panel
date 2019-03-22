import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, Table, Pagination, Modal, DropdownButton, MenuItem } from 'react-bootstrap';

import Api from './api'
import config from '../../config'

class Services extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            viewDetail: false,
            services: [],
            devices: [],
        }
    }
    componentDidMount() {
        Api.getServiceList((err, res) => {
            if (err == null) {
                this.setState({ services: res.items })
            }
        })

        Api.getDeviceList((err, res) => {
            if (err == null) {
                this.setState({ devices: res.items })
            }
        })
    }

    closeModal() {
        this.setState({ viewDetail: false })
    }

    showModal(item, index) {
        this.setState({
            viewDetail: true, selectedIndex: index, deviceId: item.parent_device,
            serviceName: item.service_name, description: item.description, price: item.price
        })
    }

    onSubmit(e) {
        e.preventDefault()
        e.stopPropagation()

        if (this.selectedIndex >= 0) {
            let item = this.state.services[this.state.selectedIndex]
            item.parent_device = Number(this.state.deviceId)
            item.service_name = this.state.serviceName
            item.description = this.state.description
            item.price = Number(this.state.price)
            console.log(item)

            Api.updateService(item, (err, res) => {
                this.setState((old) => {
                    old.services[this.state.selectedIndex] = res
                })
            })
        } else {
            let item =
                {
                    parent_device: Number(this.state.deviceId),
                    service_name: this.state.serviceName,
                    description: this.state.description,
                    price: Number(this.state.price)
                }

            Api.insertService(item, (err, res) => {
                this.setState((old) => {
                    old.services.push(res)
                })
            })
        }


        this.setState({ viewDetail: false })
    }

    renderModal() {
        var ddTitle = (<em className="fa fa-ellipsis-v fa-lg text-muted"></em>);
        return (
            <Modal show={this.state.viewDetail} onHide={this.closeModal.bind(this)}>
                <div className="mt-lg p-lg">
                    {/* <div className="pull-right">
                        <DropdownButton bsStyle="link" noCaret pullRight title={ddTitle} id="dropdown-basic">
                            <MenuItem eventKey="1">Edit Order</MenuItem>
                            <MenuItem eventKey="2">Delete Order</MenuItem>
                        </DropdownButton>
                    </div> */}
                    <div className="h4 text-center">Order Information</div>
                    <Row className="pv-lg">
                        <Col lg={2}></Col>
                        <Col lg={8}>
                            <form className="form-horizontal" onSubmit={this.onSubmit.bind(this)}>
                                <div className="form-group">
                                    <label htmlFor="inputContact3" className="col-sm-3 control-label">Device</label>
                                    <div className="col-sm-9">
                                        <select className="chosen-select form-control" value={this.state.deviceId}
                                            onChange={(e) => this.setState({ deviceId: e.target.value })}>
                                            {this.state.devices.map((item, index) => {
                                                return (<option key={index} value={item.ID}>{item.device_name}</option>)
                                            })}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="inputContact5" className="col-sm-3 control-label">Service</label>
                                    <div className="col-sm-9">
                                        <input id="inputContact5" type="text" value={this.state.serviceName} className="form-control"
                                            onChange={(e) => this.setState({ serviceName: e.target.value })} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="inputContact6" className="col-sm-3 control-label">Description</label>
                                    <div className="col-sm-9">
                                        <textarea id="inputContact6" rows="4" className="form-control" value={this.state.description}
                                            onChange={(e) => this.setState({ description: e.target.value })} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="inputContact7" className="col-sm-3 control-label">Price</label>
                                    <div className="col-sm-9">
                                        <input id="inputContact7" type="text" value={this.state.price} className="form-control"
                                            onChange={(e) => this.setState({ price: e.target.value })} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-sm-offset-3 col-sm-9">
                                        <button type="submit" className="btn btn-info">{this.state.selectedIndex>=0?'Update':'Add'}</button>
                                        <button type="button" className="btn btn-default ml-lg" onClick={() => this.closeModal()}>Cancel</button>
                                    </div>
                                </div>
                            </form>
                            {this.state.selectedIndex >= 0 &&
                                <div className="text-right">
                                    <div style={{ cursor: 'pointer' }} onClick={() => this.deleteItem(this.state.selectedIndex)}>Delete this make?
                                    </div>
                                </div>}
                        </Col>
                    </Row>
                </div>
            </Modal>
        )
    }

    deleteItem(index) {
        swal({
            title: "Are you sure?",
            text: `Do you want to delete this service?`,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
        },
            () => {
                Api.deleteService(this.state.services[index].ID, (err, res) => {
                    if (err == null) {
                        this.state.services.splice(index, 1)
                        this.setState({ services: [...this.state.services] })
                        swal("Deleted!", "The service has been deleted.", "success");
                    }
                })
            });
    }

    addService() {
        this.setState({
            viewDetail: true,
            selectedIndex: -1,
            deviceId: this.state.devices[0].ID,
            serviceName: '',
            description: '',
            price: 0,
        })
    }

    render() {
        return (
            <ContentWrapper>
                <h3>Devices
                <small>You can add, edit and delete devices</small>
                </h3>
                { /* START panel */}
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <div role="button" className="pull-right text-muted" onClick={() => this.addService()}>
                            <em className="fa fa-plus text-muted mr"></em>Add</div>
                        Service List
                    </div>
                    { /* START table-responsive */}
                    <Table id="table-ext-1" responsive bordered hover>
                        <thead>
                            <tr>
                                <th>UID</th>
                                <th>Image</th>
                                <th>Device Name</th>
                                <th>Service Name</th>
                                <th>Description</th>
                                <th>Price</th>
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
                            {this.state.services.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <div className="media">
                                                <img src={config.BACKEND_FILE_URL + item.device_image} alt="Image" className="img-responsive" />
                                            </div>
                                        </td>
                                        <td>{item.device_name}</td>
                                        <td>{item.service_name}</td>
                                        <td width="40%"><div style={{ overflow: 'hidden' }}>{item.description}</div> </td>
                                        <td style={{minWidth:80}}>$ {item.price}</td>
                                        <td className="text-nowrap">
                                            <Button className="btn btn-info fa fa-search btn-sm" onClick={() => this.showModal(item, index)} />
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
                                )
                            })}

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
                                    <select className="input-sm form-control">
                                        <option value="0">Export</option>
                                        <option value="1">Delete</option>
                                        <option value="2">Clone</option>
                                    </select>
                                    <span className="input-group-btn">
                                        <button className="btn btn-sm btn-default">Apply</button>
                                    </span>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
                {this.renderModal()}
            </ContentWrapper>
        );
    }

}

export default Services;
