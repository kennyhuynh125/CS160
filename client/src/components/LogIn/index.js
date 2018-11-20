import React, {Component} from 'react';
import { Container, Button, Form, CustomInput, Row, Col} from 'reactstrap';
import axios from 'axios';
import history from '../../history';
import { addDriver } from '../../helper';

import StyledAlert from '../Reusable/StyledAlert';
import StyledInput from '../Reusable/StyledInput';

import { SPACER } from '../../constants';

/*
This component renders the form for users to log in.
Form contains field for username and password.
*/
class LogIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isCustomer: '',
			loginError: false
        }
    }

    // changes the password state to what the user inpus
    handlePasswordChange = (e) => {
        this.setState({
            password: e.target.value,
        })
    }

    // changes the username state to what the user inputs;
    handleUsernameChange = (e) => {
        this.setState({
            username: e.target.value,
        })
    }
    
    // changes whether person logs in as driver or customer
    handleCustomerChange = (e) => {
        this.setState({
            isCustomer: e.target.value === 'customer' ? true : false,
        });
    }
    
    // authenticates and logs user if username/password is valid
    authenticate = (e) => {
        let userId;
        let isDriver;
        axios.post(`/api/loguser`, {
            username: this.state.username,
            password: this.state.password,
        })
        .then((response) => { // logs user
            if (response.data) {
                sessionStorage.setItem('isLoggedIn', true);
                sessionStorage.setItem('driver', !this.state.isCustomer);
                sessionStorage.setItem('customer', this.state.isCustomer);
                sessionStorage.setItem('userId', response.data);
                userId = sessionStorage.getItem('userId');
                isDriver = sessionStorage.getItem('driver');
                if (this.state.isCustomer) {
                    history.push('/homepage');
                } else {
                    const geolocation = navigator.geolocation;
                    if (geolocation) {
                        geolocation.getCurrentPosition((position) => {
                            const latitude = position.coords.latitude;
                            const longitude = position.coords.longitude;
                            addDriver(userId, isDriver, 1, latitude, longitude, () => {
                                history.push('/homepage');
                            });
                        });
                    }
                }
            } else {
				this.setState({
					loginError: true
				});	
            }
        })
        .catch((error) => {
            console.log(error);
        })
        e.preventDefault();
    }

    render() {
        return (
            <Container>
            <center><div style={{width:'50%'}}>
                <br/><h1>Log In</h1>
                <Form onSubmit={this.authenticate}>
					<StyledInput fieldName="username" labelText="Username" fieldType="text" changeFunction={this.handleUsernameChange}></StyledInput>
                    <div style={SPACER} />
					<StyledInput fieldName="password" labelText="Password" fieldType="password" changeFunction={this.handlePasswordChange}></StyledInput>
					{
						this.state.loginError && (
						<StyledAlert color="warning" message="The username or password was incorrect! Please Try again."/>
						)
                    }
                    <div style={SPACER} />
					<Row>
						<Col xs={{size: "auto", offset: .5}}>
							<CustomInput type="radio" id="radio" name="customRadio" label="Customer" value="customer" onChange={this.handleCustomerChange} inline required />
						</Col>
						<Col xs={{size: "auto", offset: .5}}>
							<CustomInput type="radio" id="radio1" name="customRadio" label="Driver" value="driver" onChange={this.handleCustomerChange} inline required />
						</Col>
					</Row>
                    <div style={SPACER} />
                    <Button color="info" block>Log In</Button>
                </Form>
                <p/>New user? <a href="/signup">Sign up</a>
                </div></center>
            </Container>
        )
    }
}

export default LogIn;