import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, Table, Pagination, Modal, DropdownButton, MenuItem, Image } from 'react-bootstrap';
import Dropzone from 'react-dropzone';

import Api from './api'
import config from '../../config'

class Devices extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            viewDetail: false,
            devices: [],
            selectIndex: 0,

            deviceName: '',
            description: '',

            files: [],
            changed: false,
        }
    }

    componentDidMount() {
        Api.getDeviceList((err, res) => {
            if (err == null) {
                this.setState({ devices: res.items })
            }
        })
    }

    onDrop(files) {
        this.setState({
            files: files,
            changed: true,
        });
    }

    closeModal() {
        this.setState({ viewDetail: false })
    }

    showModal(item, index) {
        this.setState((old) => {
            old.files = [{ preview: config.BACKEND_FILE_URL + item.image }]
        })
        this.setState({
            viewDetail: true, selectIndex: index, deviceName: item.device_name,
            description: item.description, changed: false
        })
    }

    onSubmit(e) {
        e.preventDefault()
        e.stopPropagation()
        if (this.state.selectIndex >= 0) {
            let item = this.state.devices[this.state.selectIndex]
            item.device_name = this.state.deviceName
            item.description = this.state.description
            if (this.state.changed) {
                Api.uploadFile(this.state.files[0], (res) => {
                    item.image = res.path
                    Api.updateDevice(item, (err1, res1) => {
                        this.setState((old)=>{
                            old.devices[this.state.selectIndex].image=res.path
                        })
                    })
                })
            } else {
                Api.updateDevice(item, (err, res) => {
                })
            }
        } else {
            let item = {
                device_name: this.state.deviceName,
                description: this.state.description
            }
            if (this.state.changed) {
                Api.uploadFile(this.state.files[0], (res) => {
                    item.image = res.path
                    Api.insertDevice(item, (err1, res1) => {
                        this.state.devices.push(res1)
                        this.setState({ devices: [...this.state.devices] })
                    })
                })
            } else {
                Api.insertDevice(item, (err, res) => {

                    this.state.devices.push(res)
                    this.setState({ devices: [...this.state.devices] })
                })
            }
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
                    <div className="h4 text-center">Device Information</div>
                    <Dropzone className="well p-lg" ref="dropzone" onDrop={this.onDrop.bind(this)} multiple={false} style={{ height: 200 }} >
                        {this.state.files.length && <Image src={this.state.files[0].preview} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
                    </Dropzone>
                    <Row className="pv-lg">
                        <Col lg={2}></Col>
                        <Col lg={8}>
                            <form className="form-horizontal" onSubmit={this.onSubmit.bind(this)} >
                                <div className="form-group">
                                    <label htmlFor="inputContact3" className="col-sm-3 control-label">Device</label>
                                    <div className="col-sm-9">
                                        <input id="inputContact5" type="text" value={this.state.deviceName} className="form-control"
                                            onChange={(e) => this.setState({ deviceName: e.target.value })} required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="inputContact6" className="col-sm-3 control-label">Description</label>
                                    <div className="col-sm-9">
                                        <textarea id="inputContact6" rows="4" className="form-control" value={this.state.description}
                                            onChange={(e) => this.setState({ description: e.target.value })}></textarea>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-sm-offset-3 col-sm-9">
                                        <button type="submit" className="btn btn-info">{this.state.selectIndex >= 0 ? 'Update' : 'Add'}</button>
                                        <button type="button" className="btn btn-default ml-lg" onClick={() => this.closeModal()}>Cancel</button>
                                    </div>
                                </div>
                            </form>
                            {this.state.selectIndex >= 0 && <div className="text-right"><div style={{ cursor: 'pointer' }} onClick={() => this.deleteItem(this.state.selectIndex)}>
                                Delete this Device?</div>
                            </div>}
                        </Col>
                    </Row>
                </div>
            </Modal>
        )
    }

    deleteItem(index) {
        console.log(this.state.devices[index].ID)
        Api.getMakeListWithParentID(this.state.devices[index].ID, (err, res) => {
            swal({
                title: "Are you sure?",
                text: `This device has ${res.total} makes. It will be deleted!`,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false
            },
                () => {
                    Api.deleteDevice(this.state.devices[index].ID, (err, res) => {
                        if (err == null) {
                            this.state.devices.splice(index, 1)
                            this.setState({ devices: [...this.state.devices] })
                            swal("Deleted!", "The device has been deleted.", "success");
                        }
                    })
                });
        })
    }

    addDevice() {
        this.setState({
            viewDetail: true, selectIndex: -1, deviceName: '',
            description: '', changed: false, files: [{ preview: null }]
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
                        <div role="button" className="pull-right text-muted" onClick={() => this.addDevice()}>
                            <em className="fa fa-plus text-muted mr"></em>Add</div>
                        Device List
                    </div>
                    { /* START table-responsive */}
                    <Table id="table-ext-1" responsive bordered hover>
                        <thead>
                            <tr>
                                <th>UID</th>
                                <th>Image</th>
                                <th>Device Name</th>
                                <th>Description</th>
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
                            {this.state.devices.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <div className="media">
                                                <img src={config.BACKEND_FILE_URL + item.image} alt="Image" className="img-responsive" />
                                            </div>
                                        </td>
                                        <td>{item.device_name}</td>
                                        <td width="50%"><div style={{ maxWidth: 600, overflow: 'hidden' }}>{item.description}</div> </td>
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

export default Devices;
