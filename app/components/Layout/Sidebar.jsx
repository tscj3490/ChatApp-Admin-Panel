import React from 'react';
import { Router, Route, Link, History, withRouter } from 'react-router-dom';
import pubsub from 'pubsub-js';
import { Collapse } from 'react-bootstrap';
import SidebarRun from './Sidebar.run';

class Sidebar extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            userBlockCollapse: false,
            collapse: {
                user: this.routeActive('user'),
                team: this.routeActive('team'),
                chatroom: this.routeActive('chatroom'),
                reminder: this.routeActive('reminder'),
                setting: this.routeActive('setting'),

                elements: this.routeActive(['buttons', 'notifications', 'sweetalert', 'tour', 'carousel', 'spinners', 'animations', 'dropdown', 'nestable', 'sortable', 'panels', 'portlet', 'grid', 'grid-masonry', 'typography', 'icons-font', 'icons-weather', 'colors']),
                forms: this.routeActive(['form-standard', 'form-extended', 'form-validation', 'form-wizard', 'form-upload', 'form-xeditable', 'form-cropper']),
                charts: this.routeActive(['chart-flot', 'chart-radial', 'chart-chartjs', 'chart-rickshaw', 'chart-morris', 'chart-chartist']),
                tables: this.routeActive(['table-standard', 'table-extended', 'table-datatable', 'table-jqgrid']),
                maps: this.routeActive(['map-google', 'map-vector']),
                extras: this.routeActive(['mailbox', 'timeline', 'calendar', 'invoice', 'search', 'todo', 'profile', 'bug-tracker', 'contact-details', 'contacts', 'faq', 'file-manager', 'followers', 'help-center', 'plans', 'project-details', 'projects', 'settings', 'social-board', 'team-viewer', 'vote-links']),
                blog: this.routeActive(['blog-list', 'blog-post', 'blog-articles', 'blog-article-view']),
                forum: this.routeActive(['forum-categories', 'forum-topics', 'forum-discussion']),
                pages: false
            }
        };
        this.pubsub_token = pubsub.subscribe('toggleUserblock', () => {
            this.setState({
                userBlockCollapse: !this.state.userBlockCollapse
            });
        });
    };

    componentDidMount() {
        // pass navigator to access router api
        SidebarRun(this.navigator.bind(this));
    }

    navigator(route) {
        this.props.history.push(route);
    }

    componentWillUnmount() {
        // React removed me from the DOM, I have to unsubscribe from the pubsub using my token
        pubsub.unsubscribe(this.pubsub_token);
    }

    routeActive(paths) {
        paths = Array.isArray(paths) ? paths : [paths];
        if (paths.indexOf(this.props.location.pathname.replace('/', '')) > -1)
            return true;
        return false;
    }

    toggleItemCollapse(stateName) {
        var newCollapseState = {};
        for (let c in this.state.collapse) {
            if (this.state.collapse[c] === true && c !== stateName)
                this.state.collapse[c] = false;
        }
        this.setState({
            collapse: {
                [stateName]: !this.state.collapse[stateName]
            }
        });
    }

    render() {
        return (
            <aside className='aside'>
                { /* START Sidebar (left) */}
                <div className="aside-inner">
                    <nav data-sidebar-anyclick-close="" className="sidebar">
                        { /* START sidebar nav */}
                        <ul className="nav">
                            { /* START user info */}
                            <li className="has-user-block">
                                <Collapse id="user-block" in={this.state.userBlockCollapse}>
                                    <div>
                                        <div className="item user-block">
                                            { /* User picture */}
                                            <div className="user-block-picture">
                                                <div className="user-block-status">
                                                    <img src="img/user/02.jpg" alt="Avatar" width="60" height="60" className="img-thumbnail img-circle" />
                                                    <div className="circle circle-success circle-lg"></div>
                                                </div>
                                            </div>
                                            { /* Name and Job */}
                                            <div className="user-block-info">
                                                <span className="user-block-name">Hello, Mike</span>
                                                <span className="user-block-role">Designer</span>
                                            </div>
                                        </div>
                                    </div>
                                </Collapse>
                            </li>
                            { /* END user info */}
                            { /* Iterates over all sidebar items */}
                            <li className="nav-heading ">
                                <span data-localize="sidebar.heading.HEADER">Main Navigation</span>
                            </li>

                            <li className={this.routeActive('users') ? 'active' : ''}>
                                <Link to="users" title="users">
                                    {/* <div className="pull-right label label-success">30</div> */}
                                    <em className="fa fa-user"></em>
                                    <span data-localize="sidebar.nav.USER">User</span>
                                </Link>
                            </li>

                            <li className={this.routeActive('teams') ? 'active' : ''}>
                                <Link to="teams" title="teams">
                                    {/* <div className="pull-right label label-success">30</div> */}
                                    <em className="fa fa-group"></em>
                                    <span data-localize="sidebar.nav.TEAM">Team</span>
                                </Link>
                            </li>   

                            <li className={this.routeActive('chatrooms') ? 'active' : ''}>
                                <Link to="chatrooms" title="chatrooms">
                                    {/* <div className="pull-right label label-success">30</div> */}
                                    <em className="fa fa-user-md"></em>
                                    <span data-localize="sidebar.nav.CHATROOM">Chat Room</span>
                                </Link>
                            </li> 

                            <li className={this.routeActive('reminders') ? 'active' : ''}>
                                <Link to="reminders" title="reminders">
                                    {/* <div className="pull-right label label-success">30</div> */}
                                    <em className="fa fa-clock-o"></em>
                                    <span data-localize="sidebar.nav.REMINDER">Reminder</span>
                                </Link>
                            </li>                       

                            <li className={this.routeActive('settings') ? 'active' : ''}>
                                <Link to="settings" title="settings">
                                    <em className="icon-settings"></em>
                                    <span data-localize="sidebar.nav.SETTING">Settings</span>
                                </Link>
                            </li>
                        </ul>
                        { /* END sidebar nav */}
                    </nav>
                </div>
                { /* END Sidebar (left) */}
            </aside>
        );
    }

}

export default withRouter(Sidebar);

