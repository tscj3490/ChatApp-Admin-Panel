import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, DropdownButton, MenuItem, Modal, Image } from 'react-bootstrap';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import Dropzone from 'react-dropzone';

import Avatar from 'react-avatar-edit'
import ReactStars from 'react-stars'
import Spinner from 'react-spinner'

import Api from './api'
import ServiceApi from '../Service/api'
import config from '../../config'

class CurrenciesEdit extends React.Component {
    constructor(props) {
        super(props)

        this.data = props.location.state ? props.location.state.data || {} : {}
        this.index = (props.location.state == undefined) ? -1 : props.location.state.index
        this.isNew = props.location.state ? props.location.state.isNew : true

        this.toggle = this.toggle.bind(this);

        this.state = {
            id: this.data.id,
            name: this.data.name,
            rate: this.data.rate,
            symbol: this.data.symbol,
            image: this.data.image,
            flag: this.data.flag,
            description: this.data.description,

            files: [{ preview: this.data.image }],

            imagePreview: this.data.image,
            flagPreview:  this.data.flag,

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

    submitCurrency(e) {
        if (this.state.isWaiting > 0) return;
        e.preventDefault()
        e.stopPropagation()
        if (this.isNew) {
            this.setState({ isWaiting: this.state.isWaiting + 1 })
            Api.setCurrency({
                data: {
                    name: this.state.name,
                    rate: this.state.rate,
                    symbol: this.state.symbol,
                    image: this.state.image,
                    flag: this.state.flag,
                    description: this.state.description,
                }

            }, (err1, res1) => {
                this.setState({ isWaiting: this.state.isWaiting - 1 })
                if (err1 == null && res1.error == null) {
                    this.props.history.goBack()
                } else {
                    console.log("error -----")
                }
            })
        } else { // isNew == false
            this.setState({ isWaiting: this.state.isWaiting + 1 })
            Api.updateCurrency(this.state.id, {
                data: {
                    id: this.state.id,
                    name: this.state.name,
                    rate: this.state.rate,
                    symbol: this.state.symbol,
                    image: this.state.image,
                    flag: this.state.flag,
                    description: this.state.description,
                }

            }, (err2, res2) => {
                this.setState({ isWaiting: this.state.isWaiting - 1 })
                if (err2 == null && res2.error == null) {
                    console.log("currency name is updated successfully.")
                    this.props.history.goBack()
                } else {
                    console.log("currency name duplication error.")
                    if (res2.error.type == 3) { // name duplication error
                        console.log("currency name duplication error.")
                        swal("The currency name already exists!", "Please set with other currency name.", "success");
                    }
                }
            })

        }

    }



    deleteItem(id) {
        console.log("id .....", id)
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
                Api.deleteCurrency(id, (err, res) => {
                    if (err == null) {
                        swal("Deleted!", "The currency has been deleted.", "success");
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
        setTimeout(() => console.log("deply", this.state.changed), 100)
    }

    onImageUpload(number) {
        this.setState({ isWaiting: this.state.isWaiting + 1 })
        ServiceApi.uploadFile(this.state.files[0], (res) => {
            if (res.error == null) {
                let imageNames = ['image', 'flag']

                this.state[imageNames[number - 1]] = res.path

            }
            this.setState({ isWaiting: this.state.isWaiting - 1 })
        })

        let variableNames = ['imagePreview', 'flagPreview']
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


    render() {
        var ddTitle = (<em className="fa fa-ellipsis-v fa-lg text-muted"></em>);
        return (
            <ContentWrapper>
                <Row>
                    <Col md={4}>
                        <div className="panel panel-default">
                            <div className="panel-body text-center">
                                <div className="pv-lg">
                                    <Image src={this.state.imagePreview} alt="image" style={{ width: '100%', height: 150, objectFit: 'contain' }} />
                                </div>
                                <div className="text-center mt mb-lg"><a className="btn btn-primary" onClick={() => this.showModal(1)}>Change Image</a>
                                </div>
                            </div>
                        </div>
                        <div className="panel panel-default">
                            <div className="panel-body text-center">
                                <div className="pv-lg">
                                    <Image src={this.state.flagPreview} alt="flag" style={{ width: '100%', height: 150, objectFit: 'contain' }} />
                                </div>
                                <div className="text-center mt mb-lg"><a className="btn btn-primary" onClick={() => this.showModal(2)}>Change Flag</a>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col md={8}>
                        <div className="panel panel-default">
                            <div className="panel-body">
                                <div className="h4 text-center">{this.index < 0 ? "Add New Project" : "Edit Project for Donation"}</div>
                                <Row className="pv-lg">
                                    <Col lg={2}></Col>
                                    <Col lg={8}>
                                        <form className="form-horizontal" onSubmit={this.submitCurrency.bind(this)} >
                                            <div className="form-group">
                                                <label htmlFor="inputContact1" className="col-sm-3 control-label text-nowrap">Currency Name</label>
                                                <div className="col-sm-9">
                                                    <input id="name" type="text" placeholder="" defaultValue={this.state.name}
                                                        onChange={(e) => this.setState({ name: e.target.value })} className="form-control" required />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="inputContact1" className="col-sm-3 control-label text-nowrap">Rate</label>
                                                <div className="col-sm-9">
                                                    <input id="rate" type="number" step="0.001" placeholder="" value={this.state.rate}
                                                        onChange={(e) => this.setState({ rate: e.target.value })} className="form-control" required />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="inputContact1" className="col-sm-3 control-label text-nowrap">Symbol</label>
                                                <div className="col-sm-9">
                                                    <input id="symbol" type="text" placeholder="" defaultValue={this.state.symbol}
                                                        onChange={(e) => this.setState({ symbol: e.target.value })} className="form-control" required />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="inputContact1" className="col-sm-3 control-label text-nowrap">Description</label>
                                                <div className="col-sm-9">
                                                    <input id="description" type="text" placeholder="" defaultValue={this.state.description}
                                                        onChange={(e) => this.setState({ description: e.target.value })} className="form-control" required />
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
                                        {this.index >= 0 && <div className="text-right"><div style={{ cursor: 'pointer' }} onClick={() => this.deleteItem(this.state.id)}>Delete this Currency?</div>
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

export default CurrenciesEdit;

