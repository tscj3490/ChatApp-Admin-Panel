import React, { Component } from 'react';
import { IndexLink } from 'react-router';

class LinkItems extends Component {
    render() {
        return(
            <ul className={this.props.classItems}>
                {this.props.links.map((link) => {
                    return <li key={link.path}>
                        <IndexLink activeStyle={{ color: '#95c127' }} to={link.path}>{link.text}</IndexLink>
                    </li>
                })}
            </ul>
        );
    }
}

export default LinkItems;
