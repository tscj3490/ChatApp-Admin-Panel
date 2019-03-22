import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, DropdownButton, MenuItem, Modal, Image } from 'react-bootstrap';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import Dropzone from 'react-dropzone';

import Avatar from 'react-avatar-edit'
import ReactStars from 'react-stars'
import Spinner from 'react-spinner'

import DonationApi from './api'
import ServiceApi from '../Service/api'
import config from '../../config'

class DonationEdit extends React.Component {
    constructor(props) {
        super(props)
        this.data = props.location.state ? props.location.state.data || {} : {}
        this.index = (props.location.state == undefined) ? -1 : props.location.state.index
        this.isNew = props.location.state ? props.location.state.isNew : true

        this.toggle = this.toggle.bind(this);
        this._handleUpdate = this._handleUpdate.bind(this);

        this.state = {
            id: this.data.id,
            projectId: this.data.projectId,
            projectName: this.data.projectName,
            currencyAmount: this.data.currencyAmount,
            currency: this.data.currencyId,
            totalAmount: this.data.totalAmount,
            summary: this.data.summary,
            thumbnail: this.data.thumbnail,
            images: this.data.images,
            type: this.data.type,
            detail: this.data.detail,
            deleted: this.data.deleted ? this.data.deleted : 0,
            createdBy: this.data.createdBy,
            updatedBy: this.data.updatedBy,

            files: [{ preview: this.data.thumbnail }],

            thumbnailPreview: this.data.thumbnail,
            imagesPreview: this.data.images,

            changed: false,
            edit: 0,

            preview: null,
            popoverOpen: false,
            myCheck: false,
            isWaiting: 0
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
        if (this.state.isWaiting > 0) return;
        e.preventDefault()
        e.stopPropagation()
        if (this.isNew) {
            this.setState({ isWaiting: this.state.isWaiting + 1 })
            DonationApi.postDonate({
                data: {
                    projectId: Number(this.state.projectId),
                    projectName: this.state.projectName,
                    currencyAmount: this.state.currencyAmount,
                    currencyId: Number(this.state.currency),
                    totalAmount: this.state.totalAmount,
                    summary: this.state.summary,
                    thumbnail: this.state.thumbnail,
                    images: this.state.images,
                    type: Number(this.state.type),
                    detail: this.state.detail
                }

            }, (err1, res1) => {
                this.setState({ isWaiting: this.state.isWaiting - 1 })
                if (err1 == null && res1.error == null) {
                    this.props.history.goBack()
                } else {
                    console.log("error!")
                    
                }
            })
        }
        else { // isNew == false
            this.setState({ isWaiting: this.state.isWaiting + 1 })
            DonationApi.updateDonate(this.state.id, {
                data: {
                    id: Number(this.state.id),
                    projectId: Number(this.state.projectId),
                    projectName: this.state.projectName,
                    currencyAmount: this.state.currencyAmount,
                    currencyId: Number(this.state.currency),
                    totalAmount: this.state.totalAmount,
                    summary: this.state.summary,
                    thumbnail: this.state.thumbnail,
                    images: this.state.images,
                    type: Number(this.state.type),
                    detail: this.state.detail
                }

            }, (err2, res2) => {
                this.setState({ isWaiting: this.state.isWaiting - 1 })
                if (err2 == null) {
                    this.props.history.goBack()
                } else {
                    if (res2.error.type == 3) { // name duplication error
                        swal("The project name already exists!", "Please set with other project name.", "success");
                    }
                }
            })
        }

    }



    deleteItem(id) {
        swal({
            title: "Are you sure?",
            text: "You will not be able to recover this donation!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
        },
            () => {
                DonationApi.deleteDonate(id, (err, res) => {
                    if (err == null) {
                        swal("Deleted!", "The donation has been deleted.", "success");
                        this.props.history.goBack()
                    }
                })
            });
    }

    closeModal() {
        this.setState({ edit: 0 })
    }

    showModal(number) {
        this.setState({ edit: number, changed: false, files: [{ preview: null }] })
    }

    onDrop(files) {
        this.setState({
            files: files,
            changed: true,
        });
    }

    onImageUpload(number) {
        this.setState({ isWaiting: this.state.isWaiting + 1 })
        ServiceApi.uploadFile(this.state.files[0], (res) => {
            if (res.error == null) {
                let imageNames = ['thumbnail', 'images']
                this.state[imageNames[number - 1]] = res.result.path
            }
            this.setState({ isWaiting: this.state.isWaiting - 1 })
        })

        let variableNames = ['thumbnailPreview', 'imagesPreview']
        let obj = {}
        obj[variableNames[number - 1]] = this.state.files[0].preview
        this.setState(obj)
    }

    renderModal() {
        return (
            <Modal show={this.state.edit > 0} onHide={this.closeModal.bind(this)}>
                <div style={{ margin: 50 }}>
                    <Dropzone className="well p-lg" ref="dropzone" onDrop={this.onDrop.bind(this)} multiple={false} style={{ height: 200 }} >
                        {this.state.files.length && <Image src={this.state.files[0].preview} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
                    </Dropzone>

                    <div className="text-center mt-lg pt-lg">
                        <Button className="btn btn-Default m-lg" style={{ width: 160 }} onClick={() => this.setState({ edit: 0 })}>Cancel</Button>
                        <Button className="btn btn-primary m-lg" style={{ width: 160 }} onClick={() => {
                            if (this.state.edit == 1) this.onImageUpload(1)
                            if (this.state.edit == 2) this.onImageUpload(2)

                            this.setState({ edit: 0 })
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
                                    <Image src={this.state.thumbnailPreview} alt="thumbnail" style={{ width: '100%', height: 150, objectFit: 'contain' }} />
                                </div>
                                <div className="text-center mt mb-lg"><a className="btn btn-primary" onClick={() => this.showModal(1)}>Change Thumbnail</a>
                                </div>
                            </div>
                        </div>
                        <div className="panel panel-default">
                            <div className="panel-body text-center">
                                <div className="pv-lg">
                                    <Image src={this.state.imagesPreview} alt="images" style={{ width: '100%', height: 150, objectFit: 'contain' }} />
                                </div>
                                <div className="text-center mt mb-lg"><a className="btn btn-primary" onClick={() => this.showModal(2)}>Change Image</a>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col md={8}>
                        <div className="panel panel-default">
                            <div className="panel-body">
                                <div className="h4 text-center">{this.index < 0 ? "Add New Donate" : "Edit Donate"}</div>
                                <Row className="pv-lg">
                                    <Col lg={2}></Col>
                                    <Col lg={8}>
                                        <form className="form-horizontal" onSubmit={this.submitProfile.bind(this)} >
                                            <div className="form-group">
                                                <label htmlFor="inputContact1" className="col-sm-3 control-label text-nowrap">Project Id</label>
                                                <div className="col-sm-9">
                                                    <input id="projectId" type="number" placeholder="" defaultValue={this.state.projectId}
                                                        onChange={(e) => this.setState({ projectId: e.target.value })} className="form-control" required />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="inputContact1" className="col-sm-3 control-label text-nowrap">Project Name</label>
                                                <div className="col-sm-9">
                                                    <input id="projectName" type="text" placeholder="" defaultValue={this.state.projectName}
                                                        onChange={(e) => this.setState({ projectName: e.target.value })} className="form-control" required />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="inputContact6" className="col-sm-3 control-label">Currency Amount</label>
                                                <div className="col-sm-9">
                                                    <input id="currencyAmount" type="text" placeholder="" defaultValue={this.state.currencyAmount}
                                                        onChange={(e) => this.setState({ currencyAmount: e.target.value })} className="form-control" required />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="inputContact6" className="col-sm-3 control-label">Currency</label>
                                                <div className="col-sm-9">
                                                    <input id="currency" type="number" placeholder="" defaultValue={this.state.currency}
                                                        onChange={(e) => this.setState({ currency: e.target.value })} className="form-control" required />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="inputContact6" className="col-sm-3 control-label">Total Amount</label>
                                                <div className="col-sm-9">
                                                    <input id="totalAmount" type="text" placeholder="" defaultValue={this.state.totalAmount}
                                                        onChange={(e) => this.setState({ totalAmount: e.target.value })} className="form-control" required />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="inputContact6" className="col-sm-3 control-label">Summary</label>
                                                <div className="col-sm-9">
                                                    <textarea id="summary" rows="4" className="form-control" value={this.state.summary}
                                                        onChange={(e) => this.setState({ summary: e.target.value })}></textarea>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="inputContact1" className="col-sm-3 control-label">Type</label>
                                                <div className="col-sm-9">
                                                    <select className="chosen-select input-md form-control"
                                                        value={this.state.type}
                                                        onChange={(e) => this.setState({ type: e.target.value })} >
                                                        <option value={1}>Environmental</option>
                                                        <option value={2}>Animal</option>
                                                        <option value={3}>Charity</option>
                                                        <option value={4}>Education</option>
                                                        <option value={5}>Medical</option>
                                                        <option value={6}>Emergency</option>
                                                        <option value={7}>Industry</option>
                                                        <option value={8}>Sea</option>
                                                        <option value={9}>Science</option>
                                                        <option value={10}>Innovation</option>
                                                        <option value={11}>Sport</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="inputContact6" className="col-sm-3 control-label">Detail</label>
                                                <div className="col-sm-9">
                                                    <textarea id="detail" rows="4" className="form-control" value={this.state.detail}
                                                        onChange={(e) => this.setState({ detail: e.target.value })}></textarea>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="col-sm-offset-3 col-sm-9">
                                                    <button type="submit" className="btn btn-info">{this.isNew ? " Create " : " Update "}</button>
                                                </div>
                                            </div>
                                            {this.state.isWaiting > 0 && <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                <div style={{ width: 100, height: 40 }}><Spinner /></div>
                                                <span>Uploading data on back end...</span>
                                            </div>}
                                        </form>
                                        {this.index >= 0 && <div className="text-right"><div style={{ cursor: 'pointer' }} onClick={() => this.deleteItem(this.state.id)}>Delete this Donation?</div>
                                        </div>}
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Col>
                </Row>
                {/* <Row>
                    <Col sm={6}>
                        <div className="big-button text-primary shadow-hover" onClick={() => this.viewService()}>View MyProject</div>
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

export default DonationEdit;

