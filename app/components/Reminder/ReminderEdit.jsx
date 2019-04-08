import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, DropdownButton, MenuItem, Modal, Image } from 'react-bootstrap';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import Dropzone from 'react-dropzone';

import Avatar from 'react-avatar-edit'
import ReactStars from 'react-stars'
import Spinner from 'react-spinner'

import ReminderApi from './api'
import ServiceApi from '../Service/api'
import config from '../../config'

class ReminderEdit extends React.Component {
    constructor(props) {
        super(props)

        this.data = props.location.state ? props.location.state.data || {} : {}
        this.index = (props.location.state == undefined) ? -1 : props.location.state.index
        this.isNew = props.location.state ? props.location.state.isNew : true

        this.toggle = this.toggle.bind(this);
        // this._handleUpdate = this._handleUpdate.bind(this);
        this.state = {
            id: this.data.id,
            name: this.data.name,
            logo: config.BACKEND_FILE_URL + this.data.logo,
            company_name: this.data.company_name,

            files: [{ preview: this.data.logo }],

            logoPreview: this.data.logo,
            changed: false,
            edit: false,

            preview: null,
            popoverOpen: false,
            myCheck: false,
            isWaiting: true
        }
    }
    componentDidMount() {
    }

    toggle() {
        this.setState({
            popoverOpen: !this.state.popoverOpen
        });
    }

    submitProfile(e) {
        this.setState({ isWaiting: false })
        e.preventDefault()
        e.stopPropagation()
        if (this.isNew) {
            if (this.state.changed) {
                ServiceApi.uploadFile(this.state.files[0], (res) => {
                    this.state.logo = res.path

                    ReminderApi.postReminder({
                        name: this.state.name,
                        company_name: this.state.company_name,
                        logo: this.state.logo,
                    }, (err1, res1) => {
                        this.setState({ isWaiting: true })
                        if (err1 == null && res1.error == null) {
                            this.props.history.goBack()
                        } else {
                        }
                    })
                })
            } else {
                ReminderApi.postReminder({
                    name: this.state.name,
                    company_name: this.state.company_name,
                }, (err, res) => {
                    this.setState({ isWaiting: true })
                    if (err1 == null && res1.error == null) {
                        this.props.history.goBack()
                    } else {
                    }
                })
            }
        } else { // isNew == false
            if (this.state.changed) {
                ServiceApi.uploadFile(this.state.files[0], (res) => {
                    this.state.logo = res.path
                    console.log("-------", this.state.logo)
                    if (res.error == null) {
                        ReminderApi.updateReminder(this.state.id, {
                            name: this.state.name,
                            company_name: this.state.company_name,
                            logo: this.state.logo,
                        }, (err1, res1) => {
                            this.setState({ isWaiting: true })
                            if (err1 == null && res1.error == null) {
                                this.props.history.goBack()
                            } else {
                            }

                        })
                    }

                })
            } else {
                ReminderApi.updateReminder(this.state.id, {
                    name: this.state.name,
                    company_name: this.state.company_name,
                }, (err, res) => {
                    this.setState({ isWaiting: true })
                    if (err == null && res.error == null) {
                        this.props.history.goBack()
                    } else {
                    }
                })
            }
        }
    }



    deleteItem(id) {
        swal({
            title: "Are you sure?",
            text: "You will not be able to recover this reminder!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
        },
            () => {
                ReminderApi.deleteReminder(id, (err, res) => {
                    if (err == null) {
                        swal("Deleted!", "The reminder has been deleted.", "success");
                        this.props.history.goBack()
                    }
                })
            });
    }

    closeModal() {
        this.setState({ edit: false })
    }

    showModal() {
        this.setState({ edit: true, changed: false })
        this.setState((old) => {
            this.state.files = [{ preview: this.state.logo }]
        })
    }

    onDrop(files) {
        this.setState({
            files: files,
            changed: true,
        });
        setTimeout(() => console.log("=", this.state.changed), 100)
    }

    renderModal() {
        return (
            <Modal show={this.state.edit} onHide={this.closeModal.bind(this)}>
                <div style={{ margin: 50 }}>
                    <Dropzone className="well p-lg" ref="dropzone" onDrop={this.onDrop.bind(this)} multiple={false} style={{ height: 200 }} >
                        {this.state.files.length && <Image src={this.state.files[0].preview} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
                    </Dropzone>

                    <div className="text-center mt-lg pt-lg">
                        <Button className="btn btn-Default m-lg" style={{ width: 160 }} onClick={() => this.setState({ edit: false })}>Cancel</Button>
                        <Button className="btn btn-primary m-lg" style={{ width: 160 }} onClick={() => {
                            this.setState({ logo: this.state.files[0].preview, edit: false })
                        }}>Done</Button>
                    </div>
                </div>

            </Modal>
        )
    }

    _handleUpdate(e) {
        if (e.target.validity.valid) {
            this.setState({ totalAmount: e.target.value });
        }
    }

    render() {
        var ddTitle = (<em className="fa fa-ellipsis-v fa-lg text-muted"></em>);
        return (
            <ContentWrapper>
                <Row>
                    <Col md={4}>
                        <div className="panel panel-default">
                            <div className="panel-body text-center">
                                <div className="pv-lg">
                                    <Image src={this.state.logo} alt="thumbnail" style={{ width: '100%', height: 150, objectFit: 'contain' }} />
                                </div>
                                <h3 className="m0 text-bold">{this.state.name}</h3>
                                <div className="text-center mt mb-lg"><a className="btn btn-primary" onClick={() => this.showModal()}>Change Logo</a>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col md={8}>
                        <div className="panel panel-default">
                            <div className="panel-body">
                                <div className="h4 text-center">{this.index < 0 ? "Add New Reminder" : "Edit Reminder"}</div>
                                <Row className="pv-lg">
                                    <Col lg={2}></Col>
                                    <Col lg={8}>
                                        <form className="form-horizontal" onSubmit={this.submitProfile.bind(this)} >
                                            <div className="form-group">
                                                <label htmlFor="inputContact1" className="col-sm-3 control-label text-nowrap">Reminder Name</label>
                                                <div className="col-sm-9">
                                                    <input id="name" type="text" placeholder="" defaultValue={this.state.name}
                                                        onChange={(e) => this.setState({ name: e.target.value })} className="form-control" required />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="inputContact1" className="col-sm-3 control-label text-nowrap">Company</label>
                                                <div className="col-sm-9">
                                                    <input id="company_name" type="text" placeholder="" defaultValue={this.state.company_name}
                                                        onChange={(e) => this.setState({ company_name: e.target.value })} className="form-control" required />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="col-sm-offset-3 col-sm-9">
                                                    <button type="submit" className="btn btn-info">{this.isNew ? " Create " : " Update "}</button>
                                                </div>
                                            </div>
                                            {!this.state.isWaiting  && <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                <div style={{ width: 100, height: 40 }}><Spinner /></div>
                                                <span>Uploading data on back end...</span>
                                            </div>}
                                        </form>
                                        {this.index >= 0 && <div className="text-right"><div style={{ cursor: 'pointer' }} onClick={() => this.deleteItem(this.state.id)}>Delete this Reminder?</div>
                                        </div>}
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Col>
                </Row>
                {/* <Row>
                    <Col sm={6}>
                        <div className="big-button text-primary shadow-hover" onClick={() => this.viewService()}>View MyReminder</div>
                    </Col>
                    <Col sm={6}>
                        <div className="big-button text-success shadow-hover" onClick={() => this.viewOrder()}>View Orders</div>
                    </Col>
                </Row> */}
                {this.renderModal()}
            </ContentWrapper>
        );
    }

}

export default ReminderEdit;

