import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, DropdownButton, MenuItem, Modal, Image } from 'react-bootstrap';
import Dropzone from 'react-dropzone';

import Avatar from 'react-avatar-edit'
import ReactStars from 'react-stars'
import Spinner from 'react-spinner'

import Api from './api'
import ServiceApi from '../Service/api'
import config from '../../config'

class UserEdit extends React.Component {
    constructor(props) {
        super(props)

        this.data = props.location.state ? props.location.state.data || {} : {}
        this.index = (props.location.state == undefined) ? -1 : props.location.state.index
        this.isNew = props.location.state ? props.location.state.isNew : true

        console.log("user >>>", this.data)

        this.state = {
            id: this.data.id,
            name: this.data.name,
            email: this.data.email,
            phone: this.data.phone,
            avatar: config.BACKEND_FILE_URL + this.data.avatar,
            role: this.data.role,
            team_name: this.data.team_name,
            code: this.data.code,
            company_name: this.data.company_name,

            files: [{ preview: this.data.avatar }],
            changed: false,
            editAvatar: false,
            preview: null,
            isWaiting: true,
        }

        console.log(this.state)
    }

    componentDidMount() {
    }

    submitProfile(e) {
        this.setState({ isWaiting: false })
        e.preventDefault()
        e.stopPropagation()

        if (this.isNew) {
            if (this.state.changed) {
                ServiceApi.uploadFile(this.state.files[0], (res) => {
                    this.state.avatar = res.path

                    Api.postUser({
                        name: this.state.name,
                        email: this.state.email,
                        phone: this.state.phone,
                        role: this.state.role,
                        company_name: this.state.company_name,
                        team_name: this.state.team_name,
                        avatar: this.state.avatar,
                    }, (err1, res1) => {
                        this.setState({ isWaiting: true })
                        if (err1 == null && res1.error == null) {
                            this.props.history.goBack()
                        } else {
                        }
                    })
                })
            } else {
                Api.postUser({
                    name: this.state.name,
                    email: this.state.email,
                    phone: this.state.phone,
                    role: this.state.role,
                    company_name: this.state.company_name,
                    team_name: this.state.team_name,
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
                    this.state.avatar = res.path
                    if (res.error == null) {
                        Api.updateUser(this.state.id, {
                            name: this.state.name,
                            email: this.state.email,
                            phone: this.state.phone,
                            role: this.state.role,
                            company_name: this.state.company_name,
                            team_name: this.state.team_name,
                            avatar: this.state.avatar,
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
                Api.updateUser(this.state.id, {
                    name: this.state.name,
                    email: this.state.email,
                    phone: this.state.phone,
                    role: this.state.role,
                    company_name: this.state.company_name,
                    team_name: this.state.team_name,
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

    deleteItem() {
        swal({
            title: "Are you sure?",
            text: "You will not be able to recover this vendor!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
        },
            () => {
                Api.deleteVendor(id, (err, res) => {
                    if (err1 == null && res1.error == null) {
                        swal("Deleted!", "The vendor has been deleted.", "success");
                        this.props.history.goBack()
                    }
                })
            });
    }

    closeModal() {
        this.setState({ editAvatar: false })
    }

    showModal() {
        this.setState({ editAvatar: true, changed: false })
        this.setState((old) => {
            this.state.files = [{ preview: this.state.avatar }]
        })
    }

    onDrop(files) {
        this.setState({
            files: files,
            changed: true,
        });
    }

    renderModal() {
        return (
            <Modal show={this.state.editAvatar} onHide={this.closeModal.bind(this)}>
                <div style={{ margin: 50 }}>
                    <Dropzone className="well p-lg" ref="dropzone" onDrop={this.onDrop.bind(this)} multiple={false} style={{ height: 200 }} >
                        {this.state.files.length && <Image src={this.state.files[0].preview} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
                    </Dropzone>

                    <div className="text-center mt-lg pt-lg">
                        <Button className="btn btn-Default m-lg" style={{ width: 160 }} onClick={() => this.setState({ editAvatar: false })}>Cancel</Button>
                        <Button className="btn btn-primary m-lg" style={{ width: 160 }} onClick={() => {
                            this.setState({ avatar: this.state.files[0].preview, editAvatar: false })
                        }}>Done</Button>
                    </div>
                </div>

            </Modal>
        )
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
                                    <Image src={this.state.avatar} alt="Contact" style={{ width: '100%', height: 150, objectFit: 'contain' }} />
                                </div>
                                <h3 className="m0 text-bold">{this.state.name}</h3>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="m">
                                    {/* <ReactStars
                                        count={5}
                                        size={20}
                                        half={true}
                                        value={this.data.rate}
                                        edit={false}
                                        color2={'#ffd700'} />
                                    <div className="ml-lg">{this.data.rate}</div> */}
                                </div>
                                <div className="text-center mt mb-lg"><a className="btn btn-primary" onClick={() => this.showModal()}>Change Avatar</a>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col md={8}>
                        <div className="panel panel-default">
                            <div className="panel-body">

                                <div className="h4 text-center">{this.index < 0 ? "Add New User" : "Edit User Profile"}</div>
                                <Row className="pv-lg">
                                    <Col lg={2}></Col>
                                    <Col lg={8}>
                                        <form className="form-horizontal" name="formDemo" onSubmit={this.submitProfile.bind(this)} >
                                            <div className="form-group">
                                                <label htmlFor="inputContact1" className="col-sm-3 control-label text-nowrap">User Name<span className="text-danger">*</span></label>
                                                <div className="col-sm-9">
                                                    <input id="name" type="text" placeholder="" defaultValue={this.state.name}
                                                        onChange={(e) => this.setState({ name: e.target.value })} className="form-control" required />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="inputContact1" className="col-sm-3 control-label text-nowrap">Email<span className="text-danger">*</span></label>
                                                <div className="col-sm-9">
                                                    <input id="email" type="text" placeholder="" defaultValue={this.state.email}
                                                        onChange={(e) => this.setState({ email: e.target.value })} className="form-control" required />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="inputContact1" className="col-sm-3 control-label text-nowrap">Phone<span className="text-danger">*</span></label>
                                                <div className="col-sm-9">
                                                    <input
                                                        id="phone" type="text"
                                                        placeholder="" defaultValue={this.state.phone}
                                                        onChange={(e) => this.setState({ phone: e.target.value })}
                                                        className="form-control" required />

                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="inputContact3" className="col-sm-3 control-label text-nowrap">Role</label>
                                                <div className="col-sm-9">
                                                    <select className="chosen-select input-md form-control"
                                                        value={this.state.role}
                                                        onChange={(e) => this.setState({ role: e.target.value })} >
                                                        <option value={1}>manager</option>
                                                        <option value={2}>seller</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="inputContact4" className="col-sm-3 control-label text-nowrap">Team</label>
                                                <div className="col-sm-9">
                                                    <input id="team_name" type="text" value={this.state.team_name}
                                                        onChange={(e) => this.setState({ team_name: e.target.value })} className="form-control" />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="inputContact5" className="col-sm-3 control-label text-nowrap">Company</label>
                                                <div className="col-sm-9">
                                                    <input id="company_name" type="text" value={this.state.company_name}
                                                        onChange={(e) => this.setState({ company_name: e.target.value })} className="form-control" />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <div className="col-sm-offset-3 col-sm-9">
                                                    <button type="submit" className="btn btn-info">{this.isNew ? "Create" : "Update"}</button>
                                                </div>
                                            </div>
                                        </form>
                                        {!this.state.isWaiting && <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <div style={{ width: 100, height: 40 }}><Spinner /></div>
                                            <span>Uploading data on back end...</span>
                                        </div>}
                                        {this.index >= 0 && <div className="text-right"><div style={{ cursor: 'pointer' }} onClick={() => this.deleteItem()}>Delete this User?</div>
                                        </div>}
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Col>
                </Row>
                {this.renderModal()}
            </ContentWrapper>
        );
    }

}

export default UserEdit;
