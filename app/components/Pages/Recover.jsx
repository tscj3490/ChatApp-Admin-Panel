import React from 'react';
import { Grid, Row, Col, Panel, Button } from 'react-bootstrap';
import AuthService from '../../authService'
import Cache from '../../utils/Cache'

class Recover extends React.Component {

    constructor(props) {

        super(props)

        this.state = {
            password: '',
            email: '',
            mismatch: false,
            error: '',
            loading: false,
        }
    } 

    onSubmit(e) {
        e.preventDefault()
        e.stopPropagation()

        this.setState({ loading: true, error: '' })
        AuthService.forgotPassword(this.state.email, (err, res) => {
            this.setState({ loading: false })
            if (err == null) {
                Cache.login = true
                this.props.history.push("login")
            } else {
                this.setState({ error: 'Email is wrong!' })
                this.setState({ mismatch: true })
            }
        })
    }

    render() {
        return (
            <div className="block-center mt-xl wd-xl">
                { /* START panel */}
                <div className="panel panel-dark panel-flat">
                    <div className="panel-heading text-center">
                        <a href="#">
                            <img src="img/logo.png" alt="Image" className="block-center img-rounded" width="176" height="176" />
                        </a>
                    </div>
                    <div className="panel-body">
                        <p className="text-center pv">PASSWORD RESET</p>
                        <form role="form" onSubmit={this.onSubmit.bind(this)}>
                            <p className="text-center">Fill with your mail to receive instructions on how to reset your password.</p>
                            <div className="form-group has-feedback">
                                <label htmlFor="resetInputEmail1" className="text-muted">Email address</label>
                                <input id="resetInputEmail1" type="email" placeholder="Enter email" autoComplete="off" className="form-control" 
                                value={this.state.email} onChange={(e) => this.setState({ email: e.target.value, mismatch: false })} />
                                <span className="fa fa-envelope form-control-feedback text-muted"></span>
                            </div>
                            <button type="submit" className="btn btn-danger btn-block">Reset</button>
                        </form>
                    </div>
                </div>
                { /* END panel */}
            </div>
        );
    }

}

export default Recover;

