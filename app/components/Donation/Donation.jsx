import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, Table, Pagination, Modal, DropdownButton, MenuItem } from 'react-bootstrap';
import {
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    FormFeedback,
    FormText,
    Label,
    InputGroup,
    InputGroupAddon,
    InputGroupButtonDropdown,
    InputGroupText,
    Input,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';

import DonationApi from './api'
import config from '../../config'

class Donation extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            viewDetail: false,
            donations: [],
            devices: [], 

            searchString: '',

            selectedIndex: 0,
        }
    }

    componentDidMount() {
        DonationApi.getDonateList((err, res) => {
            console.log(err, res)
            if (err == null && res.error == null) {
                this.setState({ donations: res.result })
            }
        })

    }

    closeModal() {
        this.setState({ viewDetail: false })
    }

    showModal(index, isNew) {
        this.props.history.push("donation-edit", { data: this.state.donations[index], index: index, isNew: isNew })
    }

    addProject(isNew) {
        this.props.history.push("donation-edit", { data: {}, index: -1, isNew: isNew })
    }

    onSubmit(e) {
        e.preventDefault()
        e.stopPropagation()
        this.setState({ viewDetail: false })
    }


    search() {
        if (this.state.searchString == '') {
            DonationApi.getDonateList((err, res) => {
                console.log(err, res)
                if (err == null) {
                    this.setState({ donations: res.result })
                }
            })
            return;
        }
        var project = '',
            type = '',
            currency = '';

        switch (this.state.filterType) {
            case "project":
                project = this.state.searchString;
                break;
            case "type":
                type = this.state.searchString;
                break;
            case "currency":
                currency = this.state.searchString;
                break;
            default:
                break;
        }

        DonationApi.searchDonate({
            projectId: project,
            type: type,
            currencyId: currency,
        }, (err, res) => {
            console.log(err, res)
            if (err == null && res.error == null) {
                this.setState({ donations: res.result })
            }
        })
    }


    deleteItem(index) {
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
                DonationApi.deleteDonate(this.state.donations[index].id, (err, res) => {
                    if (err == null) {
                        this.state.donations.splice(index, 1)
                        this.setState({ donations: [...this.state.donations] })
                        swal("Deleted!", "The donation has been deleted.", "success");
                    }
                })
            });
    }

    render() {
        return (
            <ContentWrapper>
                <h3>Donation
                   <small>Search and filter results</small>
                </h3>
                <div className="panel-footer">
                    <Row>
                        <Col lg={2}>
                            <div className="input-group">
                                <input type="text" placeholder="Search projects for donation." className="input-sm form-control"
                                    value={this.state.searchString} onChange={(e) => this.setState({ searchString: e.target.value })} />
                                <span className="input-group-btn" >
                                    <button type="button" style={{ marginLeft: 5 }} className="btn btn-sm btn-default" onClick={() => this.search()}>Search</button>
                                </span>
                            </div>
                        </Col>
                        <Col lg={8}></Col>
                        <Col lg={2}>
                            <div className="input-group pull-right form-row" style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                <label className="control-label mb" style={{ display: "flex", flex: 1 }}>Filter: </label>
                                <select className="chosen-select input-md form-control"
                                    value={this.state.filterType}
                                    onChange={(e) => this.setState({ filterType: e.target.value })} >
                                    <option value={'project'}>project</option>
                                    <option value={'type'}>type</option>
                                    <option value={'currency'}>currency</option>
                                </select>
                            </div>
                        </Col>
                    </Row>
                </div>
                { /* START panel */}    
                <div className="panel panel-default">
                    {/* <div className="panel-heading">
                                <a href="#" data-tool="panel-refresh" data-toggle="tooltip" title="Refresh Panel" className="pull-right">
                                    <em className="fa fa-refresh"></em>
                                </a>Search Results
                            </div> */}
                    <div className="panel-heading">
                        {/* <div role="button" className="pull-right text-muted" onClick={() => this.addProject(true)}>
                            <em className="fa fa-plus text-muted mr"></em>Add</div> */}
                        Donation List
                            </div>
                    { /* START table-responsive */}

                    <Table responsive bordered className="text-center">
                        <thead>
                            <tr>
                                <th className="text-center">ProjectId</th>
                                <th className="text-center">User</th>
                                <th className="text-center">Email</th>
                                <th className="text-center">Amount</th>
                                <th className="text-center">CurrencyAmount</th>
                                <th className="text-center">Currency</th>
                                <th className="text-center">TotalAmount</th>
                                <th className="text-center">CurrentAmount</th>
                                <th className="text-center">ProjectName</th>
                                <th className="text-center">Summary</th>
                                <th className="text-center">Thumbnail</th>
                                <th className="text-center">Detail</th>
                                <th className="text-center">Image</th>
                                <th className="text-center">Type</th>
                                <th className="text-center">Deleted</th>
                                <th className="text-center">CreatedBy</th>
                                <th className="text-center">UpdatedBy</th>
                                <th className="text-center">CreatedAt</th>
                                <th className="text-center">UpdatedAt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.donations.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.projectId}</td>
                                        <td>{item.userId}</td>
                                        <td>{item.email}</td>
                                        <td>{item.amount}</td>
                                        <td>{item.currencyAmount}</td>
                                        <td>{item.currencyId}</td>
                                        <td>{item.totalAmount}</td>
                                        <td>{item.currentAmount}</td>
                                        <td style={{ maxWidth: 150 }} className="text-overflow">{item.projectName}</td>
                                        <td style={{ maxWidth: 150 }} className="text-overflow">{item.summary}</td>
                                       <td>
                                            <div className="media">
                                                <img src={item.thumbnail} alt="Image" className="img-responsive" />
                                            </div>
                                        </td>
                                        <td style={{ maxWidth: 200 }} className="text-overflow">{item.detail}</td>
                                        <td>
                                            <div className="media">
                                                <img src={item.images} alt="Image" className="img-responsive" />
                                            </div>
                                        </td>
                                        <td>
                                            {item.type == 1 && <span className="label label-success">Environmental</span>}
                                            {item.type == 2 && <span className="label label-success">Animal</span>}
                                            {item.type == 3 && <span className="label label-success">Charity</span>}
                                            {item.type == 4 && <span className="label label-success">Education</span>}
                                            {item.type == 5 && <span className="label label-success">Medical</span>}
                                            {item.type == 6 && <span className="label label-success">Emergency</span>}
                                            {item.type == 7 && <span className="label label-success">Industry</span>}
                                            {item.type == 8 && <span className="label label-success">Sea</span>}
                                            {item.type == 9 && <span className="label label-success">Science</span>}
                                            {item.type == 10 && <span className="label label-success">Innovation</span>}
                                            {item.type == 11 && <span className="label label-success">Sport</span>}
                                        </td>
                                        <td>{item.deleted}</td>
                                        <td>{item.createdBy}</td>
                                        <td>{item.updatedBy}</td>
                                        <td>{item.createdAt}</td>
                                        <td>{item.updatedAt}</td>                                        
                                        {/* <td className="text-nowrap">
                                            <Button className="btn btn-info fa fa-edit btn-sm" onClick={() => this.showModal(index, false)} />
                                            <Button className="btn btn-danger fa fa-trash btn-sm" onClick={() => this.deleteItem(index)} />
                                        </td> */}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                    { /* END table-responsive */}
                    <div className="panel-footer">
                        <Row>
                            <Col lg={2}>
                                {/* <button className="btn btn-sm btn-default">Clear</button> */}
                            </Col>
                            <Col lg={7}></Col>
                            <Col lg={3} className="text-right">
                                <Pagination bsSize="small" prev next items={3} maxButtons={5} />
                            </Col>
                        </Row>
                    </div>
                </div>
                { /* END panel */}
            </ContentWrapper>
        );
    }

}

export default Donation;
