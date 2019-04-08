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

import ReminderApi from './api'
import config from '../../config'

class Reminder extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            viewDetail: false,
            reminders: [],
           
            searchString: '',

            selectedIndex: 0,
        }
    }

    componentDidMount() {
        ReminderApi.getReminderList((err, res) => {
            console.log('======', err, res)
            if (err == null && res.error == null) {
                this.setState({ reminders: res.items })
            }
        })

    }

    closeModal() {
        this.setState({ viewDetail: false })
    }

    showModal(index, isNew) {
        // this.setState({ viewDetail: true, selectedIndex: index })
        this.props.history.push("reminder-edit", { data: this.state.reminders[index], index: index, isNew: isNew })
    }

    addReminder(isNew) {
        this.props.history.push("reminder-edit", { data: {}, index: -1, isNew: isNew })
    }

    onSubmit(e) {
        e.preventDefault()
        e.stopPropagation()
        this.setState({ viewDetail: false })
    }


    search() {
        if (this.state.searchString == '') {
            ReminderApi.getReminderList((err, res) => {
                console.log(err, res)
                if (err == null) {
                    this.setState({ reminders: res.items })
                }
            })
            return;
        }
        var name = '',
            type = '',
            position = '',
            featured = '',
            tags = '';

        switch (this.state.filterType) {
            case "name":
                name = this.state.searchString;
                break;
            case "type":
                type = this.state.searchString;
                break;
            case "position":
                position = this.state.searchString;
                break;
            case "featured":
                featured = this.state.searchString;
                break;
            case "tags":
                tags = this.state.searchString;
                break;
            default:
                break;
        }

        ReminderApi.searchReminder({
            name: name,
            type: type,
            position: position,
            featured: featured,
            tags: tags,
        }, (err, res) => {
            console.log(err, res)
            if (err == null && res.error == null) {
                this.setState({ reminders: res.items })
            }
        })
    }


    deleteItem(index) {
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
                ReminderApi.deleteReminder(this.state.reminders[index].id, (err, res) => {
                    if (err == null) {
                        this.state.reminders.splice(index, 1)
                        this.setState({ reminders: [...this.state.reminders] })
                        swal("Deleted!", "The reminder has been deleted.", "success");
                    }
                })
            });
    }

    render() {
        return (
            <ContentWrapper>
                <h3>Reminder
                   {/* <small>Search and filter results</small> */}
                </h3>
                { /* START panel */}
                <div className="panel panel-default">
                    {/* <div className="panel-heading">
                                <a href="#" data-tool="panel-refresh" data-toggle="tooltip" title="Refresh Panel" className="pull-right">
                                    <em className="fa fa-refresh"></em>
                                </a>Search Results
                            </div> */}
                    <div className="panel-heading">
                        {/* <div role="button" className="pull-right text-muted" onClick={() => this.addReminder(true)}>
                            <em className="fa fa-plus text-muted mr"></em>Add</div> */}
                        Reminder List
                            </div>
                    { /* START table-responsive */}

                    <Table responsive bordered className="text-center">
                        <thead>
                            <tr>
                                {/* <th className="text-center">Id</th> */}
                                <th className="text-center">CreatorID</th>
                                <th className="text-center">Title</th>
                                <th className="text-center">Description</th>
                                <th className="text-center">Meeting Time</th>
                                <th className="text-center">Location</th>
                                <th className="text-center">GroupID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.reminders.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        {/* <td>{item.id}</td> */}
                                        <td className="text-center">{item.creatorId}</td>
                                        <td className="text-overflow">{item.title}</td>
                                        <td className="text-overflow">{item.description}</td>
                                        <td className="text-center">{item.meeting_time}</td>
                                        <td className="text-center">{item.location}</td>
                                        <td className="text-center">{item.groupId}</td>
                                        <td className="text-nowrap">
                                            {/* <Button className="btn btn-info fa fa-edit btn-sm" onClick={() => this.showModal(index, false)} /> */}
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

export default Reminder;
