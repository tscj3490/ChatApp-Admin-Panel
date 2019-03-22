import React, { Component } from 'react';
import LinkItems from './LinkItems';

class DropdownMenu extends Component {
    render() {
        return (
            <li className="row dropdown">
                <a href="#" className="hidden-xs btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" style={{lineHeight:'28px'}}>{this.props.buttonName}</a>
                <a href="#" className="visible-xs-block dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{this.props.buttonName}</a>
                <LinkItems classItems="dropdown-menu" links={this.props.links} />
            </li>
        );
    }
}

export default DropdownMenu;
