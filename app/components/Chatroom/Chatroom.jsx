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

import ChatroomApi from './api'
import config from '../../config'

class Chatroom extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            viewDetail: false,
            chatrooms: [],

            searchString: '',

            selectedIndex: 0,
        }
    }

    componentDidMount() {
        ChatroomApi.getChatroomList((err, res) => {
            console.log('======', err, res)
            if (err == null && res.error == null) {
                this.setState({ chatrooms: res.items })
            }
        })

    }

    closeModal() {
        this.setState({ viewDetail: false })
    }

    showModal(index, isNew) {
        // this.setState({ viewDetail: true, selectedIndex: index })
        this.props.history.push("chatroom-edit", { data: this.state.chatrooms[index], index: index, isNew: isNew })
    }

    addChatroom(isNew) {
        this.props.history.push("chatroom-edit", { data: {}, index: -1, isNew: isNew })
    }

    onSubmit(e) {
        e.preventDefault()
        e.stopPropagation()
        this.setState({ viewDetail: false })
    }


    search() {
        if (this.state.searchString == '') {
            ChatroomApi.getChatroomList((err, res) => {
                console.log(err, res)
                if (err == null) {
                    this.setState({ chatrooms: res.items })
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

        ChatroomApi.searchChatroom({
            name: name,
            type: type,
            position: position,
            featured: featured,
            tags: tags,
        }, (err, res) => {
            console.log(err, res)
            if (err == null && res.error == null) {
                this.setState({ chatrooms: res.items })
            }
        })
    }


    deleteItem(index) {
        swal({
            title: "Are you sure?",
            text: "You will not be able to recover this chatroom!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
        },
            () => {
                ChatroomApi.deleteChatroom(this.state.chatrooms[index].id, (err, res) => {
                    if (err == null) {
                        this.state.chatrooms.splice(index, 1)
                        this.setState({ chatrooms: [...this.state.chatrooms] })
                        swal("Deleted!", "The chatroom has been deleted.", "success");
                    }
                })
            });
    }

    render() {
        return (
            <ContentWrapper>
                <h3>Chatroom
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
                        {/* <div role="button" className="pull-right text-muted" onClick={() => this.addChatroom(true)}>
                            <em className="fa fa-plus text-muted mr"></em>Add</div> */}
                        Chatroom List
                            </div>
                    { /* START table-responsive */}

                    <Table responsive bordered className="text-center">
                        <thead>
                            <tr>
                                {/* <th className="text-center">Id</th> */}
                                <th className="text-center">Name</th>
                                <th className="text-center">User IDs</th>
                                <th className="text-center">Deleted</th>
                                <th className="text-center">UpdatedAt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.chatrooms.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        {/* <td>{item.id}</td> */}
                                        <td>{item.name}</td>
                                        <td className="text-center">{item.userIds}</td>
                                        <td className="text-center">
                                            {item.deleted == true && <span className="label label-success">Deleted</span>}
                                            {item.deleted == false && <span className="label label-default">Undeleted</span>}
                                        </td>
                                        <td className="text-center">{item.updatedAt}</td>
                                        <td className="text-center">
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

export default Chatroom;
