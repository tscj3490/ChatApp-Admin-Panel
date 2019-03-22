import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, Table, Pagination, Modal, DropdownButton, MenuItem } from 'react-bootstrap';

import Api from './api'
import DonationApi from '../Donation/api'

class CustomerOrder extends React.Component {

    constructor(props) {
        super(props)
        console.log(props.location.state)
        this.state = {
            viewDetail: false,
            id: props.location.state.id,
            customerName: props.location.state.customerName,
            orders: [],
            selectedIndex: 0,
        }
    }

    componentDidMount() {
        Api.getOrderByCustomer(this.state.id, (err, res) => {
            if (err == null) {
                this.setState({ orders: res.items })
            }
        })
    }

    closeModal() {
        this.setState({ viewDetail: false })
    }

    showModal(index) {
        this.setState({ viewDetail: true, selectedIndex:index })
    }

    onSubmit(e) {
        e.preventDefault()
        e.stopPropagation()
        this.setState({ viewDetail: false })
    }

    deleteItem(index) {
        swal({
            title: "Are you sure?",
            text: "You will not be able to recover this order!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
        },
            () => {
                DonationApi.deleteOrder(this.state.orders[index].ID, (err, res) => {
                    if (err == null) {
                        this.state.orders.splice(index, 1)
                        this.setState({ orders: [...this.state.orders] })
                        swal("Deleted!", "The order has been deleted.", "success");
                    }
                })
            });
    }

    renderModal() {
        if (!this.state.viewDetail) return
        let { VenderName, CustomerName, DeviceName, MakeName, ModelName, ServiceName, description, price, status, book_date } = this.state.orders[this.state.selectedIndex]
        var ddTitle = (<em className="fa fa-ellipsis-v fa-lg text-muted"></em>);
        return (
            <Modal show={this.state.viewDetail} onHide={this.closeModal.bind(this)}>
                <div className="mt-lg p-lg">
                    <div className="h4 text-center">Order Information</div>
                    <Row className="pv-lg">
                        <Col lg={2}></Col>
                        <Col lg={8}>
                            <form className="form-horizontal" onSubmit={this.onSubmit.bind(this)}>
                                <div className="form-group">
                                    <label htmlFor="inputContact1" className="col-sm-3 control-label">User</label>
                                    <div className="col-sm-9">
                                        <input id="inputContact1" type="text" placeholder="" value={VenderName} className="form-control" disabled={true} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="inputContact2" className="col-sm-3 control-label">Customer</label>
                                    <div className="col-sm-9">
                                        <input id="inputContact2" type="email" value={CustomerName} className="form-control" disabled={true} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="inputContact3" className="col-sm-3 control-label">Device</label>
                                    <div className="col-sm-9">
                                        <input id="inputContact3" type="text" value={DeviceName} className="form-control" disabled={true} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="inputContact4" className="col-sm-3 control-label">Make</label>
                                    <div className="col-sm-9">
                                        <input id="inputContact4" type="text" value={MakeName} className="form-control" disabled={true} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="inputContact5" className="col-sm-3 control-label">Model</label>
                                    <div className="col-sm-9">
                                        <input id="inputContact5" type="text" value={ModelName} className="form-control" disabled={true} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="inputContact5" className="col-sm-3 control-label">Service</label>
                                    <div className="col-sm-9">
                                        <input id="inputContact5" type="text" value={ServiceName} className="form-control" disabled={true} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="inputContact6" className="col-sm-3 control-label">Description</label>
                                    <div className="col-sm-9">
                                        <textarea id="inputContact6" rows="4" className="form-control" value={description} disabled={true}></textarea>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="inputContact7" className="col-sm-3 control-label">Price</label>
                                    <div className="col-sm-9">
                                        <input id="inputContact7" type="text" value={price} className="form-control" disabled={true} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="inputContact8" className="col-sm-3 control-label">Status</label>
                                    <div className="col-sm-9">
                                        <select className="chosen-select input-md form-control" value={status} disabled={true} >
                                            <option value={1}>Fixed</option>
                                            <option value={2}>Cancel</option>
                                            <option value={3}>Awaiting</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-sm-offset-3 col-sm-9">
                                        <button type="submit" className="btn btn-danger" onClick={() => this.deleteItem(this.state.selectedIndex)}>Delete</button>
                                        <button type="button" className="btn btn-default ml-lg" onClick={() => this.closeModal()}>Cancel</button>
                                    </div>
                                </div>
                            </form>
                            {/* <div className="text-right"><a className="text-muted">Delete this order?</a></div> */}
                        </Col>
                    </Row>
                </div>
            </Modal>
        )
    }

    render() {
        return (
            <ContentWrapper>
                <h3>{this.state.customerName}'s Order
                </h3>
                <Row>
                    <Col lg={12}>
                        { /* START panel */}
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <a href="#" data-tool="panel-refresh" data-toggle="tooltip" title="Refresh Panel" className="pull-right">
                                    <em className="fa fa-refresh"></em>
                                </a>Search Results</div>
                            { /* START table-responsive */}

                            <Table responsive bordered>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Device</th>
                                        <th>Sevice</th>
                                        <th>User</th>
                                        <th>Price</th>
                                        <th>Status</th>
                                        <th>Booking</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.orders.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.DeviceName}</td>
                                                <td style={{ maxWidth: 200 }}>{item.ServiceName}</td>
                                                <td>{item.VendorName}</td>
                                                <td>{item.price}</td>
                                                <td>
                                                    {item.status == 1 && <span className="label label-success">fixed</span>}
                                                    {item.status == 2 && <span className="label label-danger">cancel</span>}
                                                    {item.status == 3 && <span className="label label-primary">awaiting</span>}
                                                </td>
                                                <td>{item.book_date}</td>
                                                <td className="text-nowrap">
                                                    <Button className="btn btn-info fa fa-search btn-sm" onClick={() => this.showModal(index)} />
                                                    <Button className="btn btn-danger fa fa-trash btn-sm" onClick={() => this.deleteItem(index)} />
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    
                                </tbody>
                            </Table>
                            { /* END table-responsive */}
                            <div className="panel-footer">
                                <Row>
                                    <Col lg={2}>
                                        <button className="btn btn-sm btn-default">Clear</button>
                                    </Col>
                                    <Col lg={7}></Col>
                                    <Col lg={3} className="text-right">
                                        <Pagination bsSize="small" prev next items={3} maxButtons={5} />
                                    </Col>
                                </Row>
                            </div>
                        </div>
                        { /* END panel */}
                    </Col>

                </Row>
                {this.renderModal()}
            </ContentWrapper>
        );
    }

}

export default CustomerOrder;
