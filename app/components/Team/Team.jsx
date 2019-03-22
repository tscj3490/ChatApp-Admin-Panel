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

import TeamApi from './api'
import config from '../../config'

class Team extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            viewDetail: false,
            teams: [],
           
            searchString: '',

            selectedIndex: 0,
        }
    }

    componentDidMount() {
        TeamApi.getTeamList((err, res) => {
            console.log('======', err, res)
            if (err == null && res.error == null) {
                this.setState({ teams: res.items })
            }
        })

    }

    closeModal() {
        this.setState({ viewDetail: false })
    }

    showModal(index, isNew) {
        // this.setState({ viewDetail: true, selectedIndex: index })
        this.props.history.push("team-edit", { data: this.state.teams[index], index: index, isNew: isNew })
    }

    addTeam(isNew) {
        this.props.history.push("team-edit", { data: {}, index: -1, isNew: isNew })
    }

    onSubmit(e) {
        e.preventDefault()
        e.stopPropagation()
        this.setState({ viewDetail: false })
    }


    search() {
        if (this.state.searchString == '') {
            TeamApi.getTeamList((err, res) => {
                console.log(err, res)
                if (err == null) {
                    this.setState({ teams: res.items })
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

        TeamApi.searchTeam({
            name: name,
            type: type,
            position: position,
            featured: featured,
            tags: tags,
        }, (err, res) => {
            console.log(err, res)
            if (err == null && res.error == null) {
                this.setState({ teams: res.items })
            }
        })
    }


    deleteItem(index) {
        swal({
            title: "Are you sure?",
            text: "You will not be able to recover this team!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
        },
            () => {
                TeamApi.deleteTeam(this.state.teams[index].id, (err, res) => {
                    if (err == null) {
                        this.state.teams.splice(index, 1)
                        this.setState({ teams: [...this.state.teams] })
                        swal("Deleted!", "The team has been deleted.", "success");
                    }
                })
            });
    }

    render() {
        return (
            <ContentWrapper>
                <h3>Team
                   {/* <small>Search and filter results</small> */}
                </h3>
                {/* <div className="panel-footer">
                    <Row>
                        <Col lg={2}>
                            <div className="input-group">
                                <input type="text" placeholder="Search teams for donation." className="input-sm form-control"
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
                                    <option value={'name'}>name</option>
                                    <option value={'type'}>type</option>
                                    <option value={'position'}>position</option>
                                    <option value={'featured'}>featured</option>
                                    <option value={'tags'}>tags</option>
                                </select>
                            </div>
                        </Col>
                    </Row>
                </div> */}
                { /* START panel */}
                <div className="panel panel-default">
                    {/* <div className="panel-heading">
                                <a href="#" data-tool="panel-refresh" data-toggle="tooltip" title="Refresh Panel" className="pull-right">
                                    <em className="fa fa-refresh"></em>
                                </a>Search Results
                            </div> */}
                    <div className="panel-heading">
                        <div role="button" className="pull-right text-muted" onClick={() => this.addTeam(true)}>
                            <em className="fa fa-plus text-muted mr"></em>Add</div>
                        Team List
                            </div>
                    { /* START table-responsive */}

                    <Table responsive bordered className="text-center">
                        <thead>
                            <tr>
                                <th className="text-center">Id</th>
                                <th className="text-center">Name</th>
                                <th className="text-center">Logo</th>
                                <th className="text-center">Company</th>
                                <th className="text-center">UpdatedAt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.teams.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>
                                            <div className="media">
                                                <img src={config.BACKEND_FILE_URL + item.logo} alt="Image" className="img-responsive" />
                                            </div>
                                        </td>
                                        <td style={{ maxWidth: 150 }} className="text-overflow">{item.company_name}</td>
                                        <td>{item.updated_at}</td>
                                        <td className="text-nowrap">
                                            <Button className="btn btn-info fa fa-edit btn-sm" onClick={() => this.showModal(index, false)} />
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

export default Team;
